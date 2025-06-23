import { test, expect } from '@playwright/test';
import { clearBrowserStorage, TEST_USERS } from './utils/test-helpers.js';

test.describe('Responsive Design', () => {
  
    test('Mobile layout works correctly', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');
      
      // Login form should be responsive
      await expect(page.locator('.login_form')).toBeVisible();
      
      // Login and check quiz selection on mobile
      await page.fill('input.input_field', TEST_USERS.E2E_USER.email);
      await page.fill('input[type="password"]', TEST_USERS.E2E_USER.password);
      await page.click('button[type="submit"]');
      
      await expect(page.locator('h1', { hasText: 'Available Quizzes' })).toBeVisible();
      
      // Quiz cards should stack properly on mobile
      const quizCards = page.locator('.quiz_card');
      const firstCard = quizCards.first();
      const secondCard = quizCards.nth(1);
      
      if (await secondCard.isVisible()) {
        const firstCardBox = await firstCard.boundingBox();
        const secondCardBox = await secondCard.boundingBox();
        
        // On mobile, cards should stack vertically
        expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y + firstCardBox.height - 50);
      }
    });
  
    test('Tablet layout works correctly', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/');
      await page.fill('input.input_field', TEST_USERS.E2E_USER.email);
      await page.fill('input[type="password"]', TEST_USERS.E2E_USER.password);
      await page.click('button[type="submit"]');
      
      await expect(page.locator('h1', { hasText: 'Available Quizzes' })).toBeVisible();
      
      // Check if quiz selection layout adapts to tablet
      await expect(page.locator('.quiz_card').first()).toBeVisible();
    });
  }); 