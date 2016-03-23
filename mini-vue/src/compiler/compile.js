//定义终端指令
export const terminalDirectives = [
    'for',
    'if'
]

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
export function compile(el, options, partial) {
    //编译节点本身
    var nodeLinkFn = compileNode(el, options);
    //编译子节点
    var childLinkFn = el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;
}


/**
 * 编译一个节点列表
 * 返回子节点childLinkFn
 * @param  {[type]} nodeList [description]
 * @param  {[type]} options  [description]
 * @return {[type]}          [description]
 */
function compileNodeList(nodeList, options) {
    var linkFns = [];
    var nodeLinkFn, childLinkFn, node;
    for (var i = 0, l = nodeList.length; i < l; i++) {
        node = nodeList[i];
        nodeLinkFn = compileNode(node, options);
        childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null;
        linkFns.push(nodeLinkFn, childLinkFn);
    }
    return linkFns.length ? makeChildLinkFn(linkFns) : null;
}







/**
 * 返回一个基于节点类型的nodeLinkFn
 * @param  {[type]} node    [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function compileNode(node, options) {
    var type = node.nodeType
        //元素类型
        //并且不是SCRIPT
    if (type === 1 && node.tagName !== 'SCRIPT') {
        return compileElement(node, options)
    } else if (type === 3 && node.data.trim()) {
        //文本类型,不为空
        return compileTextNode(node, options)
    } else {
        return null
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
 * 检查终端指令按固定顺序的元素。
 * 如果找到一个,返回一个终端连接功能。
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
        attr = attrs[i]
            //属性值
        value = rawValue = attr.name;
    }
}