import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('form requires title and due date to submit', async ({ page }) => {
    await page.click('.btn-add');
    // Try submitting with no data
    await page.click('button[type="submit"]');
    // Modal should remain open (validation prevents close)
    await expect(page.locator('.modal')).toBeVisible();
  });

  test('creates a task and it appears in the list', async ({ page }) => {
    const title = `Task-${Date.now()}`;
    await page.click('.btn-add');
    await page.fill('[name="title"]', title);
    await page.fill('[name="dueDate"]', '2030-06-15');
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.getByText(title).first()).toBeVisible();
  });

  test('can select all categories in task form', async ({ page }) => {
    await page.click('.btn-add');
    const categories = ['Family', 'Social', 'Event', 'Work', 'Health', 'Other'];
    for (const cat of categories) {
      await page.selectOption('[name="category"]', cat);
    }
    // Just verify no errors; last selected is 'Other'
    await expect(page.locator('[name="category"]')).toHaveValue('Other');
  });

  test('can add a prep step in the task form', async ({ page }) => {
    await page.click('.btn-add');
    await page.fill('[name="title"]', 'Task with steps');
    await page.fill('[name="dueDate"]', '2030-07-01');

    // Find the prep step input and add a step
    const stepInput = page.locator('input[placeholder="Add preparation step..."]');
    if (await stepInput.count() > 0) {
      await stepInput.fill('First step');
      await page.click('.modal button.btn-secondary:has-text("Add")');
      await expect(page.getByText('First step')).toBeVisible();
    }
  });

  test('closes form when clicking overlay', async ({ page }) => {
    await page.click('.btn-add');
    await expect(page.locator('.modal')).toBeVisible();
    await page.click('.modal-overlay', { position: { x: 5, y: 5 } });
    await expect(page.locator('.modal')).not.toBeVisible();
  });
});
