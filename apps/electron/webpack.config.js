const path = require('path');

module.exports = (config) => {
  config.entry = {
    ...config.entry,
    jwt: path.resolve(__dirname, 'src/app/api/jwt.preload.ts'),
  };
  return config;
};
