let isScript = (el) => {
    return el.tagName === 'SCRIPT' && (!el.hasAttribute('type') || el.getAttribute('type') === 'text/javascript');
}

let dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/
let tagRE = new RegExp(/\{\{\{((?:.|\n)+?)\}\}\}|\{\{((?:.|\n)+?)\}\}/g)
let htmlRE = new RegExp(/^\{\{\{((?:.|\n)+?)\}\}\}$/)

import text from './directives/text'
import on from './directives/on'
// must export plain object
var directives = {
    text: text,
    on: on
};

/**
 * Convert an Array-like object to a real Array.
 *
 * @param {Array-like} list
 * @param {Number} [start] - start index
 * @return {Array}
 */

let toArray = (list, start) => {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret;
}


function makeNodeLinkFn(directives) {
    return function nodeLinkFn(vm, el, host, scope, frag) {

    };
}

let compileDirectives = (attrs, options) => {
    var i = attrs.length;
    var dirs = [];
    var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;
    while (i--) {
        attr = attrs[i];
        name = rawName = attr.name;
        value = rawValue = attr.value


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
        })
    }

    if (dirs.length) {
        return makeNodeLinkFn(dirs);
    }

}



function resolveAsset(options, type, id, warnMissing) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
        return;
    }
    var assets = options[type];
    var camelizedId;
    var res = assets[id]
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
            def = resolveAsset(options, 'directives', matched[1])
            if (def && def.terminal) {
                termDef = def
                rawName = attr.name
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
let compileElement = (el, options) => {

    //The element has an attribute node
    let hasAttrs = el.hasAttributes()
    let attrs = hasAttrs && toArray(el.attributes)

    let linkFn

    //check terminal directives(if & for)
    if (hasAttrs) {
        linkFn = checkTerminalDirectives(el, attrs, options);
    }

    if (!linkFn) {
        linkFn = compileDirectives(attrs, options)
    }

    return linkFn
}


/**
 * Parse text string into an array of tokens
 */
let parseText = (text) => {

    var tokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match, index, html, value, first, oneTime;
    while (match = tagRE.exec(text)) {

        index = match.index

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
        value = oneTime ? value.slice(1) : value

        tokens.push({
            tag: true,
            value: value.trim(),
            html: html,
            oneTime: oneTime
        })

        lastIndex = index + match[0].length;
    }

    //tag end
    if (lastIndex < text.length) {
        tokens.push({
            value: text.slice(lastIndex)
        });
    }

    return tokens
}


function parseDirective(str) {
    var dir = {}
    dir.expression = str.trim();
    return dir
}


/**
 * Process a single text token
 */
let processTextToken = (token, options) => {
    var el
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
    return el
}

let makeTextNodeLinkFn = (tokens, frag) => {
    return function textNodeLinkFn(vm, el) {
        var fragClone = frag.cloneNode(true)


    }
}

/**
 * Compile a textNode and return a linkFns
 */
let compileTextNode = (node, options) => {

    //Parse textNode string 
    let tokens = parseText(node.wholeText);
    if (!tokens) {
        return null;
    }

    let frag = document.createDocumentFragment()
    let el, token;
    for (let i = 0, l = tokens.length; i < l; i++) {
        token = tokens[i];
        el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
        frag.appendChild(el);
    }
    // console.log(token)
    return makeTextNodeLinkFn(tokens, frag, options)
}




let makeChildLinkFn = (linkFns) => {
    // console.log(linkFns)
    return function childLinkFn(vm, nodes) {
        var node, nodeLinkFn, childrenLinkFn;
        for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
            node = nodes[n];
            nodeLinkFn = linkFns[i++]
            childrenLinkFn = linkFns[i++];
            // cache childNodes before linking parent, fix #657
            var childNodes = toArray(node.childNodes);
            if (nodeLinkFn) {
                nodeLinkFn(vm, node);
            }
            if (childrenLinkFn) {
                // childrenLinkFn(vm, childNodes, host, scope, frag);
            }
        }
    }
}


/**
 * Complie node and return a nodeLinkFn based on the node type
 */
let compileNode = (node, options) => {
    let type = node.nodeType
        //If be the element node
    if (type === 1 && !isScript(node)) {
        return compileElement(node, options)
    } else if (type === 3 && node.data.trim()) {
        //if be the text node and remove the blank space
        return compileTextNode(node, options)
    } else {
        return null
    }
}


/**
 *  Compile a node list and return a childLinkFn.
 */
let compileNodeList = (nodeList, options) => {
    let linkFns = []
    let nodeLinkFn, childLinkFn, node
    for (let i = 0, l = nodeList.length; i < l; i++) {
        node = nodeList[i]
        nodeLinkFn = compileNode(node, options);

        childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null

        linkFns.push(nodeLinkFn, childLinkFn)
    }
    return linkFns.length ? makeChildLinkFn(linkFns) : null;
}


/**
 * Apply a linker to a vm/element pair and capture the
 * directives created during the process.
 *
 * @param {Function} linker
 * @param {Vue} vm
 */

let linkAndCapture = (linker, vm) => {
    var originalDirCount = vm._directives.length
    linker()
        // var dirs = vm._directives.slice(originalDirCount);
        // dirs.sort(directiveComparator);
        // for (var i = 0, l = dirs.length; i < l; i++) {
        //     dirs[i]._bind();
        // }
        // return dirs;
}


export function compile(el, options) {
    //link function for the node itself
    let nodeLinkFn = compileNode(el, options);
    //link function for the node childNodes
    let childLinkFn = el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null

    return function compositeLinkFn(vm, el) {
        let childNodes = toArray(el.childNodes)
        let dirs = linkAndCapture(function() {
            if (nodeLinkFn) nodeLinkFn(vm, el)
            if (childLinkFn) childLinkFn(vm, childNodes)
        }, vm)
    }
}