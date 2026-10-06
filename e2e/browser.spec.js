import { test, expect } from '@playwright/test';

test('document browser preserves navigation, guidance, filters, and previews', async ({ page, context }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await expect(page.locator('.doc-card')).toHaveCount(153);
  await page.getByRole('button', { name: 'PowerPoint', exact: true }).click();
  await expect(page.locator('.doc-card')).toHaveCount(1);
  await page.locator('.doc-card').click();
  await page.getByRole('button', { name: 'Preview Document' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.preview-page-wrap')).toHaveCount(29);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.detail-panel')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.detail-panel')).toHaveCount(0);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await page.getByRole('navigation', { name: 'Document categories' }).getByRole('button', { name: /Policies/ }).click();
  await expect(page.locator('.doc-card')).toHaveCount(14);
  await page.getByRole('button', { name: /Clause 6 — Planning/ }).click();
  await expect(page.locator('.clause-children.open')).toHaveCount(1);
  await expect(page.locator('h2')).toHaveText('Clause 6 — Planning');
  await page.getByRole('textbox', { name: 'Search documents' }).fill('MDL-001');
  await expect(page.locator('.doc-card')).toHaveCount(1);
  await page.locator('.doc-card').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.detail-title')).toHaveText('Master List of Documents');
  await expect(page.locator('.howto-rows')).not.toBeEmpty();
  await page.getByRole('button', { name: 'Copy', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible();
  await page.getByRole('button', { name: 'Preview Document' }).click();
  await expect(page.locator('.doc-page')).toBeVisible();
  await page.getByRole('button', { name: 'Close preview', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search documents' }).fill('no-such-document');
  await expect(page.getByText('No documents found')).toBeVisible();
  expect(errors).toEqual([]);
});

test('mobile view keeps search and document details usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Search documents' }).fill('POL-001');
  await page.locator('.doc-card').click();
  await expect(page.locator('.detail-panel')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close document details' })).toBeInViewport();
  await page.getByRole('button', { name: 'Close document details' }).click();
  await expect(page.locator('.detail-panel')).toHaveCount(0);
});


test('reference layout, sorting, search shortcut, and copy restrictions', async ({ page }) => {
  await page.setViewportSize({ width: 1586, height: 992 });
  await page.goto('/');
  await expect(page.locator('.card-id').first()).toHaveText('CHK-001');
  await page.screenshot({ path: '/tmp/iso42001-redesign.png' });
  await page.getByRole('combobox', { name: 'Sort documents' }).selectOption('id-desc');
  await expect(page.locator('.card-id').first()).toHaveText('TRN-001');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('textbox', { name: 'Search documents' })).toBeFocused();
  expect(await page.locator('.card-title').first().evaluate(node => getComputedStyle(node).userSelect)).toBe('none');
  expect(await page.locator('.doc-card').first().evaluate(node => !node.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true })))).toBe(true);
});
