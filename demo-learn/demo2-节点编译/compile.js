var tagRE = /\{\{\{(.+?)\}\}\}|\{\{(.+?)\}\}/g
var htmlRE = /^\{\{\{.*\}\}\}$/
    //v-on|@快捷方式
var onRE = /^v-on:|^@/;
//普通v-命令
var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/

//存放指令
var _directives = []

/**
 * 转化数组
 * @param  {[type]} list  [description]
 * @param  {[type]} start [description]
 * @return {[type]}       [description]
 */
var toArray = function(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret;
}

/**
 * 替换节点
 * @param  {[type]} target [description]
 * @param  {[type]} el     [description]
 * @return {[type]}        [description]
 */
function replace(target, el) {
    var parent = target.parentNode;
    if (parent) {
        parent.replaceChild(el, target);
    }
}


function Directive(descriptor, node) {
    this.descriptor = descriptor;
    this.node = node;
}


var _bindDir = function(descriptor, node) {
    _directives.push(new Directive(descriptor, node));
}



/**
 * 节点编译
 *  指令提取与编译
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
var compile = function(el) {

    var options = {}
    var nodeLinkFn = compileNode(el, options)
    var childLinkFn = el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;

    var childNodes = toArray(el.childNodes);
    if (nodeLinkFn) nodeLinkFn(el);
    if (childLinkFn) childLinkFn(childNodes);
}


/**
 * 编译节点 
 * @param  {[type]} node    [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function compileNode(node, options) {
    var type = node.nodeType;
    //元素节点
    //排除script
    if (type === 1 && node.tagName !== 'SCRIPT') {
        return compileElement(node, options);
    } else if (type === 3 && node.data.trim()) {
        //不为空的文本节点
        return compileTextNode(node, options);
    } else {
        return null;
    }
}

/**
 * 编译一个元素节点
 * 并且返回一个节点引用的link函数
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function|null}
 */

function compileElement(el, options) {
    var linkFn;
    //如果有属性
    var hasAttrs = el.hasAttributes();
    var attrs = hasAttrs && toArray(el.attributes);

    //如果有属性
    //可能是for 与 if指令
    if (hasAttrs) {
        // linkFn = checkTerminalDirectives(el, attrs, options);
    }

    //普通指令
    //v-on ,v-text... 
    if (!linkFn && hasAttrs) {
        linkFn = compileDirectives(attrs, options);
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
        if (!parseDirective[type]) {
            console.log('指令没找到', type)
        }
        token.descriptor = {
            name: type,
            def: parseDirective[type],
            expression: token.value
        };
    }
    return el
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
function makeTextNodeLinkFn(tokens, frag, options) {
    return function textNodeLinkFn(el) {
        var fragClone = frag.cloneNode(true);
        var childNodes = toArray(fragClone.childNodes);
        var token, value, node;
        for (var i = 0, l = tokens.length; i < l; i++) {
            token = tokens[i];
            value = token.value;
            if (token.tag) {
                node = childNodes[i];
                //创建指令
                _bindDir(token.descriptor, node);
            }
        }
        //拿文档碎片替换{{}}节点
        replace(el, fragClone);
    };
}


/**
 * 编译子节点列表
 * 返回子节点 函数链接
 * @param  {[type]} nodeList [description]
 * @param  {[type]} options  [description]
 * @return {[type]}          [description]
 *
 * 节点遍历需要考虑文本的情况
 * 0: text
 * 1: a
 * 2: text
 * 3: ul
 * 4: text
 *
 * 规则
 * nodeLinkFn
 * childLinkFn [
 *      nodeLinkFn 
 *      childLinkFn [
 *              nodeLinkFn
 *              childLinkFn [].....
 *           ]
 *      ]
 * 
 * [nodeLinkFn,childLinkFn,nodeLinkFn,childLinkFn...........]
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
            childLinkFn = compileNodeList(node.childNodes, options)
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
    return function childLinkFn(nodes) {
        var node, nodeLinkFn, childrenLinkFn
        for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
            node = nodes[n]
            nodeLinkFn = linkFns[i++]
            childrenLinkFn = linkFns[i++]
            var childNodes = toArray(node.childNodes)
            if (nodeLinkFn) {
                nodeLinkFn(node)
            }
            if (childrenLinkFn) {
                childrenLinkFn(childNodes)
            }
        }
    }
}




/**
 *
 * 编译元素上普通指令
 * 并且返回一个 函数链接
 *  
 * @param {Array|NamedNodeMap} attrs
 * @param {Object} options
 * @return {Function}
 */
function compileDirectives(attrs, options) {
    var i = attrs.length;
    var dirs = [];
    var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;

    while (i--) {
        //找到每一个属性
        attr = attrs[i]
            //属性名
        name = rawName = attr.name;
        //属性值
        value = rawValue = attr.value;
        //事件绑定
        //v-on: | @
        if (onRE.test(name)) {
            arg = name.replace(onRE, '');
            pushDir('on', parseDirective.on);
        } else if (matched = name.match(dirAttrRE)) {
            // 普通指定
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
            expression: value,
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
            _bindDir(directives[i], el);
        }
    }
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










compile(document.querySelector("#app"))
