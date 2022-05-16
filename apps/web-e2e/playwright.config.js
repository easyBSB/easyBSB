// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: './src/integration',
  projects: [
    {
      name: 'Chrome Stable',
      use: {
        launchOptions: {
          slowMo: 0,
        },
        headless: true,
        browserName: 'chromium',
        channel: 'chrome',
      },
    },
  ],
};
