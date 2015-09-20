module.exports = function(config) {
    return {
        // watch: true,
        //页面入口
        entry: config.script.entry,
        //出口文件输出配置
        output: config.script.output,
        //source map 支持
        devtool: config.script.sourceMap ? '#source-map' : '',
        //加载器
        module: {
            loaders: [{
                test: /\.sass$/,
                loader: 'style!css!sass'
            }, {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }, {
                test: /\.styl$/,
                loader: "style!css!stylus"
            }, {
                test: /\.html$/,
                loader: "html"
            }]
        }
    }
}
