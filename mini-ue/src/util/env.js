
/**
 * 异步延迟一个任务来执行它
 * 我们利用MutationObserver来执行
 * 否则用setTimeout(0)
 * @param  {Array}  ) {              
 * @return {[type]}   [description]
 */
export const nextTick = (function() {
    var callbacks = []
    var pending = false
    var timerFunc

    /**
     * 触发所有更新
     * @return {[type]} [description]
     */
    function nextTickHandler() {
        pending = false
        var copies = callbacks.slice(0)
        callbacks = []
        for (var i = 0; i < copies.length; i++) {
            copies[i]()
        }
    }

   	//Mutation Observer（变动观察器）是监视DOM变动的接口。
   	//当DOM对象树发生任何变动时，Mutation Observer会得到通知。
   	//这样设计是为了应付DOM变动频繁的情况。
   	//举例来说，
   	// 如果在文档中连续插入1000个段落（p元素），
   	// 会连续触发1000个插入事件，执行每个事件的回调函数，
   	// 这很可能造成浏览器的卡顿；而MutationObserver完全不同，
   	// 只在1000个段落都插入结束后才会触发，而且只触发一次。
   	//
   	// MutationObserver所观察的DOM变动（即上面代码的option对象），包含以下类型：
	// 	    childList：子元素的变动
	//	    attributes：属性的变动
	//  	characterData：节点内容或节点文本的变动
	//    	subtree：所有下属节点（包括子节点和子节点的子节点）的变动
    if (typeof MutationObserver !== 'undefined') {
        var counter = 1
        var observer = new MutationObserver(nextTickHandler)
        var textNode = document.createTextNode(counter)
        observer.observe(textNode, {
            characterData: true
        })
        timerFunc = function() {
            counter = (counter + 1) % 2
            textNode.data = counter
        }
    } else {
        const context = inBrowser ? window : typeof global !== 'undefined' ? global : {}
        timerFunc = context.setImmediate || setTimeout
    }
    return function(cb) {
        var func = cb
        callbacks.push(func)

        //状态控制
        //如果执行了就不在调用
        //等一下次完毕
        if (pending) return
        pending = true
        timerFunc(nextTickHandler, 0)
    }
})() 
