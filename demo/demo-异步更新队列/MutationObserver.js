var MutationObserver = window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;

var mutationObserverSupport = !!MutationObserver;

var callback = function(records) {
    console.log('MutationObserver callback');
    records.map(function(record) {
        console.log(record);
    });
};

var mo = new MutationObserver(callback);


// 上面代码首先指定，所要观察的DOM元素提article，然后指定所要观察的变动是子元素的变动和属性变动。最后，将这两个限定条件作为参数，传入observer对象的observer方法。

// MutationObserver所观察的DOM变动（即上面代码的option对象），包含以下类型：

// childList：子元素的变动
// attributes：属性的变动
// characterData：节点内容或节点文本的变动
// subtree：所有下属节点（包括子节点和子节点的子节点）的变动
// 想要观察哪一种变动类型，就在option对象中指定它的值为true。需要注意的是，不能单独观察subtree变动，必须同时指定childList、attributes和characterData中的一种或多种。

// 除了变动类型，option对象还可以设定以下属性：

// attributeOldValue：值为true或者为false。如果为true，则表示需要记录变动前的属性值。
// characterDataOldValue：值为true或者为false。如果为true，则表示需要记录变动前的数据值。
// attributesFilter：值为一个数组，表示需要观察的特定属性（比如['class', 'str']）。
var option = {
    'childList': true,
    'subtree': true
};

var test = document.querySelector('#test')

mo.observe(test, option);

window.onload = init;

function init() {
    if (!mutationObserverSupport) {
        return;
    }
    document
        .getElementById('app')
        .addEventListener('click', function(e) {
            for (var i = 0, j = 100; i < j; i++) {
                var p = document.createElement('p');
                p.appendChild(document.createTextNode(i));
                test.appendChild(p);
                console.log('append child node: ' + i);
            }
        }, false);
}
