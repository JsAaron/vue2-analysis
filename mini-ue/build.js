/*!
 * build.js vundefined
 * (c) 2016 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.build = factory());
}(this, function () { 'use strict';

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
      return obj !== null && typeof obj === 'object';
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
  const isArray = Array.isArray;

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
  let warn$1;
  const hasConsole = typeof console !== 'undefined';
  warn$1 = function (msg, e) {
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
  const config = {

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
  var defaultStrat = function (parentVal, childVal) {
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

  let uid = 0;

  /**
   * dep 是一个可观察量
   * 可以被多个指定订阅
   */
  function Dep() {
    this.id = uid++;
    this.subs = [];
  }

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
          get: function reactiveGetter() {
              alert('set');
              return value;
          },
          set: function reactiveSetter(newVal) {
              alert('get');
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
      if (!value || typeof value !== 'object') {
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

  var on = {
      test: 'on',
      bind: function () {},
      update: function () {},
      update: function () {},
      update: function () {}
  };

  var text = {

      test: 'text',

      bind: function () {},

      update: function (value) {}
  };

  var model = {

      params: ['lazy', 'number', 'debounce'],

      bind: function () {},

      checkFilters: function () {},

      unbind: function () {}
  };

  var directives = {
      on,
      model,
      text
  };

  //特殊的绑定前缀
  //用来检查指定

  //v-on|@快捷方式
  const onRE = /^v-on:|^@/;
  //普通v-命令
  const dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/;

  //定义终端指令
  const terminalDirectives = ['for', 'if'];

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
      //保证必须有值
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
                  vm._bindDir(token.descriptor, node, host, scope);
              }
          }
          //拿文档碎片替换{{}}节点
          replace(el, fragClone);
      };
  }

  /**
   * 解析文本
   * @return {[type]} [description]
   */
  function parseText(text) {
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
          //属性值
          name = rawName = attr.name;

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
              arg: arg
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

  function noop() {}

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

      console.log(descriptor);

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

      //给上下文对象包装更新方法
      var dir = this;
      if (this.update) {
          this._update = function (val, oldVal) {
              if (!dir._locked) {
                  dir.update(val, oldVal);
              }
          };
      } else {
          this._update = noop;
      }

      var preProcess = this._preProcess ? bind(this._preProcess, this) : null;
      var postProcess = this._postProcess ? bind(this._postProcess, this) : null;
      // var watcher = this._watcher = new Watcher(
      //     this.vm,
      //     this.expression,
      //     this._update, // callback
      //     {
      //         filters     : this.filters,
      //         twoWay      : this.twoWay,
      //         deep        : this.deep,
      //         preProcess  : preProcess,
      //         postProcess : postProcess,
      //         scope       : this._scope
      //     }
      // );

      // console.log(this)
  };

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

      //初始化空数据
      //通过_initScope方法填充
      this._data = {};
      this._initState();

      //所有指令合集
      this._directives = [];
      //所有观察对象
      this._watchers = [];

      //el存在,开始编译
      if (options.el) {
          this.$mount(options.el);
      }
      // console.log(this)
  };

  Object.defineProperty(Ue.prototype, '$data', {
      get: function () {
          return this._data;
      },
      set: function (newData) {
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
      this._initMethods();
      this._initData();
  };

  /**
   * 初始化props属性
   * @return {[type]} [description]
   */
  Ue.prototype._initProps = function () {
      var options = this.$options;
      var el = options.el;
      var props = options.props;
      if (props && !el) {
          warn$1('在实例化的时候,如果没有el,props不会被变异');
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
  		directives
  	};
  }

  installGlobalAPI(Ue);

  Ue.version = 'undefined';

  window.Ue = Ue;

  return Ue;

}));