import { test, expect } from '@playwright/test';

test.describe('PlanTrack App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads the home page with brand name', async ({ page }) => {
    await expect(page.locator('.brand-name')).toHaveText('PlanTrack');
  });

  test('shows the Add Event button', async ({ page }) => {
    await expect(page.locator('.btn-add')).toBeVisible();
  });

  test('opens the New Task form when Add Event is clicked', async ({ page }) => {
    await page.click('.btn-add');
    await expect(page.locator('.modal')).toBeVisible();
    await expect(page.locator('.modal h2')).toHaveText('New Task');
  });

  test('closes the form when close button is clicked', async ({ page }) => {
    await page.click('.btn-add');
    await expect(page.locator('.modal')).toBeVisible();
    await page.click('[aria-label="Close"]');
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('creates a new task', async ({ page }) => {
    await page.click('.btn-add');

    await page.fill('[name="title"]', 'E2E Test Task');
    await page.fill('[name="dueDate"]', '2030-12-31');
    await page.selectOption('[name="category"]', 'Work');

    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.getByText('E2E Test Task').first()).toBeVisible();
  });

  test('shows greeting message', async ({ page }) => {
    const greeting = page.locator('.greeting-title');
    await expect(greeting).toBeVisible();
    const text = await greeting.textContent();
    expect(['Good morning', 'Good afternoon', 'Good evening'].some((g) => text.includes(g))).toBe(true);
  });

  test('shows the calendar view', async ({ page }) => {
    await expect(page.locator('.calendar-card')).toBeVisible();
  });

  test('displays upcoming events stats section', async ({ page }) => {
    await expect(page.locator('.events-card-header')).toBeVisible();
    await expect(page.locator('.events-stat').first()).toBeVisible();
  });
});
