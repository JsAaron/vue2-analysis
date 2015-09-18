var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');
var notify = require('gulp-notify');
//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


//config file
var src      = './develop/';
var dest     = './release/';
var homepage = "index.html";
var config = {
    src  : src,
    dest : dest,
    webServer: {
        server    : './',
        index     : homepage,
        port      : 3000,
        logLevel  : "debug",
        logPrefix : "Aaron",
        open      : true,
        files     : [dest + "/*.js", "./index.html"] //监控变化
    },
    styl: {
        src: src + '**/*.styl'
    },
    script: {
        entry : src + 'main.js', //入口
        dest  : dest,  //打包后位置
        watch : src + '**/*.js', //监控脚本
        name  : 'bundle.js'  
    },
    html: {
        watchHome : homepage, //主页
        watchAll  : src + '**/*.html', //所有
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
