var path = require('path')

module.exports = {
    build: {
        index: path.resolve(__dirname, 'temp/index.html'),
        assetsRoot: path.resolve(__dirname, 'temp'),
        assetsPublicPath: '/',
        productionSourceMap: true,
        src: './src/',
        dist: './dist/',
        entry: './src/lib/index.js'
    },
    dev: {
        port: 8888,
        proxyTable: {}
    }
}