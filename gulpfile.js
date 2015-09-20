var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');
var notify = require('gulp-notify');
var concat = require('gulp-concat'); //合并文件

//http://csspod.com/using-browserify-with-gulp/
var browserify = require('browserify');
var source = require('vinyl-source-stream');

//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


//config file
var src = './develop/';
var dest = './release/';
var homepage = "index.html";
var config = {
    src: src,
    dest: dest,
    webServer: {
        server: './',
        index: homepage,
        port: 3000,
        logLevel: "debug",
        logPrefix: "Aaron",
        open: true,
        files: [dest + "/*.js", "./index.html"] //监控变化
    },
    styl: {
        src: src + '**/*.styl'
    },
    script: {
        entry: {
            'entry' :src + 'main.js'
            // 'vue'   :'./src/vue.js'
        },
        //输出
        output: {
            path       : dest, //js位置
            publicPath : dest, //web打包的资源地址
            filename   : 'bundle.js'
        },
        sourceMap: true, //源支持
        watch: src + '**/*.js' //监控脚本
    },
    html: {
        watchHome: homepage, //主页
        watchAll: src + '**/*.html', //所有
    }
}


// Webpack packaging
var webpackConfig = require('./webpack.config')(config);
gulp.task('scripts', function() {
    webpack(webpackConfig, function(err, stats) {
        if (err) {
            handleErrors();
        }
    });
});


//error prompt
function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: '编译错误',
        message: '<%= error.message %>'
    }).apply(this, args);
    this.emit('end');
};


// web服务 Server + watching scss/html files
gulp.task('web-server', function() {
    browserSync.init(config.webServer);
});



gulp.task('watch', ["scripts", 'web-server'], function() {
    gulp.watch(config.script.watch, ['scripts']);
    gulp.watch(config.styl.src, ['scripts']);
    gulp.watch(config.html.watchHome).on('change', reload);
    gulp.watch(config.html.watchAll).on('change', reload);
})

gulp.task('default', ['watch'])



//vue 测试
gulp.task('vue', function() {

    browserSync.init({
        server    : './vue',
        index     : homepage,
        port      : 3000,
        logLevel  : "debug",
        logPrefix : "Aaron",
        open      : false,
        files     : ["vue/**/*.js", "./vue/index.html"] //监控变化
    });

    webpack({
        watch  : true,
        entry  : './vue/develop/app.js',
        output: {
            path       : './vue/',
            publicPath : './vue/',
            filename   : 'bundle.js'
        },      
        devtool : '#source-map'
    }, function(err, stats) {
        if (err) {
            handleErrors();
        }
    });
})