var apiURL = 'https://api.github.com/repos/vuejs/vue/commits?per_page=3&sha='
var isPhantom = navigator.userAgent.indexOf('PhantomJS') > -1

new Vue({

    el: '#demo',

    data: {
        branches: ['master', 'dev'],
        currentBranch: 'master',
        commits: null
    },

    created: function() {
        this.fetchData()
    },

    watch: {
        currentBranch: 'fetchData'
    },

    methods: {
        fetchData: function() {
            // CasperJS fails at cross-domain XHR even with
            // --web-security=no, have to mock data here.
            if (isPhantom) {
                return mockData.call(this)
            }
            var xhr = new XMLHttpRequest()
            var self = this
            xhr.open('GET', apiURL + self.currentBranch)
            xhr.onload = function() {
                self.commits = JSON.parse(xhr.responseText)
                console.log(self.commits[0].html_url)
            }
            xhr.send()
        }
    }


})
