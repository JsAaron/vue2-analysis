/**
 * Compile an element and retrun a nodeLinkFn 
 */
let compileElement = (el, options) => {

    //The element has an attribute node
    let hasAttrs = el.hasAttributes()
}


/**
 * Parse text string into an array of tokens
 */
let parseText = (text) => {
    console.log(text)
    let match
    while (match = /\{\{((?:.|\n)+?)\}\}/g.exec(text)) {
        console.log(match)
    }

}

/**
 * Compile a textNode and return a linkFns
 */
let compileTextNode = (node, options) => {
    console.log(node.wholeText)
console.log(123)
    //Parse textNode string 
    let tokens = parseText(node.wholeText);

    //  \{\{ ((?:.|\n)+?)\ }\}/g
}

/**
 * Complie node and return a nodeLinkFn based on the node type
 */
let compileNode = (node, options) => {
    let type = node.nodeType

    //If be the element node
    if (type === 1) {
        return compileElement(node, options)
    } else if (type === 3 && node.data.trim()) {
        //if be the text node and remove the blank space
        return compileTextNode(node, options)
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

        //aslo complile node
        nodeLinkFn = compileNode(node, options);

    }
}

export function compile(el, options) {
    //link function for the node itself
    let nodeLinkFn = compileNode(el, options)

    //link function for the node childNodes
    if (el.hasChildNodes()) {
        let childNodes = compileNodeList(el.childNodes, options)
    }
}