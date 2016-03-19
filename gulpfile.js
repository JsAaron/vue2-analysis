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
    open: true,
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
