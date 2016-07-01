let isScript = (el) => {
    return el.tagName === 'SCRIPT' && (!el.hasAttribute('type') || el.getAttribute('type') === 'text/javascript');
}

let dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/
let tagRE = new RegExp(/\{\{\{((?:.|\n)+?)\}\}\}|\{\{((?:.|\n)+?)\}\}/g)
let htmlRE = new RegExp(/^\{\{\{((?:.|\n)+?)\}\}\}$/)

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


let compileDirectives = (attrs, options) => {
    var i = attrs.length;
    var dirs = [];
    var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;
    while (i--) {
        attr = attrs[i];
        name = rawName = attr.name;
        value = rawValue = attr.value
            // normal directives
        if (matched = name.match(dirAttrRE)) {
            dirName = matched[1];
            arg = matched[2];
        }
    }
}


/**
 * Compile an element and retrun a nodeLinkFn 
 */
let compileElement = (el, options) => {

    //The element has an attribute node
    let hasAttrs = el.hasAttributes()
    let attrs = hasAttrs && toArray(el.attributes)
    let linkFn = compileDirectives(attrs, options)

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

/**
 * Process a single text token
 */
let processTextToken = (token, options) => {
    let el = document.createTextNode(' ')
    token.descriptor = {
        name: 'text',
        def: null,
        expression: token.value,
        filters: null
    }
    return el
}

let makeTextNodeLinkFn = (tokens, frag) => {
    return function textNodeLinkFn() {

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

    return makeTextNodeLinkFn(tokens, frag, options)
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


let makeChildLinkFn = (linkFns) => {
    return childLinkFn()[

    ]
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
        if (node.hasChildNodes()) {
            childLinkFn = compileNodeList(node.childNodes, options)
        }
        linkFns.push(nodeLinkFn, childLinkFn)
    }
    return linkFns.length ? makeChildLinkFn(linkFns) : null;
}


export function compile(el, options) {
    //link function for the node itself
    let nodeLinkFn = compileNode(el, options);
    //link function for the node childNodes
    let childNodes = el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null


    return function compositeLinkFn() {

    }
}