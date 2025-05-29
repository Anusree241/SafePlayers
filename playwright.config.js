// @ts-check
import { defineConfig, devices } from '@playwright/test';
<<<<<<< HEAD
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  timeout: 0,
  workers: process.env.CI ? 1 : undefined,
 
  expect: {
    timeout: 0, // ✅ 10 seconds for all expect() calls
  },
 
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
 
=======

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  timeout:120000,

  expect: {
    timeout: 120000, // ✅ 10 seconds for all expect() calls
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
>>>>>>> 29a6d2ab26d1b0f6f982d91c2f4c52dd363c81cc
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
<<<<<<< HEAD
=======

>>>>>>> 29a6d2ab26d1b0f6f982d91c2f4c52dd363c81cc
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
<<<<<<< HEAD
=======

>>>>>>> 29a6d2ab26d1b0f6f982d91c2f4c52dd363c81cc
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
<<<<<<< HEAD
  ],
});
=======

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

>>>>>>> 29a6d2ab26d1b0f6f982d91c2f4c52dd363c81cc
