/**
 * @file place模块广播名称枚举
 */
/**
 * @module place:static/js/broadcastname.js
 */
define('place:static/js/broadcastname.js', function (require, exports, module) {
    module.exports = {
        DATEPICKER_DATE_CHANGE: 'datepickerdatechange',
        HOTELBOOK_OR_THIRDSRCOTA_SHOW: 'hotelbookorthirdsrcotashow'
    };
});
;/**
 * 验证码服务
 * 坦然
 * 2013-10-23
 */
define('place:static/js/vcode.js', function (require, exports, module) {

var VCode, _option;

_option = {};

/**
 * @param {object} option
 * @param {dom}    option.el 验证码放到哪个dom节点中
 */
VCode = function(option) {
    var self = this;

    self.option = $.extend({}, _option, option);

    self.el = $(self.option.el);
    self.render();
    self.refreshVcode();
}

VCode.Const = {};
//VCode.Const.U_GET_VCODE = 'http://map.baidu.com/maps/services/captcha?cb=getVcodeCallback&t='+new Date().getTime();
VCode.Const.U_GET_VCODE = "http://map.baidu.com/maps/services/captcha?cb=?";

VCode.Const.U_GET_IMAGE = 'http://map.baidu.com/maps/services/captcha/image';
VCode.Const.T_VCODE = '' +
    '<input type="hidden" name="vcode" value="" />'+
    '<img title="点击更换验证码" width="100" height="30"  id="VerifyCodeImg" class="codeimg"  src="http://map.baidu.com/img/transparent.gif" />'+
    '<a id="changeVerifyCode" href="javascript:void(0);" class="changecode">换一张</a>';


$.extend(VCode.prototype, {
    /**
     * 渲染模板
     * @private
     */
    render: function() {
        var self = this;

        self.el.prepend($(VCode.Const.T_VCODE));
        self.el.find('#changeVerifyCode').click(function () {
            self.refreshVcode();
        });
    },
    /**
     * 设置vcode
     * @private
     */
    setVcode: function(vcode) {
        var self = this;

        self.el.find("input[name=vcode]").val(vcode);
        self.vcode = vcode;
    },
    /**
     * 刷新验证码
     * @public
     */
    refreshVcode: function() {
        var self = this;

        self.el.find(".vcode-img").prop("src", "http://map.baidu.com/img/transparent.gif");

        $.ajax({
            url: VCode.Const.U_GET_VCODE + "&t=" + (+new Date()),
            dataType: "jsonp",
            jsonp: "cb",
            success: function(data) {
                var vcode;

                if (vcode = data.content.vcode) {
                    self.setVcode(vcode);
                    self.getImage(vcode);
                }
            }
        });
    },
    getImage: function(vcode) {
        var self = this;

        this.el.find(".codeimg").prop("src", VCode.Const.U_GET_IMAGE + '?vcode=' + vcode);
    },
    /**
     * 获取验证码
     * @public
     */
    getData: function () {
        var self = this;

        return {
            vcode: self.vcode,
            code: self.el.find("input[name=code]").val()
        }
    }
});

module.exports = VCode;
});
;define('place:static/lib/mapresize.js', function(require, exports, module){

/**
 * @fileoverview 屏幕尺寸变化处理
 *
 */
var util = require('common:static/js/util.js');

// 屏幕尺寸变化处理
var mapResize = {

    h: 0,
    // 显示高度记录
    w: 0,
    // 显示宽度记录
    tm: 1000,
    // 计时器频率
    interval: null,
    ua: navigator.userAgent.toLowerCase(),

    init: function() {
        this.startMgr();
    },

    startMgr: function() {

        //var hasBind = false;
        if(typeof window.onorientationchange != 'undefined') {
            window.addEventListener('orientationchange', this.resize, false);

        } else {

            window.addEventListener('resize', this.resize, false);
            //hasBind = true;
        }

        if(util.isAndroid()) {

            window.addEventListener('resize', this.resize, false);
        }
        // 为了兼容iphone uc浏览器，绑定reseize事件
        // if((util.isIPhone() || util.isIPod()) && this.ua.indexOf("safari") < 0 && this.ua.indexOf("mqqbrowser") < 0) {
        //     if(this.ua.indexOf("os 5_1 ") > -1) {
        //         return;
        //     }
        //     this.isForUC = true;
        //     

        //     window.addEventListener('resize', this.resize, false);
        // }

        // this.w = window.innerWidth; // 初始化设置
        // this.h = window.innerHeight; // 初始化设置
    },

    endMgr: function() {
        clearInterval(this.interval);
        this.interval = null;
    },

    resize: function(evt) {
        // var win = window,
        //     winW = win.innerWidth;
        // if(mapResize.isForUC && winW === mapResize.w) { // FIXED: this -> window;
        //     return;
        // }

        // //menu.openAni(); //侧边栏打开动画？应该没有用吧 暂时没发现用处，我注释掉了 -by jz
        // //FIXED：避免5830默认浏览器不能完全缩进地址栏，页面高度不停变化的情况；
        // var span = Math.abs(win.innerHeight - mapResize.h);
        // if(span < 60) { // 经验值
        //     return;
        // }

        // mapResize.w = win.innerWidth; // 重新设置
        // mapResize.h = win.innerHeight; // 重新设置
        //app.eventCenter.trigger('sizechange', {width: evt.target.innerWidth, height: evt.target.innerHeight, delay:true});

        // var cover = $('#bmap_pop_cover');
        // //重置cover的高度和宽度
        // if(cover && cover.css('display') !== 'none'){
        //     cover.css({
        //         'width' : mapResize.w,
        //         'height': mapResize.h
        //     })
        // }
        return;

        //todolyx delete mapresize
        // win.tfCon && win.tfCon.setPos(); // 调整交通流量控件的位置
        /*win.mnPop && win.mnPop.setPos(); // 调整menu的显示位置 
        win.dtCon0 && win.dtCon0.setPos(); // 调整测距控件的显示位置
        win.mapSubway && win.mapSubway.setPos(); // 调整地铁专题图的显示尺寸；
        win.dropDownList && win.dropDownList.setPos();

        win.TelBox.telBox && win.TelBox.telBox.setPos();
        win.TxtBox.tBox && win.TxtBox.tBox.setPos();

        topNav.setPageSize(function() {
            topNav.setSize();
        });*/
    }
};



module.exports = mapResize;


});
;define('place:static/lib/template.js', function(require, exports, module){

window.baidu = window.baidu || {};
baidu.template = baidu.template || {};

//HTML转义
baidu.template._encodeHTML = function (source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/\\/g,'&#92;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
};

//转义UI UI变量使用在HTML页面标签onclick等事件函数参数中
baidu.template._encodeEventHTML = function (source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;')
        .replace(/\\\\/g,'\\')
        .replace(/\\\//g,'\/')
        .replace(/\\n/g,'\n')
        .replace(/\\r/g,'\r');
};

});

;//     Underscore.js 1.5.1
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

 define('place:static/lib/underscore.js', function(require, exports, module){

(function() {
  
  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.1';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value == null ? _.identity : value);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var result;
    var timeout = null;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(window);


});

;define('place:widget/bdcomment/bdcomment.js', function(require, exports, module){


var util = require('common:static/js/util.js');

module.exports = {
    startIndex: 0,
    $select: $( '#J_commentSelect' ),
    init: function() {
        var me = this;

        me.$select.on( 'change', $.proxy(me.loadMore, me));
        $( '.comment-loadmore').on( 'click', function() {
            me.loadMore(  true );
        } );
    },
    loadMore: function( isAsyncLoad ) {
        var me = this,
            $select = me.$select,
            startIndex = 0,
            maxResults = 5,
            params;

        if ( isAsyncLoad ) {
            startIndex = (++me.startIndex);
            maxResults = 10;
        }

        params = util.jsonToUrl({
            uid: $select.data( 'uid' ),
            startIndex: startIndex,
            maxResults: maxResults,
            orderBy: $select.val()
        });

        BigPipe.asyncLoad( {id: 'place-pagelet-bdcomment'}, params )
    }
}

});
;define('place:widget/bookphone/bookphone.js', function(require, exports, module){

/**
 * @file bookphone-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */
var util = require('common:static/js/util.js'),
    $bookphone = $('.place-widget-bookphone');  //商户电话
/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    $bookphone.on('click', showTelBox);

}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    $bookphone.off('click', showTelBox);
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function showTelBox(e) {
    var  $target = $(e.target).closest('a');
    if(util.isAndroid()){
        $target.attr("href","javascript:void(0)");
        util.TelBox.showTb($target.attr("data-tel"));
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/bookphone
 */
module.exports = {

    init: function() {
        'use strict';

        bindEvents();

    }
};

});
;define('place:widget/captain/captain.js', function(require, exports, module){

/**
 * @fileOverview
 * @author liushuai02@baidu.com
 */

var broadcaster,
    $el = $('.place-widget-captain');


});
;define('place:widget/commentbtn/commentbtn.js', function(require, exports, module){



var login = require('common:widget/login/login.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = {
    init: function () {
        $( '#J_commentBtn' ).on( 'click', $.proxy( this.commentAction, this ) );
    },

    commentAction: function( e ) {
        e.preventDefault();

        //评论入口点击总量
        //stat.addStat( STAT_CODE.PLACE_DETAIL_COMMENT_CLICK );

        login.checkLogin(function( data ) {
            if ( data.status ) {
                location.href = $( e.target ).closest( 'a' ).prop( 'href' );;
            } else {
                login.loginAction();
            }
        });
    }
}


});
;define('place:widget/datepicker/datepicker.js', function(require, exports, module){

'use strict';
var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    placeBroadcastName = require('place:static/js/broadcastname.js'),
    $el = $('.place-widget-datepicker'),
    $sd, $ed, $sdWrapper, $edWrapper, $sdPicker, $edPicker;

broadcaster.subscribe(placeBroadcastName.HOTELBOOK_OR_THIRDSRCOTA_SHOW, function() {
    if($el.css('display') === 'none') {
        create();
    }
});

function create() {
    var datepicker = require('common:widget/datepicker/datepicker.js'),
        today = new Date(),
        tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    $sd = $el.find('.sd');
    $ed = $el.find('.ed');
    $sdWrapper = $el.find('.sd-wrapper');
    $edWrapper = $el.find('.ed-wrapper');
    $sdPicker = $el.find('.sd-picker');
    $edPicker = $el.find('.ed-picker');

    // 初始化时间
    $sd.text(today.format('yyyy-MM-dd'));
    $ed.text(tomorrow.format('yyyy-MM-dd'));

    //初始化入住时间datepicker
    $sdPicker.datepicker({
        date: today,
        minDate: today,
        valuecommit: function (e, date, dateStr) {
            //unbindEvents();
            var enddate, newed;

            $sd.text(dateStr);
            enddate = $.datepicker.parseDate($ed.text());

            //如果选择的入住日期大于退房日期，则退房日期变更为新的入住日期的下一天
            if (compareDate(date, enddate) >= 0) {
                newed = new Date(date.getTime() + 24 * 60 * 60 * 1000);
                $ed.text(newed.format('yyyy-MM-dd'));
                $edPicker.datepicker('date', newed)
            }
            $edPicker.datepicker('minDate', new Date(date.getTime() + 24 * 60 * 60 * 1000)).datepicker('refresh');
            //移除样式
            removeActiveCss('start');
            broadcaster.broadcast(placeBroadcastName.DATEPICKER_DATE_CHANGE, {
                sd: $sd.text(),
                ed: $ed.text()
            });
        }

    });

    //初始化退房时间datepicker
    $edPicker.datepicker({
        date: tomorrow,
        minDate: tomorrow,
        valuecommit: function (e, date, dateStr) {
            //unbindEvents();
            var startdate, newsd;

            $ed.text(dateStr);
            startdate = $.datepicker.parseDate($sd.text());

            //如果选择的退房日期大于入住日期，则入住日期变更为新的退房日期的前一天
            if (compareDate(date, startdate) <= 0) {
                newsd = new Date(date.getTime() - 24 * 60 * 60 * 1000);
                $sd.text(newsd.format('yyyy-MM-dd'));
                $sdPicker.datepicker('date', newsd).datepicker('refresh');
            }
            //移除样式
            removeActiveCss('end');
            broadcaster.broadcast(placeBroadcastName.DATEPICKER_DATE_CHANGE, {
                sd: $sd.text(),
                ed: $ed.text()
            });
        }

    });

    $sd.on('click', onDateClick);
    $ed.on('click', onDateClick);
    $el.show();
}

function onDateClick(e) {
    var type = e.currentTarget.className;

    if (type === 'sd') {
        removeActiveCss('end');

        $sdWrapper.toggle();
        $sd.parents('.date').toggleClass('active');
    } else {
        removeActiveCss('start');

        $edWrapper.toggle();
        $ed.parents('.date').toggleClass('active');
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 移除日期控件的样式
 * @param {string} type 'start':移除入住样式, 'end':移除退房样式
 */
function removeActiveCss(type) {
    switch (type) {
        case 'start':
            $sdWrapper.hide();
            $sd.parents('.date').removeClass('active');
            break;
        case 'end':
            $edWrapper.hide();
            $ed.parents('.date').removeClass('active');
            break;
        default :
    }

}

/**
 * 比较两个日期的大小
 * @param {date} [date1] 日期对象
 * @param {date} [date2] 日期对象
 * @returns {number} 0：相等, >0：date1大于date2, <0：date1小于date2
 */
function compareDate(date1, date2) {
    return date1.getTime() - date2.getTime();
}

});
;define('place:widget/dishcategory/dishcategory.js', function(require, exports, module){

var util = require('common:static/js/util.js'),
    mapResize = require('place:static/lib/mapresize.js'),
    iScroll = require('common:static/js/iscroll.js');

$(function() {
    $('#place-widget-dish-category').show();


    var ddlScroll = new iScroll($("#place-widget-dish-category .ddl_wrapper div").get(0), {
        hScroll: false,
        hScrollbar: false,
        vScroll: true,
        vScrollbar: true,
        handleClick: false
    });


    var height = mapResize.h || 320;
    height = height - 160;
    height = Math.min(Math.max(120, height), 360);

    $("#place-widget-dish-category .ddl_wrapper .ul_scroll").css({maxHeight : height});

    ddlScroll.refresh();


    function scrollToDish(e){
        var target = e.target;
        var dishCategoryId = target.id;
        
        if(dishCategoryId){
            var offset = $('#dishCategory_' + dishCategoryId).offset();
            window.scroll(0, offset.top);
        }

        $('#place-widget-dish-category').hide();
    }

    // 分类菜单点击事件
    $('#place-widget-dish-category').on('click', scrollToDish);
    
    // 隐藏分类菜单
    $('#place-widget-dish-category').hide();
});

});
;define('place:widget/gotomovie/gotomovie.js', function(require, exports, module){

/**
 */
'use strict';



var util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js'),
    $telephone = $('#detail-phone');  //商户电话

stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_SHOW);
/**
 * 绑定事件
 */
function bindEvents() {
    $telephone.on('click', showTelBox);

}

/**
 * 解绑事件
 */
function unbindEvents() {
    $telephone.off('click', showTelBox);
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function showTelBox(e) {
    var wd = $('.common-widget-nav .title span').text(),
        name = $('.place-widget-captain').find('.name').text();

    stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_CLICK, {'wd': wd, 'name':name});

    var  $target = $(e.target).closest('a');
    if(util.isAndroid()){
        $target.attr('href','javascript:void(0)');
        util.TelBox.showTb($target.attr('data-tel'));
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/telephone
 */
module.exports = {
    init: function() {
        bindEvents();

    }
};

});
;define('place:widget/groupon/groupon.js', function(require, exports, module){

/**
 * @file groupon-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var $uls = $('.place-widget-groupon-main'), //团购信息层元素集合
    $prev = $('.place-widget-groupon-pagenum-prev'), //上一页元素
    $next = $('.place-widget-groupon-pagenum-next'), //上一页元素
    $curpage = $('.place-widget-groupon-curpage'), //当前页面元素
    $totalpage = $('.place-widget-groupon-totalpage'), //总页数
    stat = require('common:widget/stat/stat.js'),
    statData;

/**
 * 跳转到团购详情页
 * @param {event} e 事件对象
 */
function gotoSee(e) {
    'use strict';

    var url = $(e.target).closest('ul').attr('url'),
        dest = $('.place-widget-groupon-site').text();

    stat.addStat(STAT_CODE.PLACE_GROUPON_CLICK, {'wd': statData.wd, 'name': statData.name, 'dest':dest, 'srcname': statData.srcname});

    window.open(url);

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 显示上一页
 * @param {event} e 事件对象
 */
function goPrev(e) {
    var cp = $curpage.html()-0; //当前页面索引

    if($next.hasClass('place-widget-groupon-disable')){
        $next.removeClass('place-widget-groupon-disable');
    }

    if(!$prev.hasClass('place-widget-groupon-disable')){
        $next.on('click', goNext);

        $uls.hide();
        $uls.eq(cp-2).show();
        $curpage.html(cp-1);
        if(cp-2==0){
            $prev.addClass('place-widget-groupon-disable');
            $prev.off('click', goPrev);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function goNext(e) {
    var cp = $curpage.html() - 0, //当前页面索引
        total = $totalpage.html() - 0; //总页数

    if($prev.hasClass('place-widget-groupon-disable')){
        $prev.removeClass('place-widget-groupon-disable');
    }


    if(!$next.hasClass('place-widget-groupon-disable')){
        $prev.on('click', goPrev);

        $uls.hide();
        $uls.eq(cp).show();
        $curpage.html(cp+1);
        if(cp+1==total){
            $next.addClass('place-widget-groupon-disable');
            $next.off('click', goNext);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/groupon
 */
module.exports = {

    init: function( data ) {
        'use strict';

        var total = $totalpage.html()-0; //总页数
        
        statData = data || {};

        $uls.on('click', gotoSee);
        if(total>1){
            $prev.on('click', goPrev);
            $next.on('click', goNext);
        }


        stat.addStat(STAT_CODE.PLACE_GROUPON_VIEW, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});

    }
};

});
;define('place:widget/hotelbook/hotelbook.js', function(require, exports, module){

/**
 * @file hotelbook-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */
'use strict';

var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    placeBroadcastName = require('place:static/js/broadcastname.js'),
    util = require('common:static/js/util.js'),
    geolocation = require('common:widget/geolocation/location.js'),
    popup = require('common:widget/popup/popup.js'),
    stat = require('common:widget/stat/stat.js');

/**
 * @module place/widget/hotelbook
 */
module.exports = {
    create: function () {
        var $el = this.$el = $('.place-widget-hotel-book');
        this.serverAddr = 'http://' + location.host + '/mobile/webapp/place/hotelbook/async=1&qt=';

        this.$showAllRoom = $el.find('.show-all-room');  //查看其他房型层
        this.$showAllOta = $el.find('.show-all-ota');    //展开其他报价层
        this.$hbMain = $el.find('.main'); //房型层父元素
        this.$roomsWp = $el.find('.rooms'); //房型层
        this.$rooms = $el.find('.room-list > li'); //全部房型
        this.$roomsHide = $el.find('.room-list > li').slice(3); //默认收起的房型元素集合
        this.$otasHide = $el.find('.ota-list > li').slice(3);  //默认收起的ota报价元素集合
        this.$otaResult = $el.find('.ota-result');  //ota结果根元素
        this.$fetchFailed = $el.find('.ota-failed'); //获取ota数据失败的页面
        this.$bookBtn = $el.find('.ota-bookbtn');  //预订按钮
        this.uid = $('#uid').html(); //酒店的uid
        this.isShowAllRoom = false; //是否展示了全部房型
        this.isShowAllOta = false;  //是否展示了全部的ota报价
        this.isShowOta = true;  //是否展示了ota报价
        //this.$targetRoom;  //当前点击的房型元素
        this.lastIndex = '0'; //上次点击的房型的索引
        this.currentIndex = '0';  //当前点击的房型的索引
        //this.sd;
        //this.ed; // 开始与结束时间
        broadcaster.subscribe(placeBroadcastName.DATEPICKER_DATE_CHANGE, $.proxy(this.onDatepickerDateChange, this));
        broadcaster.broadcast(placeBroadcastName.HOTELBOOK_OR_THIRDSRCOTA_SHOW);
    },
    onDatepickerDateChange: function (data) {
        if (data.sd !== this.sd || data.ed !== this.ed) {
            this.sd = data.sd;
            this.ed = data.ed;
            var param = {
                st: data.sd,
                et: data.ed,
                uid: this.uid
            };

            BigPipe.asyncLoad({id: 'place-pagelet-hotelbook'}, util.jsonToUrl(param));
        }

    },

    /**
     * 绑定事件
     */
    bindEvents: function () {
        this.bindRoomListEvents();

    },

    /**
     * 绑定房型部分的事件
     */
    bindRoomListEvents: function () {
        this.$showAllRoom.on('click', $.proxy(this.showAllRoom, this));
        this.$showAllOta.on('click', $.proxy(this.showAllOta, this));
        this.$rooms.on('click', $.proxy(this.fetchOtas, this));
        this.$bookBtn.on('click', $.proxy(this.goToBook, this));

    },

    /**
     * 解绑事件
     */
    unbindEvents: function () {
        this.unbindRoomListEvents();

    },

    /**
     * 解绑房型部分的事件
     */
    unbindRoomListEvents: function () {
        this.$showAllRoom.off('click', $.proxy(this.showAllRoom, this));
        this.$showAllOta.off('click', $.proxy(this.showAllOta, this));
        this.$rooms.off('click', $.proxy(this.fetchOtas, this));
        this.$bookBtn.off('click', $.proxy(this.goToBook, this));
    },

    /**
     * 显示所有房型
     * @param {event} [e] 事件对象
     */
    showAllRoom: function (e) {
        if (!this.isShowAllRoom) {
            this.$showAllRoom.find('span').eq(0).html('收起其他房型');
            this.isShowAllRoom = true;
        } else {
            if (this.lastIndex > 2) {
                this.$otaResult = this.$el.find('.ota-result'); //异步加载后重新获取ota结果根元素
                this.$otaResult.remove(); //如果当前展开的ota页面是四个或者第四个以后的房型，则删除ota页面
                //调整房型下拉箭头为水平
                this.$el.find('.arrow-icon-open').attr('class', 'arrow-icon');
                this.isShowOta = false; //设置为未展开ota
                this.isShowAllOta = false;  //设置为未展开所有ota
            }
            this.$showAllRoom.find('span').eq(0).html('查看其他房型');
            this.isShowAllRoom = false;
        }

        this.$roomsHide.toggle();
        this.$showAllRoom.toggleClass('show-all-room-open');

        e.stopPropagation();
        e.stopImmediatePropagation();
    },

    /**
     * 显示当前房型所有的ota报价
     * @param {event} [e] 事件对象
     */
    showAllOta: function (e) {
        if (!this.isShowAllOta) {
            this.$showAllOta.find('span').eq(0).html('收起其他报价');
            this.isShowAllOta = true;
        } else {
            this.$showAllOta.find('span').eq(0).html('展开其他报价');
            this.isShowAllOta = false;
        }

        this.$otasHide.toggle();
        this.$showAllOta.toggleClass('show-all-ota-open');

        e.stopPropagation();
        e.stopImmediatePropagation();
    },

    /**
     * 获取点击房型的ota报价信息
     * @param {event} [e] 事件对象
     */
    fetchOtas: function (e) {
        var $el = this.$el,
            action = _APP_HASH.action,
            roomtype = $(e.target).closest('li').find('span').eq(1).text(),
            otaPriceUrl,
            settings = {},
            fetching;

        if (action === 'detail') {
            //详情页报价区所有房型点击量PV/UV
            stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_ROOM_CLICK, {'name': this.poiname, 'type': roomtype});
        } else if (action === 'hotelbook') {
            //预订报价页所有房型点击量PV/UV
            stat.addStat(STAT_CODE.PLACE_HOTEL_BOOK_ROOM_CLICK, {'name': this.poiname, 'type': roomtype});
        }


        this.$targetRoom = $(e.target).closest('li');
        this.currentIndex = this.$targetRoom.attr('index');

        if (!this.isShowOta || this.currentIndex != this.lastIndex) {
            this.unbindEvents();

            this.$otaResult = $el.find('.ota-result'); //异步加载后重新获取ota结果根元素
            this.$otaResult.remove();  //移除ota页面
            this.$fetchFailed = $el.find('.ota-failed'); //获取ota数据失败的页面
            this.$fetchFailed.remove();

            //切换箭头样式为朝下
            this.$targetRoom.find('span').eq(0).attr('class', 'arrow-icon-open');

            //添加ota-fetching页面
            fetching = '<div class="ota-fetching">'
                + '<span></span>'
                + '<span>正在获取实时精准报价数据...</span>'
                + '</div>';
            this.$targetRoom.after(fetching);

            otaPriceUrl = this.$targetRoom.attr('ota_price_url');
            settings = {
                'type': 'POST',
                'url': this.serverAddr + 'fetchotas',
                'data': {
                    'uid': this.uid,
                    'otaPriceUrl': otaPriceUrl
                },
                'dataType': 'html'
            };
            this.fetchData(settings, $.proxy(this.doFetchOtaSuccess, this), $.proxy(this.doFetchOtaError, this));
            this.isShowOta = true;
            this.lastIndex = this.$targetRoom.attr('index');
        } else {
            this.$otaResult = $el.find('.ota-result'); //异步加载后重新获取ota结果根元素
            this.$otaResult.remove();
            this.$targetRoom.find('span').eq(0).attr('class', 'arrow-icon');
            this.isShowOta = false;
        }

        this.$bookBtn.off('click', this.goToBook);

        e.stopPropagation();
        e.stopImmediatePropagation();
    },

    /**
     * 通过发送ajax请求获取数据
     * @param {object} [settings] ajax参数
     * @param {function} dosuccess 请求成功后的回调函数
     * @param {function} doerror 请求失败后的回调函数
     */
    fetchData: function (settings, dosuccess, doerror) {
        $.ajax({
            type: settings.type,
            url: settings.url,
            data: settings.data,
            dataType: settings.dataType,
            success: function (data) {
                dosuccess(data);
            },
            error: function (xhr, type) {
                doerror(xhr, type);
            }
        });
    },

    /**
     * 请求ota报价数据成功后的处理函数
     * @param {string} data 请求成功后返回的html页面
     */
    doFetchOtaSuccess: function (data) {
        this.$targetRoom.next().remove(); //移除ota-fetching页面

        this.$showAllOta.off('click', $.proxy(this.showAllOta, this)); //异步加载后解绑“展开其他报价”事件

        this.$el.find('.arrow-icon-open').attr('class', 'arrow-icon');

        this.$targetRoom.after(data);
        //切换箭头样式为朝下
        this.$targetRoom.find('span').eq(0).attr('class', 'arrow-icon-open');

        this.$showAllOta = this.$el.find('.show-all-ota'); //异步加载后重新获取“展开其他报价”元素
        this.$otasHide = this.$el.find('.ota-list > li').slice(3); //异步加载后重新获取默认隐藏的ota报价
        this.$bookBtn = this.$el.find('.ota-bookbtn');  //异步加载后重新获取预订按钮元素

        this.bindEvents();
    },

    /**
     * 请求ota报价数据失败后的处理函数
     * @param {object} xhr XMLHttpresponse对象
     * @param {string} type 描述错误类型
     */
    doFetchOtaError: function (xhr, type) {
        this.bindEvents();
    },


    /**
     * 请求房型数据成功后的处理函数
     * @param {string} data 请求成功后返回的html页面
     */
    doFetchRoomSuccess: function (data) {
        var $el = this.$el;
        this.unbindRoomListEvents();//解除当前元素的事件绑定
        this.$hbMain.append(data); //追加请求回来的房型信息层
        //异步加载后重新获取元素
        this.$showAllRoom = $el.find('.show-all-room');  //查看其他房型层
        this.$showAllOta = $el.find('.show-all-ota');    //展开其他报价层
        this.$rooms = $el.find('.room-list > li'); //全部房型
        this.$roomsHide = $el.find('.room-list > li').slice(3); //默认收起的房型元素集合
        this.$otasHide = $el.find('.ota-list > li').slice(3);  //默认收起的ota报价元素集合
        this.$roomsWp = $el.find('.rooms'); //房型层

        this.$bookBtn = $el.find('.ota-bookbtn');  //异步加载后重新获取预订按钮元素

        this.$bookBtn.on('click', goToBook);  //异步加载后重新绑定跳转到第三方预订页面事件

        this.bindEvents(); //绑定当前元素的事件

        //重置标志
        this.isShowAllRoom = false;
        this.isShowOta = true;
        this.isShowAllOta = false;

    },

    /**
     * 请求房型数据失败后的处理函数
     */
    doFetchRoomError: function () {
        this.bindEvents();
    },

    /**
     * 跳转到第三方的预订页面
     * @param {event} e 事件对象
     */
    goToBook: function (e) {
        var $target = $(e.target),
            action = _APP_HASH.action,
            url = $target.data('url'),
            roomtype = $target.closest('li').find('span').eq(1).text(),
            otaname = $target.parent().find('.ota-name').text(),
            name,
            today = new Date().format('yyyy-MM-dd'),
            tomorrow = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd'),
            price = parseInt($target.data('price'), 10),
            bonus = parseInt($target.data('bonus'), 10) || 0,
            extraParams;

        if ($target.hasClass('ota-bookbtn-web')) {
            if (action === 'detail') {
                //详情页所有电脑预订方式的点击总量
                name = $('.place-widget-captain .name').text();
                stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_BOOKBTN_PC_CLICK, {'name': this.poiname, 'type': roomtype, 'ota': otaname});
            } else if (action === 'hotelbook') {
                //房型报价页所有电脑预订方式的点击总量
                stat.addStat(STAT_CODE.PLACE_HOTEL_BOOK_BOOKBTN_PC_CLICK, {'name': this.poiname, 'type': roomtype, 'ota': otaname});
            }

            popup.open({
                'text': '您好，此酒店报价需要在电脑端登陆：map.baidu.com，在酒店版块中进行搜索预订',
                'autoCloseTime': 3000
            });
        } else if ($target.hasClass('ota-bookbtn-tel')) {
            if (action === 'detail') {
                //详情页所有电话预订方式的点击总量
                stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_BOOKBTN_TEL_CLICK, {'name': this.poiname, 'type': roomtype, 'ota': otaname});
            } else if (action === 'hotelbook') {
                //房型报价页所有电话预订方式的点击总量
                stat.addStat(STAT_CODE.PLACE_HOTEL_BOOK_BOOKBTN_TEL_CLICK, {'name': this.poiname, 'type': roomtype, 'ota': otaname});
            }

            if (util.isAndroid()) {
                $target.attr('href', 'javascript:void(0)');
                util.TelBox.showTb($target.attr('phone'));
            }
        } else {
            extraParams = {
                from_page: action,
                checkin_date: (this.sd || today),
                checkout_date: (this.ed || tomorrow),
                c: geolocation.getCityCode(),
                price: price,
                book_price: price - bonus,
                simple: 1
            };
            window.open(url + '&' + util.jsonToQuery(extraParams), '_blank');
        }

        e.stopPropagation();
        e.stopImmediatePropagation();
    },

    /**
     * 切换日期后再次渲染页面
     * @param {string} sd 入住日期
     * @param {string} ed 退房日期
     */
    refreshPage: function (sd, ed) {
        this.$roomsWp.remove(); //移除当前的房型信息层

        this.isShowOta = true;
        this.isShowAllRoom = false;
        this.isShowAllOta = false;

        var settings = {
            'type': 'POST',
            'url': this.serverAddr + 'fetchrooms',
            'data': {
                'uid': this.uid,
                'st': this.sd,
                'et': this.ed
            },
            'dataType': 'html'
        };

        this.fetchData(settings, $.proxy(this.doFetchRoomSuccess, this), $.proxy(this.doFetchRoomError, this));
    },


    init: function () {
        var action = _APP_HASH.action;

        this.create();

        if (action === 'detail') {
            this.poiname = $('.place-widget-captain .name').text();
        } else if (action === 'hotelbook') {
            this.poiname = $('.place-widget-hotel-info p').eq(0).text();
        }
        if (action === 'detail') {
            //酒店有预订功能的详情页展示PV/UV
            stat.addStat(STAT_CODE.PLACE_HOTEL_BOOKABLE_DETAIL_VIEW, {'name': this.poiname});
        }
        this.bindEvents();
    }
};

});
;define('place:widget/icomment/icomment.js', function(require, exports, module){


var login = require("common:widget/login/login.js"),
    popup = require("common:widget/popup/popup.js"),
    stat = require('common:widget/stat/stat.js');

module.exports = {
    msg: {
        netError: '发送失败请检查网络连接后重试',
        nocontentError: '评论内容不能为空'
    },
    $form: $( '#J_addComment' ),
    $scores: $( '#J_impression li' ),
    init: function() {
        this.$scores.on( 'click', $.proxy( this.switchScores, this ) );
        $( '#J_submitComment').on( 'click', $.proxy( this.submitComment, this ) );
    },
    switchScores: function( e ) {
        var $score;

        if ( $score = $( e.target ).closest( 'li' )) {
            this.$scores.removeClass( 'active' );
            $score.addClass( 'active' );
        }
    },
    submitComment: function() {
        var me = this,
            content = me._getContent(),
            score = me._getScore(),
            msg = me.msg;

        // 提交评论按钮点击总量
        stat.addStat(STAT_CODE.PLACE_COMMENT_ICOMMENT_SUBMITCLICK);

        //提交评论前验证是否存在cookie
        login.checkLogin(function(data){
            if(!data.status){
                login.loginAction();
            }else{
                if( !score || !content){
                    me.showMessage( msg['nocontentError'] );
                } else {
                    $.ajax({
                        type : 'post',
                        url : '/mobile/webapp/place/icomment/force=simple',
                        data : {
                            uid: me.$form.data('uid'),
                            content: content,
                            score: score
                        },
                        dataType: 'json',
                        success: function( ret ){
                            me._addCommentSuccess( ret );
                        },
                        error: function(){
                            me.showMessage( msg['netError'] );
                        }
                    });
                }
            }
        });

    },
    _getScore:function() {
        return this.$form.find( '.active' ).attr( 'value' )
    },
    _getContent: function(){
        return $('#J_commentContent').val();
    },

    _addCommentSuccess: function( ret ){
        var me = this;

        if ( parseInt( ret.status ) === 0 ) {
            // 提交评论成功总量
            stat.addStat(STAT_CODE.PLACE_COMMENT_ICOMMENT_SUBMITSUCCESS);

            me.showMessage( ret.msg );
            setTimeout(function() {
                location.href = me.$form.data( 'url' );
            }, 2000)
        } else {
            me.showMessage( ret.msg );
        }
    },

    showMessage: function( msg, delayTime ) {
        popup.open({
            text: msg,
            autoCloseTime: delayTime || 2000
        });
    }
}

});
;define('place:widget/listtool/listtool.js', function(require, exports, module){

/**
 * @file 列表工具条
 */
 
var bindBtn = (function(){
	var listTool = $(".place-widget-listtool");
	var btn = listTool.find(".select-btn");
	btn.on("click",function(){
		var stat = stat = require('common:widget/stat/stat.js'),
			wd = $('.common-widget-nav .title span').text();

		!$(this).hasClass('up') &&
			(stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_CLICK, {'wd': wd}))

		$(this).toggleClass("up");
		listTool.toggleClass("hide-extend");
	});
})();


exports = bindBtn;

});
;define('place:widget/movielist/movielist.js', function(require, exports, module){

/**
 * @file place列表页处理逻辑
 */

var url = require("common:widget/url/url.js");
var util = require("common:static/js/util.js");
var $showAllBtn = $("#place-widget-movielist-showall");
var $poiList = $(".place-widget-movielist");
var stat = require('common:widget/stat/stat.js');

var wd = $('.common-widget-nav .title span').text();
var _cacheData;

var bindShowAll = function () {
	$showAllBtn.on("click",showAll);
}

var bindPageBtn = function(){
	$pageNav = $(".place-widget-movielist .page-btn");
	$.each($pageNav, function (index,item) {
		var $dom = $(item);
		$dom.on("click", function(evt){
            var btn = $(evt.target),
                type = btn.data("type"),
                href = btn.data("href");

            // 添加“上一页”“下一页”的点击量统计 by cdq
            stat.addCookieStat(STAT_CODE.PLACE_LIST_PAGE_CHANGE, {'wd': wd,type:type});

			if(!btn.hasClass("unclick")) {
				href = "http://" + location.host + href;
				window.location.replace(href);
			}
		});
	})
}

/**
 * 显示所有
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
var showAll = function (evt) {
	var $poiList = $(".place-widget-movielist .place-list"),
		$pageNav = $(".place-widget-movielist .pagenav");

	$showAllBtn.hide();
	$poiList.removeClass("acc-list");
	$pageNav.show();

	// 添加强展现量统计  by cdq
	stat.addStat(STAT_CODE.PLACE_MAINRES_OPEN);
}

var bindList = function () {
	$poiList.on("click", "li", function(evt){
		var $item = $(this),
			url = $item.data("href"),
            name = $item.find('.rl_li_title').text(),
            isGen = _cacheData && _cacheData["isGenRequest"],
            target = evt.target;
            
        // 过滤路线按钮，防止重复触发
        if(target.tagName.toLowerCase() === "a") {
        	return;
        }
        isGen = isGen == 1 ? 1 : 0;
        stat.addCookieStat(STAT_CODE.PLACE_LIST_CLICK, {'wd': wd, 'name': name, 'is_gen' : isGen}, function(){
            location.href = "http://" + window.location.host + url;
        });
    });
}

var saveData = function ( data ) {
	_cacheData = data;
}

var bind = function () {
	bindShowAll();
	bindPageBtn();
	bindList();
}


var init = function ( data ) {
	saveData(data);
	bind();
}

module.exports.init = init;

});
;define('place:widget/movienews/movienews.js', function(require, exports, module){

require("place:static/lib/template.js");
var util = require('common:static/js/util.js');
var stat = require('common:widget/stat/stat.js');
var iScroll = require('common:static/js/iscroll.js');

var DETAILTPL = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="cover">    <div id="cover-wrapper" class="cover-wrapper">        <div id="cover-scroller" class="cover-scroller">            ');for(var j = 0, len = imgs.length; j < len ; j++){_template_fun_array.push('            <img class="cover-pic needsclick" width="69" height="84" data-id="',typeof(imgs[j].id) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].id),'" data-date="',typeof(imgs[j].day) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].day),'" src="http://map.baidu.com/maps/services/thumbnails?width=96&height=128&quality=100&src=',typeof(imgs[j].url) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].url),'" style="display:',typeof(imgs[j].visible) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].visible),'" alt="',typeof(imgs[j].title) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].title),'">            ');if(imgs[j].newm){_template_fun_array.push('            <span class="new_icon" style="display:',typeof(imgs[j].labelvis) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].labelvis),'"></span>            ');}_template_fun_array.push('            ');}_template_fun_array.push('        </div>    </div></div><p class="info-tip"><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwODxAPDgwTExQUExMcGxsbHCAgICAgICAgICD/2wBDAQcHBw0MDRgQEBgaFREVGiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCABZANADAREAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAEEAwUGAgj/xABHEAABAwIDAwUKCQsFAAAAAAABAAIDBBEFEiETIjEGFEFRcRUWMlJhgZPR0tMjQlRVkZKUo8EkQ0RTYnKDocPh4zNksbKz/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAiEQEAAwACAQQDAQAAAAAAAAAAAQIRAyESBDFBUSIyYUL/2gAMAwEAAhEDEQA/APqlAQFAQEBAQEBAQEBQEBAQEBUEBAQEBAQEBAVBAUBAQEBAQEBQEBAQEBAQEBAQEBUEBAQEBAQEBAQEBAQFAQEBBF1AQEBAQQ5wa0ucbNGpJ6kHOycp6momhgpKbKysfsoahzxnAP53ZWNwG71r9tl5OP1tL8nhGu88ExGy6RexwEBAQFQQEBAQEBAQEBAUBAQQoKkmKUUcj43POeM2cAx51tfoB6ChjLSVdNVw7aneJI7kXHWOIIOoKDMgICAgwV1DTV1M6mqWl8L/AAmgube3laQVMWFCl73qCaQQubzhu5K8l0sg/ZLjmI7FinHWv6xi2tM+7ZxSxzRiSJ2ZjuDgujL2gm6AqCAgKggICAgICAoCCFBr8bk2dKx5zFolZnYxxY5wOlgQQfKiw1nPaR36LP55n+2itXiDny1VOaKmkp2RTZ6wFhk27Mvghxdp2orYUtTSOY7Z4QYBmN2vBbc9dvxRGXbQ/N0Z7c/sFA20XzbF957tA20fRhzPNtfdoG3Z83/+vsoG2Z83n731INTiLKmqh2WH0EmHStma6ScQZ9o0HeGvjdaK2kM8ZjB7kuj47rmPB4+QdPFEe4ntdWUuWlFMRKPhLPF907uo6UHQoyIJVBAQFQQEBAQFAQQoCCli9xRFzfDD48js2XKS8DNezuF+pFhS5ti/TV/fN9yqMZpMezkjEGhhtlbnGnXrskGF9Bj8lO+KorjI64dG+GSNti0hzb5otd4IrXw4tygpdmzF5Zr6MklijYxjSfjF2V7C3y3XCvJyeWTXI+25rXOpbrJiv62f0lP7C79uaNnix/PS+lg90p2pscV+USD+NF7lO0QYsVH6UfPOz8IFRXbT44HvMuJMLCfg27S1h5fgtVFI469rLT10bn63cJS3p002fUgyUjQcRpWmobObuflbJmtlYd4jKPGQdAoyKgglUEBUEBAQFAQQVAQFBUxYE4ZVWbnOydZhbnvp4ut+xFaLm+B+M77GPdK9Kwmj5OmZxM8u0s3NGKYaDW27stLp0PNDR8mwx4p5ppwHnOTTbSzvFvstOxOha5rg3izfYh7lOhHNcH8Sf7H/AIk6E80wvojmPbRf41OhPM8N/Uznsox+MavQjmeH9EFX9ljH9JToUKel5PPlnNPFWPkD7T/B8Ha6eBp5k6VdoqXD2wDm1LVuiu626OOY5uLR8a6qNjhUcorJHCKaGBsYAE2XeeXG9ra7oH81EbdARBUEEqggKggICgIIUBAUVSxHFqHD2B1TJZzvAiaM0jv3WDUoKDeV2Gk2EVT6JyLio/Hac18s4hnMb442i0Zvdhff/sEMV8AxZlAysE8FQdtUOmjyxk7ruv6EG076qP5NV+hPrUww76aT5LV+i/umGK0/LnC4H7N8FSJNNzIL3dwHHiehTY3PlfGVnvlb8hqfqt9a1iYd8v8AsKj6G+tMMaahramlqq2V1DIWVM20ZqBYXJ1+lMFug5Rc0pGwyUr84Lyd5tt55d09qYYynlhEONOG/vStHrQxs8JxqkxKN2yOWeO22gJBc2/DUaEHoIRGxQEQVEqggKggICgIIUBQaHGsenilloqFuSojy7SplZI6NubWzcjXZnZfMEac+6KOR+1qeazzkWdPM2oLz57Cw8g0VVLXUMJaM1DHmNmi02p6hdqCy2oh/WUvopT/AEymo9CdnRJT28kMvuVdEtlgvvCJ3ZDN7hNHq9OeEIPZBN7hNFWnw2iiOkE8jM20ET453sz+NYxC57brjHDTy8s/JvznM+F0hlt2i18tM8/8sC66w873yPL2UfrsmjG6lD+NM77Cz8SmjycPB8GCQHo/IIPxcminQthr2Okoqh1Qxjix7oqKkIDhxHhJqrTaCvjmjnikqo5ojdrmUlM246Wuyvbdp6QiOlwjEpqtskdTCaeqhtnYbWc13gvbYusDY6HgojYoCqAQSqCAqCgIIKgICitfNhJdUyzxVcsJmIc9jRGW3DQ347HHgOtB47mVvRiMno4fZUHG4hFX18sM9ZIyY4fUSPo3mMbrmPMYdo4XuBquc2VeocUxyonqI3VrRsshBELdc9/L5FuvaNjROxOeoljmr9nG1rDHJs4xmJJzDW/CwVF8YfVu4Yo49kcXqUHvuTV9OIy+ZkPsFBPcd/TX1P3Q/ppodxj8vqvrR+wgxuwyFvhYlUD+JH7KGqFfTkOi5riVRYX2ozMPRpqWdaprTzz4q3EHU8dfUFojY8asvdznA/E/ZWbTgxUVLV0UkMUE8lPTzVLNs2MRNBMrwHO3WcTfisxZXX9xmnUV1SfLnb7K3AzUeGR0s759tLNI9ojJlcDZrSSLWA6XLSLyAqgglUEBUEBMBTBhqZ208Jle17mttpG1z3am3gtuUwabE+U1RT0e1o8Kq6qpe7LDTmN0eYDwiXWdk0BtmGq5zM/RrlsQ5R8qqWpEmH4fiBgmMjZIZ6cucHPawsscxF2uu3xbLy8dLU33nZdOXk8s6zIe3cpuUTGPifgdacmjnwBzmiS+8bFrcwbfj09CvHWaVyIlztebLtBQ18OF0wmppZHujDpQ1tzmdvO07SukxP0TLkajvtqMWbsMHqxDC8S5WsMTniMnZ5tpoP8AV61i1bT0OojrsaELRJg1a+czbNx2Ya0N0u86k2trp2LXBW9a5b3avMTLZOFQ3LakqHZgHC0R6evqPkXfGVoYfiFgdm4X1tcX8+qviJFBiN7ZHfW/uniPQwzEHXu0+d3908REuF1cTS7JmDfF1P0cVJglpcQr8QghJo8Lq6uo+IzZPay4IFnEi+t+IXO3l1kdClyXouUUhrJMSpJ4pdps4hLq4xh73DXpAz2BU/KVXsbp8Qiw2aSOknlkZZ7WxN3rxkP0+qszE/RuJ5PY3ytLxFX4NUU7Do3daWcLkmxu29lj0/Dak5/j4/jpfki0f11NBXy1TiHUksDR8aUZf5GxXsxzXrJiFlcBMEq4CYCoICAgICAgICAgICAgICAgICAgICAgICAgIP/Z" /><br>暂无当日排期...</p><div class="info ');if(!book){_template_fun_array.push('info-unbook');}_template_fun_array.push('">    ');if(book){_template_fun_array.push('    <div class="list_opt">        <button id="btnMovieBookMore" class="btn-more">查看更多影讯&nbsp;></button>        <button id="btnMovieBookClose" class="btn-close">收起</button>    </div>    ');}_template_fun_array.push('</div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var TABSTPL = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="tab"><div id="tab_wrapper" class="tab_wrapper"><ul class="calendar_tab">    ');for(var i = 0, len = days.length; i < len ; i++){_template_fun_array.push('    <li data-date="',typeof(days[i].date) === 'undefined'?'':baidu.template._encodeHTML(days[i].date),'" data-text="',typeof(days[i].text) === 'undefined'?'':baidu.template._encodeHTML(days[i].text),'" ');if(i == 0){_template_fun_array.push('class="current"');}_template_fun_array.push('>',typeof(days[i].text) === 'undefined'?'':baidu.template._encodeHTML(days[i].text),'</li>    ');}_template_fun_array.push('</ul></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var INFOTPL = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<dl>    <dt><em class="tit">',typeof(name) === 'undefined'?'':baidu.template._encodeHTML(name),'</em> ');if(parseInt(score)>0){_template_fun_array.push('<em class="sco"> ',typeof(score) === 'undefined'?'':baidu.template._encodeHTML(score),'</em>');}_template_fun_array.push('<em data-id="',typeof(id) === 'undefined'?'':baidu.template._encodeHTML(id),'" class="movieDes des">影片简介&gt;&gt;</em></dt>    <dd>        ',typeof(times) === 'undefined'?'':baidu.template._encodeHTML(times),'    </dd></dl>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var TIMETPL =  [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<ul>');for(var j = 0, len = schedules.length; j < len ; j++){_template_fun_array.push('<li><span class="meta"><em class="time">',typeof(schedules[j].time) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].time),'</em>',typeof(schedules[j].type) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].type),'</span><span class="meta-extend">');if(schedules[j].url){_template_fun_array.push('<a class="btn-exchange" href="',typeof(schedules[j].url) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].url),'">兑换码</a>');}_template_fun_array.push('');if(schedules[j].seatL){_template_fun_array.push('<a class="btn-book ',typeof(schedules[j].style) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].style),'" data-day="',typeof(schedules[j].day) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].day),'" data-num="',typeof(schedules[j].num) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].num),'" data-cinema="',typeof(schedules[j].cinema) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].cinema),'" data-movie="',typeof(schedules[j].movie) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].movie),'" data-info="',typeof(schedules[j].info) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].info),'" data-orign="',typeof(schedules[j].orign) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].orign),'">选座订票</a>');}_template_fun_array.push('',typeof(schedules[j].price) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].price),'</span></li>');}_template_fun_array.push('</ul>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var POPUPTPL =  [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="moviebook-popup-wrapper"><div class="moviebook-popup"><div class="header">',typeof(title) === 'undefined'?'':baidu.template._encodeHTML(title),'院线购票手机验证<a href="javascript:void(0);" id="valid-btn-close" class="btn-close"></a></div><div class="content"><p><label>手机号:&nbsp;</label><input id="valid-phone" autocomplete="false" type="tel"><span class="tip"></span></p><p><label>验证码:&nbsp;</label><input id="valid-number" autocomplete="false" type="text"><img src=""><span class="tip"></span></p><p><button id="valid-btn-submit" class="submit-btn" type="button">提交</button></p></div></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var DESPOPUPTPL =  [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="moviebook-popup-wrapper"><div class="moviedes_popup"><div class="header">',typeof(name) === 'undefined'?'':baidu.template._encodeHTML(name),'');if(parseInt(score)>0){_template_fun_array.push('<span class="sco"> ',typeof(score) === 'undefined'?'':baidu.template._encodeHTML(score),'</span>');}_template_fun_array.push('<a href="javascript:void(0);" id="des-btn-close" class="btn_close"> X </a></div><div class="content" style="text-align:left;"><style>table.des td{vertical-align: top;}</style><table class="des"><tr><td width="45"><span class="name">版本</span>:</td><td><span>',typeof(type || "暂无") === 'undefined'?'':baidu.template._encodeHTML(type || "暂无"),'</span></td></tr><tr><td><span class="name">片长</span>:</td><td><span>',typeof(duration || "暂无") === 'undefined'?'':baidu.template._encodeHTML(duration || "暂无"),'</span></td></tr><tr><td><span class="name">上映</span>:</td><td><span>',typeof(release || "暂无") === 'undefined'?'':baidu.template._encodeHTML(release || "暂无"),'</span></td></tr> <tr><td><span class="name">地区</span>:</td><td><span>',typeof(nation || "暂无") === 'undefined'?'':baidu.template._encodeHTML(nation || "暂无"),'</span></td></tr><tr><td><span class="name">导演</span>:</td><td><span>',typeof(director || "暂无") === 'undefined'?'':baidu.template._encodeHTML(director || "暂无"),'</span></td></tr><tr><td><span class="name">主演</span>: </td><td><span>',typeof(players || "暂无") === 'undefined'?'':baidu.template._encodeHTML(players || "暂无"),'</span></td></tr><tr><td colspan="2"><span class="name">简介</span>: <p style="padding:6px 0 0;">',typeof(des || "暂无") === 'undefined'?'':baidu.template._encodeHTML(des || "暂无"),'</p></td></tr></table></div></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

function getOrientation() {
    var ornttn = window.outerWidth > 0 ?
        (window.outerWidth > window.outerHeight ? 90 : 0) :
        (document.body.offsetWidth > document.body.offsetHeight ? 90 : 0);

    return ornttn;
}
function formatDate(objDate){
    return objDate.getFullYear() + '-' + (objDate.getMonth() < 9 ? '0' + (objDate.getMonth() + 1) : objDate.getMonth() + 1) + '-' + (objDate.getDate() < 10 ? '0' + objDate.getDate() : objDate.getDate());
}
function formateDateText(objDate, objDateNow){
    var arrDaysText = ['周日','周一','周二','周三','周四','周五','周六'];

    if(!objDate || !(objDate instanceof Date)){
        return '';
    }

    if( (objDate - objDateNow) == 0){
        return '今天';
    }
    else if( (objDate - objDateNow) == 86400000){
        return '明天';
    }
    else{
        return arrDaysText[objDate.getDay()];
    }
}
function Schedules(now, uid){
    /*var date = new Date(now.split('-')[0], parseInt(now.split('-')[1], 10) - 1, now.split('-')[2], '00', '00', '00');        */
    var eventHandler = {
        ".btn-more": this.showMore,
        ".btn-close": this.showSpecific,
        ".btn-book": this.bookMovie,
        ".calendar_tab li": this.switchTab,
        ".cover-pic": this.showMovieInfo,
        ".movieDes": this.showDesPopup
    };

    this.elePlaceMovie = $('div.place-widget-movienews');         

    this.now = now;
    this.uid = uid;
    /*this.days = {};
    
    this.days[ formatDate(date) ] = 0;
    this.days[ date.setDate(date.getDate()+1) && formatDate(date) ] = 1;
    this.days[ date.setDate(date.getDate()+1) && formatDate(date) ] = 2;*/

    //初始化事件处理
    for(var selector in eventHandler){
        this.elePlaceMovie.delegate(selector, "click", $.proxy(eventHandler[selector], this));
    }
}

Schedules.prototype.renderFailInfo = function(){
    this.elePlaceMovie.find('.movienews-loading').text('暂无影讯数据！');
};
Schedules.prototype.renderMovieNews = function(obj){
    var me = this,
         arrMovies = ( $.isArray(obj.base) && obj.base.length > 0 ) ? obj.base :  [],
        arrMovieTimes = ( $.isArray(obj.time_table) && obj.base.length > 0 ) ? obj.time_table :  [],
        data = {
            date: {},
            imgs: [],
            book: obj.webview_style == 2 ? false : true,
            days: []
        };                        
        wrapperWidth = 0,
        date = new Date(),
        now = obj.now_time || date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()),
        contentTpl = '',tabsTpl = '',days={}; 

    this.orign = arrMovieTimes[0][0].src_info[0].src;
    me.arrMovies = arrMovies;
    me.lastOrientation = lastOrientation = -1;
    //组装电影票来源
    /*var orignArr = [];
    for(var i = 0,len = arrMovieTimes.length; i < len; i++){
        for(var j = 0,len2 = arrMovieTimes[i].length; j< len2;j++){

            var item = arrMovieTimes[i][j].src_info[0].src;
            if (orignArr.indexOf(item) === -1) {
                orignArr.push(item);
            }
        }
    }
    this.orign = orignArr.join("_");*/
    //天数
    $.each(arrMovieTimes, function(index, item){
        var objDate = new Date(item[0].date.split('-')[0], parseInt(item[0].date.split('-')[1], 10) - 1, item[0].date.split('-')[2], '00', '00', '00'),
            objText = item[0].date.replace(/-/g, '.').replace(/^[0-9]*./g, '');

        days[ formatDate(objDate) ] = index;
        data.days[index] = {
            text: objText + ' ' + formateDateText(objDate, new Date(now.split('-')[0], parseInt(now.split('-')[1], 10) - 1, now.split('-')[2], '00', '00', '00')),
            date: item[0].date,
            obj: objDate
        };
    });
    this.days = days;
    //创建封面基础信息
    function generatorCover(objs){            
        var arr = [], obj = {};

        $.each(objs, function(index, item){
            var data = {
                    'url': item.movie_picture || '', 
                    'id': item.movie_id || '',
                    'title': item.movie_name || '',
                    'day': '',
                    'newm': false
                }, 
                properties = [];

            $.each(arrMovieTimes, function(_index, _item){
                var i = 0;

                while(i < _item.length){
                    if(item.movie_id == _item[i].movie_id){
                        data['day'] += ('d' + _index);
                        data['newm'] = ((new Date().getTime() - new Date(item.movie_release_date).getTime())<3*24*3600*1000)
                        break;
                    }

                    i++;
                }
            });                 
            data['visible'] = data['day'].match(/0/) ? 'block' : 'none';
            data['labelvis'] = data['visible'] =='block'? 'inline-block' : 'none';
            arr.push(data);
        });

        return arr;
    }
    //创建影片基础信息
    function generatorInfo(id, day){
        var data = {},
            times = [],
            scheduleList = [];
            //myDate = new Date(me.now.split('-')[0], parseInt(me.now.split('-')[1], 10) - 1, me.now.split('-')[2], '00', '00', '00'),
            //day = myDate.setDate(myDate.getDate()+day) && myDate.getFullYear() + '-' + (myDate.getMonth() < 9 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1) + '-' + (myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate());

        //查找指定ID影片
        $.each(arrMovies, function(index, item){
            if(item.movie_id == id)
                data = item;
        });
        data && (data = {
            'name': data.movie_name || '', 
            'id': data.movie_id || '',
            'duration': (data.movie_length && data.movie_length.toString().replace('分钟', '') + '分钟') || '',
            'category': (data.movie_nation ? data.movie_nation + '&nbsp;&nbsp;' : '') +  (data.movie_type || ''),
            'director': data.movie_director || '',
            'players': data.movie_starring || '',
            'score': data.movie_score || "",
            'des': data.movie_description || "",
            'pic': data.movie_picture || "",
            'release': data.movie_release_date || ""
        });
        //查找某天影讯
        $.each(arrMovieTimes, function(index, item){
            if(item[0].date == day)
                times = item;
        });

        if(!$.isArray(times))return;
        $.each(times, function (index, item) {                
            if(data.id != item.movie_id)
                return;

            var subData = {
                day: item.date,
                seatL: true,
                time: item.time || '', 
                type: ( item.lan || item.src_info[0].lan || '') + '/' + ( item.type || item.src_info[0].type || ''), 
                price: item.src_info[0].price || item.origin_price || '&nbsp;&nbsp;-',
                style: item.src_info[0].seq_no ? '' : 'unbook',
                num: item.src_info[0].seq_no,
                orign: item.src_info[0].src,
                cinema: item.src_info[0].cinema_id,
                theater: item.src_info[0].theater,
                movie: item.src_info[0].movie_id,
                name: item.src_info[0].movie_name || data.name,
                info: '{\'lan\':\'' + item.src_info[0].lan + '\',\'time\': \'' + item.time + '\',\'price\': \'' + item.src_info[0].price + '\',\'name\': \'' + data.name + '\'}'
            };
            if(item.src_info[0].aid){
                subData.url = me.createCodeUrl(subData,data);
                subData.seatL = false;
            }
            if(subData.price.toString().indexOf('-') == -1){     
                subData.price = [' ',' ',' '].slice(0, 3 - subData.price.toString().length).join('') + '￥' + subData.price;
            }

            scheduleList.push(subData);
        });
        
        data['times'] = TIMETPL({schedules: scheduleList});
        data['date'] = day;
        data['from'] = times[0].src_info[0].src;
        
        return INFOTPL(data)
            .replace(/&amp;/g,'&')
            .replace(/&lt;/g,'<')
            .replace(/&gt;/g,'>')
            .replace(/&#92;/g,'\\')
            .replace(/&quot;/g,'"')
            .replace(/&#39;/g,'\'');
    }
    function switchMovieInfo(id, index){
        var infoEle = me.eleInfo.length ? me.eleInfo : me.elePlaceMovie.find('.info'),
            closeBtn = $('#btnMovieBookClose');
        var day = me.elePlaceMovie.find('.calendar_tab li.current').attr("data-date"), domId = '#info_' + id + '_' + day, tpl;

        closeBtn.length && closeBtn[0].click();

        if($(domId).css('display') == 'block')
            return;
        if($(domId).length == 0){
            tpl = generatorInfo(id, day);
            $(tpl).prependTo(infoEle).attr('id', domId.substr(1));                
        }

        infoEle.children()
            .hide()
            .filter(domId)
            .attr('style', function(){  
                if(data['book'] && $(this).find('li').length > 7){
                    infoEle.find('.list-opt').data('id', domId).show();
                    $('#btnMovieBookMore').show();      
                    $('#btnMovieBookClose').hide();                  
                }
                    
                return 'display: block';
            });            
    }

    //构造影讯内容
    data['imgs'] = generatorCover(arrMovies);

    contentTpl = DETAILTPL(data);
    tbsTpl = TABSTPL(data);
    me.elePlaceMovie
        .find('.movienews-content')
        .append(tbsTpl)
        .append(contentTpl)
        .show()
        .removeClass('movienews-empty')
        .next()
        .remove();           

    me.eleCover = this.elePlaceMovie.find('.cover'); 
    me.eleInfo = me.elePlaceMovie.find('.info');
    me.eleInfotip = me.elePlaceMovie.find('.info-tip');    

    if(arrMovieTimes.length > 3 && $('.tab_wrapper').width() < 75*arrMovieTimes.length + 8){
         $('.tab_wrapper')
            .addClass('slide')
            .find('.calendar_tab')
            .width(75*arrMovieTimes.length + 8);

        me.tabScroll = new iScroll('tab_wrapper', {
            momentum: false,
            hScroll: true,
            hScrollbar: false,
            vScrollbar: false,
            vScroll: false,
            lockDirection: true,
            handleClick: false
        });
    }

    me.elePlaceMovie.find('.cover-scroller').css({'display':"block"});
    me.coverScroll = new iScroll('cover-wrapper', {
        snap: true,
        momentum: false,
        hScrollbar: false,
        vScrollbar: false,
        vScroll: false,
        lockDirection: true,
        onScrollEnd: function (e) {
            var eleImgs = me.eleCover.find("img[style='display:block']"),
                ele = eleImgs.eq(me.coverScroll.currPageX);
            var id = ele.data('id');

            if(eleImgs.length == 0){
                me.elePlaceMovie.addClass('movienews-empty');
                return false;
            }
                
            switchMovieInfo(id, me.coverScroll.currPageX);
        }
    });

    //当今天TAB选项下无影讯时的处理
    if($('div.cover').find("img[style='display:block']").length)          
        this.updateLayout(0);
    else{
        this.elePlaceMovie.toggleClass('movienews-empty', true);
    }
}          

Schedules.prototype.updateLayout = function(currentIndex) {            
    var wrapperWidth = $('div.cover').width(),me=this,
        eleTab = $('.tab_wrapper'),
        days = eleTab.find('li').length,
        count = $('div.cover').find("img[style='display:block']").length,
        itemWidth = 69,lastOrientation = me.lastOrientation;
                 
    window.orientation = getOrientation();
    //if(window.orientation != lastOrientation) {
        $('#cover-wrapper').css({
            'overflow': 'visible',
            'width': itemWidth + 10,
            'right': (wrapperWidth*3/4 - itemWidth/2 - 10)
        });
        $('#cover-scroller').css('width', (itemWidth + 10) * count);
        
        this.coverScroll.refresh();

        if(typeof currentIndex != 'undefined' && currentIndex > -1){
            this.coverScroll.scrollToPage(currentIndex, 0, 0);        
        }
    //}
    //ios6获取方向属性有延迟
    window.setTimeout(function(){
        window.orientation = getOrientation();
        
        //重置TAB滚动
        if(eleTab.width() < 75*days + 8){
            if(me.tabScroll){
                //me.tabScroll.refresh();
            }else{
                eleTab
                    .addClass('slide')
                    .find('.calendar_tab')
                    .width(75*days + 8);

                me.tabScroll = new iScroll('tab_wrapper', {
                    momentum: false,
                    hScroll: true,
                    hScrollbar: false,
                    vScrollbar: false,
                    vScroll: false,
                    lockDirection: true,
                    handleClick: false
                });
            }

            (window.orientation != lastOrientation) && me.tabScroll.scrollToPage(eleTab.find('.current').index(), 0, 0);
        }
        else{
            if(me.tabScroll){
                eleTab.removeClass('slide').find('.calendar_tab').width('auto');
                me.tabScroll.destroy();
                delete me.tabScroll;
            }
        }

        if(window.orientation != lastOrientation){
          me.lastOrientation = window.orientation;
        }
    }, 100);
}
Schedules.prototype.switchTab = function(event){
    var ele = $(event.target),
            elesImg = [],
            index = ele.index(),
            indexState = index === 0 ? true : false,
            infoState;

    if(ele.hasClass('current'))
        return false;

    stat.addStat(STAT_CODE.PLACE_MOVIE_TAB_CLICK, {day: index});
    
    ele.addClass('current')
        .siblings()
        .removeClass('current');

    if(!this.eleCover || !this.eleCover.length){
        return;
    }

    this.eleCover.find("img").each(function(i, item){                                                
        var ele = $(item);
        var day = ele.data('date'),
            isShow = true;
        
        if(day.indexOf('d' + index) != -1){
            ele.attr('style', 'display:block');
            if(ele.next().hasClass("new_icon")){ele.next().show();}
        }else{
            ele.attr('style', 'display:none');
            if(ele.next().hasClass("new_icon")){ele.next().hide();}
            isShow = false;
        }

        isShow && elesImg.push(ele);
    });
    
    infoState = elesImg.length == 0 ? true : false;
    this.elePlaceMovie.toggleClass('movienews-empty', infoState);
    if(!infoState){
        this.updateLayout(0);
    }
}
Schedules.prototype.showDesPopup = function(event) {
    var id =$(event.target).attr("data-id"),
            arrMovies = this.arrMovies,star,data,desStr,
            elePopup = $('.moviebook-popup-wrapper');
        $.each(arrMovies, function(index, item){
            if(item.movie_id == id)
                data = item;
        });
        if(data.movie_starring){
            star = data.movie_starring.split("/").slice(0,4).join("、");
        }
        if(data.movie_description.length>180){
            desStr = data.movie_description.slice(0,180)+"...";
        }else{
            desStr = data.movie_description;
        }
        data = {
            'name': data.movie_name || '', 
            'id': data.movie_id || '',
            'duration': (data.movie_length && data.movie_length.toString().replace('分钟', '') + '分钟') || '',
            'nation': data.movie_nation,
            'type' : data.movie_type,
            'director': data.movie_director || '',
            'players': star,
            'score' : data.movie_score,
            'des' : desStr,
            'release' : data.movie_release_date
        };
        popupHtml = DESPOPUPTPL(data);
        $(popupHtml)
            .prependTo("#wrapper")
            .show()
            .children()
            .first()
            .css('top', window.scrollY + $(window).height()/3 );
        
    if($('body').height() < window.screen.height)
        elePopup.height(window.screen.height)
    $('#des-btn-close').click($.proxy(this.closePopup,this));
}
Schedules.prototype.showMovieInfo = function(event) {
    var me = this,
        ele = $(event.target), 
        eleCover = me.elePlaceMovie.find('.cover');
    var index = -1;

    eleCover.find("img[style='display:block']").each(function(i, item){                
        if(ele.data('id') == $(item).data('id'))
            index = i;
    });
    
    if(index > -1 && index != me.coverScroll.currPageX){
        stat.addStat(STAT_CODE.PLACE_MOVIE_PIC_CLICK);

        window.setTimeout(function(){
            me.coverScroll.scrollToPage(index, 0);
        }, 0);
    }
}
Schedules.prototype.showMore = function(event) {
    var relID = $(event.target).parent().data('id'), 
        relEle = $(relID),
        relListEle = relEle.find('ul'),
        count = relListEle.children().length,
        listHeight = relListEle.height();

    if(count > 7 && count < 15){
        relListEle.css('max-height', 'none');
        $('#btnMovieBookMore').hide();
        $('#btnMovieBookClose').show();
    }
    else{
        listHeight = listHeight + 386;
        if(listHeight > count*56){
            relListEle.css('max-height', count*56 + 'px');
            $('#btnMovieBookMore').hide();
            $('#btnMovieBookClose').show();
        }
        else
            relListEle.css('max-height', listHeight - 3 + 'px');
    }
}
Schedules.prototype.showSpecific = function(event){
    var relID = $(event.target).parent().attr('data-id'), 
        relEle = $(relID),
        relListEle = relEle.find('ul');

    relListEle.css('max-height', '386px');
    $('#btnMovieBookMore').show();
    $('#btnMovieBookClose').hide();
}
Schedules.prototype.bookMovie = function(event) {
    if(event.target.tagName != 'A')
        return false;
    event.preventDefault();

    stat.addStat(STAT_CODE.PLACE_MOVIE_BOOK_CLICK, {from: this.orign});

    var ele = $(event.target);
    if(ele.hasClass('unbook')){            
        return false;
    }

    var actionUrl = '/detail?',
        query = {
            uid: this.uid,
            date: ele.attr('data-day'),
            seq_no: ele.attr('data-num'),
            cinema_id: ele.attr('data-cinema'), 
            movie_id: ele.attr('data-movie'),
            third_from: ele.data('orign'),
            movie_info: ele.attr('data-info').replace(/\'/g, '"')
        },
        url = actionUrl + 'qt=movie&act=select&from=webapp&' + $.param(query);          
    
    if(query.third_from == 'gewala' || query.third_from == 'wanda'){
        this.renderValidPopup(url); 
        return false;
    }        

    window.location.href = url;
}        
Schedules.prototype.renderValidPopup = function(url){
    var elePopup = $('.moviebook-popup-wrapper');        
    var titles = {'wanda': '万达', 'gewala': '格瓦拉'},
        data = {title: titles[this.orign]},
        popupHtml = POPUPTPL(data),
        number = localStorage.getItem('movie_book_user_mobile');

    if(elePopup.length)return;

    elePopup = $(popupHtml);
    elePopup.prependTo("#wrapper")
        .show()
        .data('url', url)
        .children()
        .first()
        .css('top', window.scrollY + $(window).height()/2 );
    if($('body').height() < window.screen.height)
        elePopup.height(window.screen.height)

    number && $('#valid-phone').val(number);

    $('#valid-btn-close').click($.proxy(this.closePopup,this));
    $('#valid-btn-submit').click($.proxy(this.validPhone,this));
}
Schedules.prototype.closePopup = function(){
    var elePopup = $('.moviebook-popup-wrapper');

    elePopup.length && elePopup.remove();
}
Schedules.prototype.validPhone = function() {
    var eleBtn = $(event.target),
        eleNumber = $('#valid-phone'),
        eleCode = $('#valid-number'),
        eleNumberTip = eleNumber.next(),
        elePopup = $('.moviebook-popup-wrapper');
    var number = eleNumber.val(),
        oldNumber = localStorage.getItem('movie_book_user_mobile');
    
    //创建验证码图片
    function makeValidImg(){
        var callbackName = 'mkcode',
            script = document.createElement('script'),
            cleanup = function () {
                $(script).remove()
                delete window[callbackName]
            };
       
        window[callbackName] = function(data){
            cleanup();

            if(data.content && data.content.vcode)
                elePopup.data('vcode', data.content.vcode)
                    .find('p')
                    .eq(1)
                    .show()
                    .find('img')
                    .attr('src', 'http://map.baidu.com/maps/services/captcha/image?vcode=' + data.content.vcode);
        }
                    
        script.src = 'http://map.baidu.com/maps/services/captcha?setno=1&cb=' + callbackName + '&t=' + (Math.random() * 100000000).toFixed(0);
        $('head').append(script);            
    }
    //检查输入验证码
    function validCode(args, fn){
        var callbackName = 'vdcode',
            script = document.createElement('script'),
            cleanup = function () {
                $(script).remove()
                delete window[callbackName]
            };

        args['t'] = (Math.random() * 100000000).toFixed(0);
        
        window[callbackName] = function(data){                
            cleanup();
            
            if(data.result && data.result.error != 0){
                eleCode.val('');
                elePopup.find('.tip').eq(1).show().text('验证出错，请重新输入验证码！');

                makeValidImg();
                return;
            }

            $.isFunction(fn) && fn();
        };

        script.src = 'http://map.baidu.com/maps/services/captcha/verify?cb=' + callbackName + '&' + $.param(args);
        script.setAttribute('async', 'false');
        $('head').append(script);
    }

    if(!number || number.length != 11 || !number.match(/^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}|15[0-9]\d{8}|18\d{9}/g)){
        eleNumberTip.html('请确保输入号码正确！').show();
        return false;
    }

    if(elePopup.data('valid')){
        eleNumberTip.hide();

        validCode({code: eleCode.val(), vcode: elePopup.data('vcode')}, function(){
            number = eleNumber.val();
            //验证localStorage在IOS隐私模式下是否可用
            try{
                localStorage.setItem('movie_book_user_mobile', number);
            }
            catch(err){}

            window.setTimeout(function(){
                window.location.href = elePopup.data('url') + '&user_mobile=' + number;
            }, 200);
        });
        return false;
    }
    if(!oldNumber || (oldNumber && number != oldNumber) ){
        eleNumberTip.hide();
        elePopup.data('valid', true);

        makeValidImg();
        return false;
    }        

    //验证localStorage在IOS隐私模式下是否可用
    try{
        localStorage.setItem('movie_book_user_mobile', number);
    }
    catch(err){}
    
    window.location.href = elePopup.data('url') + '&user_mobile=' + number;
}       
Schedules.prototype.createCodeUrl = function(json,data){
    var urlParam=util.urlToJSON(window.location.href),url="";

    var urlJson = {
        qt : "mcdkey",
        act : "verify",
        uid : this.uid,
        code : urlParam.code,
        sign : urlParam.sign,
        //影片名称
        name : data.name,
        //影片id
        mid : json.movie,
        //时长
        duration : data.duration,
        //评分
        score : data.score,
        //订票info
        info : json.info.replace(/\'/g, '"'),
        //场次日期
        day : json.day,
        //场次日期
        seq_no : json.num,
        //场次id
        cinemaid : json.cinema,
        //场次时间
        time : json.time,
        //屏幕分类
        type : json.type,
        pname : $("#place-widget-captain-name").html()||"",
        //上映时间
        release : data.release,
        //电影分类
        category : data.category,
        //导演
        director : data.director,
        //主演
        player : data.player,
        //封面
        pic : data.pic
    };
    if(urlParam.code && urlParam.sign){
        url = "/detail?"+util.jsonToUrl(urlJson);
    }
    return url;
}
module.exports = {
    init: function(uid, bookState, now){
        stat.addStat(STAT_CODE.PLACE_MOVIE_PV, {'state': bookState });
        var urlParam=util.urlToJSON(window.location.href);
        var dataQ = {
            qt: 'timetable', 
            act: 'timetable', 
            uid: uid, 
            style: bookState,
            code:urlParam['code']||"",
            sign:urlParam['sign']||"",
        };
        $.ajax({
            url: '/detail?',
            data: dataQ,
            dataType: 'json',
            success: function(data){
                var schedulesObj = new Schedules(data.now_time || now, uid);
                //浏览器翻转事件
                window.addEventListener("resize", function(){schedulesObj.updateLayout();}, false); 
                if(bookState == 2){
                    data = data.other_info;
                }
                if(data.time_table && data.time_table.length){
                    schedulesObj.renderMovieNews(data);    
                }
                else{
                    schedulesObj.renderFailInfo();
                }
            }
        })
    }
}


});
;define('place:widget/placelist/placelist.js', function(require, exports, module){

/**
 * @file place列表页处理逻辑
 */

var url = require("common:widget/url/url.js"),
	util = require("common:static/js/util.js"),
	stat = require('common:widget/stat/stat.js'),
	loc = require('common:widget/geolocation/location.js'),
	$showAllBtn = $("#place-widget-placelist-showall"),
	$poiList = $(".place-widget-placelist"),
	wd = $('.common-widget-nav .title span').text(),
	_cacheData,
	searchFlag,
	$scopeBook = $('.btn-book[industry="scope"]');

function bindEvents() {
	'use strict';

	$scopeBook.on('click', scopeBookClick);
	$poiList.on('click', 'li', listClick);
	$showAllBtn.on("click", showAll);
	$poiList.on("click", ".mod_tel_content", telClick);
	bindPageBtn();
	
}

function unBindEvents() {
	'use strict';

	$scopeBook.off('click', scopeBookClick);
	$poiList.off('click', 'li', listClick);
	$showAllBtn.off("click",showAll);
	$poiList.off("click", ".mod_tel_content", telClick);
}

function scopeBookClick( evt ) {
	'use strict';

	var $li = $(evt.target).closest('li'),
		name = find('.rl_li_title').text(),
		srcname = $li.attr('srcname');

	stat.addCookieStat(STAT_CODE.PLACE_SCOPE_LIST_BOOK_CLICK, {'wd': wd, 'name': name, 'srcname': srcname, 'entry': searchFlag});
}

function bindPageBtn(){
	'use strict';

	var $navBtns = $(".place-widget-placelist .page-btn");
	$.each($navBtns, function (index,item) {
		var $dom = $(item);
		$dom.on("click", function( evt ){
            var btn = $(evt.target),
                type = btn.data("type"),
                href = btn.data("href");

            // 添加“上一页”“下一页”的点击量统计 by cdq
            stat.addCookieStat(STAT_CODE.PLACE_LIST_PAGE_CHANGE, {'wd': wd,type:type});

			if(!btn.hasClass("unclick")) {
				href = "http://" + location.host + href;
				window.location.replace(href);
			}

			evt.stopPropagation();
    		evt.stopImmediatePropagation();
		});
	})
}

/**
 * 显示所有
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function showAll( evt ) {
	'use strict';

	var $poiList = $(".place-widget-placelist .place-list"),
		$pageNav = $(".place-widget-placelist .pagenav");

	$showAllBtn.hide();
	$poiList.removeClass("acc-list");
	$pageNav.show();

	// 添加强展现量统计  by cdq
	stat.addStat(STAT_CODE.PLACE_MAINRES_OPEN);

	evt.stopPropagation();
    evt.stopImmediatePropagation();
}

function listClick( evt ) {
	'use strict';

	var $item = $(this),
		url = $item.data("href"),
        name = $item.find('.rl_li_title').text(),
        isGen = _cacheData && _cacheData["isGenRequest"],
        target = evt.target,
        srcname = $item.attr('srcname');
        
    // 过滤路线按钮，防止重复触发
    if(target.tagName.toLowerCase() === "a") {
    	return;
    }
    isGen = isGen == 1 ? 1 : 0;
    stat.addCookieStat(STAT_CODE.PLACE_LIST_CLICK, {'wd': wd, 'name': name, 'is_gen' : isGen, 'srcname': srcname, 'entry': searchFlag}, function(){
        location.href = "http://" + window.location.host + url;
    });

    evt.stopPropagation();
    evt.stopImmediatePropagation();

}

function telClick( evt ) {
	'use strict';

	var $a = $(this).find("a"),
		tel = $a.data("tel"),
	    wd = $('.common-widget-nav .title span').text(),
	    $li = $(evt.target).closest("li"),
	    name = $li.find(".rl_li_title").text(),
	    srcname = $li.attr('srcname');
	    
	if(util.isAndroid()) {
		$a.attr('href','javascript:void(0)');
        util.TelBox.showTb(tel);
	} else {
		window.location.href = "tel:" + tel;
	}

	// 发送电话拨打量统计 by cdq
	stat.addStat(STAT_CODE.PLACE_LIST_TELEPHONE_CLICK, {'wd': wd, 'name':name, 'srcname':srcname, 'entry': searchFlag});
	
	evt.stopPropagation();
    evt.stopImmediatePropagation();
}

/**
*获取URL的searchFlag参数
**/
function getFlag() {
	'use strict';

	var reg = /searchFlag=([A-Za-z]+)/g,
		matches;

	(matches = reg.exec(location.href)) && (searchFlag = matches[1])

}

function saveData( data ) {
	'use strict';

	_cacheData = data;
}

module.exports = {
	init: function( data ) {
		saveData(data);
		bindEvents();
		getFlag();

		//添加POI结果页的展现量
	    var wd = $('.common-widget-nav .title span').text();
	    stat.addStat(STAT_CODE.PLACE_LIST_VIEW, {'wd': wd});

	    if(loc.hasExactPoi()){
	        stat.addStat(STAT_CODE.PLACE_LIST_GEO_SUC);
	    }else{
	        stat.addStat(STAT_CODE.PLACE_LIST_GEO_FAIL);
	    }
	}
};

});
;define('place:widget/premium/premium.js', function(require, exports, module){

var $uls = $('.premium-list > li'), //优惠信息层元素集合
    $prev = $('.place-widget-premium-pagenum-prev'), //上一页元素
    $next = $('.place-widget-premium-pagenum-next'), //上一页元素
    $curpage = $('.place-widget-premium-curpage'), //当前页面元素
    $totalpage = $('.place-widget-premium-totalpage'), //总页数
    stat = require('common:widget/stat/stat.js'),
    util = require('common:static/js/util.js'),
    cookie = require("common:widget/cookie/cookie.js"),
    statData;

var MsgManager = function(){
    var saleId, saleName, $container, $tip;

    function sendMsg(){
        var tel = $('#msg-tel').val();

        if(isNaN(tel) || tel.length !== 11 || !tel.match(/^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}|15[89]\d{8}|18\d{9}/g)){
            $tip.addClass('tip-active');
            setTimeout(function(){
                $tip.removeClass('tip-active');
             },1000);
            return;
        }
        
        Msg.send(
            {
                en_name: saleName,
                poi_id: poiID,
                promo_id: saleId,
                mobile: tel
            }, 
            sendMsgSuccess
        );
        //hide the message
        showMessage({'type':'sendIng'});

        //stat.addStat(STAT_CODE.STAT_PREMIUM_DETAIL_CLICK_BTN, {uid: poiID, source: poiID === sourceUid ? 'qr' : ''});
    }
    function cancelSend(){
        Popup.hidePopup();
    }
    function showMessage(opts) {
        opts = opts || {};

        var ms = {       
                'noNetWork' : '请检查网络，稍后重试',
                'sendIng' : '正在发送...',
                'success' : '发送成功',
                'fail' : '发送失败'
            },
            message = opts.message || ms[opts.type] || ms['fail'],
            $msgForm = $container.find('.msg-form');
            $msgNotice = $container.find('.msg-notice');
         
         $msgForm.hide();
         $msgNotice.show().html(message);
    }
    function sendMsgSuccess(json){
        var errno = json.errorNo,
            baidu_id,
            promo_id;
         
        if(errno === 0){
            //baidu_id =  cookie.get("BAIDUID");
            // = this.get("saleId");

            //for lba
            //placeUtil.addStatForMec(1, {'stat_type':'lbc_promo', 'origin':6, 'promo_id':promo_id, 'baidu_id':baidu_id, 'action':2});
//            stat.addStat(STAT_CODE.STAT_PLACE_PREMIUM_SEND_SUCCESS,{
//              uid : poiID,
//              source: poiID === sourceUid ? 'qr' : ''
//            });
            showMessage({'type':'success'});
        }
        else{
            showMessage({'message':json.errMsg});
        }       

        //close the prompt after 2seconds
        setTimeout(function(){
            Popup.hidePopup();            
        },2000);
    }

    function init(){
        if(!$popup){
            Popup.creatPopup();

            $container = $('div.msg-container');
            $tip = $container.find('.tip');
            
            $("#msg-send-btn").on("click",sendMsg);
            $("#msg-cancel-btn").on("click",cancelSend);
        }
    }

    return {
        show : function(id, name){
            saleId = id || '';
            saleName = name || '';

            init();            

            $popup.show().find('input').focus();
        }
    };
}(),
Popup = {
    creatPopup : function(){
        var popupHtml = '<div class="place-msg-mask">\
            <div class="msg-container">\
                <div class="msg-form">\
                    <p>请输入手机号</p>\
                    <p>\
                        <input type="tel" id="msg-tel"/>\
                        <span class="tip">请输入正确手机号</span>\
                    </p>\
                    <p class="opt">\
                        <a href="javascript:void(0);" id="msg-send-btn" class="msg-send-btn">发送</a>\
                        <a href="javascript:void(0);" id="msg-cancel-btn" class="msg-cancel-btn">取消</a>\
                    </p>\
                </div>\
                <div class="msg-notice"></div>\
            </div>\
        </div>';

        $popup = $(popupHtml).appendTo("#wrapper");
    },
    hidePopup : function(){
        $popup && $popup.hide();
    },
},
Msg = {
    send: function(opt, callback){
        opt = $.extend({
            qt: 'sms',
            en_name: '',
            poi_id: '',
            promo_id: '',
            mobile: '',
            src: 'map',
            terminal: 'webapp',
            imei: 200000000000000
        }, opt);

        $.ajax({
            'url' : 'http://client.map.baidu.com/detail',
            'data': opt,
            'success' : callback,
            'dataType' : 'jsonp'
        });
    }
},
sourceUid = util.urlToJSON(location.href).uid,
poiID,
$popup;

$('#place-premium-msg-btn').click(function(){
    var $target = $(this),
        saleId = $target.data("saleid"),
        enName = $target.data("enname");
    
    window.scrollTo(0, $('#product-nav').height());

    MsgManager.show(saleId, enName);

    // 详情页短信下载点击量
    stat.addStat(STAT_CODE.PLACE_PREMIUM_SMSG_DL_CLICK, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});
});

/**
 * 显示上一页
 * @param {event} e 事件对象
 */
function goPrev(e) {
    var cp = $curpage.html()-0; //当前页面索引

    if($next.hasClass('place-widget-premium-disable')){
        $next.removeClass('place-widget-premium-disable');
    }

    if(!$prev.hasClass('place-widget-premium-disable')){
        $next.on('click', goNext);

        $uls.hide();
        $uls.eq(cp-2).show();
        $curpage.html(cp-1);
        if(cp-2==0){
            $prev.addClass('place-widget-premium-disable');
            $prev.off('click', goPrev);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function goNext(e) {
    var cp = $curpage.html() - 0, //当前页面索引
        total = $totalpage.html() - 0; //总页数

    if($prev.hasClass('place-widget-premium-disable')){
        $prev.removeClass('place-widget-premium-disable');
    }


    if(!$next.hasClass('place-widget-premium-disable')){
        $prev.on('click', goPrev);

        $uls.hide();
        $uls.eq(cp).show();
        $curpage.html(cp+1);
        if(cp+1==total){
            $next.addClass('place-widget-premium-disable');
            $next.off('click', goNext);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

module.exports = {
    init: function(arg, data){
        poiID = arg;

        statData = data || {};

        var total = $totalpage.html()-0; //总页数
        if(total>1){
            $prev.on('click', goPrev);
            $next.on('click', goNext);
        }

        //添加团购页展现量
        stat.addStat(STAT_CODE.PLACE_PREMIUM_VIEW, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});
    }
};


});
;define('place:widget/recommend/recommend.js', function(require, exports, module){

/**
 * @file recommend-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var $rs = $('.place-widget-recommend ul li'), //附近美食元素集合
    stat = require('common:widget/stat/stat.js');

/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    $rs.on('click', gotoDetail);
}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    $rs.off('click', gotoDetail);
}

/**
 * 跳转到详情页
 * @param {event} e 事件对象
 */
function gotoDetail(e) {
    'use strict';

    var $item = $(e.target).closest('li'),
        url = location.href,
        uid = $item.attr('data-uid'),
        newurl,
        name_src = $('.place-widget-captain .name').text(),
        name_dest = $item.find('p').eq(0).text().substr(2),
        lastIndex = url.lastIndexOf("/"),
        leftp,
        rightp;

    leftp = url.slice(0, lastIndex).replace(/qt=[A-Za-z]*/g, 'qt=inf');
    rightp = url.slice(lastIndex);   
    newurl = leftp + '&uid=' + uid + rightp;

    stat.addCookieStat(STAT_CODE.PLACE_CATER_DETAIL_RECOMMEND_CLICK, {'name': name_src}, function(){
        location.href = newurl;
    });

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/recommend
 */
module.exports = {

    init: function() {
        'use strict';

        bindEvents();

    }
};

});
;define('place:widget/scopebook/scopebook.js', function(require, exports, module){

/**
 * @file scopebook-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var $rs = $('.scope-ticket-name').parent(),
    $widget = $('.place-widget-scope-book'),
    stat = require('common:widget/stat/stat.js');

/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    $rs.on('click', toggleOta);
}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    $rs.off('click', toggleOta);
}

/**
 * 切换ota是否展现的状态
 */
function toggleOta(e) {
    var $item = $(e.target).closest('div'),
        $arrow = $item.find('span').eq(0),
        $ul = $item.next();

    if(!$arrow.hasClass('scope-arrow-icon-down')) {
        $rs.next().addClass('scope-book-hide');
        $rs.find('.scope-arrow-icon').removeClass('scope-arrow-icon-down');

        if($item.attr('last')) {
            $item.addClass('scope-border-bottom');
        }else{
            $rs.last().addClass('scope-border-bottom-radius');
            $rs.last().attr('style', 'border-bottom: none');
        }
    }

    $arrow.toggleClass('scope-arrow-icon-down');
    $ul.length == 0 ? null : $ul.toggleClass('scope-book-hide');

    if($item.attr('last')) {
        $item.attr('style', '');
        $item.toggleClass('scope-border-bottom-radius');
        if($item.attr('class')!='scope-border-bottom') {
            $item.attr('style', 'border-bottom: none');
        }
    }

    scrollWindow($widget);

    e.stopPropagation();
    e.stopImmediatePropagation();

 }

/**
* 滚动窗口
* @param  {Object} target 滚动到的对象
*/
function scrollWindow($target) {
    var offset = $target.offset();
    window.scrollTo(0, offset.top);
}

/**
 * @module place/widget/recommend
 */
module.exports = {

    init: function() {
        'use strict';

        bindEvents();

    }
};

});
;define('place:widget/selectbox/selectbox.js', function(require, exports, module){

/**
 * @file 筛选框逻辑
 */

var url = require("common:widget/url/url.js"),
	loc  = require('common:widget/geolocation/location.js'),
	util   = require('common:static/js/util.js'),
	stat = require('common:widget/stat/stat.js'),
	selects = $(".place-widget-selectbox select"),
	selectForm = $(".place-widget-selectbox select"),
	_selectType,what,
	adpatConfig = {
		takeout : {
			"pl_dist" : "radius",
			"pl_sort_type" : "sortType",
			"pl_sort_rule" : "orderType",
			"pn" : "pageNum"
		}
	},
	_data;

module.exports.init = function(data){
	var	wd, srcname;
	(_data = data || {}) && (wd = _data.wd) && (srcname = _data.srcname)
	bind();
	_selectType = _data.select_type;
	what = _data.what;

	//添加place列表页筛选条件的展现量统计
	stat.addStat(STAT_CODE.PLACE_LIST_FILTER_VIEW, {'wd': wd, 'srcname': srcname});
}

/**
 * 绑定事件
 */
var bind = function () {

	var len = selects.length,
		i = 0;

	$.each(selects, function(index, item){
		$(item).on("change",handleSelect);
	});

	$(".city-select").on("click", _onClickCity);
}

var handleSelect = function(evt){
	var target = evt.target,
        type = $(target).closest('select').attr('name'),
        selectedIndex = $(target)[0].selectedIndex,
        $selectedOption = $($(target)[0][selectedIndex]),
        value = $selectedOption.text(),
        wd = _data.wd,
		srcname = _data.srcname;
    
    //添加筛选条件的点击统计
    switch(type){
        case 'pl_dist':
            stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_RANGE_CLICK, {'wd': wd, 'range': value, 'srcname': srcname});
            break;
        case 'pl_sort_type':
            stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_SORT_CLICK, {'wd': wd, 'sort': value, 'srcname': srcname});
            break;
        case 'pl_sub_type':
            stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_CATEGORY_CLICK, {'wd': wd, 'type': value, 'srcname': srcname});
            break;
        default :
    }
    
	_changeTitle(target);
	_submitSelect();
}

/**
 * 修改筛选框标题
 * @param  {HTMLElement} dom 筛选框的dom节点   
 */
var _changeTitle = function(dom){
    var $select = $(dom);
    var selectedIndex = $select[0].selectedIndex;
    var selectedOption = $($select[0][selectedIndex]);
    var value = selectedOption.text();
    var $title = $select.parent().children(".select_title");
    $title.html(value);
}

/**
 * 完成筛选
 */
var _submitSelect = function(){
	var query = url.get().query;
	var param = _getSelectParams();
	var c = loc.getCityCode();
	param = $.extend(param,{
		"pn" : 0
	});

	query = $.extend(query,param,{
		c : c
	});

	if(_selectType === "takeout") {
		query = paramAdapt(query, _selectType);
	}

	if(query.pl_tonight_sale_flag_section) {
		delete query.pl_tonight_sale_flag_section;
	}

	// 处理筛选框全市逻辑
	if(query.pl_dist == "全市") {
		delete query.center_rank;
	} else if(query.nb_x && query.nb_y) {
		query.center_rank = 1;
	}
	// 处理电影预定逻辑
	if(query.pl_sort_type == "movie_book") {
		query.pl_movie_book_section="1,1";
	}else{
		query.pl_movie_book_section="0,+";
	}

	url.update({
		query : query,
		pageState : {
			show_select : 1
		}
	},{
		queryReplace : true,
		replace : true
	});
}

/**
 * 获取筛选参数
 */
var _getSelectParams = function(){
	var param = {},
		_name,
		_value,
		paramKey;
	$.each(selects,function(index,item){
		var _param = {},
			$item = $(item),
			parent = $item.parent("select-box");
		_name = $(item).attr("name");
		_value = $(item).val();
		switch(_name) {
			case "pl_sub_type" : 
				_param["wd"] = _value;
				_param["pl_sub_type"] = _value;
				break;
			case "pl_sort_type" :
				_param["pl_sort_type"] = _value.split("__")[0];
				_param["pl_sort_rule"] = _value.split("__")[1] || 0;
				break;
			case "pl_dist" :
				_param["pl_dist"] = _value;
				break;

		}
		param = $.extend(param,_param);
	});

	return param;
}

/**
 * 进行参数转换
 * @param  {Object} paramObj 参数
 * @return {[type]}          [description]
 */
var paramAdapt = function(paramObj,type) {
	if(!paramObj || !type) {
		return;
	}

	var _param = $.extend({},paramObj);
	var config = adpatConfig[type];

	$.each(config, function(key,transKey){

		var paramValue = _param[key];
		if(paramValue){
			_param[transKey] = paramValue;
		}
		if( key !== "pl_sort_rule" && paramValue == "0" ) {
			delete _param[transKey];
		}
		delete _param[key];
	});

	return _param;
}


var _onClickCity = function (evt) {
	var cityType = loc.getCityType(),
		cityCode = loc.getCityCode(),
		urlParam = url.get(),
		referQuery = urlParam.query || {},
		referPagestate = urlParam.pageState  || {},
		wd = _data.wd,
		srcname = _data.srcname;

	referQuery.wd = what || referQuery.wd;

	// 如果当前是区县，则获取上一级的城市code
	if(cityType === 3) {
		cityCode = loc.getUpCityCode() || cityCode;
	}

	refer_query = util.jsonToUrl(urlParam.query || {});
	refer_pagestate =  util.jsonToUrl(urlParam.pageState || {});

	// 添加城市检索统计
	stat.addCookieStat(STAT_CODE.PLACE_SELECT_CLICK_CITY, {'wd': wd, 'srcname': srcname});

	url.update({
		module : "index",
		action : "setmylocation",
		query : {
			c : cityCode
		},
		pageState : {
			refer_query : refer_query,
			refer_pagestate : refer_pagestate,
			list_type : "business_area"
		}
	},{
		queryReplace : true,
		pageStateReplace : true
	});
}


});
;define('place:widget/selectlist/selectlist.js', function(require, exports, module){

/**
 * @file 设置精确点
 */

var loc  = require('common:widget/geolocation/location.js');
var url  = require('common:widget/url/url.js');
var util   = require('common:static/js/util.js');
var setCity = require("common:widget/setcity/setcity.js");

var referQueryKey = "_refer_query";
var referPageStateKey = "_refer_pagestate";


module.exports.init = function (data) {
    saveData(data);
    bind();
}

var _cacheData;
var indexPath = "http://" + location.host + "/mobile/webapp/index/index";
var RESULT_TYPE_NONE = 0;       //没有结果
var RESULT_TYPE_NOTCUR = 1;       //本城市无结果
var RESULT_TYPE_POISUC = 2;       //成功返回结果
var RESULT_TYPE_AREA = 3;       //
var BUSINESS_SPLIT = "     ";  //商圈筛选分隔符


var saveData = function (data) {
    _cacheData = data;
}

var bind = function(){
    $list = $(".place-widget-selectlist");
    $list.on("click", "li", _onClickList);
}

var _onClickList = function(e){
    var $dom = $(this);
    var index = +$dom.data("i") - 1;


    selectPlace(index);
}

var selectPlace = function (index) {
    if(typeof index == "undefined") {
        return;
    }

    var item = _cacheData.list[index];
    var urlParam = url.get();
    var pageState = urlParam.pageState;
    var locData = getLocData(item);
    var _referPageState = pageState.refer_pagestate || window.localStorage.getItem(referPageStateKey);
    var _referQuery = pageState.refer_query || window.localStorage.getItem(referQueryKey);

    if(_referQuery && _referQuery != "undefined" ) {
        setLocation(locData,false);
        redirectToRefer(item,{
            referQuery : _referQuery,
            referPageState : _referPageState,
        });
    } else {
        setLocation(locData);
        // 城区结果处理
        if(!locData.isExactPoi && locData.addr.cityType !== 3) {
            setCity.setAndRedirect(locData.addr.city,locData.addr.cityCode);
        } else {
            redirectToindex();
        }
    }
}

var redirectToRefer = function (data,options) {
    var urlParam = url.get(),
        opts = options || {},
        pagestate = urlParam.pageState || {},
        query = util.urlToJSON(opts.referQuery) || {},
        state = util.urlToJSON(opts.referPageState) || {},
        isTakeout = query.qt === 'wm' || state.search === "takeout",
        x = isTakeout ? 'pointX1' : 'nb_x',
        y = isTakeout ? 'pointY1' : 'nb_y',
        module, action, route,type,
        city = _cacheData["city"];

    // 删除当前的缓存key
    window.localStorage.removeItem(referQueryKey);
    window.localStorage.removeItem(referPageStateKey);



    //若关键词包含 商圈+'     '+关键字，将商圈去掉，保留关键字
    if(query.wd && query.wd.split(BUSINESS_SPLIT)[1]){
        query.wd = query.wd.split(BUSINESS_SPLIT)[1];
    }

    query.c = city.code;

    type = _getDataType();

    //跳转到外卖页
    if(isTakeout){
        route = _switchToTakeout(data, query);
    //跳转到place页
    }else{
        route = _switchToPlace(data, query);
    }

    state = $.extend(state,{
        'center_name' : data.name || ""
    });

    // 删除可能存在的i参数，避免存在直接进入详情页
    delete state.i;

    //跳转到其他页面
    url.update({
        module : route.module,
        action :  route.action,
        query : route.query,
        pageState : state
    },{
        'queryReplace': true,
        'pageStateReplace': true
    });
}

var getLocData = function (data) {
    if(!data) return;

    var _type = _getDataType();
    var city = _cacheData.city;
    var point = util.geoToPoint(data.geo);
    var addr = getAddr(data);
    var locData;

    locData = {
        addr : addr,
        isExactPoi : addr.isExactPoi,
        point : {
            x : point.lng,
            y : point.lat
        }
    }
    return locData;
}


/**
* 设置我的位置
* @param {string} name 地理描述信息
* @param {array}  point 坐标数组, point[0]为x坐标, point[1]为y坐标
*/
var setLocation = function(locData , isSaveLocInCookie){
    if(!locData) {
        return;
    }
    locData.isSaveLocInCookie = true;

    // if( isSaveLocInCookie === false){
    //     //是否保存定位信息
    //     locData.isSaveLocInCookie = false;
    // }


    //重设我的位置	
    loc.setAddress(locData);
};


var getAddr = function (item) {
    var addr,
        isExactPoi,
        cityType,
        cityInfo = _cacheData.city;
        cityName = cityInfo.name;

    //若是特殊区域，如北京市，海淀区等,name 进行特殊处理
    if(item.cname){
        name = item.pcname ? item.pcname + item.cname : item.cname;
        isExactPoi = false;
    }else{
        name = item.name;
        isExactPoi = true;
    }
    var upCityCode = null;

    //当前位置是区
    if(item.city_type === 3){
        upCityCode = cityInfo.up_cityid;
    }

    addr = {
        address: name, 
        city: cityName,
        cityCode: item.code ? item.code : cityInfo.code,
        isExactPoi: isExactPoi,
        cityType : item.city_type ? item.city_type : cityInfo.type,
        upCityCode : item.pccode ? item.pccode : upCityCode
    }
    return addr;
}

var _getDataType = function () {
    return _cacheData["type"];
}


var redirectToindex = function () {

    window.location.href = indexPath;
};


/**
* 跳转到外卖页
*/
var _switchToTakeout = function(data, query){
	var type = _getDataType(),
		point;

    // 如果是城区结果，则不加中心点
    if(type != 2 ){
    	point = util.geoToPoint( data.geo );
        query['pointX1'] = point.lng;
        query['pointY1'] = point.lat;
        query['nb_x'] = point.lng;
        query['nb_y'] = point.lat;
        query['center_rank'] = 1;
        query['m'] = 'searchXY';
    } else {
        query['m'] = 'searchBrands';
        delete query['pointX1'];
        delete query['pointY1'];
        delete query['center_rank'];
        delete query['nb_x'];
        delete query['nb_y'];
    }

    query = $.extend(query,{
        'cityId'   : data.addr.cityCode,
        'directId' : data.addr.cityCode,
        'pageNum' : 1,
        'pageSize': 10 
    })

    return {query: query, module: 'place', action: 'takeout'};
}

    /**
    * 跳转到place页
    */
var _switchToPlace = function(data, query){
	var type = _getDataType(),
		point;

    // 如果是城区结果，则不加中心点
    if(type != 2 ){
    	point = util.geoToPoint( data.geo );
        query['nb_x'] = point.lng;
        query['nb_y'] = point.lat;
        query['center_rank'] = 1;
    } else {
        delete query['nb_x'];
        delete query['nb_y'];
        delete query['center_rank'];
        delete query['pointX1'];
        delete query['pointY1'];
    }

    query = $.extend(query,{
        'c'   : data.addr.cityCode,
        'center_rank': 1,
        'pn' : 0      // 设置页码为第一页
    });
    
    return {query: query, module: 'search', action: 'search'};
};


});
;define('place:widget/takeoutdetailnav/takeoutdetailnav.js', function(require, exports, module){

$('.place-widget-takeout-detail').on('click', function() {
	$('#place-widget-dish-category').hide();
});

$('.meau-btn').click(function() {
	if ($('#place-widget-dish-category .dish-name').length > 0) {
		$('#place-widget-dish-category').toggle();
	}
})



});
;define('place:widget/takeoutlist/takeoutlist.js', function(require, exports, module){

module.exports.bind = function(){
    $pageNav = $(".place-widget-taskoutlist .page_btn");
    $.each($pageNav, function (index,item) {
        var $dom = $(item);
        $dom.on("click", function(evt){
            var btn = $(evt.target),
                type = btn.data("type"),
                href = btn.data("href");

            if(!btn.hasClass("unclick")) {
                href = "http://" + location.host + href;
                window.location.replace(href);
            }
        });
    })
};

});
;define('place:widget/telephone/telephone.js', function(require, exports, module){

/**
 * @file telephone-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */
'use strict';

var util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js'),
    $telephone = $('.place-widget-telephone'),  //商户电话
    statData;

/**
 * 绑定事件
 */
function bindEvents() {
    $telephone.on('click', showTelBox);

}

/**
 * 解绑事件
 */
function unbindEvents() {
    $telephone.off('click', showTelBox);
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function showTelBox(e) {
    var $target = $(e.target).closest('a'),
        reg = /searchFlag=([A-Za-z]+)/g,
        matches,
        searchFlag,
        statOpts;

    (matches = reg.exec(location.href)) && (searchFlag = matches[1])

    statOpts = {
        'wd': statData.wd, 
        'name': statData.name, 
        'srcname': statData.srcname, 
        'entry': searchFlag
    };
    stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_CLICK, statOpts);

    if(util.isAndroid()){
        $target.attr('href','javascript:void(0)');
        util.TelBox.showTb($target.attr('data-tel'));
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/telephone
 */
module.exports = {
    init: function( data ) {
        bindEvents();

        statData = data || {};

        stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_SHOW, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});
    }
};

});
;define('place:widget/thirdcomment/thirdcomment.js', function(require, exports, module){

var util = require('common:static/js/util.js');

module.exports = {
    init: function() {
        if ( $( '#J_commentSelect' ) ) {
            $( '#J_commentSelect').on( 'change', this.loadMore );
        }
    },
    loadMore: function() {
        var $select = $(this),
            params = util.jsonToUrl({
                uid: $select.data( 'uid' ),
                startIndex: 0,
                maxResults: 5,
                orderBy: $select.val()
            });

        BigPipe.asyncLoad( {id: 'place-pagelet-bdcomment'}, params )
    }
}


});
;define('place:widget/thirdsrcota/thirdsrcota.js', function(require, exports, module){

/**
 * @file 第三方报价资源（携程）
 * @author liushuai02@baidu.com
 */
'use strict';

var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    placeBroadcastName = require('place:static/js/broadcastname.js'),
    geolocation = require('common:widget/geolocation/location.js'),
    util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js'),
    $el,
    $response, $moreItems, $roomMoreIcon, $roomMoreText, $bookBtns, uid,
    action = _APP_HASH.action,
    sd, ed;

function init() {
    $el = $('.place-widget-thirdsrcota');
    $bookBtns = $el.find('.bookbtn-xiecheng-normal');
    uid = $el.find('.uid').val();

    if ($bookBtns.length > 0) {
        $el.removeClass('hidelist');
    }

    broadcaster.subscribe(placeBroadcastName.DATEPICKER_DATE_CHANGE, onDatepickerDateChange);
    broadcaster.broadcast(placeBroadcastName.HOTELBOOK_OR_THIRDSRCOTA_SHOW);

    $el.delegate('.room-more', 'click', function () {
        $moreItems = $el.find('.more-items');
        $roomMoreIcon = $el.find('.room-more-icon');
        $roomMoreText = $el.find('.room-more-text');
        if ($roomMoreIcon.hasClass('arrow-down')) {
            $roomMoreIcon.removeClass('arrow-down');
            $roomMoreText.text('查看全部房型');
            $moreItems.hide();
        } else {
            $roomMoreIcon.addClass('arrow-down');
            $roomMoreText.text('收起其它房型');
            $moreItems.show();
        }
    });

    $el.delegate('.hb-hd', 'click', function (e) {
        if (!$(e.target).hasClass('xiecheng-sales')) {
            $el.toggleClass('hidelist');
        }
    });

    $el.delegate('.bookbtn-item', 'click', function (e) {
        var $target = $(e.target),
            today = new Date().format('yyyy-MM-dd'),
            tomorrow = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd'),
            url = $target.data('url'),
            price = parseInt($target.data('price'), 10),
            bonus = parseInt($target.data('bonus'), 10) || 0,
            extraParams;

        extraParams = {
            from_page: action,
            checkin_date: (sd || today),
            checkout_date: (ed || tomorrow),
            c: geolocation.getCityCode(),
            price: price,
            book_price: price - bonus,
            simple: 1
        };
        window.location.href = '/mobile/webapp/place/order/'+url + '&' + util.jsonToQuery(extraParams);
    });
}

function onDatepickerDateChange(data) {
    if (data.sd !== sd || data.ed !== ed) {
        sd = data.sd;
        ed = data.ed;
        BigPipe.asyncLoad({id: 'place-pagelet-thirdsrcota'}, util.jsonToUrl({
            st: data.sd,
            et: data.ed,
            uid: uid
        }));
    }
}

module.exports = {
    init: function () {
        init();
        stat.addStat(STAT_CODE.PLACE_XIECHENG_PV, {'from_page': action});
    }
};



});
;define('place:widget/toplist/toplist.js', function(require, exports, module){

/**
 * @file toplist-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var $toplist = $('.place-widget-toplist'), //餐饮酒店排行榜根元素
    $arrow = $('.place-widget-toplist-arrow'), //箭头元素
    $others = $('.place-widget-toplist-others'), //其他排行
    stat = require('common:widget/stat/stat.js'),
    wd = $('.common-widget-nav .title span').text(),
    statData;

/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    $toplist.on('click', showAll);
    $others.on('click', gotoDetail);
}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    $toplist.off('click', showAll);
    $others.off('click', gotoDetail);
}

/**
 *处理点击排行榜显示所有排行的事件
 * @param {event} e 事件对象
 */
function showAll(e) {
    'use strict';

    $arrow.toggleClass('place-widget-toplist-arrowup');
    $others.toggleClass('place-widget-toplist-showall');

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 跳转到详情页
 * @param {event} e 事件对象
 */
function gotoDetail(e) {
    'use strict';

    var $item = $(e.target).closest('li'),
        url = location.href,
        uid = $item.attr('data-uid'),
        newurl,
        name_dest = $item.find('p').eq(0).text(),
        lastIndex = url.lastIndexOf("/"),
        leftp, rightp,
        statOpts = {
            'wd': wd,   //注意key必须有引号
            'name_src': statData.name, 
            'name_dest': name_dest,
            'srcname': statData.srcname
        };
    
    leftp = url.slice(0, lastIndex).replace(/qt=[A-Za-z]*/g, 'qt=inf');
    rightp = url.slice(lastIndex);   
    newurl = leftp + '&uid=' + uid + rightp;

    stat.addCookieStat(STAT_CODE.PLACE_DETAIL_RANK_CLICK, statOpts, function(){
        location.href = newurl;
    });

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/toplist
 */
module.exports = {

    init: function( data ) {
        'use strict';

        bindEvents();
        statData = data || {};
        
        //添加详情页排行榜的展现量
        stat.addStat(STAT_CODE.PLACE_DETAIL_RANK_VIEW, {'wd': wd, 'name': statData.name, 'srcname': statData.srcname});

    }
};

});
;define('place:widget/tosearch/tosearch.js', function(require, exports, module){

/**
 * @file tosearch-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

/**
 * @module place/widget/tosearch
 */
module.exports = {

    init: function() {
        'use strict';

        var $name = $('.place-widget-tosearch .name');
		$name.css('max-width', $('body').offset().width - 200 + 'px');
		$(window).on('resize', function(){
		    $name.css('max-width', $('body').offset().width - 200 + 'px');
		});

    }
};



});