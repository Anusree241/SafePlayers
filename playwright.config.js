// @ts-check
import { defineConfig, devices } from '@playwright/test';
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
 
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
