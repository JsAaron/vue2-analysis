const webpack = require('webpack')
const merge = require('webpack-merge')

//https://github.com/ampedandwired/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
//https://www.npmjs.com/package/write-file-webpack-plugin
const WriteFilePlugin = require('write-file-webpack-plugin');


module.exports = function(config) {

  const baseWebpackConfig = {
    entry: config.entry,
    output: {
      path: config.assetsRoot,
      publicPath: config.assetsPublicPath,
      filename: config.filename
    },
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }]
    },
    resolve: {
      alias: config.aliases
    }
  }

  //刷新
  baseWebpackConfig.entry = ['./build/dev/client'].concat(baseWebpackConfig.entry)

  return merge(baseWebpackConfig, {
    devtool: 'cheap-source-map',
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
}