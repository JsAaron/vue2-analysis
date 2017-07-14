const config = require('../config')

module.exports = {
  entry: config.dev.conf.entry,
  output: {
    path: config.dev.conf.assetsRoot,
    publicPath: config.dev.conf.assetsPublicPath,
    filename: 'app.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  }
}
