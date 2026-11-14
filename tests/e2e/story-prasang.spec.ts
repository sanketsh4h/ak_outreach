import { expect, test } from '@playwright/test'

test.describe('story player', () => {
  test('plays a Bhulkao story to two different endings, with Back and restart', async ({
    page,
  }) => {
    await page.goto('/bhulkao/story')
    await expect(page).toHaveURL(/\/bhulkao\/story\/homework-time$/)
    await expect(page.getByTestId('placeholder-notice')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Placeholder: Homework Time')
    await expect(page.getByRole('heading', { name: 'Step 1' })).toBeVisible()

    await page.getByRole('button', { name: 'Play the game now' }).click()
    await expect(page.getByRole('heading', { name: 'Step 2' })).toBeFocused()
    await page.getByRole('button', { name: 'Keep playing' }).click()
    await expect(page.getByRole('heading', { name: 'How it ends' })).toBeFocused()
    await expect(page.getByText('Your homework is not finished.')).toBeVisible()
    await expect(page.getByRole('complementary', { name: 'What we learn' })).toContainText(
      'a game can wait',
    )

    // Back undoes one choice.
    await page.getByRole('button', { name: 'Back one step' }).click()
    await expect(page.getByRole('heading', { name: 'Step 2' })).toBeVisible()
    await page.getByRole('button', { name: 'Keep playing' }).click()

    await page.getByRole('button', { name: 'Try a different choice' }).click()
    await expect(page.getByRole('heading', { name: 'Step 1' })).toBeVisible()
    await page.getByRole('button', { name: 'Finish homework first' }).click()
    await page.getByRole('button', { name: 'Ask Mira to do homework with you' }).click()
    await expect(page.getByText('You both finish early.')).toBeVisible()
    await expect(page.getByRole('complementary', { name: 'What we learn' })).toContainText(
      'good friends help each other',
    )
  })

  test('plays a Yuvako scenario by keyboard alone', async ({ page }) => {
    await page.goto('/yuvako/scenario/one-am-exam')
    const first = page.getByRole('button', { name: 'Put the phone away now' })
    await first.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Step 2' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(
      page.getByRole('button', { name: 'Sit quietly and take ten slow breaths' }),
    ).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'How it ends' })).toBeFocused()
    await expect(page.getByRole('complementary', { name: 'Think about it' })).toBeVisible()
  })

  test('shows the scenario in Hindi', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'हिन्दी' }).click()
    await page.goto('/yuvako/scenario/one-am-exam')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'अस्थायी: रात का एक बजा, कल परीक्षा',
    )
    await expect(page.getByRole('button', { name: 'अभी फ़ोन रख दें' })).toBeVisible()
  })
})

test.describe('prasang reader', () => {
  test('reads a Yuvako prasang to its lesson box', async ({ page }) => {
    await page.goto('/yuvako/prasang')
    await expect(page).toHaveURL(/\/yuvako\/prasang\/lamp-by-the-window$/)
    await expect(page.getByTestId('placeholder-notice')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Placeholder: The Lamp by the Window',
    )
    await expect(page.getByRole('img', { name: /oil lamp flickering/ })).toBeVisible()
    const lesson = page.getByRole('complementary', { name: 'Reflect' })
    await lesson.scrollIntoViewIfNeeded()
    await expect(lesson).toBeVisible()
    await expect(lesson).toContainText('which open windows')
  })

  test('a Bhulkao prasang uses the "What we learn" heading, in Gujarati too', async ({ page }) => {
    await page.goto('/bhulkao/prasang/patient-seed')
    await expect(page.getByRole('complementary', { name: 'What we learn' })).toBeVisible()
    await page.getByRole('button', { name: 'ગુજરાતી' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('કામચલાઉ: આશા અને બીજ')
    await expect(page.getByRole('complementary', { name: 'આપણે શું શીખ્યાં' })).toBeVisible()
  })
})

test('placeholder content is marked unmistakably', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('preview-strip')).toBeVisible()
  await expect(page.getByTestId('placeholder-notice')).toBeVisible()
  await page.goto('/yuvako')
  await expect(page.getByRole('link', { name: /Scenario.*Placeholder/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Prasang.*Placeholder/ })).toBeVisible()
})
