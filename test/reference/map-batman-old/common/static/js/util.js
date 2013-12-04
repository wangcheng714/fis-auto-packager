/**
 * @file 工具方法们
 */
define('common:static/js/util.js', function(require, exports, module) {
  'use strict';
  /**
   * @external Date
   */
  /**
   * 对Date的扩展，将 Date 转化为指定格式的String
   * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   * @param {date} fmt 要格式化的日期对象
   * @memberof Date.prototype
   * @returns {string}
   * @example
   * (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
   * (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
   */
  Date.prototype.format = function(fmt) {
    var o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'h+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      'S': this.getMilliseconds() //毫秒
    }, k;
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  };
  /**
   * @lends common:static/js/util
   */
  var util = {

    /**
     * html字符编码，防止html代码注入
     * @param {string} 原始内容
     * @returns {string} 返回编码之后的内容
     */
    encodeHTML: function(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    /**
     * 将url参数部分解析成key/value形式
     * @param {string} url，格式key=value&key=value
     * @returns {Object} json对象{key:value,key:value}
     */
    urlToJSON: function(url) {
      if (!url) {
        return {};
      }
      var result = {}, pairs = url.split('&'),
        i, keyValue, len;
      for (i = 0, len = pairs.length; i < len; i++) {
        keyValue = pairs[i].split('=');
        result[keyValue[0]] = decodeURIComponent(keyValue[1]);
      }
      return result;
    },
    /**
     * json转换为url
     * @param {Object} json数据
     * @returns {string} url
     */
    jsonToUrl: function(json) {
      if (!json) {
        return '';
      }
      var arr = [],
        key;
      for (key in json) {
        if (json.hasOwnProperty(key)) {
          arr.push(key + '=' + encodeURIComponent(json[key]));
        }
      }
      return arr.join('&');
    },
    /**
     * 判断是否为android系统
     * @returns {boolean}
     */
    isAndroid: function() {
      return (/android/i).test(navigator.userAgent);
    },

    /**
     * 判断是否为IOS平台
     * @returns {boolean}
     */
    isIOS: function() {
      return (/iphone|ipad|ipod/i).test(navigator.userAgent);
    },
    /**
     * 判断是否为iphone
     * @returns {boolean}
     */
    isIPhone: function() {
      return (/iphone/i).test(navigator.userAgent);
    },
    /**
     * 判断是否为ipad
     * @returns {boolean}
     */
    isIPad: function() {
      return (/ipad/i).test(navigator.userAgent);
    },
    /**
     * 判断是否为ipod
     * @returns {boolean}
     */
    isIPod: function() {
      return (/ipod/i).test(navigator.userAgent);
    },
    /**
     * 判断IOS版本(暂时只是区别是否是ios7)
     * @returns {boolean}
     */
    getIosVersion:function(){
      return (/OS 7_\d[_\d]* like Mac OS X/i).test(navigator.userAgent);
    },
    /**
     * 处理geo返回的点
     * @param {Object} geo
     */
    geoToPoint: function(geo) {
      if (typeof geo !== 'string') {
        return;
      }
      var a = geo.split('|'),
        p, point;

      if (parseInt(a[0], 10) === 1) {
        p = a[1].split(',');
        point = {
          lng: parseFloat(p[0]),
          lat: parseFloat(p[1])
        };
        return point;
      }
    },
    /**
     * 将json对象格式化为请求串
     * @param {Object} Json对象
     * @param {Function} 编码函数
     */
    jsonToQuery: function(json, encode) {
      var s = [],
        n, value;

      encode = encode ||
        function(v) {
          return v;
      };
      for (n in json) {
        if (json.hasOwnProperty(n)) {
          value = json[n];
          if (value) {
            s.push(n + '=' + encode(value));
          }
        }
      }
      return s.join('&');
    },
    /**
     * 是否支持路况显示，判断城市和设备是否支持
     * @param {number} 城市代码或拼音名称
     * @return {string|boolean} 对应城市的名称字符串
     */
    ifSupportSubway: function(codeOrName) {
      var supportCity = {
        "131": "beijing,北京,131",
        "289": "shanghai,上海,289",
        "257": "guangzhou,广州,257",
        "340": "shenzhen,深圳,340",
        "2912": "hongkong,香港,2912",
        "75": "chengdu,成都,75",
        "53": "changchun,长春,53",
        "132": "chongqing,重庆,132",
        "167": "dalian,大连,167",
        "138": "foshan,佛山,138",
        "179": "hangzhou,杭州,179",
        "104": "kunming,昆明,104",
        "315": "nanjing,南京,315",
        "58": "shenyang,沈阳,58",
        "224": "suzhou,苏州,224",
        "332": "tianjin,天津,332",
        "218": "wuhan,武汉,218",
        "233": "xian,西安,233",
        "48": "haerbin,哈尔滨,48",

        "beijing": "beijing,北京,131",
        "shanghai": "shanghai,上海,289",
        "guangzhou": "guangzhou,广州,257",
        "shenzhen": "shenzhen,深圳,340",
        "hongkong": "hongkong,香港,2912",
        "chengdu": "chengdu,成都,75",
        "changchun": "changchun,长春,53",
        "chongqing": "chongqing,重庆,132",
        "dalian": "dalian,大连,167",
        "foshan": "foshan,佛山,138",
        "hangzhou": "hangzhou,杭州,179",
        "kunming": "kunming,昆明,104",
        "nanjing": "nanjing,南京,315",
        "shenyang": "shenyang,沈阳,58",
        "suzhou": "suzhou,苏州,224",
        "tianjin": "tianjin,天津,332",
        "wuhan": "wuhan,武汉,218",
        "xian": "xian,西安,233",
        "haerbin": "haerbin,哈尔滨,48"
      };

      var ua = navigator.userAgent;
      var unAndroid = /android((\s)*|\/)(1\.\d|2\.[12])/i;
      var unbrowser = /FlyFlow/i;
      var isbrowserSupport = !(unAndroid.test(ua) || unbrowser.test(ua));

      if (!isbrowserSupport) {
        return false;
      }

      return supportCity[codeOrName];
    },
    /**
     * 展示loading
     * @param {string} 展示loading对应的容器
     */
    showLoading: function(wrapper) {
      var me = this;
      me.$pageLoading = util.LoadingBox;
      //me.loadingNode =
      me.$pageLoading.show(wrapper);
      var postype = wrapper.css('position');
      if (postype == "static") {
        wrapper.css('position', 'relative');
      }
    },
    /**
     * 关闭loading
     * @param {timeoutc} 规定时间关闭菊花
     */
    hideLoading: function(wrapper, timeoutc) {
      var me = this,
        c = function() {
          if ( !! wrapper) {
            if (wrapper.children('.page-loading').length > 0) {
              wrapper.children('.page-loading').remove();
            }
          } else {
            $('.page-loading').remove();
          }
          /*if(!!me.loadingNode) {
                        me.loadingNode.remove();
                        me.loadingNode = undefined;
                    }*/
        },
        tc = parseInt(timeoutc, 10);
      if (tc && (tc > -1)) {
        setTimeout(function() {
          c();
        }, tc);
      } else {
        c();
      }
    },
    /*
     **创建元素添加到dom结构中
     */
    create: function(tag, attr) {
      var e = document.createElement(tag);
      attr = attr || {};
      // 设置属性
      for (var name in attr) {
        //name = {'for': 'htmlFor', 'class': 'className'}[name] || name;
        if (name == "style") {
          e.style.cssText = attr[name];
          continue;
        }
        if (attr[name]) {
          if (e.setAttribute) {
            e.setAttribute(name, attr[name]);
          } else {
            try {
              e[name] = attr[name];
            } catch (e) {}
          }
        }
      }
      return e;
    },
    /**
     * 获取本地信息
     * @param {string} packageName 包名称
     * @param {function} successCallback
     * @param {function} errorCallback
     */
    getNativeInfo: function(packageName, successCallback, errorCallback) {
      var url = "http://127.0.0.1:6259/getpackageinfo?packagename=" + packageName;
      $.ajax({
        url: url,
        dataType: 'jsonp',
        success: successCallback,
        error: errorCallback
      });
      
      //successCallback({error:0});
    },
    /**
     * 判断客户是否安装客户端
     */
    isInstalledClient: function(sucfn, errfn, uid) {
      var me = this;
      me.getNativeInfo("com.baidu.BaiduMap", function(data) {
        var dataerr = (data.error == 0);
        if (dataerr) {
          $.isFunction(sucfn) && sucfn(me.getClientUrl('open', uid));
        } else {
          $.isFunction(errfn) && errfn(me.getClientUrl('download', uid));
        }
      }, function() {
        $.isFunction(errfn) && errfn(me.getClientUrl('download', uid));
      });
    },
    /**
     * 取得打开客户端还是下载客户端的url
     */
    getClientUrl: function(utype, uid) {
      var me = this,
        url = "";
      me.os = me.isAndroid() ? "android" : me.isIPhone() ? "iphone" : me.isIPad() ? "ipad" : "unknown";
      if (utype == "download") {
        switch (me.os) {
          case 'android':
            url = "http://map.baidu.com/maps/download/index.php?app=map&qudao=gw10014";
            break;
          case 'iphone':
            url = "http://itunes.apple.com/cn/app/id452186370?ls=1&mt=8";
            break;
          case 'ipad':
            url = "https://itunes.apple.com/cn/app/bai-du-de-tuhd/id553771681?ls=1&mt=8";
            break;
          case 'unknown':
            url = "http://mo.baidu.com/d/map/gw/bmap_andr_gw10016.apk";
            break;
          default:
            url = "http://mo.baidu.com/d/map/gw/bmap_andr_gw10016.apk";
            break;
        }
      } else if (utype = "open") {
        switch (me.os) {
          case 'android':
            if (uid) {
              url = "bdapp://map/place/detail?uid=" + uid + "&src=baidu|lbswebapp";
            } else {
              url = "bdapp://map/";
            }
            break;
          case 'iphone':
            if (uid) {
              url = "baidumap://map/place/detail?uid=" + uid + "&src=baidu|lbswebapp";
            } else {
              url = "baidumap://map/";
            }
            break;
          case 'ipad':
            if (uid) {
              url = "baidumap://map/place/detail?uid=" + uid + "&src=baidu|lbswebapp";
            } else {
              url = "baidumap://map/";
            }
            break;
          case 'unknown':
            if (uid) {
              url = "bdapp://map/place/detail?uid=" + uid + "&src=baidu|lbswebapp";
            } else {
              url = "bdapp://map/";
            }
          default:
            url = "http://mo.baidu.com/map";
            break;
        }
      }
      return url;
    },

    /**
     * 设置a标签的href和data-log
     * @param {[type]} ele  元素
     * @param {[type]} href 设置的href
     * @param {[type]} code 要设置的统计code
     */
    setHrefStat: function(elem, href, code) {
      if (!elem || !href) {
        return;
      }
      if (code) {
        elem.attr('href', href).attr('data-log', "{code:" + code + "}");
      } else {
        elem.attr('href', href);
      }
      return elem;
    },
  /**
   * 用于对a标签的打开下载客户端统计绑定
   * @param  {[type]}   elem     a标签元素
   * @param  {Function} callback 回调函数，一般为发送统计的函数
   * @return {[type]}            [description]
   */
    bindHrefStat: function(elem, callback){
      var me = this;
      var ck = function(e){
        e.stopPropagation();
        e.preventDefault();
        callback();
        setTimeout(function(){
          if(window.navigator.standalone){
            window.open(elem.attr('data'));            
          }else{
            window.location.href = elem.attr('data');
          }
        }, 200);
      }
      elem.bind('click', ck);
    }
  };
  /**
   * 拨打电话TelBox
   */
  util.TelBox = {

    bindEvent: function() {
      var $ok = $('#telBox button').eq(1),
        $cancel = $('#telBox button').eq(0);

      $ok.on('click', function() {
        $('#telBox').remove();
      });

      $cancel.on('click', function() {
        $('#telBox').remove();
      });
    },

    // 显示box
    showTb: function(number) {
      if (!number) return;
      if ($("#telBox")[0]) {
        $('#telBox').remove();
      }

      var htm = [];
      htm.push('<div id="telBox" class="telbox">');
      htm.push('<div class="t"></div>');
      htm.push('<div  class="c">');
      htm.push('<div class="t1">拨打电话</div><div>');
      htm.push('<button class="bt qx cancel-telbox" >取消</button>');
      htm.push('<a href="wtai://wp/mc;' + $.trim(number) + '"><button class="bt qd cancel-telbox" >确定</button></a>');
      htm.push('</div></div></div>');

      $('body').append(htm.join(''));

      this.bindEvent();

    }

  };
  util.LoadingBox = {
    show: function(wrapper) {
      //如果当前节点下已经存在loading结点，则返回当前loading结点
      if (wrapper.children('.page-loading').length > 0) {
        return wrapper.children('.page-loading');
      }
      var node = util.create('div', {
        'class': 'mappic-loading page-loading slide in',
        'id': 'loadingbox'
      });
      var inner = '<div>\
                           <span class="dot-1"></span>\
                           <span class="dot-2"></span>\
                           <span class="dot-3"></span>\
                           <span class="dot-4"></span>\
                           <span class="dot-5"></span>\
                           <span class="dot-6"></span>\
                           <span class="dot-7"></span>\
                           <span class="dot-8"></span>\
                      </div>';

      $(node).html(inner);
      wrapper && wrapper.append($(node));
      $(node).show();
      return $(node);
    }
  };
  /**
   * @module common:static/js/util
   */
  module.exports = util;
});
