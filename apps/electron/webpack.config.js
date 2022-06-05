const path = require('path');

module.exports = (config) => {
  config.entry = {
    ...config.entry,
    splash: path.resolve(__dirname, 'src/app/api/splash.preload.ts'),
  };
  return config;
};
