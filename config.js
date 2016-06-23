var path = require('path')

module.exports = {
    dev: {
        port: 8888,
        index: path.resolve(__dirname, 'temp/index.html'),
        assetsRoot: path.resolve(__dirname, 'temp'),
        assetsPublicPath: '/',
        productionSourceMap: true,
        src: './xxt/',
        entry: './xxt/src/index.js'
    }
}