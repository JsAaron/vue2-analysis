const fs = require('fs')
const express = require('express')
const webpack = require('webpack')
const ora = require('ora')
const fsextra = require('fs-extra')

//https://github.com/ampedandwired/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

//https://github.com/webpack/webpack-dev-middleware#usage
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpacHotMiddleware = require('webpack-hot-middleware')

//https://www.npmjs.com/package/write-file-webpack-plugin
const WriteFilePlugin = require('write-file-webpack-plugin');

const config = require('../../config')
const port = process.env.PORT || config.dev.port
const app = express()

fsextra.removeSync(config.dev.assetsRoot)
fsextra.mkdirSync(config.dev.assetsRoot)

const entry = {
    app: config.dev.entry
}
Object.keys(entry).forEach((name) => {
    entry[name] = ['./build/dev/client'].concat(entry[name])
})

const webpackConfig = {
    entry: entry,
    output: {
        path: config.dev.assetsRoot,
        publicPath: config.dev.assetsPublicPath,
        filename: 'app.js'
    },
    devtool: '#eval-source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        // 热替换、错误不退出
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),

        // 生成html文件
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './xxt/index.html',
            inject: true
        }),

        new WriteFilePlugin()
    ]
}

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


// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

app.use('/lib', express.static('src/lib'));
app.use('/css', express.static('src/css'));
app.use('/images', express.static('src/images'));
app.use('/content', express.static('src/content'));

module.exports = app.listen(port, (err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})