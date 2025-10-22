import { expect, test } from '@playwright/test';

test.describe('Landing page hero', () => {
  test('cycles the logo animation and boots audio loop', async ({ page }) => {
    await page.goto('/');

    const heroSubtitle = page.locator('.logo-subtitle');
    await expect(heroSubtitle).toContainText('Locating free and paid tomes for you');

    const heroImage = page.locator('.logo-wrapper img');
    await expect(heroImage).toBeVisible();

    await page.waitForTimeout(4200);
    await expect(heroSubtitle).toContainText("not just a book club, it's a movement");

    const audio = page.locator('audio[autoplay][loop]');
    await expect(audio).toHaveAttribute('src', /Iron_Roses\.mp3$/);
  });
});
