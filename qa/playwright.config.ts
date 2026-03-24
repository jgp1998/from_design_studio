import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // Definimos BASE_URL global al Web App. Pruebas que vayan al landing pueden usar override 3030.
    baseURL: 'http://localhost:3031',
    trace: 'on-first-retry',
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

  /*
  webServer: {
    command: 'cd ../frontend-fds && npm run dev',
    url: 'http://localhost:3031',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  */
});
