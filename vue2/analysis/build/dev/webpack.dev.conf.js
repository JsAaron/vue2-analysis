const baseWebpackConfig = require('../webpack.base.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')

//https://github.com/ampedandwired/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
  //https://www.npmjs.com/package/write-file-webpack-plugin
const WriteFilePlugin = require('write-file-webpack-plugin');

//刷新
baseWebpackConfig.entry = ['./build/dev/client'].concat(baseWebpackConfig.entry)

module.exports = merge(baseWebpackConfig, {
  devtool:'cheap-source-map',
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './src/index.html',
      inject: true
    }),

    new WriteFilePlugin()
  ]
})
