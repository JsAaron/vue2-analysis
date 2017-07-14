const path = require('path')
const resolve = path.resolve
const _ = require("underscore");
const root = resolve(__dirname)

/**
 * 公共配置
 */
const common = {
  //index入口
  index: './src/index.html',
  //执行入口
  entry: './src/lib/index.js'
}

module.exports = {

  common: common,

  /**
   * 开发配置
   */
  dev: {

    /**
     * 浏览器访问端口
     */
    port: 8080,

    /**
     * 路径配置
     * @type {[type]}
     */
    conf: _.extend(common, {
      index: path.resolve(__dirname, 'temp/index.html'),
      assetsRoot: path.resolve(__dirname, 'temp'),
      assetsPublicPath: '/',
      productionSourceMap: true
    })
  }
}
