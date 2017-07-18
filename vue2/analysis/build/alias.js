const path = require('path')

module.exports = {
  core: path.resolve(__dirname, '../src/lib/core'),
  shared: path.resolve(__dirname, '../src/lib/shared'),
  platforms: path.resolve(__dirname, '../src/lib/platforms')
}