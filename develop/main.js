// With proper loader configuration you can load,
// pre-process and insert css directly with require().
// See webpack.config.js for details.  
require('./main.styl')

Vue.component('user-profile', {
    template: '<li>{{user.name}} {{user.email}} {{user.msg}} {{parents}}</li>',
    props: ['parents'],
    data: function() {
        return {
            msg: '我的测试'
        }
    },
    created: function() {
        this.$dispatch('child-created', this)
    }
})

var app = new Vue({
    el: '#app',
    data: {
        view: 'page-a',
        users: [{
            name: 'Chuck Norris',
            email: 'chuck@norris.com',
            parents: 1
        }, {
            name: 'Bruce Lee',
            email: 'bruce@lee.com'
        }, {
            name: 'Bruce Lee',
            email: 'bruce@lee.com'
        },
         {
            name: '111e',
            email: '12312312312'
        }],
        parents: 'Aaron1'
    },

    created: function() {
        this.$on('child-created', function(child) {
            // console.log(child)
        })
    },

    components: {
        // define the main pages as async components.
        'page-a': function(resolve) {
            require(['./views/a'], resolve)
        },
        'page-b': function(resolve) {
            require(['./views/b'], resolve)
        }
    }
})


/**
 * Some really crude routing logic here, just for
 * demonstration purposes. The key thing to note here is
 * that we are simply changing the view of the root app -
 * Vue's async components and Webpack's code splitting will
 * automatically handle all the lazy loading for us.
 */

function route() {
    app.view = window.location.hash.slice(1) || 'page-a'
}

window.addEventListener('hashchange', route)
window.addEventListener('load', route)
