
module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function() {
        return {
            msg       : 'This is page A.',
            leftName  : 'Bruce Lee',
            rightName : 'Chuck Norris'
        }
    },
    compiled: function() {
        var self = this;
        setTimeout(function() {
            self.$emit('data-loaded')
        }, 500)
    },
    components: {
        'app-header': require('../../components/header'),
        'app-pane': require('../../components/pane')
    }
}
