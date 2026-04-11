import { test, expect } from '@playwright/test'

test('home screen loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Reveer')
})
