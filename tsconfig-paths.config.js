const { resolve } = require('path');

module.exports = {
  baseUrl: resolve(__dirname),
  paths: {
    '@/*': ['./dist/*']
  }
}