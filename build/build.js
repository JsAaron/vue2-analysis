const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
    // const multiEntry = require('rollup-plugin-multi-entry')

const config = require('../config')
const root = config.build.root

let banner =
    '/*!\n' +
    ' * vue-analysis \n' +
    ' * (c) ' + new Date().getFullYear() + ' Aaron\n' +
    ' * https://github.com/JsAaron/vue-analysis\n' +
    ' */'

let write = (dest, code) => {
    return new Promise(function(resolve, reject) {
        fs.writeFile(dest, code, function(err) {
            if (err) return reject(err)
            console.log(blue(dest) + ' ' + getSize(code))
            resolve()
        })
    })
}

let getSize = (code) => {
    return (code.length / 1024).toFixed(2) + 'kb'
}

let blue = (str) => {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}


function startRollup(dir) {

    var entry = root + '/' + dir + '/src/index.js'
    var build = root + '/' + dir + '/build.js'

    fs.stat(entry, function(err, stats) {
        if (err) {
            console.log('error：' + entry);
        } else {
            rollup.rollup({
                entry: entry,
                plugins: [
                    replace({
                        'process.env.NODE_ENV': "'development'"
                    }),
                    babel({
                        "presets": ["es2015-rollup"]
                    })
                ]
            }).then((bundle) => {
                return write(build, bundle.generate({
                    format: 'cjs',
                    banner: banner,
                    moduleName: 'build'
                }).code)
            }).catch((err) => {
                console.log(err)
            })
        }
    })

}

fs.readdir(root, function(err, files) {
    if (err) {
        console.log('read dir error');
    } else {
        files.forEach(function(dir) {
            startRollup(dir)
        })
    }
});