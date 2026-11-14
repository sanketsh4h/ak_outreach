import { expect, test, type Locator, type Page } from '@playwright/test'
import { expectNoHorizontalOverflow } from './helpers'

/** Tap on the phone project (touch), click on desktop. */
function press(isPhone: boolean) {
  return (target: Locator) => (isPhone ? target.tap() : target.click())
}

test.describe('pill game', () => {
  test('red path: every card, Back, the green pill and its placeholder screen, Start over', async ({
    page,
  }, info) => {
    const go = press(info.project.name === 'phone')
    await page.goto('/yuvako/activity/pills')
    const game = page.getByTestId('pill-game')
    await expect(game.getByTestId('placeholder-notice')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Which pill will you take?' })).toBeVisible()
    await expectNoHorizontalOverflow(page)

    await go(page.getByRole('button', { name: /Red pill/ }))
    await expect(page.getByRole('heading', { name: 'Card 1 of 5' })).toBeFocused()
    await expect(game).toContainText('Placeholder card 1')
    await expect(game.getByText('Source needed')).toBeVisible()
    await go(page.getByRole('button', { name: 'Next' }))
    await expect(page.getByRole('heading', { name: 'Card 2 of 5' })).toBeFocused()
    await go(page.getByRole('button', { name: 'Back' }))
    await expect(page.getByRole('heading', { name: 'Card 1 of 5' })).toBeVisible()
    for (let n = 1; n < 5; n++) await go(page.getByRole('button', { name: 'Next' }))
    await expect(page.getByRole('heading', { name: 'Card 5 of 5' })).toBeVisible()
    await go(page.getByRole('button', { name: 'Continue' }))

    await expect(page.getByRole('heading', { name: 'One more choice' })).toBeFocused()
    await expectNoHorizontalOverflow(page)
    const popups: Page[] = []
    page.on('popup', (p) => popups.push(p))
    await go(page.getByRole('button', { name: /Green pill/ }))
    await expect(
      page.getByRole('heading', { name: "The green pill's destination will be added later" }),
    ).toBeFocused()
    await expect(game.getByTestId('placeholder-notice')).toBeVisible()
    expect(popups).toEqual([])

    await go(page.getByRole('button', { name: 'Start over' }))
    await expect(page.getByRole('heading', { name: 'Which pill will you take?' })).toBeVisible()
  })

  test('blue path dissolves by itself into the message and the green pill', async ({ page }) => {
    await page.goto('/yuvako/activity/pills')
    await page.getByRole('button', { name: /Blue pill/ }).click()
    await expect(page.getByRole('heading', { name: 'You took the blue pill' })).toBeFocused()
    await expect(page.getByTestId('blue-screen')).toContainText('everything is fine')
    await expect(page.getByRole('heading', { name: 'One more choice' })).toBeVisible({
      timeout: 8000,
    })
    await expect(page.getByText('Ignoring it is not an option.')).toBeVisible()
    // After finishing, the other pill can be chosen directly.
    await page.getByRole('button', { name: 'Try the red pill' }).click()
    await expect(page.getByRole('heading', { name: 'Card 1 of 5' })).toBeVisible()
  })

  test('blue screen dissolves on tap', async ({ page }, info) => {
    const go = press(info.project.name === 'phone')
    await page.goto('/yuvako/activity/pills')
    await go(page.getByRole('button', { name: /Blue pill/ }))
    await go(page.getByTestId('blue-screen'))
    await expect(page.getByRole('heading', { name: 'One more choice' })).toBeVisible({
      timeout: 2500,
    })
  })

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })
    test('the dissolve is replaced by a Continue button', async ({ page }) => {
      await page.goto('/yuvako/activity/pills')
      await page.getByRole('button', { name: /Blue pill/ }).click()
      await expect(page.getByTestId('blue-screen')).toHaveCount(0)
      await page.waitForTimeout(3500)
      await expect(page.getByRole('heading', { name: 'You took the blue pill' })).toBeVisible()
      await page.getByRole('button', { name: 'Continue' }).click()
      await expect(page.getByRole('heading', { name: 'One more choice' })).toBeVisible()
    })
  })

  test('plays the whole flow by keyboard', async ({ page }) => {
    await page.goto('/yuvako/activity/pills')
    await page.getByRole('button', { name: /Red pill/ }).focus()
    await page.keyboard.press('Enter')
    for (let n = 1; n <= 5; n++) {
      await expect(page.getByRole('heading', { name: `Card ${n} of 5` })).toBeFocused()
      await page.keyboard.press('Tab') // Back
      await page.keyboard.press('Tab') // Next / Continue
      await page.keyboard.press('Enter')
    }
    await expect(page.getByRole('heading', { name: 'One more choice' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /Green pill/ })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(
      page.getByRole('heading', { name: /destination will be added later/ }),
    ).toBeFocused()
    await page.keyboard.press('Tab') // Back
    await page.keyboard.press('Tab') // Start over
    await expect(page.getByRole('button', { name: 'Start over' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Which pill will you take?' })).toBeFocused()
  })

  test('with a destination set, the green pill opens it in a new tab', async ({
    page,
    context,
  }) => {
    const url = 'https://example.org/green-pill-test'
    // Serve the site's script with greenPillUrl set, as if content/pills.json had a URL.
    let replaced = false
    await page.route(/\/assets\/index-[\w-]+\.js$/, async (route) => {
      const response = await route.fetch()
      const body = await response.text()
      replaced = body.includes('greenPillUrl:null')
      await route.fulfill({
        response,
        body: body.replace('greenPillUrl:null', `greenPillUrl:${JSON.stringify(url)}`),
      })
    })
    await context.route('https://example.org/**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Destination</title>' }),
    )
    await page.goto('/yuvako/activity/pills')
    expect(replaced, 'pills content found in the bundle').toBe(true)
    await page.getByRole('button', { name: /Blue pill/ }).click()
    await page.getByTestId('blue-screen').click()
    const green = page.getByRole('link', { name: /Green pill/ })
    await expect(green).toHaveAttribute('href', url)
    await expect(green).toHaveAttribute('target', '_blank')
    await expect(green).toHaveAttribute('rel', 'noopener noreferrer')
    const [popup] = await Promise.all([page.waitForEvent('popup'), green.click()])
    await popup.waitForLoadState()
    expect(popup.url()).toBe(url)
    expect(await popup.evaluate(() => window.opener)).toBeNull()
    await expect(page.getByRole('heading', { name: 'One more choice' })).toBeVisible()
  })

  test('works in Gujarati', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'ગુજરાતી' }).click()
    await page.goto('/yuvako/activity/pills')
    await page.getByRole('button', { name: /લાલ ગોળી/ }).click()
    await expect(page.getByRole('heading', { name: 'કાર્ડ 1 / 5' })).toBeVisible()
    await expect(page.getByText('સ્રોત જોઈએ')).toBeVisible()
  })
})
