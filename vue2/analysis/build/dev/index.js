const fs = require('fs')
const http = require('http');
const express = require('express')
const webpack = require('webpack')
const path = require('path')
const _ = require("underscore");
const fsextra = require('fs-extra')
const cp = require('child_process');
const utils = require('../utils')

//https://github.com/webpack/webpack-dev-middleware#usage
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpacHotMiddleware = require('webpack-hot-middleware')
const killOccupied = require('../kill.occupied')


const app = express()
const config = require('../../config')
const port = process.env.PORT || config.dev.port

const devConfig = _.extend(config.dev.conf, {
  rollup: config.dev.conf.distDir + 'rollup.js'
})


const webpackConfig = require('./webpack.dev.conf')

fsextra.removeSync(devConfig.assetsRoot)

const compiler = webpack(webpackConfig)

const devMiddleware = webpackDevMiddleware(compiler, {
  //The path where to bind the middleware to the server.
  //In most cases this equals the webpack configuration option output.publicPath
  publicPath: webpackConfig.output.publicPath,

  //Output options for the stats. See node.js API.
  //http://webpack.github.io/docs/node.js-api.html
  stats: {
    //With console colors
    colors: true,
    //add chunk information
    chunks: false
  }
})


//Webpack热重载连接服务器
//https://github.com/glenjamin/webpack-hot-middleware
//Add webpack-hot-middleware attached to the same compiler instance
const hotMiddleware = webpacHotMiddleware(compiler)

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', (compilation) => {
    //https://github.com/ampedandwired/html-webpack-plugin
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
      hotMiddleware.publish({
        action: 'reload'
      })
      cb()
    })
  })
  // cssWatcher(devConfig.srcDir,function() {
  //    hotMiddleware.publish({
  //       action: 'reload'
  //     })
  // })
  // serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

app.use('/lib', express.static('src/lib'));
app.use('/css', express.static('src/css'));
app.use('/js', express.static('src/js'));




killOccupied(port, () => {
  app.listen(port, (err) => {
    if (err) {
      utils.log(err)
      return
    }
    utils.log('Listening at http://localhost:' + port + '\n')
  })
})
