// With proper loader configuration you can load,
// pre-process and insert css directly with require().
// See webpack.config.js for details.  
require('./main.styl')

var a = Vue.component('user-profile', {
    template: '<li {{view}}>{{user.name}} {{user.email}} {{user.msg}} {{parents}}</li>',
    props: ['parents'],
    data: function() {
        return {
            msg: '我的测试'
        }
    },

    computed: {
        msg: {
            set: function() {
                alert(2)
            },
            get: function() {
                alert(1)
            }
        }
    },

    compiled: function() {
        this.$log(this)
    },
    created: function() {
        this.$dispatch('child-created', this)
    }
})

console.log(a   )

var app = new Vue({
    el: '#app',
    data: {
        view: 'page-a',
        users: [{
            name: 'Chuck Norris',
            email: 'chuck@norris.com'
        }, {
            name: 'Bruce Lee',
            email: 'bruce@lee.com'
        }, {
            name: 'Bruce Lee',
            email: 'bruce@lee.com'
        }, {
            name: '111e',
            email: '12312312312'
        }],
        parents: 'Aaron'
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


console.log(app)


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
