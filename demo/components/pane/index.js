require('./style.styl')

module.exports = {
  template: require('./template.html'),
  replace: true,
  props: ['side', 'name']
}