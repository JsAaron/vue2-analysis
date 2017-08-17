webpackHotUpdate(0,{

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(21);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { isServerRendering } from 'core/util/env'

(0, _index3.initGlobalAPI)(_index2.default);

exports.default = _index2.default;


function T() {
  vm = this;
  var hasHandler = {
    has: function has(target, key) {
      // var has = key in target;
      // var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      // if (!has && !isAllowed) {
      //   warnNonPresent(target, key);
      // }
      // return has || !isAllowed
    }
  };
  vm._renderProxy = new Proxy(vm, handlers);
}

new T();

/***/ })

})
//# sourceMappingURL=0.93244995612b62378f7b.hot-update.js.map