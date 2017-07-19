// Regular Expressions for parsing tags and attributes
const singleAttrIdentifier = /([^\s"'<>/=]+)/
const singleAttrAssign = /(?:=)/
const singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
]
const attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
)


const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'
//"^<((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)"
const startTagOpen = new RegExp('^<' + qnameCapture)
const startTagClose = /^\s*(\/?)>/

export function parseHTML(html, options) {
  var stack = []

  var index = 0
  var last, lastTag;

  //递归分解HTML
  while (html) {
    last = html;
    var textEnd = html.indexOf('<')
    if (textEnd === 0) {
      //如果是开始的标记<d
      //分解这个节点
      var startTagMatch = parseStartTag();
      if (startTagMatch) {
        handleStartTag(startTagMatch);
        continue
      }
    }

    //解析结尾分解符，空白，换行符处理
    let text, rest, next
    //如果有下一个开始标记，那么就需要把结尾"清理
    if (textEnd >= 0) {
      rest = html.slice(textEnd)
      text = html.substring(0, textEnd)
      advance(textEnd)
    }


    if (html === last) {
      console.log(111)
      break
    }
  }


  function advance(n) {
    index += n;
    html = html.substring(n);
  }

  //解析标记头
  function parseStartTag() {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };

      //截取已经处理过的html标记
      //"<div id="editor"></div> => " id="editor"></div>"
      advance(start[0].length);

      var end, attr;
      //递归处理属性
      //有属性，并且不是最后的结尾的标记
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }

      //处理尾部
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }

    }
  }

  function handleStartTag(match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: value
      }
    }

    var unary = false

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }


    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }

  }


}