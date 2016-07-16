/*!
 * vue-analysis 
 * (c) 2016 Aaron
 * https://github.com/JsAaron/vue-analysis
 */
'use strict';

function _toString(value) {
    return value == null ? '' : value.toString();
}

var text = {
    bind: function bind() {
        this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
    },
    update: function update(value) {
        this.el[this.attr] = _toString(value);
    }
};

var vFor = {
    priority: 2200,
    terminal: true,
    bind: function bind() {},
    unbind: function unbind() {
        this.reset();
    }
};

function on(el, event, cb, useCapture) {
    el.addEventListener(event, cb, useCapture);
}

var on$1 = {

    priority: 700,
    bind: function bind() {},
    update: function update(handler) {
        this.handler = handler;
        on(this.el, this.arg, this.handler, false);
    },
    unbind: function unbind() {}
};

function on$2(el, event, cb, useCapture) {
          el.addEventListener(event, cb, useCapture);
}

var bind$1 = {
          bind: function bind() {},
          update: function update(handler) {
                    console.log(11);
                    this.handler = handler;
                    console.log(this.el, this.arg);
                    on$2(this.el, this.arg, function () {
                              this.handler;
                              alert(1);
                    }, this.modifiers.capture);
          },
          unbind: function unbind() {}
};

var directives = {
    text: text,
    'for': vFor,
    on: on$1,
    bind: bind$1
};

var isScript = function isScript(el) {
    return el.tagName === 'SCRIPT' && (!el.hasAttribute('type') || el.getAttribute('type') === 'text/javascript');
};

var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/;
var tagRE = new RegExp(/\{\{\{((?:.|\n)+?)\}\}\}|\{\{((?:.|\n)+?)\}\}/g);
var htmlRE = new RegExp(/^\{\{\{((?:.|\n)+?)\}\}\}$/);

var DEFAULT_PRIORITY = 1000;

/**
 * Convert an Array-like object to a real Array.
 *
 * @param {Array-like} list
 * @param {Number} [start] - start index
 * @return {Array}
 */

var toArray = function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret;
};

function makeNodeLinkFn(directives) {
    return function nodeLinkFn(vm, el, host, scope, frag) {
        var i = directives.length;
        while (i--) {
            vm._bindDir(directives[i], el);
        }
    };
}

var compileDirectives = function compileDirectives(attrs, options) {
    var i = attrs.length;
    var dirs = [];
    var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;
    while (i--) {
        attr = attrs[i];
        name = rawName = attr.name;
        value = rawValue = attr.value;

        if (/^v-on:|^@/.test(name)) {
            arg = name.replace(/^v-on:|^@/, '');
            pushDir('on', directives.on);
        } else {

            // normal directives
            if (matched = name.match(dirAttrRE)) {
                dirName = matched[1];
                arg = matched[2];
            }
        }
    }

    /**
     * Push a directive.
     *
     * @param {String} dirName
     * @param {Object|Function} def
     * @param {Array} [interpTokens]
     */

    function pushDir(dirName, def, interpTokens) {
        var parsed = parseDirective(value);
        dirs.push({
            name: dirName,
            attr: rawName,
            raw: rawValue,
            def: def,
            arg: arg,
            expression: parsed && parsed.expression
        });
    }

    if (dirs.length) {
        return makeNodeLinkFn(dirs);
    }
};

function resolveAsset(options, type, id, warnMissing) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
        return;
    }
    var assets = options[type];
    var camelizedId;
    var res = assets[id];
    return res;
}

function makeTerminalNodeLinkFn(el, dirName, value, options, def, rawName, arg) {
    var parsed = parseDirective(value);
    var descriptor = {
        name: dirName,
        arg: arg,
        expression: parsed.expression,
        raw: value,
        attr: rawName,
        def: def
    };
    var fn = function terminalNodeLinkFn(vm, el, host, scope, frag) {
        vm._bindDir(descriptor, el);
    };
    fn.terminal = true;
    return fn;
}

function checkTerminalDirectives(el, attrs, options) {
    var attr, name, value, modifiers, matched, dirName, rawName, arg, def, termDef;
    for (var i = 0, j = attrs.length; i < j; i++) {
        attr = attrs[i];
        name = attr.name.replace(/\.[^\.]+/g, '');
        if (matched = name.match(/^v-([^:]+)(?:$|:(.*)$)/)) {
            def = resolveAsset(options, 'directives', matched[1]);
            if (def && def.terminal) {
                termDef = def;
                rawName = attr.name;
                value = attr.value;
                dirName = matched[1];
                arg = matched[2];
            }
        }
    }
    if (termDef) {
        return makeTerminalNodeLinkFn(el, dirName, value, options, termDef, rawName, arg);
    }
}

/**
 * Compile an element and retrun a nodeLinkFn 
 */
var compileElement = function compileElement(el, options) {

    //The element has an attribute node
    var hasAttrs = el.hasAttributes();
    var attrs = hasAttrs && toArray(el.attributes);

    var linkFn = void 0;

    //check terminal directives(if & for)
    if (hasAttrs) {
        linkFn = checkTerminalDirectives(el, attrs, options);
    }

    if (!linkFn) {
        linkFn = compileDirectives(attrs, options);
    }

    return linkFn;
};

/**
 * Parse text string into an array of tokens
 */
var parseText = function parseText(text) {

    var tokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match, index, html, value, first, oneTime;
    while (match = tagRE.exec(text)) {

        index = match.index;

        //The number of matches all strings
        //diminishing
        if (index > lastIndex) {
            tokens.push({
                value: text.slice(lastIndex, index)
            });
        }

        //html tag
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

        lastIndex = index + match[0].length;
    }

    //tag end
    if (lastIndex < text.length) {
        tokens.push({
            value: text.slice(lastIndex)
        });
    }

    return tokens;
};

function parseDirective(str) {
    var dir = {};
    dir.expression = str.trim();
    return dir;
}

/**
 * Process a single text token
 */
var processTextToken = function processTextToken(token, options) {
    var el;
    el = document.createTextNode(' ');
    setTokenType('text');

    function setTokenType(type) {
        if (token.descriptor) return;
        var parsed = parseDirective(token.value);
        token.descriptor = {
            name: type,
            def: directives[type],
            expression: parsed.expression
        };
    }
    return el;
};

function replace$1(target, el) {
    var parent = target.parentNode;
    if (parent) {
        parent.replaceChild(el, target);
    }
}

var makeTextNodeLinkFn = function makeTextNodeLinkFn(tokens, frag) {
    return function textNodeLinkFn(vm, el) {
        var fragClone = frag.cloneNode(true);
        var childNodes = toArray(fragClone.childNodes);
        var token, value, node;
        for (var i = 0, l = tokens.length; i < l; i++) {
            token = tokens[i];
            value = token.value;
            if (token.tag) {
                node = childNodes[i];
                vm._bindDir(token.descriptor, node);
            }
        }
        replace$1(el, fragClone);
    };
};

/**
 * Compile a textNode and return a linkFns
 */
var compileTextNode = function compileTextNode(node, options) {

    //Parse textNode string
    var tokens = parseText(node.wholeText);
    if (!tokens) {
        return null;
    }

    var frag = document.createDocumentFragment();
    var el = void 0,
        token = void 0;
    for (var i = 0, l = tokens.length; i < l; i++) {
        token = tokens[i];
        el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
        frag.appendChild(el);
    }
    // console.log(token)
    return makeTextNodeLinkFn(tokens, frag, options);
};

var makeChildLinkFn = function makeChildLinkFn(linkFns) {
    // console.log(linkFns)
    return function childLinkFn(vm, nodes) {
        var node, nodeLinkFn, childrenLinkFn;
        // console.log(linkFns)
        for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
            node = nodes[n];
            nodeLinkFn = linkFns[i++];
            childrenLinkFn = linkFns[i++];
            var childNodes = toArray(node.childNodes);
            if (nodeLinkFn) {
                nodeLinkFn(vm, node);
            }
            if (childrenLinkFn) {
                childrenLinkFn(vm, childNodes);
            }
        }
    };
};

/**
 * Complie node and return a nodeLinkFn based on the node type
 */
var compileNode = function compileNode(node, options) {
    var type = node.nodeType;
    //If be the element node
    if (type === 1 && !isScript(node)) {
        return compileElement(node, options);
    } else if (type === 3 && node.data.trim()) {
        //if be the text node and remove the blank space
        return compileTextNode(node, options);
    } else {
        return null;
    }
};

/**
 *  Compile a node list and return a childLinkFn.
 */
var compileNodeList = function compileNodeList(nodeList, options) {
    var linkFns = [];
    var nodeLinkFn = void 0,
        childLinkFn = void 0,
        node = void 0;
    for (var i = 0, l = nodeList.length; i < l; i++) {
        node = nodeList[i];
        nodeLinkFn = compileNode(node, options);

        childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null;

        linkFns.push(nodeLinkFn, childLinkFn);
    }
    return linkFns.length ? makeChildLinkFn(linkFns) : null;
};

function directiveComparator(a, b) {
    a = a.descriptor.def.priority || DEFAULT_PRIORITY;
    b = b.descriptor.def.priority || DEFAULT_PRIORITY;
    return a > b ? -1 : a === b ? 0 : 1;
}

/**
 * Apply a linker to a vm/element pair and capture the
 * directives created during the process.
 *
 * @param {Function} linker
 * @param {Vue} vm
 */

var linkAndCapture = function linkAndCapture(linker, vm) {
    var originalDirCount = vm._directives.length;
    linker();
    var dirs = vm._directives.slice(originalDirCount);
    dirs.sort(directiveComparator);
    for (var i = 0, l = dirs.length; i < l; i++) {
        dirs[i]._bind();
    }
    return dirs;
};

function makeUnlinkFn(vm, dirs, context, contextDirs) {
    function unlink(destroying) {
        teardownDirs(vm, dirs, destroying);
        if (context && contextDirs) {
            teardownDirs(context, contextDirs);
        }
    }
    // expose linked directives
    unlink.dirs = dirs;
    return unlink;
}

function compile(el, options) {
    //link function for the node itself
    var nodeLinkFn = compileNode(el, options);
    //link function for the node childNodes
    var childLinkFn = el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;

    return function compositeLinkFn(vm, el) {
        var childNodes = toArray(el.childNodes);
        var dirs = linkAndCapture(function () {
            if (nodeLinkFn) nodeLinkFn(vm, el);
            if (childLinkFn) childLinkFn(vm, childNodes);
        }, vm);
        return makeUnlinkFn(vm, dirs);
    };
}

var uid = 0;

function toArray$1(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret;
}

/**
 * dep是一种观察可以被多个指令订阅它
 */
function Dep() {
    this.id = uid++;
    this.subs = [];
}

Dep.target = null;

Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
};

/**
 *  Dep.target is a wather object through Wacther class to build
 */
Dep.prototype.depend = function () {
    Dep.target.addDep(this);
};

Dep.prototype.notify = function () {
    var subs = toArray$1(this.subs);
    for (var i = 0, l = subs.length; i < l; i++) {
        subs[i].update();
    }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var isArray = Array.isArray;

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

/**
 * 定义个对象属性
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */
var def = function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
};
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
        console.log(method);
    });
});

/**
 * Define a reactive property on an Object
 */
var defineReactive = function defineReactive(obj, key, val) {
    var dep = new Dep();

    var childOb = observe(val);

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function get() {
            if (Dep.target) {
                dep.depend();
            }
            return val;
        },
        set: function set(newVal) {
            if (newVal === val) {
                return;
            }
            val = newVal;
            dep.notify();
        }
    });
};

function protoAugment(target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
}

/**
 * 建立数据观察
 * 观察者类连接到每个观察对象。
 * 一旦连接
 * 观察者转换目标对象的属性键到getter / setter收集依赖和分派更新
 */

var Observer = function () {
    function Observer(value) {
        classCallCheck(this, Observer);

        this.value = value;
        this.dep = new Dep();
        def(value, '__ob__', this);
        if (isArray(value)) {
            protoAugment(value, arrayMethods);
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }

    createClass(Observer, [{
        key: 'observeArray',
        value: function observeArray(items) {
            for (var i = 0, l = items.length; i < l; i++) {
                observe(items[i]);
            }
        }

        /**
         * 通过each方法把每一个属性转化成getter/getter
         * 只有当值是对象的时候才能被调用
         */

    }, {
        key: 'walk',
        value: function walk(obj) {
            var keys = Object.keys(obj);
            for (var i = 0, l = keys.length; i < l; i++) {
                this.convert(keys[i], obj[keys[i]]);
            }
        }

        /**
         * 转化一个属性变成getter/setter
         * 当属性存取或者改变的时候，我们能触发这个事件
         */

    }, {
        key: 'convert',
        value: function convert(key, val) {
            defineReactive(this.value, key, val);
        }

        /**
         * 增加一个所有者的vm
         */

    }, {
        key: 'addVm',
        value: function addVm(vm) {
            (this.vms || (this.vms = [])).push(vm);
        }
    }]);
    return Observer;
}();

/**
 * 试图给一个值去创建一个观察实例
 * 成功，返回一个新的观察
 * 或者值已经存在了观察
 */


function observe(value, vm) {
    if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
        return;
    }
    var ob = void 0;
    ob = new Observer(value);
    if (ob && vm) {
        ob.addVm(vm);
    }
    return ob;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * 检查是否为对象的属性
 * @param {Object} obj
 * @param {String} key
 * @return {Boolean}
 */
var hasOwn = function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
};

/**
 * 选择覆盖策略函数处理
 * 如何合并父选项值和一个子的选择的值变成最终值
 * 
 * 有策略函数遵循相同的签名
 */
var strats = Object.create(null);

/**
 * 递归合并两个数据对象在一起
 */
var mergeData = function mergeData(to, from) {
    var key = void 0,
        toVal = void 0,
        fromVal = void 0;
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
};

/**
 * Mix properties into target object.
 *
 * @param {Object} to
 * @param {Object} from
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
 * El
 */
strats.el = function (parentVal, childVal, vm) {
    var ret = childVal || parentVal;
    //过是一个合并的实例，调用元素的工厂方法
    return vm && typeof ret === 'function' ? ret.call(vm) : ret;
};

/**
 * Data
 * return mergedInstanceDataFn
 */
strats.data = function (parentVal, childVal, vm) {
    if (parentVal || childVal) {
        return function () {
            // instance merge
            //如果是值是函数
            var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
            var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
            if (instanceData) {
                return mergeData(instanceData, defaultData);
            } else {
                return defaultData;
            }
        };
    }
};

/**
 * Other object hashes.
 */

strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
    if (!childVal) return parentVal;
    if (!parentVal) return childVal;
    var ret = Object.create(null);
    extend(ret, parentVal);
    extend(ret, childVal);
    return ret;
};

function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal || null);
    return childVal ? extend(res, guardArrayAssets(childVal)) : res;
}

strats.directives = mergeAssets;

/**
 * 合并2个参数对象变成一个新的
 * 核心工具用于实例化和继承
 */
function mergeOptions(parent, child, vm) {
    var options = {};
    var key = void 0;
    var mergeField = function mergeField(key) {
        var strat = strats[key];
        options[key] = strat(parent[key], child[key], vm, key);
    };
    for (key in parent) {
        mergeField(key);
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key);
        }
    }
    return options;
}

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';

// UA sniffing for working around browser-specific quirks
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && UA.indexOf('trident') > 0;
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIos = UA && /(iphone|ipad|ipod|ios)/i.test(UA);
var iosVersionMatch = isIos && UA.match(/os ([\d_]+)/);
var iosVersion = iosVersionMatch && iosVersionMatch[1].split('_');

// detecting iOS UIWebView by indexedDB
var hasMutationObserverBug = iosVersion && Number(iosVersion[0]) >= 9 && Number(iosVersion[1]) >= 3 && !window.indexedDB;

/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *
 * @param {Function} cb
 * @param {Object} ctx
 */

var nextTick = function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;
  function nextTickHandler() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks = [];
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined' && !hasMutationObserverBug) {
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
    // webpack attempts to inject a shim for setImmediate
    // if it is used as a global, so we have to work around that to
    // avoid bundling unnecessary code.
    var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
    timerFunc = context.setImmediate || setTimeout;
  }
  return function (cb, ctx) {
    var func = ctx ? function () {
      cb.call(ctx);
    } : cb;
    callbacks.push(func);
    if (pending) return;
    pending = true;
    timerFunc(nextTickHandler, 0);
  };
}();

var _Set = void 0;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && Set.toString().match(/native code/)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = function _Set() {
    this.set = Object.create(null);
  };
  _Set.prototype.has = function (key) {
    return this.set[key] !== undefined;
  };
  _Set.prototype.add = function (key) {
    this.set[key] = 1;
  };
  _Set.prototype.clear = function () {
    this.set = Object.create(null);
  };
}

var queue = [];
var has = {};
var circular = {};
var waiting = false;

function resetBatcherState() {
    queue.length = 0;
    has = {};
    circular = {};
    waiting = false;
}

function runBatcherQueue(queue) {
    for (var i = 0; i < queue.length; i++) {
        var watcher = queue[i];
        var id = watcher.id;
        has[id] = null;
        watcher.run();
    }
    queue.length = 0;
}

function flushBatcherQueue() {
    var _again = true;
    _function: while (_again) {
        _again = false;
        runBatcherQueue(queue);
        if (queue.length) {
            _again = true;
            continue _function;
        }
        resetBatcherState();
    }
}

function pushWatcher(watcher) {
    var id = watcher.id;
    if (has[id] == null) {
        var q = queue;
        has[id] = q.length;
        q.push(watcher);
        if (!waiting) {
            waiting = true;
            nextTick(flushBatcherQueue);
        }
    }
}

var uid$1 = 0;

function makeGetterFn(body) {
    try {
        /* eslint-disable no-new-func */
        return new Function('scope', 'return ' + body + ';');
        /* eslint-enable no-new-func */
    } catch (e) {
        console.log('makeGetterFn is error');
    }
}

function parseExpression(exp, needSet) {
    exp = exp.trim();
    var res = {
        exp: exp
    };
    res.get = makeGetterFn('scope.' + exp);
    return res;
}

function Watcher(vm, expOrFn, cb) {

    var isFn = typeof expOrFn === 'function';
    this.vm = vm;
    vm._watchers.push(this);
    this.expression = expOrFn;
    this.cb = cb;

    this.active = true;
    this.id = ++uid$1; // uid for batching

    this.newDeps = [];
    this.newDepIds = new _Set();

    this.deps = [];
    this.depIds = new _Set();

    if (isFn) {} else {
        var res = parseExpression(expOrFn);
        this.getter = res.get;
        this.setter = res.set;
    }

    this.value = this.get();
}

Watcher.prototype.beforeGet = function () {
    Dep.target = this;
};

Watcher.prototype.get = function () {
    this.beforeGet();
    var scope = this.scope || this.vm;
    var value;

    try {
        value = this.getter.call(scope, scope);
    } catch (e) {}

    this.afterGet();

    return value;
};

Watcher.prototype.afterGet = function () {
    Dep.target = null;
    var i = this.deps.length;
    while (i--) {
        var dep = this.deps[i];
        if (!this.newDepIds.has(dep.id)) {
            dep.removeSub(this);
        }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
};

/**
 * 收集defineReactive产生的dep依赖
 * 然后对一个把wahter对象push到dep对象中
 * 相互push 真TMD绕
 */
Watcher.prototype.addDep = function (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if (!this.depIds.has(id)) {
            dep.addSub(this);
        }
    }
};

/**
 * Prepare for dependency collection.
 */

Watcher.prototype.beforeGet = function () {
    Dep.target = this;
};

/**
 * Add a dependency to this directive.
 *
 * @param {Dep} dep
 */

Watcher.prototype.addDep = function (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if (!this.depIds.has(id)) {
            dep.addSub(this);
        }
    }
};

/**
 * Clean up for dependency collection.
 */

Watcher.prototype.afterGet = function () {
    Dep.target = null;
    var i = this.deps.length;
    while (i--) {
        var dep = this.deps[i];
        if (!this.newDepIds.has(dep.id)) {
            dep.removeSub(this);
        }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
};

/**
 * Depend on all deps collected by this watcher.
 */

Watcher.prototype.depend = function () {
    var i = this.deps.length;
    while (i--) {
        this.deps[i].depend();
    }
};

Watcher.prototype.update = function () {
    pushWatcher(this);
};

Watcher.prototype.run = function () {
    if (this.active) {
        var value = this.get();
        console.log(value);
        if (value !== this.value) {
            var oldValue = this.value;
            this.value = value;
            this.cb.call(this.vm, value, oldValue);
        }
    }
};

function extend$1(to, from) {

    var keys = Object.keys(from);
    var i = keys.length;
    while (i--) {
        to[keys[i]] = from[keys[i]];
    }
    return to;
}

function Directive(descriptor, vm, el) {
    this.vm = vm;
    this.el = el;

    this.descriptor = descriptor;
    this.name = descriptor.name;
    this.expression = descriptor.expression;
    this.arg = descriptor.arg;

    this._locked = false;
    this._bound = false;
    this._listeners = null;
}

Directive.prototype._bind = function () {

    var name = this.name;
    var descriptor = this.descriptor;
    var def = descriptor.def;

    extend$1(this, def);

    if (this.bind) {
        this.bind();
    }

    var dir = this;
    this._update = function (val, oldVal) {
        if (!dir._locked) {
            dir.update(val, oldVal);
        }
    };

    var watcher = new Watcher(this.vm, this.expression, this._update);

    this._watcher = watcher;

    if (this.update) {
        this.update(watcher.value);
    }
};

var query = function query(el) {
    if (typeof el === 'string') {
        var selector = el;
        el = document.querySelector(el);
    }
    return el;
};

function bind(fn, ctx) {
    return function (a) {
        var l = arguments.length;
        return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
    };
}

/**
 * constructor class
 */

var XXT = function () {
    function XXT() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? options || {} : arguments[0];
        classCallCheck(this, XXT);


        //merge options
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        //initalize data as empty object
        //it will be filled up in _initState method
        this._data = {};

        //all directives
        this._directives = [];
        this._watchers = [];

        //initalize data observation and scope inheritance
        this._initState();

        //start compilation
        if (options.el) {
            this.$mount(options.el);
        }
    }

    /**
     * Setup the scope fo an instance ,which container:
     * - observed data
     */


    createClass(XXT, [{
        key: '_initState',
        value: function _initState() {
            this._initProps();
            this._initMethods();
            this._initData();
        }

        /**
         * Initalize props
         */

    }, {
        key: '_initProps',
        value: function _initProps() {
            var options = this.$options;
            var el = options.el;
            options.el = query(el);
        }
    }, {
        key: '_initMethods',
        value: function _initMethods() {
            var methods = this.$options.methods;
            if (methods) {
                for (var key in methods) {
                    this[key] = bind(methods[key], this);
                }
            }
        }

        /**
         * Initalize data
         */

    }, {
        key: '_initData',
        value: function _initData() {
            var dataFn = this.$options.data;
            var data = this._data = dataFn ? dataFn() : {};

            //代理实例
            var keys = Object.keys(data);
            var i = void 0,
                key = void 0;
            i = keys.length;
            while (i--) {
                key = keys[i];
                this._proxy(key);
            }

            observe(data, this);
        }

        /**
         * 代理属性，所以
         * vm.prop === vm._data.prop
         */

    }, {
        key: '_proxy',
        value: function _proxy(key) {
            var _this = this;

            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get: function get() {
                    return _this._data[key];
                },
                set: function set(val) {
                    _this._data[key] = val;
                }
            });
        }
    }, {
        key: '$mount',
        value: function $mount(el) {
            el = query(el);
            this._compile(el);
        }

        /**
         * compile and linker
         */

    }, {
        key: '_compile',
        value: function _compile(el) {

            var options = this.$options;

            //compile node
            var contentUnlinkFn = compile(el, options)(this, el);
            if (options.replace) {
                replace(original, el);
            }
        }
    }, {
        key: '_bindDir',
        value: function _bindDir(descriptor, node) {
            this._directives.push(new Directive(descriptor, this, node));
        }
    }]);
    return XXT;
}();

XXT.options = {
    directives: directives
};

window.XXT = XXT;