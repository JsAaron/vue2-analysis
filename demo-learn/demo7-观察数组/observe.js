  var uid = 0;
  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto)


  function def(obj, key, val, enumerable) {
      Object.defineProperty(obj, key, {
          value: val,
          enumerable: !!enumerable,
          writable: true,
          configurable: true
      });
  }

  //重写数组的方法
  //让方法可以支持计算
  ;
  ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function(method) {
      // 数组元素方法
      var original = arrayProto[method];
      //扩展原型方法
      def(arrayMethods, method, function mutator() {
          //数组计算处理
      });
  });


  function Dep() {
      this.id = uid++;
      this.subs = [];
  }

  function defineReactive(obj, key, val) {
      var dep = new Dep();

      //如果val有子属性
      // items: [{
      //     message: 'Foo'
      // }, {
      //     message: 'Bar'
      // }]
      var childOb = observe(val);
console.log(childOb)
      Object.defineProperty(obj, key, {
          enumerable: true,
          configurable: true,
          get: function reactiveGetter() {
              console.log('get')
          },
          set: function reactiveSetter(newVal) {
              console.log('set', newVal)
          }
      });
  }


  /**
   * data = {
   *   __ob__
   *   array __ob__
   *   string __ob__
   *   object __ob__
   *   ...
   * }
   *     
   * @param {[type]} value [description]
   */
  function Observer(value) {
      this.value = value;
      this.dep = new Dep();
      //关键步骤
      //保存了this的引用
      Object.defineProperty(value, '__ob__', {
          value: this,
          enumerable: false,
          writable: true,
          configurable: true
      });

      if (Array.isArray(value)) {
          //重写数组的方法
          value.__proto__ = arrayMethods;
          //建立数组观察
          this.observeArray(value);
      } else {
          this.walk(value);
      }
  }

  //如果是数组
  //分解每一个元素建立观察
  Observer.prototype.observeArray = function(items) {
      for (var i = 0, l = items.length; i < l; i++) {
          observe(items[i]);
      }
  };

  Observer.prototype.walk = function(obj) {
      var keys = Object.keys(obj);
      for (var i = 0, l = keys.length; i < l; i++) {
          this.convert(keys[i], obj[keys[i]]);
      }
  };

  Observer.prototype.convert = function(key, val) {
      defineReactive(this.value, key, val);
  };


  function observe(value) {
    if (!value || typeof value !== 'object') {
      return;
    }
    var ob;
    ob = new Observer(value);
    return ob;
  }
