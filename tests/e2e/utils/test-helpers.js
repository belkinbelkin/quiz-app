// tests/e2e/utils/test-helpers.js
import { expect } from '@playwright/test';

export const TEST_USERS = {
  // E2E_USER: {
  //   email: 'e2e@test.local',
  //   password: 'secureTestPass2024'
  // },
  E2E_USER: {
    email: 'admin',
    password: 'admin'
  },
  PLAYWRIGHT_USER: {
    email: 'playwright@test.local', 
    password: 'playwrightPass123'
  },
  STANDARD_USER: {
    email: 'test@example.com',
    password: 'password'
  }
};

export const API_ENDPOINTS = {
  LOGIN: 'http://localhost:3000/api/login',
  QUIZZES: 'http://localhost:3000/api/quizzes',
  START_QUIZ: (id) => `http://localhost:3000/api/quiz/${id}/start`,
  SUBMIT_ANSWER: (attemptId) => `http://localhost:3000/api/quiz-attempt/${attemptId}/answer`,
  COMPLETE_QUIZ: (attemptId) => `http://localhost:3000/api/quiz-attempt/${attemptId}/complete`,
  GET_RESULTS: (attemptId) => `http://localhost:3000/api/quiz-attempt/${attemptId}/results`
};

/**
 * Login helper for tests
 */
export async function loginUser(page, user = TEST_USERS.E2E_USER) {
  await page.goto('/');
  
  // Fill login form
  await page.fill('input.input_field', user.email);
  await page.fill('input[type="password"]', user.password);
  
  // Submit login
  await page.click('button[type="submit"]');
  
  // Wait for successful login (should redirect to quiz selection)
  await expect(page).toHaveURL(/.*/, { timeout: 10000 });
  
  // Verify we're logged in by checking for logout button or quiz content
  await expect(page.locator('text=Available Quizzes')).toBeVisible({ timeout: 5000 });
}

/**
 * Select and start a quiz
 */
export async function startQuiz(page, quizTitle = 'Basic Physics Quiz') {
  // Wait for quiz selection screen
  await expect(page.locator('h1', { hasText: 'Available Quizzes' })).toBeVisible();
  
  // Find and click the quiz card
  const quizCard = page.locator('.quiz_card', { hasText: quizTitle });
  await expect(quizCard).toBeVisible();
  await quizCard.click();
  
  // Wait for quiz start screen
  await expect(page.locator('h1', { hasText: 'Quiz' })).toBeVisible();
  await expect(page.locator('h2', { hasText: quizTitle })).toBeVisible();
  
  // Click start button
  await page.click('button.start_button', { hasText: 'Start' });
  
  // Wait for first question to load
  await expect(page.locator('.question_number')).toBeVisible({ timeout: 10000 });
}

/**
 * Answer a quiz question
 */
export async function answerQuestion(page, optionLetter = 'A') {
  // Wait for question to be loaded
  await expect(page.locator('.question_text')).toBeVisible();
  
  // Click the specified option
  const option = page.locator('.option').first();
  await expect(option).toBeVisible();
  await option.click();
  
  // Verify option is selected
  await expect(option).toHaveClass(/selected/);
}

/**
 * Navigate to next question
 */
export async function goToNextQuestion(page) {
  const nextButton = page.locator('button', { hasText: 'Next' });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();
}

/**
 * Submit the quiz
 */
export async function submitQuiz(page) {
  const submitButton = page.locator('button', { hasText: 'Submit' });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();
  
  // Wait for results page
  await expect(page.locator('text=Scored')).toBeVisible({ timeout: 10000 });
}

/**
 * Clear browser storage (for test isolation)
 */
export async function clearBrowserStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Wait for API response and verify it's successful
 */
export async function waitForApiResponse(page, urlPattern, timeout = 5000) {
  const response = await page.waitForResponse(
    response => response.url().includes(urlPattern) && response.status() === 200,
    { timeout }
  );
  return response;
}