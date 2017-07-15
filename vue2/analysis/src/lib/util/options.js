import {
  ASSET_TYPES
} from '../shared/constants'

import {
  extend,
  hasOwn,
  camelize,
  capitalize,
  isBuiltInTag,
  isPlainObject
} from '../shared/util'

const strats = Object.create(null)

/**
 * Default strategy.
 */
var defaultStrat = function(parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal
};


strats.el = strats.propsData = function(parent, child, vm, key) {
  if (!vm) {
    console.log(
      "option \"" + key + "\" can only be used during instance " +
      'creation with the `new` keyword.'
    );
  }
  return defaultStrat(parent, child)
};

/**
 * Data
 */
strats.data = function(parentVal, childVal, vm) {
  if (parentVal || childVal) {
    return function mergedInstanceDataFn() {

    }
  }
};


/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal ? extend(res, childVal) : res
}
ASSET_TYPES.forEach(function(type) {
  strats[type + 's'] = mergeAssets;
});


/**
 * Other object hashes.
 */
strats.props =
  strats.methods =
  strats.computed = function(parentVal, childVal) {
    if (!childVal) {
      return Object.create(parentVal || null)
    }
    if (!parentVal) {
      return childVal
    }
    var ret = Object.create(null);
    extend(ret, parentVal);
    extend(ret, childVal);
    return ret
  };


/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps(options) {
  var props = options.props;
  if (!props) {
    return
  }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        console.log('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : { type: val };
    }
  }
  options.props = res;
}

/**
 * 将两个选项对象合并为一个新对象。
 * 实例化和继承中使用的核心实用工具。
 * @param  {[type]} parent [description]
 * @param  {[type]} child  [description]
 * @param  {[type]} vm     [description]
 * @return {[type]}        [description]
 */
export function mergeOptions(parent, child, vm) {

  /*统一组件中props的格式，为对象*/
  normalizeProps(child);

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }

  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }

  /*如果能找到对应的匹配，则用匹配覆盖，否则默认的原始数据
    components
    directives
    filters
    如果能找到对应的解析器，解析器就是创建一个新对象，继承对应的components/directives/filters
    如果有child则混入，返回一个新的对象

    默认
  */
  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }

  return options
}