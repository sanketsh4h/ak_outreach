import { expect, test } from '@playwright/test'

test('language choice survives reload and navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.getByRole('button', { name: 'ગુજરાતી' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'gu')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ડિજિટલ આઉટરીચ')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'gu')
  await expect(page.getByRole('button', { name: 'ગુજરાતી' })).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('link', { name: /યુવકો/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('યુવકો')
  await page.getByRole('button', { name: 'हिन्दी' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('युवको')
  await page.goto('/bhulkao')
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi')
})

test('each language option is marked with its own lang attribute', async ({ page }) => {
  await page.goto('/')
  const group = page.getByRole('group', { name: 'Language' })
  await expect(group.getByRole('button', { name: 'English' })).toHaveAttribute('lang', 'en')
  await expect(group.getByRole('button', { name: 'ગુજરાતી' })).toHaveAttribute('lang', 'gu')
  await expect(group.getByRole('button', { name: 'हिन्दी' })).toHaveAttribute('lang', 'hi')
})

test.describe('first visit follows the browser language', () => {
  test.use({ locale: 'hi-IN' })
  test('a Hindi browser gets Hindi', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi')
  })
})

test.describe('first visit in Gujarati', () => {
  test.use({ locale: 'gu-IN' })
  test('a Gujarati browser gets Gujarati', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'gu')
  })
})

test.describe('first visit in another language', () => {
  test.use({ locale: 'fr-FR' })
  test('falls back to English', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })
})

test('the draft-translation note shows only for unreviewed languages', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('translation-note')).toHaveCount(0)
  await page.getByRole('button', { name: 'हिन्दी' }).click()
  await expect(page.getByTestId('translation-note')).toBeVisible()
})
