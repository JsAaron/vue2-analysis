import publicDirectives from '../directives/public/index'
import {toArray} from '../util/index'

//特殊的绑定前缀
//用来检查指定

//v-on|@快捷方式
const onRE = /^v-on:|^@/
    //普通v-命令
const dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/

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
 
 
//************************
//      编译子节点
//************************ 
 
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
        //本身节点
        nodeLinkFn = compileNode(node, options);
        //如果有子字节
        if (node.hasChildNodes()) {
            //递归
            childLinkFn = compileNodeList(node.childNodes, options)
        }
        linkFns.push(nodeLinkFn, childLinkFn);
    }
    return linkFns.length ? makeChildLinkFn(linkFns) : null;
}


/**
 * 生成子节点的link函数
 * @param  {[type]} linkFns [description]
 * @return {[type]}         [description]
 */
function makeChildLinkFn(linkFns) {
    return function childLinkFn(vm, nodes, host, scope, frag) {
        alert(linkFns)
    }
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
    var type = node.nodeType
        //元素类型
        //并且不是SCRIPT
    if (type === 1 && node.tagName !== 'SCRIPT') {
        return compileElement(node, options)
    } else if (type === 3 && node.data.trim()) {
        //文本类型,不为空
        // return compileTextNode(node, options)
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
        attr = attrs[i]
            //属性值
        name = rawName = attr.name;

        //事件绑定
        //v-on: | @
        if (onRE.test(name)) {
            arg = name.replace(onRE, '');
            pushDir('on', publicDirectives.on);
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
    }
}
