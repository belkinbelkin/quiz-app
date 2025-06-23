import { test, expect } from '@playwright/test';
import { clearBrowserStorage, TEST_USERS } from './utils/test-helpers.js';

test.describe('API Integration', () => {
  
    test.beforeEach(async ({ page }) => {
      //await clearBrowserStorage(page);
    });
  
    test('Quiz data loads correctly from API', async ({ page }) => {
      // Login
      await page.goto('/');
      await page.fill('input.input_field', TEST_USERS.E2E_USER.email);
      await page.fill('input[type="password"]', TEST_USERS.E2E_USER.password);
      await page.click('button[type="submit"]');
      
      // Wait for quiz list to load
      await expect(page.locator('h1', { hasText: 'Available Quizzes' })).toBeVisible();
      
      // Verify quiz cards are displayed
      await expect(page.locator('.quiz_card').first()).toBeVisible();
      
      // Verify quiz data is displayed correctly
      const firstQuiz = page.locator('.quiz_card').first();
      await expect(firstQuiz.locator('.quiz_title')).toBeVisible();
      await expect(firstQuiz.locator('.quiz_topic')).toBeVisible();
      await expect(firstQuiz.locator('.question_count')).toContainText(/\d+ questions/i);
    });
  
    test('Quiz answers are saved to backend', async ({ page }) => {
      // Setup: Login and start quiz
      await page.goto('/');
      await page.fill('input.input_field', TEST_USERS.E2E_USER.email);
      await page.fill('input[type="password"]', TEST_USERS.E2E_USER.password);
      await page.click('button[type="submit"]');
      
      await page.locator('.quiz_card').first().click();
      await page.click('button.start_button', { hasText: 'Start' });
      
      // Answer first question and verify API call
      const responsePromise = page.waitForResponse(response => 
        response.url().includes('/answer') && response.status() === 200
      );
      
      await page.locator('.option').first().click();
      await responsePromise;
      
      // Response should indicate success
      const response = await responsePromise;
      const responseData = await response.json();
      expect(responseData).toHaveProperty('is_correct', true);
    });
  });