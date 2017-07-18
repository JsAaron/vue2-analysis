const path = require('path')

module.exports = {
  core: path.resolve(__dirname, '../src/core'),
  compiler: path.resolve(__dirname, '../src/compiler'),
  shared: path.resolve(__dirname, '../src/shared'),
  platforms: path.resolve(__dirname, '../src/platforms')
}