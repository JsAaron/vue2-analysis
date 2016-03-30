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
 * 		nodeLinkFn 
 * 		childLinkFn [
 * 				nodeLinkFn
 * 				childLinkFn [].....
 * 		     ]
 * 		]
 *
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
    var attrs = hasAttrs && util.toArray(el.attributes);

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




//v-on|@快捷方式
var onRE = /^v-on:|^@/;
//普通v-命令
var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/

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
            pushDir('on', publicDirectives.on);
        } else if (matched = name.match(dirAttrRE)) {
            // 普通指定
			dirName = matched[1];
			arg     = matched[2];
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
