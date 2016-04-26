new Vue({

    el: '#demo',

    data: {
        checked: false
    },

    watch: {
        checked: function(v) {
            console.log(v)
        }
    }
})
