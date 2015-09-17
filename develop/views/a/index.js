
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
        this.$emit('data-loaded')
    },
    components: {
        'app-header': require('../../components/header'),
        'app-pane': require('../../components/pane')
    }
}
