/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./vue/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	 // var Vue = require('./src/vue.js')

	a = 1

	 
	// var vm = new Vue({
	// 	el:"#demo",
	//     data: {
	//         firstName : 'Foo',
	//         lastName  : 'Bar',
	//         fullName  :'ahahh'
	//     },
	//     // computed: {
	//     //     fullName: function() {
	//     //         return this.firstName + ' ' + this.lastName
	//     //     }
	//     // },
	//     methods:{
	//         onClick:function(){
	//             this.firstName = "Aaron"
	//             this.lastName  = "慕课网"
	//             this.fullName = this.firstName + this.lastName
	//         }
	//     }
	// })
	 
	// // Vue.config.debug = true;

	// // require('./style.css');

	// // var xtemplate = 
	// // 	'<table>'+
	// // 	'	<thead>'+
	// // 	'		<th>姓名</th>'+
	// // 	'		<th>价格</th>'+
	// // 	'	</thead>'+
	// // 	'	<tbody>'+
	// // 	'		<tr>'+
	// // 	'			<td>1</td>'+
	// // 	'			<td>2</td>'+
	// // 	'		</tr>'+
	// // 	'	</tbody>'+
	// // 	'</table>';


	// // Vue.component('demo-grid', {
	// // 	template:xtemplate
	// // 	props:['data']
	// // })


	// // var app = new Vue({
	// // 	el: '#demo',
	// // 	data: {
	// // 	    searchQuery: '',
	// // 	    gridColumns: ['name', 'power'],
	// // 	    gridData: [
	// // 	      { name: 'Chuck Norris', power: Infinity },
	// // 	      { name: 'Bruce Lee', power: 9000 },
	// // 	      { name: 'Jacky Chang', power: 7000 },
	// // 	      { name: 'Jet Li', power: 8000 }
	// // 	    ]
	// //    }
	// // })


/***/ }
/******/ ]);