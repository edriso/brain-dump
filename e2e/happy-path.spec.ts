import { expect, test } from '@playwright/test';

test('dump, end early, sort, and see the grouped result', async ({ page }) => {
  await page.goto('/');
  const heading = page.getByRole('heading', { name: /Too much in your head/ });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS('opacity', '1');

  await page.getByRole('button', { name: 'Start the dump' }).click();
  await page.getByLabel('Brain dump').fill('reply to Sam\nbook the dentist');
  await page.getByRole('button', { name: /I.?m empty/ }).click();

  await expect(page.getByText('reply to Sam')).toBeVisible();
  await page.getByRole('button', { name: 'Today', exact: true }).click();
  await page.getByRole('button', { name: 'Not today' }).click();
  await expect(page.getByRole('heading', { name: /Out of your head/ })).toBeVisible();
  await expect(page.getByText(/Today · 1/)).toBeVisible();
  await expect(page.getByText(/Not today · 1/)).toBeVisible();
});
