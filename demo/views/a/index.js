require('./a.styl')

Vue.transition('expand', {

    beforeEnter: function(el) {
        console.log('beforeEnter')
        // el.textContent = 'beforeEnter'
    },
    enter: function(el) {
         console.log('enter')
        // el.textContent = 'enter'
    },
    afterEnter: function(el) {
         console.log('afterEnter')
        // el.textContent = 'afterEnter'
    },
    enterCancelled: function(el) {
         console.log('enterCancelled')
        // handle cancellation
    },

    beforeLeave: function(el) {
        console.log(222)
        // el.textContent = 'beforeLeave'
    },
    leave: function(el) {
        // el.textContent = 'leave'
    },
    afterLeave: function(el) {
        // el.textContent = 'afterLeave'
    },
    leaveCancelled: function(el) {
        // handle cancellation
    }
})



module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function() {
        return {
            msg: 'This is page A.',
            leftName: 'Bruce Lee',
            rightName: 'Chuck Norris'
        }
    },
    compiled: function() {
        this.$emit('data-loaded')
    },
    components: {
        'app-header': require('../../components/header'),
        'app-pane': require('../../components/pane')
    }
}
