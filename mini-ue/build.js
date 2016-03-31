/*!
 * build.js vundefined
 * (c) 2016 Aaron
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('util/index')) :
  typeof define === 'function' && define.amd ? define(['util/index'], factory) :
  (global.build = factory(global.util_index));
}(this, function (util_index) { 'use strict';

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };
  babelHelpers;

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  /**
   * 检查对象上是否有指定的属性
   * @param {Object} obj
   * @param {String} key
   * @return {Boolean}
   */
  function hasOwn(obj, key) {
      return hasOwnProperty.call(obj, key);
  }

  function isObject(obj) {
      return obj !== null && (typeof obj === 'undefined' ? 'undefined' : babelHelpers.typeof(obj)) === 'object';
  }

  //是一个真实的对象
  //通过call prototype  == [object object]
  var toString = Object.prototype.toString;
  var OBJECT_STRING = '[object Object]';
  function isPlainObject(obj) {
      return toString.call(obj) === OBJECT_STRING;
  }

  /**
   * 数组化
   * 转化一个像数组的对象变成一个真实的数组
   * @param  {[type]} list  [description]
   * @param  {[type]} start [description]
   * @return {[type]}       [description]
   */
  function toArray(list, start) {
      start = start || 0;
      var i = list.length - start;
      var ret = new Array(i);
      while (i--) {
          ret[i] = list[i + start];
      }
      return ret;
  }

  /**
   * 文本输出
   * 如果是null 返回空
   * 如果有值，通过toString强制转字符串
   * @param {*} value
   * @return {String}
   */

  function _toString(value) {
      return value == null ? '' : value.toString();
  }

  /**
   * 定义一个属性
   *
   * @param {Object} obj
   * @param {String} key
   * @param {*} val
   * @param {Boolean} [enumerable]
   */

  function def(obj, key, val, enumerable) {
      Object.defineProperty(obj, key, {
          value: val,
          enumerable: !!enumerable,
          writable: true,
          configurable: true
      });
  }

  /**
   * 数组检测
   *
   * @param {*} obj
   * @return {Boolean}
   */
  var isArray = Array.isArray;

  /**
   * 混入属性合并
   * @param  {[type]} to   [description]
   * @param  {[type]} from [description]
   * @return {[type]}      [description]
   */
  function extend(to, from) {
      var keys = Object.keys(from);
      var i = keys.length;
      while (i--) {
          to[keys[i]] = from[keys[i]];
      }
      return to;
  }

  /**
   * 错误提示
   */
  var warn$2 = void 0;
  var hasConsole = typeof console !== 'undefined';
  warn$2 = function warn(msg, e) {
      if (hasConsole) {
          console.warn('[Ue warn]: ' + msg);
      }
  };

  /**
   * 查询节点
   * @param  {[type]} el [description]
   * @return {[type]}    [description]
   */
  function query(el) {
    if (typeof el === 'string') {
      var selector = el;
      el = document.querySelector(el);
      if (!el) {
        warn('Cannot find element: ' + selector);
      }
    }
    return el;
  }

  /**
   * 绑定shij
   *
   * @param {Element} el
   * @param {String} event
   * @param {Function} cb
   * @param {Boolean} [useCapture]
   */

  function on(el, event, cb, useCapture) {
    el.addEventListener(event, cb, useCapture);
  }

  /**
   * 通过el替换target节点
   *
   * @param {Element} target
   * @param {Element} el
   */

  function replace(target, el) {
    var parent = target.parentNode;
    if (parent) {
      parent.replaceChild(el, target);
    }
  }

  /**
   * 配置文件
   */
  var config = {

      /**
       * 组件列表类型
       * @type {Array}
       */
      _assetTypes: ['component', 'directive', 'elementDirective', 'filter', 'transition', 'partial']
  };

  var strats = config.optionMergeStrategies = Object.create(null);

  /**
   * 助手递归合并两个数据对象在一起
   * @param  {[type]} to   [description]
   * @param  {[type]} from [description]
   * @return {[type]}      [description]
   */
  function mergeData(to, from) {
      var key, toVal, fromVal;
      for (key in from) {
          toVal = to[key];
          fromVal = from[key];
          if (!hasOwn(to, key)) {
              set(to, key, fromVal);
          } else if (isObject(toVal) && isObject(fromVal)) {
              mergeData(toVal, fromVal);
          }
      }
      return to;
  }

  /**
   * 当存在一个vm(实例创建), 我们需要做的 
   * 构造函数之间的三方合并选项, 实例
   * @param  {[type]} parentVal [description]
   * @param  {[type]} childVal  [description]
   * @return {[type]}           [description]
   */
  function mergeAssets(parentVal, childVal) {
      var res = Object.create(parentVal);
      return childVal ? extend(res, guardArrayAssets(childVal)) : res;
  }
  config._assetTypes.forEach(function (type) {
      strats[type + 's'] = mergeAssets;
  });

  strats.data = function (parentVal, childVal, vm) {
      return function mergedInstanceDataFn() {
          // instance merge
          var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
          var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
          if (instanceData) {
              return mergeData(instanceData, defaultData);
          } else {
              return defaultData;
          }
      };
  };

  strats.el = function (parentVal, childVal, vm) {
      var ret = childVal || parentVal;
      return ret;
  };

  strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
      if (!childVal) return parentVal;
      if (!parentVal) return childVal;
      var ret = Object.create(null);
      extend(ret, parentVal);
      extend(ret, childVal);
      return ret;
  };

  function guardArrayAssets(assets) {
      console.log(assets);
  }

  /**
   * 默认策略
   */
  var defaultStrat = function defaultStrat(parentVal, childVal) {
      return childVal === undefined ? parentVal : childVal;
  };

  /**
   * 合并
   * 将两个选项对象合并为一个新的
   * @return {[type]} [description]
   */
  function mergeOptions(parent, child, vm) {

      var options = {};
      var key;

      //optons:
      // components: Object
      // directives: Object
      // elementDirectives: Object
      // filters: Object
      // partials: Object
      // replace: true
      // transitions: Object
      for (key in parent) {
          mergeField(key);
      }

      //options参数处理
      //返回一个link
      for (key in child) {
          if (!hasOwn(parent, key)) {
              mergeField(key);
          }
      }

      function mergeField(key) {
          var strat = strats[key] || defaultStrat;
          //object.create继承parent=>child
          options[key] = strat(parent[key], child[key], vm, key);
      }

      return options;
  }

  /**
   * 异步延迟一个任务来执行它
   * 我们利用MutationObserver来执行
   * 否则用setTimeout(0)
   * @param  {Array}  ) {              
   * @return {[type]}   [description]
   */
  var nextTick = function () {
      var callbacks = [];
      var pending = false;
      var timerFunc;

      /**
       * 触发所有更新
       * @return {[type]} [description]
       */
      function nextTickHandler() {
          pending = false;
          var copies = callbacks.slice(0);
          callbacks = [];
          for (var i = 0; i < copies.length; i++) {
              copies[i]();
          }
      }

      //Mutation Observer（变动观察器）是监视DOM变动的接口。
      //当DOM对象树发生任何变动时，Mutation Observer会得到通知。
      //这样设计是为了应付DOM变动频繁的情况。
      //举例来说，
      // 如果在文档中连续插入1000个段落（p元素），
      // 会连续触发1000个插入事件，执行每个事件的回调函数，
      // 这很可能造成浏览器的卡顿；而MutationObserver完全不同，
      // 只在1000个段落都插入结束后才会触发，而且只触发一次。
      //
      // MutationObserver所观察的DOM变动（即上面代码的option对象），包含以下类型：
      // 	    childList：子元素的变动
      //	    attributes：属性的变动
      //  	characterData：节点内容或节点文本的变动
      //    	subtree：所有下属节点（包括子节点和子节点的子节点）的变动
      if (typeof MutationObserver !== 'undefined') {
          var counter = 1;
          var observer = new MutationObserver(nextTickHandler);
          var textNode = document.createTextNode(counter);
          observer.observe(textNode, {
              characterData: true
          });
          timerFunc = function timerFunc() {
              counter = (counter + 1) % 2;
              textNode.data = counter;
          };
      } else {
          var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
          timerFunc = context.setImmediate || setTimeout;
      }
      return function (cb) {
          var func = cb;
          callbacks.push(func);

          //状态控制
          //如果执行了就不在调用
          //等一下次完毕
          if (pending) return;
          pending = true;
          timerFunc(nextTickHandler, 0);
      };
  }();

  var uid = 0;

  /**
   * dep 是一个可观察量
   * 可以被多个指定订阅
   */
  function Dep() {
      this.id = uid++;
      this.subs = [];
  }

  /**
   * 自我作为一个依赖项添加到目标watcher
   */
  Dep.prototype.depend = function () {
      /**
       *  Dep.target = this;
       *  this = new Watcher()
       *  this.addDep
       */
      Dep.target.addDep(this);
  };

  /**
   * 添加一个指令订阅者
   * @param {Directive} sub => watcher对象
   */

  Dep.prototype.addSub = function (sub) {
      this.subs.push(sub);
  };

  /**
   * 更新
   * 通知所有用户的一个新值。
   * @return {[type]} [description]
   */
  Dep.prototype.notify = function () {
      //subs就是watcher对象的合集
      var subs = toArray(this.subs);
      for (var i = 0, l = subs.length; i < l; i++) {
          //watcher.update
          subs[i].update();
      }
  };

  function Observer(value) {
      this.value = value;
      this.dep = new Dep();
      //给option.data扩展一个__ob__对象
      //默认enumerable为false不能被枚举
      def(value, '__ob__', this);
      //值是数组
      if (isArray(value)) {
          console.log('isArray为处理');
      } else {
          this.walk(value);
      }
  }

  /**
   * 当值是对象的时候
   * 把每一个属性转化成setter/getter
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
  Observer.prototype.walk = function (obj) {
      var keys = Object.keys(obj);
      for (var i = 0, l = keys.length; i < l; i++) {
          this.convert(keys[i], obj[keys[i]]);
      }
  };

  /**
   * 转化一个属性转换成getter / setter
   * 所以当这个属性被改变的时候，我们能触发这个事件
   * @param {String} key
   * @param {*} val
   */
  Observer.prototype.convert = function (key, val) {
      defineReactive(this.value, key, val);
  };

  /*
   *添加一个所有者vm,所以当设置/删除美元突变
   *发生我们可以通知所有者vm代理键和
   *消化观察者。这只是对象时调用
   *观察是一个实例的根元数据。
   */
  Observer.prototype.addVm = function (vm) {
      (this.vms || (this.vms = [])).push(vm);
  };

  /**
   * 给对象定义活动属性
   * @param  {[type]} obj          [description]
   * @param  {[type]} key          [description]
   * @param  {[type]} val          [description]
   * @param  {[type]} doNotObserve [description]
   * @return {[type]}              [description]
   */
  function defineReactive(obj, key, val, doNotObserve) {
      var dep = new Dep();
      //属性可以被删除
      var property = Object.getOwnPropertyDescriptor(obj, key);
      if (property && property.configurable === false) {
          return;
      }
      Object.defineProperty(obj, key, {
          enumerable: true,
          configurable: true,
          //获取
          get: function reactiveGetter() {
              //原始值
              var value = val;
              //如果有依赖
              //增加依赖
              // 
              // Dep.target = this => new Watcher() 对象
              // dep.depend
              //    把当前dep加入到目标Dep.target中
              //
              if (Dep.target) {
                  dep.depend();
              }
              return value;
          },
          //设置
          set: function reactiveSetter(newVal) {
              var value = val;
              if (newVal === value) {
                  return;
              }
              //更新值
              val = newVal;

              //依赖通知
              dep.notify();
          }
      });
  }

  /**
   * 为实例的value创建观察observer
   * 成功：返回一个新的observer
   * 或者返回已经存在的observer对象
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  function observe(value, vm) {
      //必须是对象
      if (!value || (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) !== 'object') {
          return;
      }
      var ob;
      //如果存在
      if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
          ob = value.__ob__;
          //数组
          //对象
          //可以被扩展
      } else if ((isArray(value) || isPlainObject(value)) && Object.isExtensible(value)) {
              ob = new Observer(value);
          }

      if (ob && vm) {
          ob.addVm(vm);
      }

      return ob;
  }

  var on$1 = {
      test: 'on',

      acceptStatement: true,

      bind: function bind() {},
      update: function update(handler) {
          this.handler = handler;
          on(this.el, this.arg, function (e) {
              handler(e);
          }, 'fasle');
      }
  };

  var text = {

      test: 'text',

      bind: function bind() {
          this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
      },

      update: function update(value) {
          this.el[this.attr] = _toString(value);
      }
  };

  var model = {

      params: ['lazy', 'number', 'debounce'],

      bind: function bind() {},

      checkFilters: function checkFilters() {},

      unbind: function unbind() {}
  };

  var directives = {
      on: on$1,
      model: model,
      text: text
  };

  //特殊的绑定前缀
  //用来检查指定

  //v-on|@快捷方式
  var onRE = /^v-on:|^@/;
  //普通v-命令
  var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/;

  //定义终端指令
  var terminalDirectives = ['for', 'if'];

  var tagRE = /\{\{\{(.+?)\}\}\}|\{\{(.+?)\}\}/g;
  var htmlRE = /^\{\{\{.*\}\}\}$/;

  /**
   * 编译一个模版，返回一个可以重用的复合连接函数
   * 并且能够在内部递归更多的连接
   *
   * 最顶层的编译函数，通常是叫做元素的实例的根节点
   * 假如partial参数是正确的，也可以用来作为部分编译
   * 
   * @param  {[type]} el      [description]
   * @param  {[type]} options [description]
   * @param  {[type]} partial [description]
   * @return {[type]}         [description]
   */
  function compile(el, options, partial) {

      //编译节点本身
      var nodeLinkFn = compileNode(el, options);
      //编译子节点
      var childLinkFn = el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;

      return function compositeLinkFn(vm, el, host, scope, frag) {
          var childNodes = toArray(el.childNodes);
          //初始化link
          var dirs = linkAndCapture(function compositeLinkCapturer() {
              if (nodeLinkFn) nodeLinkFn(vm, el, host, scope, frag);
              if (childLinkFn) childLinkFn(vm, childNodes, host, scope, frag);
          }, vm);
          // return makeUnlinkFn(vm, dirs)
      };
  }

  function linkAndCapture(linker, vm) {
      //指令数
      var originalDirCount = vm._directives.length;
      linker();
      //拷贝指令
      var dirs = vm._directives.slice(originalDirCount);
      //指令初始化
      for (var i = 0, l = dirs.length; i < l; i++) {
          dirs[i]._bind();
      }
      return;
  }

  //************************
  //      编译子节点
  //************************

  /**
   * 编译一个节点列表
   * 返回子节点childLinkFn
   * @param  {[type]} nodeList [description]
   * @param  {[type]} options  [description]
   * @return {[type]}          [description]
   *
   * [nodeLinkFn,childLinkFn,nodeLinkFn,childLinkFn...........]
   * 
   * 
   */
  function compileNodeList(nodeList, options) {
      var linkFns = [];
      var nodeLinkFn, childLinkFn, node;
      for (var i = 0, l = nodeList.length; i < l; i++) {
          node = nodeList[i];
          //本身节点
          //nodeType = (1 || 3) 元素 文本节点
          nodeLinkFn = compileNode(node, options);
          //如果有子字节
          if (node.hasChildNodes()) {
              //递归
              childLinkFn = compileNodeList(node.childNodes, options);
          } else {
              childLinkFn = null;
          }
          linkFns.push(nodeLinkFn, childLinkFn);
      }
      return linkFns.length ? makeChildLinkFn(linkFns) : null;
  }

  /**
   * 生成子节点的link函数
   * linkFns 
   *     [nodeLinkFn,childrenLinkFn,nodeLinkFn,childrenLinkFn.......]
   * linkFns的数组排列是一个父节点linnk一个子节点link
   * 所以在遍历的时候通过i++的来0,1 | 2,3 这样双取值
   * 
   * @param  {[type]} linkFns [description]
   * @return {[type]}         [description]
   */
  function makeChildLinkFn(linkFns) {
      return function childLinkFn(vm, nodes, host, scope, frag) {
          var node, nodeLinkFn, childrenLinkFn;
          for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
              node = nodes[n];
              nodeLinkFn = linkFns[i++];
              childrenLinkFn = linkFns[i++];
              var childNodes = toArray(node.childNodes);
              if (nodeLinkFn) {
                  nodeLinkFn(vm, node, host, scope, frag);
              }
              if (childrenLinkFn) {
                  childrenLinkFn(vm, childNodes, host, scope, frag);
              }
          }
      };
  }

  //************************
  //      编译本身节点
  //************************

  /**
   * 返回一个基于节点类型的nodeLinkFn
   * @param  {[type]} node    [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  function compileNode(node, options) {
      var type = node.nodeType;
      //元素类型
      //并且不是SCRIPT
      if (type === 1 && node.tagName !== 'SCRIPT') {
          return compileElement(node, options);
      } else if (type === 3 && node.data.trim()) {
          //文本类型,不为空
          return compileTextNode(node, options);
      } else {
          return null;
      }
  }

  /**
   * 编译一个元素并且返回一个nodeLinkFn
   * @param {Element} el
   * @param {Object} options
   * @return {Function|null}
   */
  function compileElement(el, options) {
      var linkFn;
      //如果有属性
      var hasAttrs = el.hasAttributes();
      //检车是是否为if for指令
      if (hasAttrs) {
          linkFn = checkTerminalDirectives(el, options);
      }
      //正常指定编译
      if (!linkFn && hasAttrs) {
          linkFn = compileDirectives(el.attributes, options);
      }
      return linkFn;
  }

  /**
   * 编译文本节点
   * @return {[type]} [description]
   */
  function compileTextNode(node, options) {
      //保证必须正确的值
      var tokens = parseText(node.wholeText);
      if (!tokens) {
          return null;
      }

      //创建文档碎片
      var frag = document.createDocumentFragment();
      var el, token;
      for (var i = 0, l = tokens.length; i < l; i++) {
          token = tokens[i];
          el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
          frag.appendChild(el);
      }
      return makeTextNodeLinkFn(tokens, frag, options);
  }

  function processTextToken(token, options) {
      var el;
      el = document.createTextNode(' ');
      setTokenType('text');

      function setTokenType(type) {
          if (token.descriptor) return;
          if (!directives[type]) {
              console.log('指令没找到', type);
          }
          token.descriptor = {
              name: type,
              def: directives[type],
              expression: token.value
          };
      }
      return el;
  }

  /**
   * 文本处理 {{ message}}
   * 通过文档碎片
   * 解析出tokens的数组合集
   * 然后通过每一个tokens填充文档中每一个node
   *  node = childNodes[i];
   * @param  {[type]} tokens [description]
   * @param  {[type]} frag   [description]
   * @return {[type]}        [description]
   */
  function makeTextNodeLinkFn(tokens, frag) {
      return function textNodeLinkFn(vm, el, host, scope) {
          var fragClone = frag.cloneNode(true);
          var childNodes = toArray(fragClone.childNodes);
          var token, value, node;
          for (var i = 0, l = tokens.length; i < l; i++) {
              token = tokens[i];
              value = token.value;
              if (token.tag) {
                  node = childNodes[i];
                  //创建指令
                  vm._bindDir(token.descriptor, node, host, scope);
              }
          }
          //拿文档碎片替换{{}}节点
          replace(el, fragClone);
      };
  }

  /**
   * 解析文本
   * 包含："前后空格"
   * " {{ name }} "
   * 
   * @return {[type]} [description]
   */
  function parseText(text) {

      //去掉换行
      text = text.replace(/\n/g, '');

      //如果不是ue能解析的文本
      //必须是{{ }} 包含的节点
      //比如:内容"中文节点"
      //<a v-on:click="show()">点击</a>
      // "点击"=》text 就retrun
      if (!/\s*\{\{/.test(text)) {
          return null;
      }

      var tokens = [];
      var match, index, html, value, first, oneTime;
      while (match = tagRE.exec(text)) {
          index = match.index;
          html = htmlRE.test(match[0]);
          value = html ? match[1] : match[2];
          first = value.charCodeAt(0);
          oneTime = first === 42; // *
          value = oneTime ? value.slice(1) : value;
          tokens.push({
              tag: true,
              value: value.trim(),
              html: html,
              oneTime: oneTime
          });
      }
      return tokens;
  }

  /**
   * 检查终端指令按固定顺序的元素。
   * 如果找到一个,返回一个终端连接功能。
   * if for
   * @return {[type]} [description]
   */
  function checkTerminalDirectives(el, options) {
      var value, dirName;
      for (var i = 0, l = terminalDirectives.length; i < l; i++) {
          dirName = terminalDirectives[i];
          value = el.getAttribute('v-' + dirName);
          if (value != null) {
              return makeTerminalNodeLinkFn(el, dirName, value, options);
          }
      }
  }

  /**
   * 构建终端link
   * @param  {[type]} el      [description]
   * @param  {[type]} dirName [description]
   * @param  {[type]} value   [description]
   * @param  {[type]} options [description]
   * @param  {[type]} def     [description]
   * @return {[type]}         [description]
   */
  function makeTerminalNodeLinkFn(el, dirName, value, options, def) {
      var descriptor = {
          name: dirName,
          expression: value,
          raw: value
      };
      var fn = function terminalNodeLinkFn(vm, el, host, scope, frag) {
          vm._bindDir(descriptor, el, host, scope, frag);
      };
      return fn;
  }

  /**
   * 编译一个元素指令返回一个linker
   * @param  {[type]} attrs   [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  function compileDirectives(attrs, options) {
      var i = attrs.length;
      var dirs = [];
      var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;

      while (i--) {
          //找到每一个属性
          attr = attrs[i];
          //属性名
          name = rawName = attr.name;
          //属性值
          value = rawValue = attr.value;

          //事件绑定
          //v-on: | @
          if (onRE.test(name)) {
              arg = name.replace(onRE, '');
              pushDir('on', directives.on);
          } else
              // 普通指定
              if (matched = name.match(dirAttrRE)) {
                  dirName = matched[1];
                  arg = matched[2];
                  var assets = options['directives'];
                  dirDef = assets[dirName];
                  if (dirDef) {
                      pushDir(dirName, dirDef);
                  }
              }
      }

      /**
       * push 一个指令
       * @param  {[type]} dirName      [description]
       * @param  {[type]} def          [description]
       * @param  {[type]} interpTokens [description]
       * @return {[type]}              [description]
       */
      function pushDir(dirName, def, interpTokens) {
          dirs.push({
              name: dirName,
              attr: rawName,
              raw: rawValue,
              def: def,
              arg: arg,
              expression: value
          });
      }

      //假如有指令集合
      if (dirs.length) {
          return makeNodeLinkFn(dirs);
      }
  }

  /**
   * 给所有的单个节点构建一个link
   * @param  {[type]} directives [description]
   * @return {[type]}            [description]
   */
  function makeNodeLinkFn(directives) {
      return function nodeLinkFn(vm, el, host, scope, frag) {
          var i = directives.length;
          while (i--) {
              vm._bindDir(directives[i], el, host, scope, frag);
          }
      };
  }

  /**
   * watcher批量处理器
   *
   * 有两个分开的队列
   * 一个用于指令directive更新
   * 一个是用来给用户注册的$watch()
   * 
   */

  var queue = [];
  var has = {};
  var queueIndex;

  /**
   * 冲洗两个队列和运行观察对象
   */
  function flushBatcherQueue() {
      runBatcherQueue(queue);
  }

  /**
   * 在单个队列中运行watchers
   * @param {Array} queue
   * queue 
   *   watcher对象合集
   */

  function runBatcherQueue(queue) {
      for (queueIndex = 0; queueIndex < queue.length; queueIndex++) {
          var watcher = queue[queueIndex];
          var id = watcher.id;
          //清空标记
          has[id] = null;
          watcher.run();
      }
  }

  /**
   * 增加一个watcher对象到这个watcher队列
   * @param  {[type]} watcher [description]
   * @return {[type]}         [description]
   */
  function pushWatcher(watcher) {

      var id = watcher.id;

      if (has[id] == null) {
          var q = queue;
          has[id] = q.length;
          //指令队列
          q.push(watcher);
          //更新动作
          nextTick(flushBatcherQueue);
      }
  }

  //简单字符表达式
  var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
  var booleanLiteralRE = /^(?:true|false)$/;

  /**
   * 建立一个getter函数。需要eval。
   * @param  {[type]} body [description]
   * @return {[type]}      [description]
   */
  function makeGetterFn(body) {
      try {
          return new Function('scope', 'return ' + body + ';');
      } catch (e) {
          'development' !== 'production' && util_index.warn('Invalid expression. ' + 'Generated function body: ' + body);
      }
  }

  /**
   * 解析表达式
   * 重写setter/getter
   * @param  {[type]} exp     [description]
   * @param  {[type]} needSet [description]
   * @return {[type]}         [description]
   */
  function parseExpression(exp, needSet) {
      exp = exp.trim();
      var res = {
          exp: exp
      };
      //简单表达式getter
      res.get = makeGetterFn('scope.' + exp);
      return res;
  }

  /**
   * 检测是一个简单是路径表达式
   * 比如: 
   *    1 v-on:show() 错误
   *    2 v-on:show 正确
   * @param  {[type]}  exp [description]
   * @return {Boolean}     [description]
   */
  function isSimplePath(exp) {
      return pathTestRE.test(exp) &&
      // don't treat true/false as paths
      !booleanLiteralRE.test(exp) &&
      // Math constants e.g. Math.PI, Math.E etc.
      exp.slice(0, 5) !== 'Math.';
  }

  var uid$1 = 0;

  /**
   * watcher用来解析表达式
   * 收集依赖关系
   * 当表达式的值被改变触发callback回调函数
   * 给api或者指令 使用$watch()方法
   * @param {[type]}   vm      [description]
   * @param {[type]}   expOrFn [description]
   * @param {Function} cb      [description]
   * @param {[type]}   options [description]
   */
  function Watcher(vm, expOrFn, cb, options) {
      //混入参数
      if (options) {
          extend(this, options);
      }

      //如果计算属性
      //expOrFn = function
      //
      //其余属性d,普通表达式 => !function
      //
      var isFn = typeof expOrFn === 'function';

      this.vm = vm;
      //加入this的观察数组
      vm._watchers.push(this);

      this.expression = expOrFn;
      this.cb = cb;

      //定义一个标示
      this.id = ++uid$1;

      //懒加载
      //不会立刻执行get
      this.dirty = this.lazy;

      //dep列表
      this.deps = [];
      this.depIds = Object.create(null);
      this.newDeps = [];
      this.newDepIds = null;

      ///////////////////////////
      //解析表达式
      //得到setter/getter
      ///////////////////////////
      if (isFn) {
          //计算属性
          //在编译的时候get == new Wathcher()
          this.getter = expOrFn;
          this.setter = undefined;
      } else {
          // v:on = "show" =>表达式，需要构建函数getter
          var res = parseExpression(expOrFn, this.twoWay);
          this.getter = res.get;
          this.setter = res.set;
      }

      //获取值
      //懒加载,不执行
      this.value = this.lazy ? undefined : this.get();
  }

  /**
   * 获取值
   * 收集依赖
   * @return {[type]} [description]
   */
  Watcher.prototype.get = function () {
      this.beforeGet();
      var scope = this.scope || this.vm;
      var value;
      try {
          value = this.getter.call(scope, scope);
      } catch (e) {
          if ('development' !== 'production') {
              warn$2('Error when evaluating expression "' + this.expression);
          }
      }
      this.afterGet();
      return value;
  };

  /**
   * 准备收集依赖
   * @return {[type]} [description]
   */
  Watcher.prototype.beforeGet = function () {
      /**
       * 暴露出观察对象
       * get中
       *   getter中 
       * @type {[type]}
       */
      Dep.target = this;
      this.newDepIds = Object.create(null);
      this.newDeps.length = 0;
  };

  /**
   * 清理依赖收集
   */

  Watcher.prototype.afterGet = function () {
      Dep.target = null;
      var i = this.deps.length;
      while (i--) {
          var dep = this.deps[i];
          if (!this.newDepIds[dep.id]) {
              dep.removeSub(this);
          }
      }
      //重新赋予依赖值
      this.depIds = this.newDepIds;
      var tmp = this.deps;
      this.deps = this.newDeps;
      this.newDeps = tmp;
  };

  /**
   * 给这个指令增加一个依赖
   * Dep.target.addDep(this)
   *
   * 计算属性在getter的时候处理
   * 增加get的dep到当前指定的watcer对象中
   * 
   * value 
   *   =>getter
   *   =>Dep.target
   *   =>dep.depend
   * 
   * @param {Dep} dep
   */
  Watcher.prototype.addDep = function (dep) {
      var id = dep.id;
      //把更新的dep加入到当前的
      //newDeps列表中
      //求值函数
      //可能是多个dep依赖到watcher上
      //所以deps可能是组数
      if (!this.newDepIds[id]) {
          this.newDepIds[id] = true;
          this.newDeps.push(dep);
          if (!this.depIds[id]) {
              //把当前的watcher对象
              //反向加入到数据计算的dep中、
              // this.subs.push(sub);
              // 所以可以在setter的时候，派发这个sub任务
              // 也就是setter的时候可以调用 wather
              dep.addSub(this);
          }
      }
  };

  /**
   * 订阅接口
   * 当依赖被改变时候调用
   * _data setter = >调用
   * @param  {[type]} shallow [description]
   * @return {[type]}         [description]
   */
  Watcher.prototype.update = function (shallow) {

      //如果懒加载
      //watcher是计算属性
      if (this.lazy) {
          this.dirty = true;
      } else {
          //加入water列表
          pushWatcher(this);
      }
  };

  /**
   * Batcher工作的接口
   * 提供给被Batcher方法调用
   * nextTickHandler
   * 在watcher队列运行
   */

  Watcher.prototype.run = function () {
      //新值
      var value = this.get();
      if (value !== this.value) {
          //旧值
          var oldValue = this.value;
          //设置新值
          this.value = value;
          this.cb.call(this.vm, value, oldValue);
      }
  };

  /**
   * 给计算属性使用
   * 仅仅为懒加载watchers的get方法使用
   * 求出观察的值
   * b:function(){
   *    return this.a + this.c
   * }
   *
   * b 生成了watcher
   * 建立a与c的依赖关系
   * 
   * @return {[type]} [description]
   */
  Watcher.prototype.evaluate = function () {
      //避免引用丢失
      //this.get中会做依赖处理，会覆盖Dep.target
      var current = Dep.target;
      //获取值
      //并且设置依赖
      this.value = this.get();
      this.dirty = false;
      Dep.target = current;
  };

  /**
   * 用当前的watcher收集所有的dess合集
   */

  Watcher.prototype.depend = function () {
      var i = this.deps.length;
      while (i--) {
          this.deps[i].depend();
      }
  };

  function noop$1() {}

  /**
   * [Directive description]
   * @param {[type]} descriptor [信息描述]
   * @param {[type]} vm         [description]
   * @param {[type]} el         [description]
   * @param {[type]} host       [description]
   * @param {[type]} scope      [description]
   * @param {[type]} frag       [description]
   */
  function Directive(descriptor, vm, el, host, scope, frag) {
      this.vm = vm;
      this.el = el;
      this.descriptor = descriptor;
      this.name = descriptor.name;
      //事件name
      this.arg = descriptor.arg;
      this.expression = descriptor.expression;
  }

  /**
   * 初始化指令
   * 定义混入的属性
   * 安装watcher
   * 调用定义的bind与update
   * @return {[type]} [description]
   */
  Directive.prototype._bind = function () {

      var name = this.name;
      var descriptor = this.descriptor;

      // console.log(descriptor)

      //移除定义的属性
      //v-on: ....
      if (this.el && this.el.removeAttribute) {
          var attr = descriptor.attr || 'v-' + name;
          this.el.removeAttribute(attr);
      }

      //复制def属性
      var def = descriptor.def;
      if (typeof def === 'function') {
          console.log('def function');
      } else {
          //拷贝指定定义的接口
          extend(this, def);
      }

      //初始化bind方法
      if (this.bind) {
          this.bind();
      }

      //如果是表达式
      //并且有更新函数
      //并且表达式不是函数
      if (this.expression && this.update && !this._checkStatement()) {

          // console.log(this)
          //textl类型处理
          //给上下文对象包装更新方法
          var dir = this;
          if (this.update) {
              this._update = function (val, oldVal) {
                  if (!dir._locked) {
                      dir.update(val, oldVal);
                  }
              };
          } else {
              this._update = noop$1;
          }

          var preProcess = this._preProcess ? bind(this._preProcess, this) : null;
          var postProcess = this._postProcess ? bind(this._postProcess, this) : null;
          var watcher = this._watcher = new Watcher(this.vm, this.expression, this._update, // callback
          {
              filters: this.filters,
              twoWay: this.twoWay,
              deep: this.deep,
              preProcess: preProcess,
              postProcess: postProcess,
              scope: this._scope
          });

          //更新值
          if (this.update) {
              this.update(watcher.value);
          }
      }
  };

  /**
   * 检查指令是否是函数调用
   * 并且如果表达式是一个可以调用
   * 如果两者都满足
   * 将要包装表达式，并且作为事件处理句柄
   *
   * 例如： on-click="a++"
   *
   * on 指令
   *     acceptStatement：true
   * 
   * @return {Boolean}
   */

  Directive.prototype._checkStatement = function () {
      var expression = this.expression;

      if (expression && this.acceptStatement && !isSimplePath(expression)) {
          //生成求值方法
          var fn = parseExpression(expression).get;

          var scope = this.vm;

          //事件回调
          var handler = function handler(e) {
              scope.$event = e;
              fn.call(scope, scope);
              scope.$event = null;
          };

          //绑定事件
          this.update(handler);

          return true;
      }
  };

  function noop() {}

  /**
   * Ue构造器
   * @param {[type]} options [description]
   */
  function Ue(options) {
      this._init(options);
  }

  Ue.prototype._init = function (options) {

      options = options || {};
      this.$el = null;

      //合并options参数
      options = this.$options = mergeOptions(this.constructor.options, options, this);

      //所有指令合集
      this._directives = [];
      //所有观察对象
      this._watchers = [];

      //初始化空数据
      //通过_initScope方法填充
      this._data = {};
      this._initState();

      //el存在,开始编译
      if (options.el) {
          this.$mount(options.el);
      }
      console.log("####", this);
  };

  Object.defineProperty(Ue.prototype, '$data', {
      get: function get() {
          return this._data;
      },
      set: function set(newData) {
          if (newData !== this._data) {
              this._setData(newData);
          }
      }
  });

  /**
   * 构建实例的作用域
   * 包含
   * 观察 data
   * @return {[type]} [description]
   */
  Ue.prototype._initState = function () {
      this._initProps();
      //事件
      this._initMethods();
      //data
      //构建原始数据的观察
      this._initData();
      //初始化计算属性
      this._initComputed();
  };

  /**
   * 初始化计算属性
   * 本质上来说，是特殊的setter/getter
   * @return {[type]} [description]
   */
  Ue.prototype._initComputed = function () {
      var computed = this.$options.computed;
      //object
      if (computed) {
          for (var key in computed) {
              var userDef = computed[key];
              //设置属可观察可修改
              var def = {
                  enumerable: true,
                  configurable: true
              };
              //如果计算属性是函数
              //那么意味着就是默认的getter处理
              //set =>null
              if (typeof userDef === 'function') {
                  def.get = makeComputedGetter(userDef, this);
                  def.set = noop;
              } else {
                  def.get = makeComputedGetter(userDef.get, this);
                  def.set = userDef.set ? bind$1(userDef.set, this) : noop;
              }

              //计算属性挂到vue的实例上
              Object.defineProperty(this, key, def);
          }
      }
  };

  /**
   * 制作一个计算的getter linker
   *
   * 计算属性
   *  new Watcher
   *     内部 new Watcher
   *
   *   computed: {
   *       b: function() {
   *           var a = this.name;
   *           var b = this.message
   *           return a +" " +b
   *       }
   *   }
   *
   *  b方法通过watcher包装,成为getter方法
   *
   * Directive._bind
   *  建立b的 watcher对象,内部调用getter
   *  getter其实是一个内建的watcher对象
   *  用来收集 this.name, this.meassge的依赖
   *
   * this.name 
   *   subs:订阅关系
   *     watcher  {{}}文本节点
   *     watcher  内建watcher对象
   *     watcher  外建watcher对象
   *
   * 内建watcher对象
   *     deps 
   *       Dep this.name
   *       Dep this.message  
   *          
   * 
   * 
   * @param  {[type]} getter [description]
   * @param  {[type]} owner  [description]
   * @return {[type]}        [description]
   */
  function makeComputedGetter(getter, owner) {
      var watcher = new Watcher(owner, getter, null, {
          lazy: true,
          aaaaaaaaaaaaa: '_initComputed.get'
      });
      return function computedGetter() {
          //求值属性
          //懒加载有依赖
          //所以先要求出依赖的值
          //指定依赖的观察
          //
          //this.dirty在 watcher中被修改
          //
          if (watcher.dirty) {
              watcher.evaluate();
          }

          //让外watcher与子watcher产生的deps产生关系
          if (Dep.target) {
              watcher.depend();
          }
          return watcher.value;
      };
  }

  /**
   * 初始化props属性
   * @return {[type]} [description]
   */
  Ue.prototype._initProps = function () {
      var options = this.$options;
      var el = options.el;
      var props = options.props;
      if (props && !el) {
          warn$2('在实例化的时候,如果没有el,props不会被变异');
      }
      //确保选择器字符串转换成现在的元素
      el = options.el = query(el);
  };

  /**
   * 简单绑定
   * 比本地化更快
   * @param  {Function} fn  [description]
   * @param  {[type]}   ctx [description]
   * @return {[type]}       [description]
   */
  function bind$1(fn, ctx) {
      return function (a) {
          var l = arguments.length;
          return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
      };
  }

  /**
   * 构建方法
   * 方法必须要绑定到实例
   * 可能代替prop作为一个子组件
   * @return {[type]} [description]
   */
  Ue.prototype._initMethods = function () {
      var methods = this.$options.methods;
      if (methods) {
          for (var key in methods) {
              this[key] = bind$1(methods[key], this);
          }
      }
  };

  /**
   * 初始化数据
   * @return {[type]} [description]
   */
  Ue.prototype._initData = function () {
      var dataFn = this.$options.data;
      var data = this._data = dataFn ? dataFn() : {};
      var props = this._props;
      var keys = Object.keys(data);
      var i, key;
      i = keys.length;
      while (i--) {
          key = keys[i];
          this._proxy(key);
      }

      observe(data, this);
  };

  /**
   * 代理一个属性,所以
   * vm.prop === vm._data.prop
   * 在外面访问
   * data ={
   *    message:'aaaa'
   * }
   * this.message = > vm._data.message
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  Ue.prototype._proxy = function (key) {
      var self = this;
      Object.defineProperty(self, key, {
          configurable: true,
          enumerable: true,
          get: function proxyGetter() {
              return self._data[key];
          },
          set: function proxySetter(val) {
              self._data[key] = val;
          }
      });
  };

  /**
   * 开始编译
   * @return {[type]} [description]
   */
  Ue.prototype.$mount = function (el) {
      el = query(el);
      if (!el) {
          el = document.createElement('div');
      }
      //开始编译
      this._compile(el);
  };

  /**
   * Transclude,编译和链接元素
   * 
   * @param  {[type]} el [description]
   * @return {[type]}    [description]
   */
  Ue.prototype._compile = function (el) {
      var options = this.$options;
      //编译节点
      var contentUnlinkFn = compile(el, options)(this, el);
  };

  /**
   * 给元素创建并且绑定一个指定
   * @param  {[type]} descriptor [description]
   * @param  {[type]} node       [description]
   * @param  {[type]} host       [description]
   * @param  {[type]} scope      [description]
   * @param  {[type]} frag       [description]
   * @return {[type]}            [description]
   */
  Ue.prototype._bindDir = function (descriptor, node, host, scope, frag) {
      this._directives.push(new Directive(descriptor, this, node, host, scope, frag));
  };

  function installGlobalAPI (Ue) {

  	/**
    * Ue构造器扩展
       * 编译步骤,调用this.constructor.options”。
    * @type {Object}
    */
  	Ue.options = {
  		//指令
  		directives: directives
  	};
  }

  installGlobalAPI(Ue);

  Ue.version = 'undefined';

  window.Ue = Ue;

  return Ue;

}));