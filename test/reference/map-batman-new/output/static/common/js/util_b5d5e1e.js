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

    String.prototype.format = function() {
        var argus = [];
        argus = Array.apply(argus, arguments);
        var reStr = this.replace(/\{([0-9]+)\}/g, function($0, num) {
            var str = argus[parseInt(num, 10)];
            return typeof(str) === 'undefined' ? '' : str;
        });
        return reStr;
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
        getIosVersion: function() {
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

            encode = encode || function(v) {
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
         * 当前城市是否支持路况
         */
        need2ShowTraffic: function(citycode) {
            var locator = require('common:widget/geolocation/location.js');
            var url     = require('common:widget/url/url.js');
            var query   = url.get().query;

            var code = code || query && query.code || locator.getCityCode();
            var aid = [131, 289, 257, 340, 348, 75, 167, 92, 178, 53, 132, 315, 163, 218, 180, 150, 300, 333, 58, 317, 244, 179, 332, 158, 194, 134, 119, 138, 140, 187, 236, 261, 104, 224, 233, 288];
            for (var i = 0; i < aid.length; i++) {
                if (code == aid[i]) {
                    return true;
                }
            }
            return false;
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
                if (name === "style") {
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

        nativeInfo: {},

        /**
         * 获取本地信息
         * @param {string} packageName 包名称
         * @param {function} successCallback
         * @param {function} errorCallback
         */
        getNativeInfo: function(packageName, successCallback, errorCallback) {
            var url = "http://127.0.0.1:6259/getpackageinfo?packagename=" + packageName;
            var me = this;
            if (typeof me.nativeInfo[packageName] === 'object') {
                successCallback && successCallback(me.nativeInfo[packageName]);
            } else if (typeof me.nativeInfo[packageName] === 'number' && me.nativeInfo[packageName] >= 2) {
                errorCallback && errorCallback();
            } else {
                $.ajax({
                    url: url,
                    dataType: 'jsonp',
                    success: function(data) {
                        // 缓存上次结果
                        me.nativeInfo[packageName] = data;
                        successCallback && successCallback(data);
                    },
                    error: function() {
                        me.nativeInfo[packageName] = me.nativeInfo[packageName] || 0;
                        // 记录错误次数
                        me.nativeInfo[packageName]++;
                        errorCallback && errorCallback();
                    }
                });
            }
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
            if (utype === "download") {
                 url = "http://mo.baidu.com/map/code/?from=gw10015";
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
        bindHrefStat: function(elem, callback) {
            var me = this;
            var ck = function(e) {
                e.stopPropagation();
                e.preventDefault();
                callback && callback();
                setTimeout(function(){
                  if(window.navigator.standalone){
                    window.open(elem.attr('data'));            
                  }else{
                    if(elem.attr('data')){
                      window.location.href = elem.attr('data');
                    }
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

            $('#telBox').on('click .ok-telbox', function() {
                $('#telBox').off();
                $('#telBox').remove();
            });

            $('#telBox').on('click .cancel-telbox', function() {
                $('#telBox').off();
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
            htm.push('<a href="wtai://wp/mc;' + $.trim(number) + '"><button class="bt qd ok-telbox" >确定</button></a>');
            htm.push('</div></div></div>');

            $('body').append(htm.join(''));

            this.bindEvent();
        }

    };
      util.DownBox = {

    bindEvent: function() {
      var $ok = $('#downBox button').eq(1),
        $cancel = $('#downBox button').eq(0);

      $ok.on('click', function() {
    require('common:widget/stat/stat.js').addCookieStat(COM_STAT_CODE.TOP_BANNER_APP_ERROR_DOWN);
        $('#downBox').remove();
      });

      $cancel.on('click', function() {
    require('common:widget/stat/stat.js').addCookieStat(COM_STAT_CODE.TOP_BANNER_APP_ERROR_CANCEL);
        $('#downBox').remove();
      });
    },

    // 显示box
    showTb: function() {
      if ($("#downBox")[0]) {
        $('#downBox').remove();
      }

      var htm = [];
      htm.push('<div id="downBox" class="downbox">');
      htm.push('<div class="t"></div>');
      htm.push('<div  class="c">');
      htm.push('<div class="t1">您还未安装百度地图客户端，立即前往下载</div><div>');
      htm.push('<button class="bt qx cancel-downbox" >继续使用网页版</button>');
      htm.push('<a href="http://itunes.apple.com/cn/app/id452186370?ls=1&mt=8"><button class="bt qd cancel-downbox" >去下载</button></a>');
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




    // 扩展与gis相关的通用方法 暂时还放在util里面 by jican
    var _EXT_CHARS_ = ["=", ".", "-", "*"];
    var _MAX_DELTA_ = 0x01 << 23;
    $.extend(util, {

        /**
         * decode geo by difference
         * @type String
         */
        decode_geo_diff: function(coded) {
            var geo_type = this._decode_type(coded.charAt(0));
            var code = coded.substr(1);
            var pos = 0;
            var code_len = code.length;
            var part_vec = [];
            var geo_vec = [];
            var ret = [];
            while (pos < code_len) {
                if (code.charAt(pos) === _EXT_CHARS_[0]) {
                    if ((code_len - pos) < 13) {
                        return 0; // invalid coordinates
                    }
                    ret = this._decode_6byte_(code.substr(pos, 13), part_vec);
                    if (ret < 0) {
                        return 0;
                    }
                    pos += 13;
                } else if (code.charAt(pos) === ';') {
                    geo_vec.push(part_vec.slice(0));
                    part_vec.length = 0;
                    ++pos;
                } else {
                    if ((code_len - pos) < 8) {
                        return 0;
                    }
                    ret = this._decode_4byte_(code.substr(pos, 8), part_vec);
                    if (ret < 0) {
                        return 0;
                    }
                    pos += 8;
                }
            }
            for (var i = 0, l = geo_vec.length; i < l; i++) {
                for (var j = 0, ll = geo_vec[i].length; j < ll; j++) {
                    geo_vec[i][j] /= 100;
                }
            }
            return {
                "geoType": geo_type,
                "geo": geo_vec
            };
        },

        /**
         * get type of geo
         * @type String
         */
        _decode_type: function(c) {
            var r = -1;
            if (c === _EXT_CHARS_[1]) {
                r = 2; //mapConst.GEO_TYPE_POINT;
            } else if (c === _EXT_CHARS_[2]) {
                r = 1; //mapConst.GEO_TYPE_LINE;
            } else if (c === _EXT_CHARS_[3]) {
                r = 0; //mapConst.GEO_TYPE_AREA;
            }
            return r;
        },


        _decode_6byte_: function(code, ret) {
            var x = 0;
            var y = 0;
            var buff = 0;
            for (var i = 0; i < 6; i++) {
                buff = this._char2num_(code.substr(1 + i, 1));
                if (buff < 0) {
                    return -1 - i;
                }
                x += buff << (6 * i);
                buff = this._char2num_(code.substr(7 + i, 1));
                if (buff < 0) {
                    return -7 - i;
                }
                y += buff << (6 * i);
            }
            ret.push(x);
            ret.push(y);
            return 0;
        },

        _decode_4byte_: function(code, ret) {
            var l = ret.length;
            if (l < 2) {
                return -1;
            }
            var x = 0;
            var y = 0;
            var buff = 0;
            for (var i = 0; i < 4; i++) {
                buff = this._char2num_(code.substr(i, 1));
                if (buff < 0) {
                    return -1 - i;
                }
                x += buff << (6 * i);

                buff = this._char2num_(code.substr(4 + i, 1));
                if (buff < 0) {
                    return -5 - i;
                }
                y += buff << (6 * i);
            }
            if (x > _MAX_DELTA_) {
                x = _MAX_DELTA_ - x;
            }
            if (y > _MAX_DELTA_) {
                y = _MAX_DELTA_ - y;
            }

            ret.push(ret[l - 2] + x);
            ret.push(ret[l - 1] + y);

            return 0;
        },

        _char2num_: function(c) {
            var n = c.charCodeAt(0);
            if (c >= 'A' && c <= 'Z') {
                return n - 'A'.charCodeAt(0);
            } else if (c >= 'a' && c <= 'z') {
                return (26 + n - 'a'.charCodeAt(0));
            } else if (c >= '0' && c <= '9') {
                return (52 + n - '0'.charCodeAt(0));
            } else if (c === '+') {
                return 62;
            } else if (c === '/') {
                return 63;
            }
            return -1;
        },

        /**
         * 处理点信息，此方法将非标准格式的地理点信息进行标准化
         * @param Point|String|Array 地理坐标 "lng,lat"
         * @return Point实例
         */
        getPoiPoint: function(point) {
            var pts = [];
            var pt = null;
            if (point.toString() === "Point") {
                pt = point;
            } else {
                if (typeof point === "string") {
                    pts = $.trim(point).split(",");
                    if (pts.length < 2) {
                        return;
                    }
                    pts[0] = parseFloat($.trim(pts[0]));
                    pts[1] = parseFloat($.trim(pts[1]));
                } else {
                    pts = point.slice(0);
                    if (pts.length < 2) {
                        return;
                    }
                }
                pt = new BMap.Point(pts[0], pts[1]);
            }
            return pt;
        },

        /**
         * 将geo字符串转换成点线面geo对象
         * @param {String} geo 字符串
         * @param {Object} Geo对象
         */
        parseGeo: function(geo) {
            if (typeof(geo) != "string") return;
            var info = geo.split("|");
            var type = parseInt(info[0]);
            var bound = info[1];
            var points = info[2];
            var parts = points.split(";");
            var arr = [];
            switch (type) {
                case 1:
                    arr.push(parts[0]);
                    break;
                case 2:
                case 3:
                    for (var i = 0; i < parts.length - 1; i++) {
                        var coords = parts[i];
                        if (coords.length > 100) {
                            coords = coords.replace(/([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*),([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*)(,)/g, "$1,$2;");
                            arr.push(coords);
                        } else {
                            var str = [];
                            var ps = coords.split(",");
                            for (var j = 0; j < ps.length; j += 2) {
                                var x = ps[j];
                                var y = ps[j + 1];
                                str.push(x + "," + y);
                            };
                            arr.push(str.join(";"));
                        }
                    };
                    break;
            };
            if (arr.length <= 1) arr = arr.toString();
            return {
                type: type,
                bound: bound,
                points: arr
            };
        },

        /**
         * 将返回的压缩坐标转换成明文坐标（包含抽稀）
         * @param {String} geo 字符串
         * @param {Number} factor 抽稀因子，间隔factor个坐标抽取
         */
        parse2Geo: function(geo, factor) {

            if (!factor) {
                factor = 0;
            } else if (factor < 0.25) {
                factor = 0;
            } else if (factor > 0.25 && factor < 1) {
                factor = 1;
            } else if (factor > 32) {
                factor = 32;
            }
            var _arrG = geo.split("|");
            if (_arrG.length === 1) { //点
                var _g = this.decode_geo_diff(_arrG[0]);
                return {
                    type: _g.type,
                    bound: '',
                    points: _g.geo.join(",")
                };
            } else if (_arrG.length > 1) { //线面
                var _lines = geo.split(";.=");
                var _bs = [];
                var _ps = [];
                var _tp = 0;
                var _len = _lines.length;
                for (var i = 0; i < _len; i++) {
                    var _ln = _lines[i];
                    if (_len > 1) {
                        if (i === 0) {
                            _ln = _ln + ";";
                        };
                        if (i > 0 && i < _len - 1) {
                            _ln = ".=" + _ln + ";";
                        };
                        if (i === _len - 1) {
                            _ln = ".=" + _ln;
                        };
                    };
                    var _arrL = _ln.split("|");
                    var _b0 = this.decode_geo_diff(_arrL[0]);
                    var _b1 = this.decode_geo_diff(_arrL[1]);
                    _bs.push(_b0.geo.join(","));
                    _bs.push(_b1.geo.join(","));
                    var _g = this.decode_geo_diff(_arrL[2]);
                    _tp = _g.type;
                    var _p = _g.geo.join(",");
                    _p = _p.replace(/([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*),([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*)(,)/g, "$1,$2;");
                    if (factor > 0) {
                        var _re = new RegExp("(((-?\\d+)(\\.\\d+)?),((-?\\d+)(\\.\\d+)?);)(((-?\\d+)(\\.\\d+)?),((-?\\d+)(\\.\\d+)?);){" + factor + "}", "ig");
                        _p = _p.replace(_re, "$1");
                    };
                    _ps.push(_p);
                }
                if (_len <= 1) _ps = _ps.join(";");
                return {
                    type: _tp,
                    bound: _bs.join(";"),
                    points: _ps
                };
            }
        },
        /**
         * 将坐标字符串转化为BMap.Point对象
         * @type {Object} "lng,lat"
         */
        getPointByStr: function(point) {
            var BMap = require('common:widget/map/map.js').getBMap();
            if (typeof point != "string") {
                return;
            }
            var pts = point.split(",");
            if (pts.length < 2) {
                return;
            }
            if(BMap) {
                return new BMap.Point(pts[0], pts[1]);
            } else {
                return {
                    lng: parseFloat(pts[0]),
                    lat: parseFloat(pts[1])
                };
            }  
        },
        /**
         * 获取区域坐标
         */
        getBPoints: function(bounds) {
            if (!bounds || bounds.length === 0) return;
            var points = [];
            for (var i = 0; i < bounds.length; i++) {
                if (bounds[i]) {
                    var pts = bounds[i].split(";");
                    for (var j = 0; j < pts.length; j++) {
                        var point = util.getPointByStr(pts[j]);
                        points.push(point);
                    };
                };
            };
            return points;
        }
    });

    /**
     * @module common:static/js/util
     */
    module.exports = util;
});
