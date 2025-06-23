// tests/e2e/quiz-flow.spec.js
import { test, expect } from '@playwright/test';
import { 
  loginUser, 
  startQuiz, 
  answerQuestion, 
  goToNextQuestion, 
  submitQuiz,
  clearBrowserStorage,
  TEST_USERS 
} from './utils/test-helpers.js';

test.describe('Quiz Application - Main Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test for isolation
    // await clearBrowserStorage(page);
  });

  test('Complete quiz flow: Login → Select → Start → Answer → Submit → Results', async ({ page }) => {
    // Step 1: Login
    await loginUser(page, TEST_USERS.E2E_USER);
    
    // Step 2: Select and start quiz
    await startQuiz(page, 'Basic Physics Quiz');
    
    // Step 3: Answer all questions (assuming 5 questions)
    for (let i = 1; i <= 5; i++) {
      // Verify we're on the correct question
      await expect(page.locator('.question_number')).toContainText(i.toString());
      
      // Answer the question (alternating between A and B for variety)
      const optionLetter = i % 2 === 1 ? 'A' : 'B';
      await answerQuestion(page, optionLetter);
      
      // Navigate to next question (except on last question)
      if (i < 5) {
        await goToNextQuestion(page);
      }
    }
    
    // Step 4: Submit quiz
    await submitQuiz(page);
    
    // Step 5: Verify results page
    await expect(page.locator('h2')).toContainText('Scored');
    await expect(page.locator('.result_item')).toHaveCount(5); // Should show all 5 questions
    
  });

  test('Quiz navigation: Back and Next buttons work correctly', async ({ page }) => {
    await loginUser(page, TEST_USERS.E2E_USER);
    await startQuiz(page, 'Basic Physics Quiz');
    
    // Answer first question
    await expect(page.locator('.question_number')).toContainText('1');
    await answerQuestion(page, 'A');
    
    // Go to second question
    await goToNextQuestion(page);
    await expect(page.locator('.question_number')).toContainText('2');
    await answerQuestion(page, 'A');
    
    // Go back to first question
    await page.click('button.back_button', { hasText: 'Back' });
    await expect(page.locator('.question_number')).toContainText('1');
    
    // Go forward again
    await goToNextQuestion(page);
    await expect(page.locator('.question_number')).toContainText('2');
    
  });

  test('Cannot proceed to next question without answering current question', async ({ page }) => {
    await loginUser(page, TEST_USERS.E2E_USER);
    await startQuiz(page, 'Basic Physics Quiz');
    
    // Verify Next button is disabled when no answer is selected
    const nextButton = page.locator('button', { hasText: 'Next' });
    await expect(nextButton).toBeDisabled();
    
    // Answer the question
    await answerQuestion(page, 'A');
    
    // Now Next button should be enabled
    await expect(nextButton).toBeEnabled();
  });

  test('Quiz state persists on page refresh', async ({ page }) => {
    await loginUser(page, TEST_USERS.E2E_USER);
    await startQuiz(page, 'Basic Physics Quiz');
    
    // Answer first two questions
    await answerQuestion(page, 'A');
    await goToNextQuestion(page);
    await answerQuestion(page, 'B');
    
    // Refresh the page
    await page.reload();
    
    await expect(page.locator('.question_number').first()).toContainText('2');
    
    // Can go back and verify first answer is preserved
    await page.click('button.back_button', { hasText: 'Back' });
    await expect(page.locator('.question_number')).toContainText('1');
  });

  test('Cannot submit quiz until all questions are answered', async ({ page }) => {
    await loginUser(page, TEST_USERS.E2E_USER);
    await startQuiz(page, 'Basic Physics Quiz');
    
    // Navigate to last question without answering all
    for (let i = 1; i < 5; i++) {
      await answerQuestion(page, 'A');
      await goToNextQuestion(page);
    }
    
    // On last question, Submit button should be disabled until answered
    const submitButton = page.locator('button', { hasText: 'Submit' });
    await expect(submitButton).toBeDisabled();
    
    // Answer last question
    await answerQuestion(page, 'A');
    
    // Now Submit button should be enabled
    await expect(submitButton).toBeEnabled();
  });

});