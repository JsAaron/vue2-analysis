var gulp    = require('gulp');
var webpack = require('webpack');
var path    = require('path');
var notify  = require('gulp-notify');
var concat  = require('gulp-concat'); //合并文件
var build   = require('./build.js')

// var jshint = require('gulp-jshint');
// var map = require('map-stream');

//http://csspod.com/using-browserify-with-gulp/
var browserify = require('browserify');
var source     = require('vinyl-source-stream');

//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


//config file
var src  = './src/';
var dest = './demo/';
var homepage = "index.html";

var config = {
    src: src,
    dest: dest,
    webServer: {
        server    : dest,
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
        entry: {
            'entry': src + 'vue.js'
                // 'vue'   :'./src/vue.js'
        },
        //输出
        output: {
            path       : dest, //js位置
            publicPath : dest, //web打包的资源地址
            filename   : 'vue.js'
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




gulp.task('watch', ['web-server'], function() {
    gulp.watch(dest + homepage).on('change', reload);
    gulp.watch(dest + '**/*.js').on('change', reload);
    gulp.watch(config.script.watch, function() {
        build();
    })
})

gulp.task('default', ['watch'])



//vue 测试
gulp.task('test-vue-js', function() {
    webpack({
        // watch  : true,
        entry: './vue/develop/app.js',
        output: {
            path: './vue/',
            publicPath: './vue/',
            filename: 'bundle.js'
        },
        devtool: '#source-map',
        //加载器
        module: {

            loaders: [{
                test: /\.css$/,
                loader: 'style!css!sass'
            }, {
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
            }],

            preLoaders: [{
                test: /\.js$/,
                loader: "source-map-loader"
            }, {
                test: /\.js$/, // include .js files
                exclude: /node_modules/, // exclude any and all files in the node_modules folder
                loader: "jshint-loader"
            }]
        }
        // // more options in the optional jshint object
        // jshint: {
        //     asi:true, //省略分号
        //     // any jshint option http://www.jshint.com/docs/options/
        //     // i. e.
        //     camelcase: false,
        //     // jshint errors are displayed by default as warnings
        //     // set emitErrors to true to display them as errors
        //     emitErrors: false,
        //     // jshint to not interrupt the compilation
        //     // if you want any file with jshint errors to fail
        //     // set failOnHint to true
        //     failOnHint: true,
        //     // custom reporter function
        //     reporter: function(errors) {
        //           console.log(errors);
        //     }
        // }

    }, function(err, stats) {
        if (err) {
            handleErrors();
        }
    });
})

// var myReporter = map(function(file, cb) {
//     if (!file.jshint.success) {
//         console.log('JSHINT fail in ' + file.path);
//         file.jshint.results.forEach(function(err) {
//             if (err) {
//                 console.log(' ' + file.path + ': line ' + err.line + ', col ' + err.character + ', code ' + err.code + ', ' + err.reason);
//             }
//         });
//     }
//     cb(null, file);
// });

gulp.task('test-jslint', function() {
    return gulp.src('./vue/bundle.js')
        .pipe(jshint())
         .pipe(jshint.reporter('default'))
        // .pipe(myReporter)

});

gulp.task('test-vue-server', function() {
    browserSync.init({
        server      : './vue',
        index       : homepage,
        port        : 3000,
        // logLevel : "debug",
        logPrefix   : "Aaron",
        open        : true
            // files     : ["vue/**/*.js", "./vue/index.html"] //监控变化
    });
})


gulp.task('vue', ['test-vue-server', 'test-vue-js'], function() {
    gulp.watch('./vue/develop/**/*.js', ['test-vue-js']);
    gulp.watch('./vue/*.js').on('change', function(){
         reload();
    });
    gulp.watch('./vue/index.html').on('change', reload);
})
