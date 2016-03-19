var fs = require('fs')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
var replace = require('rollup-plugin-replace')
var version = process.env.VERSION;

var banner =
    '/*!\n' +
    ' * Vue.js v' + version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' Evan You\n' +
    ' * Released under the MIT License.\n' +
    ' */'

var main = fs
    .readFileSync('src/index.js', 'utf-8')
    .replace(/Vue\.version = '[\d\.]+'/, "Vue.version = '" + version + "'")
fs.writeFileSync('src/index.js', main)


module.exports = function(callback) {
    rollup.rollup({
            entry: 'src/index.js',
            plugins: [
                replace({
                    'process.env.NODE_ENV': "'development'"
                }),
                babel()
            ]
        })
        .then(function(bundle) {
            return write('demo/vue.js', bundle.generate({
                format: 'umd',
                banner: banner,
                moduleName: 'Vue'
            }).code)
        })
        .then(callback)
        .catch(logError)
}


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

function logError(e) {
    console.log(e)
}

function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
