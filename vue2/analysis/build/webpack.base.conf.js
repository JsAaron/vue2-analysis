const config = require('../config')


const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

console.log(aliases)

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
  },
  resolve: {
    alias: aliases
  }
}