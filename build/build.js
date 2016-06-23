const fs = require('fs')
const rollup = require('rollup')
var babel = require('rollup-plugin-babel')
var replace = require('rollup-plugin-replace')

const entry = 'xxt/src/index.js'
const dest = 'xxt'

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
    return write(dest + '/build.js', bundle.generate({
        format: 'cjs',
        banner: banner,
        moduleName: 'build'
    }).code)
}).catch((err) => {
    console.log(err)
})