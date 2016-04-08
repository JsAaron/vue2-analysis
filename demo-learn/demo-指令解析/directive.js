/**
 * 指令解析
 * ASCII码表在线查询 http://www.litefeel.com/tools/ascii.php 
 */


var str, dir
var c, prev, i, l, lastFilterIndex
var inSingle, inDouble, curly, square, paren


function parseDirective(s) {
    str = s

	for (i = 0, l = str.length; i < l; i++) {

		prev = c;
		//转化字符的 Unicode 编码
		c = str.charCodeAt(i);
		console.log(c)
	}

}
