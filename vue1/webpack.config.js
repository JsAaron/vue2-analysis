var webpack = require('webpack')

module.exports = {
    entry: './test/src/entry.js',
    output: {
        path: './test',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style!css'
        }]
    }
}