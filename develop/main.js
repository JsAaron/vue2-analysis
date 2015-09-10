// With proper loader configuration you can load,
// pre-process and insert css directly with require().
// See webpack.config.js for details.  
require('./main.sass')

Vue.config.debug = true // 开启调试模式

var app = new Vue({
    el: '#app',
    data: {
        view: 'page-a'
    }
})
