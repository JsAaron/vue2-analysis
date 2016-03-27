var gulp = require('gulp');
var webpack = require('webpack');
var fs = require('fs')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
var replace = require('rollup-plugin-replace')
var version = process.env.VERSION;

//http          ://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


var root = './mini-ue'
var src = root + '/src'
var dest = root
var packName = 'build'


/**
 * web server
 * @return {[type]}   [description]
 */
gulp.task('server', function() {
    browserSync.init({
        server: root,
        index: 'index.html',
        port: 3000,
      //  logLevel: "debug",
      //  logPrefix: "Aaron",
        open: false,
        files: [root + "/build.js", root + "/index.html"] //监控变化
    });
})

function logError(e) {
    console.log(e)
}

//============
// rollup部分
//============


var banner =
    '/*!\n' +
    ' * build.js v' + version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' Aaron\n' +
    ' * Released under the MIT License.\n' +
    ' */'

gulp.task('rollup-pack', function() {
    rollup.rollup({
            entry: src + '/index.js',
            plugins: [
                replace({
                    'process.env.NODE_ENV': "'development'"
                }),
                babel({
                    "presets": ["es2015-rollup"]
                })
            ]
        })
        .then(function(bundle) {
            return write(dest + '/build.js', bundle.generate({
                format: 'umd',
                banner: banner,
                moduleName: 'build'
            }).code)
        })
        .catch(logError)
})



function write(dest, code) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(dest, code, function(err) {
            if (err) return reject(err)
            console.log(blue(dest) + ' ' + getSize(code))
            resolve()
        })
    })
}

function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}



function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}


/**
 * rollup打包
 */
gulp.task('rollup', ['rollup-pack', 'server'], function() {
    gulp.watch(src + '/**/*.js', function() {
        gulp.run('rollup-pack');
    })
})



//==================
//  webpack部分
//==================

/**
 * webpack打包es6
 * @return {[type]} [description]
 */
gulp.task('webpack-pack', function() {
    webpack({
        // watch: true,
        //页面入口
        entry: src + '/index.js',
        //出口文件输出配置
        output: {
            path: dest, //js位置
            filename: packName
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
            logError();
        }
    });
})



/**
 * webapck打包
 */
gulp.task('webpack', ['webpack-pack', 'server'], function() {
    gulp.watch(src + '/**/*.js', function() {
        gulp.run('webpack-pack');
    })
})
