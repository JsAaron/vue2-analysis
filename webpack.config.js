module.exports = function(config) {
    return {
        // watch: true,
        //页面入口
        entry: config.script.entry,
        //出口文件输出配置
        output: {
            path: config.dest, //js位置
            publicPath: config.dest, //web打包的资源地址
            filename: config.script.name
        },
        module: { //加载器
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
