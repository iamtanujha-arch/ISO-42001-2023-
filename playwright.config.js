import { defineConfig } from '@playwright/test';

const port = process.env.E2E_PORT || '3100';
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL,
    launchOptions: { executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] },
  },
  webServer: { command: `npm start -- --port ${port}`, url: baseURL, reuseExistingServer: false },
});
