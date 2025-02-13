const {join} = require('path');

module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  browser: 'chrome',
  browserRevision: '131.0.6778.204' // Match EXACT version from error
}; 