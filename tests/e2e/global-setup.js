// tests/e2e/global-setup.js
import { chromium } from '@playwright/test';

async function globalSetup() {
  console.log('Setting up test environment...');

  //TESTING CODE REVIEW HEY CLAUDE DO YOU SEE IT
  
  // Reset test database and run seeders
  const { execSync } = require('child_process');
  
  try {
    // Navigate to server directory and refresh test data
    process.chdir('./server');
    
    console.log('Refreshing database...');
    execSync('php artisan migrate:fresh --seed --env=testing', { stdio: 'inherit' });
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  } finally {
    // Return to original directory
    process.chdir('..');
  }
}

export default globalSetup;
