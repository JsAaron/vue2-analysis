var path = require('path')
var express = require('express')
var webpack = require('webpack')

//https://github.com/ampedandwired/html-webpack-plugin
var HtmlWebpackPlugin = require('html-webpack-plugin')
//https://github.com/webpack/webpack-dev-middleware#usage
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpacHotMiddleware  = require('webpack-hot-middleware')

var projectRoot = path.resolve(__dirname, '../')

var port = process.env.PORT || 3000

var app = express()


/**
 * webpack配置
 * @type {[type]}
 */
var config = {
    index: path.resolve(process.cwd(), 'dist/index.html'),
    assetsRoot: path.resolve(process.cwd() ,'dist'),
    assetsPublicPath: '/'
}

//配置dev
var entry = {
    app: './src/demo.js'
}

Object.keys(entry).forEach(function(name) {
    entry[name] = ['./build/dev-client'].concat(entry[name])
})

var webpackConfig = {
    entry: entry,
    output: {
        path: config.assetsRoot,
        publicPath: config.assetsPublicPath,
        filename: 'dev.js' //entry is Object
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
            filename: 'index.html',
            template: 'index.html',
            inject: true
        })
    ]
}

var compiler = webpack(webpackConfig)
// compiler.watch({
//     // aggregateTimeout: 200, 
//     // poll: true 
// }, function(err, stats) {
//     if (err) {
//         console.log('webpack fail')
//         return
//     }
//     console.log('webpack sucess')
// });


var devMiddleware = webpackDevMiddleware(compiler, {
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
var hotMiddleware = webpacHotMiddleware(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})


// serve webpack bundle output
app.use(devMiddleware)


// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)


module.exports = app.listen(port, function(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})
