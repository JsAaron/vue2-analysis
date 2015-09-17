module.exports = {
    template: require('./template.html'),
    replace: true,
    compiled: function() {
        var self = this;
        setTimeout(function() {
            self.$emit('data-loaded')
        }, 1000)
    }
}
