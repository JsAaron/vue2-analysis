import { parseHTML } from './html-parser'

import {
  addAttr
} from '../helpers'

export const dirRE = /^v-|^@|^:/

const bindRE = /^:|^v-bind:/

/**
 * 解析一个HTML的字符串为 AST
 */
export function parse(template, options) {

  var stack = [];
  var root;
  var currentParent;

  parseHTML(template, {
    /**
     * 解析每个属性部分对应的定义
     */
    start: function(tag, attrs, unary) {
      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: null,
        children: []
      };

      //处理属性
      processAttrs(element)

      if (!root) {
        root = element;
      }

      if (!unary) {
        currentParent = element;
        stack.push(element);
      }

    }
  })
}

/**
 * 把属性解析成单一的对象map
 */
function makeAttrsMap(attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}


function processAttrs(el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    //判断是有指令/^v-|^@|^:/
    if (dirRE.test(name)) {
      el.hasBindings = true;
      ///^:|^v-bind:/采用2种放方式绑定的属性
      if (bindRE.test(name)) {
        name = name.replace(bindRE, '');
        // console.log(name)
      }
    } else {
      addAttr(el, name, JSON.stringify(value));
    }
  }
}