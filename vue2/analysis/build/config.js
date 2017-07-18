const path = require('path')
const rootPath = process.cwd()
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));
const mode = args.mode


const aliases = require('./alias')
const resolve = (p) => {
  return path.join(rootPath, p)
}

const builds = {
  'web-full-dev': {
    port: 8080,
    entry: resolve('src/lib/platforms/entry-runtime-with-compiler.js'), //入口
    index: resolve('src/index.html'), //html模板
    filename: 'app',
    assetsRoot: resolve('temp'), //临时编译文件
    assetsPublicPath: '/'
  }
}

function genConfig(opts) {
  opts.aliases = aliases
  return opts
}

if (mode) {
  module.exports = genConfig(builds[mode])
} else {
  module.exports = function(mode) {
    return genConfig(builds[mode])
  }
}

