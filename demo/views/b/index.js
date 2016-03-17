module.exports = {
    template: require('./template.html'),
    replace: true,
    compiled: function() {
        this.$emit('data-loaded')
    }
}
