// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: "./src/integration",
  projects: [
    {
      name: "Chrome Stable",
      use: {
        launchOptions: {
          slowMo: 0,
          devtools: false,
        },
        headless: true,
        browserName: "chromium",
        channel: "chrome",
        viewport: {
          height: 1080,
          width: 1920
        }
      },
    },
  ],
};
