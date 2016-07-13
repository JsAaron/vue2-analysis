var path = require('path')

module.exports = {
    dev: {
        port: 8000,
        index: path.resolve(__dirname, 'temp/index.html'),
        assetsRoot: path.resolve(__dirname, 'temp'),
        assetsPublicPath: '/',
        productionSourceMap: true,
        src: './xxt/',
        entry: './xxt/src/index.js'
    },
    build: {
        root: 'demo'
    }
}