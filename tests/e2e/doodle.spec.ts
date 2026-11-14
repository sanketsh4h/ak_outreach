import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalOverflow } from './helpers'

/**
 * Make runs fast and predictable without touching the game code:
 * - serve the bundle with a quicker, constant fall speed (as if content/doodle-items.json said so);
 * - pin Math.random so every item is a good habit falling straight down the middle,
 *   until the test sets window.__distraction, after which a distraction falls down the middle.
 */
async function setUp(page: Page, lang = 'en') {
  let replaced = false
  await page.route(/\/assets\/index-[\w-]+\.js$/, async (route) => {
    const response = await route.fetch()
    const body = await response.text()
    replaced = body.includes('startSpeed:90,speedRamp:3,maxSpeed:260')
    await route.fulfill({
      response,
      body: body.replace(
        'startSpeed:90,speedRamp:3,maxSpeed:260',
        'startSpeed:300,speedRamp:0,maxSpeed:300',
      ),
    })
  })
  await page.addInitScript((l) => {
    localStorage.setItem('outreach.lang', l)
    let n = 0
    // Each new item asks for: kind (below 0.3 = distraction), which item, x position (0.5 = middle).
    Math.random = () =>
      (window as unknown as { __distraction?: boolean }).__distraction
        ? [0.1, 0.1, 0.5][n++ % 3]!
        : 0.5
  }, lang)
  await page.goto('/bhulkao/activity/doodle')
  expect(replaced, 'doodle settings found in the bundle').toBe(true)
  await expect(page.getByRole('button', { name: /^(Start|શરૂ કરો|शुरू करें)$/ })).toBeEnabled()
}

const score = (page: Page) => page.getByTestId('doodle-score')

async function sendDistraction(page: Page) {
  await page.evaluate(() => {
    ;(window as unknown as { __distraction: boolean }).__distraction = true
  })
}

/** Real touch input through Chrome's DevTools protocol (touchstart / touchmove / touchend). */
async function touch(page: Page) {
  const cdp = await page.context().newCDPSession(page)
  const send = (type: 'touchStart' | 'touchMove' | 'touchEnd', x?: number, y?: number) =>
    cdp.send('Input.dispatchTouchEvent', {
      type,
      touchPoints: x === undefined ? [] : [{ x, y: y!, id: 1 }],
    })
  return {
    async drag(from: [number, number], to: [number, number], steps = 8) {
      await send('touchStart', ...from)
      for (let i = 1; i <= steps; i++) {
        await send(
          'touchMove',
          from[0] + ((to[0] - from[0]) * i) / steps,
          from[1] + ((to[1] - from[1]) * i) / steps,
        )
        await page.waitForTimeout(16)
      }
      await send('touchEnd')
    },
    async hold(at: [number, number], ms: number) {
      await send('touchStart', ...at)
      await page.waitForTimeout(ms)
      await send('touchEnd')
    },
  }
}

/** Canvas point from logical play-area coordinates (360 x 480). */
async function point(page: Page, x: number, y: number): Promise<[number, number]> {
  const box = (await page.getByTestId('doodle-canvas').boundingBox())!
  return [box.x + (x / 360) * box.width, box.y + (y / 480) * box.height]
}

test.describe('doodle catcher', () => {
  test('a full run by keyboard: catch, dodge, game over, play again', async ({ page }) => {
    await setUp(page)
    await page.getByRole('button', { name: 'Start' }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('doodle-game')).toHaveAttribute('data-phase', 'playing')
    await expect(score(page)).toHaveText('Score: 1', { timeout: 5000 })
    await expect(page.getByText(/^\+1 /)).toBeVisible()

    // Steer away with the arrow key: items in the middle now fall past (no penalty for a miss).
    await page.keyboard.down('ArrowLeft')
    await page.waitForTimeout(700)
    await page.keyboard.up('ArrowLeft')
    const after = await score(page).textContent()
    await page.waitForTimeout(2500)
    await expect(score(page)).toHaveText(after!)
    // Back to the middle with D.
    await page.keyboard.down('d')
    await page.waitForTimeout(420)
    await page.keyboard.up('d')

    await sendDistraction(page)
    const over = page.getByTestId('doodle-over')
    await expect(over).toBeVisible({ timeout: 8000 })
    await expect(over.getByRole('heading', { name: 'Game over' })).toBeVisible()
    await expect(over).toContainText(/You caught \d+ good habits?\./)
    await expect(over).toContainText('You touched: Scrolling')
    await expect(over).toContainText('Scrolling can go on and on')
    const again = page.getByRole('button', { name: 'Play again' })
    await expect(again).toBeFocused()
    await expectNoHorizontalOverflow(page)

    await page.evaluate(() => {
      ;(window as unknown as { __distraction: boolean }).__distraction = false
    })
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('doodle-game')).toHaveAttribute('data-phase', 'playing')
    await expect(score(page)).toHaveText('Score: 0')
    expect(
      Number(await page.evaluate(() => localStorage.getItem('outreach.doodle.best'))),
    ).toBeGreaterThan(0)
  })

  test('pauses with the Pause button and when the tab is hidden', async ({ page }) => {
    await setUp(page)
    await page.getByRole('button', { name: 'Start' }).click()
    await page.getByRole('button', { name: 'Pause' }).click()
    await expect(page.getByRole('heading', { name: 'Paused' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Resume' })).toBeFocused()
    const frozen = await score(page).textContent()
    await page.waitForTimeout(1500)
    await expect(score(page)).toHaveText(frozen!)
    await page.getByRole('button', { name: 'Resume' }).click()
    await expect(page.getByTestId('doodle-game')).toHaveAttribute('data-phase', 'playing')

    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { value: true, configurable: true })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    await expect(page.getByTestId('doodle-game')).toHaveAttribute('data-phase', 'paused')
  })

  test('draws labels in Gujarati and Hindi with the right font', async ({ page }) => {
    for (const [lang, family, sample] of [
      ['gu', 'Noto Sans Gujarati', 'પ્રાર્થના'],
      ['hi', 'Noto Sans Devanagari', 'प्रार्थना'],
    ] as const) {
      await setUp(page, lang)
      await page.getByRole('button', { name: lang === 'gu' ? 'શરૂ કરો' : 'शुरू करें' }).click()
      // The script's font face must actually be loaded (check() alone is also true for unknown fonts).
      const loaded = await page.evaluate(
        ([f, s]) =>
          [...document.fonts].some(
            (face) => face.family.replace(/["']/g, '') === f && face.status === 'loaded',
          ) && document.fonts.check(`700 13px "${f}"`, s),
        [family, sample],
      )
      expect(loaded, `${family} is loaded before drawing`).toBe(true)
      await expect(score(page)).toHaveText(lang === 'gu' ? 'ગુણ: 1' : 'अंक: 1', { timeout: 5000 })
    }
  })
})

test.describe('doodle catcher by touch', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'uses Chrome touch events')

  test('drag the doodle, hold one side, game over and play again', async ({ page }, info) => {
    test.skip(info.project.name !== 'phone', 'phone-sized touch run')
    await setUp(page)
    await page.getByRole('button', { name: 'Start' }).tap()
    await expect(score(page)).toHaveText('Score: 1', { timeout: 5000 })

    const finger = await touch(page)
    // Drag the doodle from the middle to the left edge: middle items now fall past.
    await finger.drag(await point(page, 180, 440), await point(page, 30, 440))
    const after = await score(page).textContent()
    await page.waitForTimeout(2500)
    await expect(score(page)).toHaveText(after!)

    // Hold the right half to walk back to the middle.
    await finger.hold(await point(page, 330, 200), 420)
    await expect.poll(async () => score(page).textContent(), { timeout: 6000 }).not.toBe(after)

    await sendDistraction(page)
    await expect(page.getByTestId('doodle-over')).toBeVisible({ timeout: 8000 })
    await expect(page.getByTestId('doodle-over')).toContainText('You touched: Scrolling')
    await page.getByRole('button', { name: 'Play again' }).tap()
    await expect(page.getByTestId('doodle-game')).toHaveAttribute('data-phase', 'playing')
  })
})
