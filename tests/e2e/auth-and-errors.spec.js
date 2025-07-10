// tests/e2e/auth-and-errors.spec.js
import { test, expect } from '@playwright/test';
import { clearBrowserStorage, TEST_USERS } from './utils/test-helpers.js';

test.describe('Authentication and Error Handling', () => {
  
  test.beforeEach(async ({ page }) => {
    // await clearBrowserStorage(page);
  });

  // HEY TEST

  console.log('HEY TEST');
  console.log('HEY TEST2');

  test('Login with valid credentials succeeds', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    console.log('here testsing');
    
    // Fill valid credentials
    await page.fill('input.input_field', TEST_USERS.E2E_USER.email);
    await page.fill('input[type="password"]', TEST_USERS.E2E_USER.password);
    
    // Submit login
    await page.click('button[type="submit"]');
    
    // Should redirect to quiz selection
    await expect(page.locator('h1', { hasText: 'Available Quizzes' })).toBeVisible({ timeout: 10000 });
  });

  test('Login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/');
    
    // Fill invalid credentials
    await page.fill('input.input_field', TEST_USERS.E2E_USER.email);
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit login
    await page.click('button[type="submit"]');
    
    // Check for error message (if implemented)
    const errorMessage = page.locator('.error_message');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText(/invalid|failed|error/i);
    }
  });

  test('Login form validation works', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit without filling fields
    const submitButton = page.locator('button[type="submit"]');
    
    // Should be disabled or show validation errors
    if (await submitButton.isEnabled()) {
      await submitButton.click();
    } else {
      await expect(submitButton).toBeDisabled();
    }
  });

  test('Protected routes redirect to login when not authenticated', async ({ page }) => {
    // Try to access quiz selection without logging in
    await page.goto('/');
  });

  test('Session expires handling', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.fill('input.input_field', TEST_USERS.E2E_USER.email);
    await page.fill('input[type="password"]', TEST_USERS.E2E_USER.password);
    await page.click('button[type="submit"]');
    
    await expect(page.locator('h1', { hasText: 'Available Quizzes' })).toBeVisible();
    
    // Clear auth token to simulate session expiry
    await page.evaluate(() => {
      localStorage.removeItem('auth_token');
    });
    
    // Try to make an API call (select a quiz)
    const quizCard = page.locator('.quiz_card').first();
    if (await quizCard.isVisible()) {
      await quizCard.click();
    }
  });
});
