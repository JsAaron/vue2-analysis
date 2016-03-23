var gulp = require('gulp');
var webpack = require('webpack');
var build = require('./build.js')

//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

//config file
var src = './src/';
var dest = './demo/';
var homepage = "index.html";
var webServer = {
    server: dest,
    index: homepage,
    port: 3000,
    logLevel: "debug",
    logPrefix: "Aaron",
    open: false,
    files: [dest + "/*.js", "./index.html"] //监控变化
}

//error prompt
function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: '编译错误',
        message: '<%= error.message %>'
    }).apply(this, args);
    this.emit('end');
};

//============
// rollup部分
//============

// web服务 Server + watching scss/html files
gulp.task('web-server', function() {
    browserSync.init(webServer);
});


gulp.task('watch', ['web-server'], function() {
    gulp.watch(dest + homepage).on('change', reload);
    gulp.watch(dest + '**/*.js').on('change', reload);
    gulp.watch(src + '**/*.js', function() {
        build();
    })
})

gulp.task('default', ['watch'])



//==================
//  webpack部分
//==================


var miniRoot = './mini-vue'

/**
 * webpack打包es6
 * @return {[type]} [description]
 */
gulp.task('webpack-pack', function() {
    webpack({
        // watch: true,
        //页面入口
        entry: miniRoot + '/src/index.js',
        //出口文件输出配置
        output: {
            path: miniRoot, //js位置
            filename: 'build.js'
        },
        //source map 支持
        devtool: '#source-map',
        //加载器
        module: {
            loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }]
        }
    }, function(err, stats) {
        if (err) {
            handleErrors();
        }
    });
})


gulp.task('mini-server', function() {
    browserSync.init({
        server    : miniRoot,
        index     : 'index.html',
        port      : 3000,
        logLevel  : "debug",
        logPrefix : "Aaron",
        open      : false,
        files     : [miniRoot + "/build.js", miniRoot+"/index.html"] //监控变化
    });
})

/**
 * 迷你vue
 */
gulp.task('mini', ['webpack-pack','mini-server'], function() {
    gulp.watch(miniRoot + '/src/**/*.js', function() {
        gulp.run('webpack-pack');
    })
})
