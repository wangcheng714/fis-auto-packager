var BigPipe = function() {
    var idMaps = {};
    function ajax(url, cb, data) {
        var xhr = new (window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP");

        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                cb(this.responseText);
            }
        };
        xhr.open(data?'POST':'GET', url + '&t=' + ~~(1e6 * Math.random()), true);

        if (data) {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(data);
    }


    function renderPagelet(obj, pageletsMap, rendered) {
        if (obj.id in rendered) {
            return;
        }
        rendered[obj.id] = true;

        if (obj.parent_id) {
            renderPagelet(
                pageletsMap[obj.parent_id], pageletsMap, rendered);
        }

        //
        // 将pagelet填充到对应的DOM里
        //
        var dom = document.getElementById(obj.id);
        var idMap = idMaps[obj.id];
        if (idMap && idMap.html_id) {
            dom = document.getElementById(idMap.html_id);
        }

        if (!dom) {
            dom = document.createElement('div');
            dom.id = obj.id;
            document.body.appendChild(dom);
        }

        dom.innerHTML = obj.html;

        var scriptText = dom.getElementsByTagName('script');
        for (var i = scriptText.length - 1; i >= 0; i--) {
            node = scriptText[i];
            text = node.text || node.textContent || node.innerHTML || "";
            window[ "eval" ].call( window, text );
        };
    }


    function render(pagelets) {
        var i, n = pagelets.length;
        var pageletsMap = {};
        var rendered = {};

        //
        // 初始化 pagelet.id => pagelet 映射表
        //
        for(i = 0; i < n; i++) {
            var obj = pagelets[i];
            pageletsMap[obj.id] = obj;
        }

        for(i = 0; i < n; i++) {
            renderPagelet(pagelets[i], pageletsMap, rendered);
        }
    }


    function process(data) {
        var rm = data.resource_map;

        if (rm.async) {
            require.resourceMap(rm.async);
        }

        function loadNext() {
            if (rm.style) {
                var dom = document.createElement('style');
                dom.innerHTML = rm.style;
                document.getElementsByTagName('head')[0].appendChild(dom);
            }
            render(data.pagelets);

            if (rm.js) {
                LazyLoad.js(rm.js, function() {
                    rm.script && window.eval(rm.script);
                });
            }
            else {
                rm.script && window.eval(rm.script);
            }
        }

        rm.css
            ? LazyLoad.css(rm.css, loadNext)
            : loadNext();
    }


    function asyncLoad(arg, param, cb) {
        if (!(arg instanceof Array)) {
            arg = [arg];
        }
        var obj, arr = [];
        for (var i = arg.length - 1; i >= 0; i--) {
            obj = arg[i];
            if (!obj.id) {
                throw new Error('missing pagelet id');
            }

            idMaps[obj.id] = obj;
            arr.push('pagelets[]=' + obj.id);
        }

        var url = location.href.split('#')[0].indexOf('mobile/webapp/taxi/index') > -1 ?
            location.href.split('#')[0] + '&' + arr.join('&') + '&force_mode=1' + '&' + param :
            location.href.split('#')[0] + 'mobile/webapp/taxi/index' + '&' + arr.join('&') + '&force_mode=1' + '&' + param;

        ajax(url, function(res) {
            var data = window.JSON?
                JSON.parse(res) :
                eval('(' + res + ')');


            if(cb && Object.prototype.toString.call(cb) === '[object Function]') {
                cb();
            }
            process(data);
        });
    }

    return {
        asyncLoad: asyncLoad
    }
}();

;define('taxi:widget/common/addprice/addprice.js', function(require, exports, module){

/**
 * @file 加价模块
 */
'use strict';

var exports = {
    /**
     * 创建控件
     * @param {array} data 初始化数据，价格区间数组
     */
    create: function(data) {
        var $el = $('.taxi-widget-addprice'),
            $wrapper = $el.find('.wrapper'),
            documentFragment, $option, $label, $radio, $options;

        if($.isArray(data)) {
            documentFragment = document.createDocumentFragment();
            $.each(data, function(i, item) {
                $option = $('<div/>').addClass('option');
                $label = $('<label/>').text(item + '元').appendTo($option);
                $radio = $('<input/>').attr({
                    'type': 'radio',
                    'name': 'add_price'
                }).val(item).appendTo($option);
                $option.appendTo(documentFragment);
            });
            $wrapper.append(documentFragment);
        }

        $options = $el.find('.option');

        $options.on('click', $.proxy(this.onOptionClick, this));

        this.$el = $el;
    },
    onOptionClick: function(e) {
        this.setValue($(e.currentTarget).find('input[type=radio]').val());
    },
    /**
     * 设置值
     * @param {number} value 将要设置的值
     */
    setValue: function(value) {
        value = parseInt(value, 10) || 0;
        var $el = this.$el,
            $options = $el.find('.option'),
            $radio, $option;

        $options.each(function(i, option) {
            $option = $(option);
            $radio = $option.find('input[type=radio]');
            if(value === parseInt($radio.val(), 10)) {
                $radio.attr('checked', 'checked');
                $option.addClass('checked');
            } else {
                $radio.removeAttr('checked');
                $option.removeClass('checked');
            }
        });
    },

    /**
     * 控件初始化
     * @param {array} data 初始化数据，价格区间数组
     * @param {number} value 选中的值，默认为0
     */
    init: function(data, value) {
        this.create(data);
        this.setValue(value);
        this.$el.show();
    }
};

module.exports = exports;

});
;define('taxi:widget/home/home.js', function(require, exports, module){

/**
 * @file 填写订单页js
 * @author liushuai02@baidu.com
 */
'use strict';
var util = require('common:static/js/util.js'),
    cookie = require('common:widget/cookie/cookie.js'),
    stat = require('common:widget/stat/stat.js'),
    geolocation = require('common:widget/geolocation/geolocation.js'),
    location = require('common:widget/geolocation/location.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    suggestion = require('common:widget/suggestion/suggestion.js'),
    quickdelete = require('common:widget/quickdelete/quickdelete.js'),
    popup = require('common:widget/popup/popup.js'),
    addprice = require('taxi:widget/common/addprice/addprice.js'),

    exports = {
        create: function () {
            var that = this,
                $el = $('.taxi-widget-home'),
                $btnSubmit = $el.find('.btn-submit'),
                $nearbyCarInfo = $el.find('.nearby-car-info'),
                $addPrice = $el.find('.add-price'),
                $routeStart = $el.find('input[name=route_start]'),
                $routeEnd = $el.find('input[name=route_end]'),
                $form = $el.find('.form'),
                $inputPanel = $el.find('.input-panel'),
                $poiInput = $el.find('.poi-input'),
                $btnBack = $el.find('.btn-back'),
                $btnBackToForm = $el.find('.btn-back-to-form'),
                $btnSettings = $el.find('.btn-settings'),
                $btnConfirm = $el.find('.btn-confirm'),
                $formInputWrapper = $el.find('.form .input-wrapper');

            if (document.referrer) {
                $btnBack.show();
                $btnBack.on('click', $.proxy(this.onBtnBackClick, this));
            }

            // 绑定提交订单事件
            $btnSubmit.on('click', $.proxy(this.onBtnSubmitClick, this));
            $btnBackToForm.on('click', $.proxy(this.onBtnBackToFormClick, this));
            $btnConfirm.on('click', $.proxy(this.onBtnConfirmClick, this));
            $btnSettings.on('click', $.proxy(this.onBtnSettingsClick, this));
            $formInputWrapper.on('click', $.proxy(this.onFormInputClick, this));


            broadcaster.subscribe('geolocation.mylocsuc', this.onGeoSuccess, this);
            broadcaster.subscribe('geolocation.fail', this.onGeoFail, this);

            // 注册suggesstion
            this.suggestion = $.ui.suggestion({
                container: '.poi-input',
                mask: '.input-panel',
                source: 'http://map.baidu.com/su',
                listCount: 4,       // SUG条目
                posAdapt: false,    // 自动调整位置
                isSharing: true,    // 是否共享
                offset: {           // 设置初始偏移量
                    x: 0,
                    y: 0
                },
                param: $.param({
                    type: "0",
                    newmap: "1",
                    ie: "utf-8"
                }),
                onsubmit: function () {
                    that.onBtnConfirmClick.call(that);
                }
            });

            // 将其他方法用到的变量附加到this
            this.$el = $el;
            this.$nearbyCarInfo = $nearbyCarInfo;
            this.$addPrice = $addPrice;
            this.$btnSubmit = $btnSubmit;
            this.$form = $form;
            this.$inputPanel = $inputPanel;
            this.$routeStart = $routeStart;
            this.$routeEnd = $routeEnd;
        },
        onBtnSubmitClick: function () {
            var $el = this.$el,
                $form = $el.find('form'),
                params = util.urlToJSON($form.serialize()),
                verifyResult = this.verifyInput();


            if (!this.geoSuccess) {
                popup.open({
                    text: '定位不成功，不能发起打车请求！',
                    layer: true
                });
                return false;
            }

            if (!this.getNearbyCarInfoSuccess) {
                popup.open({
                    text: '获取附近车辆信息失败，请稍后再试！',
                    layer: true
                });
                return false;
            }

            if (verifyResult > 0) {
                // 发送请求
                popup.open({
                    text: '正在提交表单...',
                    layer: true,
                    autoCloseTime: 0
                });

                LoadManager.request({
                    data: params,
                    success: function (data) {
                        cookie.set('BAIDU_TAXI_ORDER_ID', data.info.order_id, {
                            // 订单45分钟默认为成单状态
                            expires: 1000 * 60 * 60 * 45
                        });
                        cookie.set('BAIDU_TAXI_ORDER_START_TIME', Date.now());
                        LoadManager.loadPage('waiting', $.extend({}, params, data.info));
                        stat.addStat(STAT_CODE.TAXI_USERREQ, {
                            addPrice: params.add_price
                        });
                    },
                    error: function (data) {
                        switch (data.errno) {
                            case -121:
                                popup.open({
                                    text: '发单太频繁，请稍后再试',
                                    layer: true
                                });
                                break;
                            default:
                                popup.open({
                                    text: '系统错误！',
                                    layer: true
                                });
                        }
                    }
                });
            } else {
                switch (verifyResult) {
                    case -1:
                        LoadManager.loadPage('verify', util.urlToJSON(params + '&referrer=home'));
                        break;
                    case -2:
                        popup.open({
                            text: '请输入起点!',
                            layer: true
                        });
                        break;
                    case -3:
                        popup.open({
                            text: '请输入终点!',
                            layer: true
                        });
                        break;
                    default:
                        break;
                }
            }
        },
        onFormInputClick: function (e) {
            var $input = $(e.currentTarget).find('input'),
                type = $input.attr('name');

            this.$form.hide();
            this.$inputPanel.show();
            this.$inputPanel.attr('data-type', type);
            this.$inputPanel.find('.poi-input').val($input.val()).focus();
        },
        onBtnSettingsClick: function () {
            var phone = cookie.get('BAIDU_TAXI_PHONE');
            if (phone) {
                LoadManager.loadPage('settings');
            } else {
                LoadManager.loadPage('verify');
            }
        },
        onBtnBackToFormClick: function () {
            this.backToForm();
        },
        onBtnConfirmClick: function () {
            var type = this.$inputPanel.attr('data-type');
            this.$el.find('input[name=' + type + ']')
                .val(this.$inputPanel.find('.poi-input').val());

            this.backToForm();
        },
        backToForm: function () {
            this.$inputPanel.find('.poi-input').val('');
            this.$inputPanel.hide();
            this.$form.show();
        },
        onGeoSuccess: function (data) {
            var cityCode = parseInt(data.addr.cityCode, 10),
                address;

            if (this.cityList.indexOf(cityCode) > -1) {
                this.getNearByCarInfo(data.point.x, data.point.y, cityCode);

                address = data.addr;
                address = address.address || (address.city + address.district + address.street);
                this.$routeStart.val(address);
            } else {
                popup.open({
                    text: '当前城市不支持打车！',
                    layer: true
                });
            }
            this.geoSuccess = true;
        },
        onGeoFail: function () {
            popup.open({
                text: '定位失败\n请检查定位服务，以便将打车请求发您周边的司机!',
                layer: true
            });
            this.geoFail = true;
        },
        /**
         * 校验输入是否合法
         */
        verifyInput: function () {
            var phone = cookie.get('BAIDU_TAXI_PHONE'),
                routeStart = this.$routeStart.val(),
                routeEnd = this.$routeEnd.val();

            if (!routeStart) {
                return -2;
            }
            if (!routeEnd) {
                return -3;
            }
            if (!phone) {
                return -1;
            }
            return true;
        },
        /**
         * 获取附近出租车信息
         * @param {number} lng
         * @param {number} lat
         * @param {number} cityCode
         */
        getNearByCarInfo: function (lng, lat, cityCode) {
            var that = this,
                $nearbyCarInfo = this.$nearbyCarInfo;

            LoadManager.request({
                data: {
                    qt: 'nearby',
                    lng: lng,
                    lat: lat,
                    city_code: cityCode
                },
                success: function (data) {
                    var price_list, $el = that.$el;

                    $nearbyCarInfo
                        .addClass('loaded')
                        .find('.count').text(data.info.taxi_num);

                    if (data.info.is_add_price && data.info.is_add_price.flag === 1
                        && (price_list = data.info.is_add_price.price_list)) {
                        price_list = price_list.split(':');
                        addprice.init(price_list);

                        // 如果有加价模块将表单域中的加价默认值删除
                        $el.find('[type=input][name=add_price]').remove();
                    }

                    //填充表单域
                    $el.find('[name=taxi_num]').val(data.info.taxi_num);
                    $el.find('[name=lng]').val(lng);
                    $el.find('[name=lat]').val(lat);
                    $el.find('[name=city_code]').val(cityCode);
                    $el.find('[name=price_list]').val(price_list);
                    $el.find('[name=phone]').val(cookie.get('BAIDU_TAXI_PHONE'));
                    that.getNearbyCarInfoSuccess = true;
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -105:
                            text = '当前城市不支持打车！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        },
        /**
         * 获取当前支持打车的城市id列表
         * @param {function} callback 获取成功回调函数
         */
        getCityList: function (callback) {
            var that = this;
            LoadManager.request({
                data: {
                    qt: 'citylist',
                    city_list: 'all'
                },
                success: function (data) {
                    that.cityList = data.info;
                    callback();
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -101:
                            text = '参数错误！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        },
        onBtnBackClick: function () {
            window.location.href = document.referrer;
        },
        destroy: function () {

        },
        init: function () {
            this.create();
            this.getCityList($.proxy(geolocation.init, geolocation));
        }
    };

module.exports = exports;


});
;define('taxi:widget/common/radar/radar.js', function(require, exports, module){

/**
 * @file 雷达动画图标
 * @author liushuai02@baidu.com
 */
'use strict';
var exports = {
    create: function() {

        this.$el = $('.taxi-widget-radar');
        this.$inner = this.$el.find('.inner');

        this.currentStep = 0;
        this.maxStep = 9;
        this.timeperframe = 150;

        // 计算雷达高度
        this.$el.css({
            height: (innerHeight - 110) + 'px',
            visibility: 'visible'
        });
    },
    start: function() {
        this.interval = setInterval($.proxy(this.oneMove, this), this.timeperframe);
    },
    oneMove: function() {
        var $inner = this.$inner, innerWidth = $inner.width();

        $inner.css('background-position-y', -(((++this.currentStep)%this.maxStep) * innerWidth) + 'px');
    },
    destroy: function() {
        clearInterval(this.interval);
        this.interval = -1;
    },
    init: function() {
        this.create();
        this.start();
    }
};

module.exports = exports;



});
;define('taxi:widget/waiting/waiting.js', function(require, exports, module){

/**
 * @file 等车
 * @author liushuai02@baidu.com
 */
'use strict';
var util = require('common:static/js/util.js'),
    cookie = require('common:widget/cookie/cookie.js'),
    stat = require('common:widget/stat/stat.js'),
    radar = require('taxi:widget/common/radar/radar.js'),

    exports = {
        create: function () {
            var $el = $('.taxi-widget-waiting'),
                $nearbyCarCount = $el.find('.taxi-info .count'),
                options = this.options;

            $nearbyCarCount.text(options.taxi_num);

            this.$el = $el;
        },
        /**
         * 倒计时
         * @param {number} limit 最大推送量
         */
        countDown: function () {
            var that = this, options = this.options,
                limit = Math.min(parseInt(options.limit, 10), parseInt(options.taxi_num, 10)),
                $el = this.$el,
                $pushedCount = $el.find('.pushed-car .count'),
                $restSecond = $el.find('.second'),
                count, second,
                orderStartTime = parseInt(cookie.get('BAIDU_TAXI_ORDER_START_TIME'), 10), totalTime,
                step = function () {
                    count = parseInt($pushedCount.text(), 10);
                    second = parseInt($restSecond.text(), 10);

                    count = Math.min(count + 2, limit);
                    second -= 1;

                    $pushedCount.text(count);
                    $restSecond.text(second);

                    if (second <= 0) {
                        // 进入重发逻辑
                        that.destroy();
                        LoadManager.loadPage('resubmit', options);
                    } else {
                        that.timeout.push(setTimeout(step, 1000));
                    }
                };
            if (typeof(orderStartTime) === 'number' && !isNaN(orderStartTime)) {
                totalTime = 120 - Math.ceil((Date.now() - orderStartTime) / 1000);
                if (totalTime < 0) {
                    this.destroy();
                    LoadManager.loadPage('resubmit', options);
                } else {
                    $restSecond.text(totalTime);
                }
            }

            this.timeout.push(setTimeout(step, 1000));
        },
        getCarReply: function () {
            var that = this,
                interval, options = this.options,
                order_id = options.order_id;

            interval = setInterval(function () {
                LoadManager.request({
                    data: {
                        qt: 'driverreply',
                        order_id: order_id
                    },
                    success: function (data) {
                        if (data.info) {
                            clearInterval(interval);
                            interval = null;

                            that.destroy();
                            LoadManager.loadPage('response', data.info);
                            stat.addStat(STAT_CODE.TAXI_DRIVERREPLY);
                        }
                    },
                    error: function (data) {
                    }
                });
            }, 5000);
            this.interval.push(interval);
        },
        destroy: function () {
            var i, t, len, interval = this.interval, timeout = this.timeout;
            for (i = 0, len = interval.length; i < len; i++) {
                clearInterval(interval[i]);
            }
            for(i = 0, len = timeout.length; i < len; i++) {
                clearTimeout(timeout[i]);
            }
            radar.destroy();
        },
        init: function () {
            var options = this.options = LoadManager.getPageOptions();

            if (!options) {
                this.destroy();
                LoadManager.loadPage('home');
            }
            this.timeout = [];
            this.interval = [];
            this.create();
            this.countDown();
            this.getCarReply();
        }
    };

module.exports = exports;



});
;define('taxi:widget/resubmit/resubmit.js', function(require, exports, module){

/**
 * @file
 * @author liushuai02@baidu.com
 */

'use strict';

var util = require('common:static/js/util.js'),
    popup = require('common:widget/popup/popup.js'),
    stat = require('common:widget/stat/stat.js'),
    cookie = require('common:widget/cookie/cookie.js'),
    addprice = require('taxi:widget/common/addprice/addprice.js'),
    radar = require('taxi:widget/common/radar/radar.js'),

    exports = {
        create: function () {
            var $el = $('.taxi-widget-resubmit'),
                $btnResubmit = $el.find('.btn-resubmit'),
                $btnBack = $el.find('.btn-back'),
                $form = $el.find('form'),
                $addpriceWrapper  = $el.find('.addprice-wrapper'),
                options = this.options,
                priceList;

            // 创建加价模块
            if (options.price_list) {
                priceList = options.price_list.split(',');
                addprice.init(priceList);

                // 如果有加价模块将表单域中的加价默认值删除
                $el.find('[type=input][name=add_price]').remove();
            } else {
                $addpriceWrapper.hide();
            }

            $el.find('[name=city_code]').val(options.city_code);
            $el.find('[name=order_id]').val(options.order_id);

            $btnResubmit.on('click', $.proxy(this.onBtnResubmitClick, this));
            $btnBack.on('click', $.proxy(this.onBtnBackClick, this));

            this.$el = $el;
            this.$form = $form;
        },
        onBtnResubmitClick: function () {
            var options = $.extend({
                price_list: this.options.price_list,
                taxi_num: this.options.taxi_num
            }, util.urlToJSON(this.$form.serialize()));

            popup.open({
                text: '正在提交表单...',
                layer: true,
                autoCloseTime: 0
            });

            LoadManager.request({
                data: $.extend({}, options, {
                    qt: 'addpricereq'
                }),
                success: function (data) {
                    cookie.set('BAIDU_TAXI_ORDER_ID', data.info.order_id, {
                        expires: 1000 * 60 * 60 * 45
                    });

                    cookie.set('BAIDU_TAXI_ORDER_START_TIME', Date.now());
                    LoadManager.loadPage('waiting', $.extend({}, options, data.info));
                    stat.addStat(STAT_CODE.TAXI_ADDPRICEREQ);
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -304:
                            text = '订单已过期或结束！';
                            break;
                        case -113:
                            text = '请求过于频繁，请稍后再试！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true,
                        onClose: function() {
                            cookie.remove('BAIDU_TAXI_ORDER_ID');
                            LoadManager.loadPage('home');
                        }
                    });
                }
            });
        },
        onBtnBackClick: function() {
            cookie.remove('BAIDU_TAXI_ORDER_ID');
        },
        destroy: function() {
            radar.destroy();
        },
        init: function () {
            var options = this.options = LoadManager.getPageOptions(),
                orderId = cookie.get('BAIDU_TAXI_ORDER_ID');

            if(!options || !orderId) {
                LoadManager.loadPage('home');
            }
            this.create();
        }
    };

module.exports = exports;


});
;define('taxi:widget/response/response.js', function(require, exports, module){

/**
 * @file 司机响应
 * @author liushuai02@baidu.com
 */
'use strict';

var util = require('common:static/js/util.js'),
    cookie = require('common:widget/cookie/cookie.js'),
    stat = require('common:widget/stat/stat.js'),
    exports = {
        create: function () {
            var $el = this.$el = $('.taxi-widget-response'),
                $feedbackdialog = this.$feedbackdialog = $el.find('.feedbackdialog'),
                $btnOnCar = $el.find('.btn-on-car'),
                $btnNotCome = $el.find('.btn-not-come'),
                $btnAgreement = $el.find('.btn-agreement'),
                $btnEnd = $el.find('.btn-end'),
                $dialogLayer = this.$dialogLayer = $('<div/>')
                    .addClass('taxi-widget-response-feedbackdialog-layer')
                    .hide().appendTo(document.body);

            $feedbackdialog.appendTo($dialogLayer);
            $btnEnd.on('click', $.proxy(this.onBtnEndClick, this));
            $btnOnCar.on('click', $.proxy(this.onBtnOnCarClick, this));
            $btnNotCome.on('click', $.proxy(this.onBtnNotComeClick, this));
            $btnAgreement.on('click', $.proxy(this.onBtnAgreementClick, this));

            this.$responder = $el.find('.responder');
        },
        showResponder: function () {
            var innerHTML = this.$responder.html(),
                options = this.options;

            innerHTML = innerHTML.replace(/\$\{([a-z_]+)\}/g, function (m, key) {
                return options[key];
            });

            this.$responder.html(innerHTML);
            this.$responder.show();
        },
        openDialog: function () {
            this.$feedbackdialog.show();
            this.$dialogLayer.show();
        },
        closeDialog: function () {
            this.$feedbackdialog.hide();
            this.$dialogLayer.hide();
        },
        onBtnEndClick: function () {
            this.openDialog();
        },
        onBtnOnCarClick: function () {
            var that = this;
            LoadManager.request({
                data: {
                    qt: 'ordercomment',
                    order_id: this.orderId,
                    comment_type: 4
                },
                complete: function () {
                    that.closeDialog();
                    cookie.remove('BAIDU_TAXI_ORDER_ID');
                    LoadManager.loadPage('home');
                    stat.addStat(STAT_CODE.TAXI_ON_CAR);
                }
            });
        },
        onBtnNotComeClick: function () {
            var that = this;
            LoadManager.request({
                data: {
                    qt: 'ordercomment',
                    order_id: this.orderId,
                    comment_type: 5
                },
                complete: function () {
                    that.closeDialog();
                    cookie.remove('BAIDU_TAXI_ORDER_ID');
                    LoadManager.loadPage('home');
                    stat.addStat(STAT_CODE.TAXI_NOT_COME);
                }
            });
        },
        onBtnAgreementClick: function () {
            var that = this;
            LoadManager.request({
                data: {
                    qt: 'ordercomment',
                    order_id: this.orderId,
                    comment_type: 6
                },
                complete: function () {
                    that.closeDialog();
                    cookie.remove('BAIDU_TAXI_ORDER_ID');
                    LoadManager.loadPage('home');
                    stat.addStat(STAT_CODE.TAXI_AGREEMENT);
                }
            });
        },
        resizeFeedbackdialog: function () {
            this.$feedbackdialog.css({
                width: '270px',
                height: '210px',
                left: (window.innerWidth - 270) / 2 + 'px',
                top: (window.innerHeight - 210) / 2 + 'px'
            });
        },
        getTaxiPos: function () {
            var that = this, $el = this.$el,
                $distanceCount = $el.find('.distance .count'),
                $restTimeCount = $el.find('.rest-time .count'),
                interval;

            interval = setInterval(function () {
                LoadManager.request({
                    data: {
                        qt: 'taxipos',
                        order_id: that.orderId
                    },
                    success: function (data) {
                        var info = data.info;

                        $distanceCount.text(info.distance);
                        $restTimeCount.text(info.rest_time);

                        if (info.is_arrived) {
                            clearInterval(interval);
                            interval = -1;
                        }
                    },
                    error: function () {

                    }
                });
            }, 5000);
            this.interval = interval;
        },
        destroy: function () {
            clearInterval(this.interval);
            this.interval = -1;
        },
        init: function () {
            var options = this.options = LoadManager.getPageOptions(),
                orderId = cookie.get('BAIDU_TAXI_ORDER_ID');

            if (!options || !orderId) {
                LoadManager.loadPage('home');
            }
            this.orderId = orderId;
            this.create();
            this.showResponder();
            this.resizeFeedbackdialog();
            this.getTaxiPos();
        }
    };

module.exports = exports;



});
;define('taxi:widget/verify/verify.js', function(require, exports, module){

/**
 * @file 验证手机界面
 * @author liushuai02@baidu.com
 */
'use strict';
var util = require('common:static/js/util.js'),
    cookie = require('common:widget/cookie/cookie.js'),
    popup = require('common:widget/popup/popup.js'),
    stat = require('common:widget/stat/stat.js'),
    exports = {
        create: function () {
            var $el = this.$el = $('.taxi-widget-verify'),
                $inputPhone = this.$inputPhone = $el.find('.input-phone'),
                $inputCode = this.$inputCode = $el.find('.input-code'),
                $btnGetCode = this.$btnGetCode = $el.find('.btn-get-code'),
                $btnVerifyPhone = this.$btnVerifyPhone = $el.find('.btn-verify-phone'),
                options = this.options;

            $btnGetCode.on('click', $.proxy(this.onBtnGetCodeClick, this));
            $btnVerifyPhone.on('click', $.proxy(this.onBtnVerifyPhoneClick, this));
            $inputPhone.on('keyup', $.proxy(this.onInputPhoneKeyup, this));
            $inputCode.on('keyup', $.proxy(this.onInputCodeKeyup, this));

            $inputPhone.val(options.phone || '');
            if (Taxi.validatePhone($inputPhone.val())) {
                $btnGetCode.removeAttr('disabled');
            }

            this.$btnGetCode = $btnGetCode;
            this.$inputPhone = $inputPhone;
        },
        onBtnGetCodeClick: function () {
            var that = this,
                $btnGetCode = this.$btnGetCode,
                $inputPhone = this.$inputPhone,
                interval, time = 60,
                btnText = $btnGetCode.text(),
                refreshText = function () {
                    $btnGetCode.text(time + '秒');
                    time--;
                };

            $btnGetCode.attr('disabled', 'disabled');
            $inputPhone.attr('disabled', 'disabled');


            LoadManager.request({
                data: {
                    qt: 'sendcode',
                    phone: this.$inputPhone.val()
                },
                success: function () {
                    refreshText();
                    interval = that.interval = setInterval(function () {
                        if (time === 0) {
                            $btnGetCode.removeAttr('disabled');
                            $inputPhone.removeAttr('disabled');
                            $btnGetCode.text(btnText);
                            clearInterval(interval);
                            interval = -1;
                        } else {
                            refreshText();
                        }
                    }, 1000);
                },
                error: function (data) {
                    var text = '';
                    switch(data.errno) {
                        case -201:
                            text = '请求太频繁，请60秒后重试！';
                        break;
                        case -101:
                            text = '参数错误！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true,
                        onClose: function () {
                            $btnGetCode.removeAttr('disabled');
                            $inputPhone.removeAttr('disabled');
                            $btnGetCode.text(btnText);
                            clearInterval(that.interval);
                            that.interval = -1;
                        }
                    });
                }
            });
        },
        onBtnVerifyPhoneClick: function () {
            var phone = this.$inputPhone.val(),
                $btnVerifyPhone = this.$btnVerifyPhone,
                options = this.options,
                referrer = options['referrer'];

            $btnVerifyPhone.attr('disabled', 'disabled');

            LoadManager.request({
                data: {
                    qt: 'verifycode',
                    phone: phone,
                    code: this.$inputCode.val()
                },
                success: function (data) {
                    if (data.info.is_pass === 1) {
                        // 根据来源进入不同的页面，将手机号设置进cookie
                        cookie.set('BAIDU_TAXI_PHONE', phone, {
                            expires: 1000 * 60 * 60 * 24 * 365
                        });

                        delete options['referrer'];
                        switch (referrer) {
                            case 'home':
                                popup.open({
                                    text: '正在发送打车请求...',
                                    layer: true,
                                    autoCloseTime: 0
                                });
                                LoadManager.request({
                                    data: $.extend({}, options, {
                                        qt: 'userreq',
                                        phone: phone
                                    }),
                                    success: function (data) {
                                        cookie.set('BAIDU_TAXI_ORDER_ID', data.info.order_id, {
                                            // 订单45分钟默认为成单状态
                                            expires: 1000 * 60 * 60 * 45
                                        });
                                        cookie.set('BAIDU_TAXI_ORDER_START_TIME', Date.now());
                                        LoadManager.loadPage('waiting', $.extend({}, options, data.info));
                                    },
                                    error: function (data) {
                                        if (data.errno === -101) {
                                            popup.open({
                                                text: '请求参数错误！',
                                                layer: true,
                                                onClose: function() {
                                                    LoadManager.loadPage('home');
                                                }
                                            });
                                        }
                                    }
                                });
                                break;

                            case 'settings':
                                LoadManager.loadPage('home');
                                break;
                            default:
                                LoadManager.loadPage('home');
                                break;
                        }
                    } else {
                        popup.open({
                            text: '验证码错误！',
                            layer: true
                        });
                    }
                    $btnVerifyPhone.removeAttr('disabled');
                    stat.addStat(STAT_CODE.TAXI_VERIFYCODE);
                },
                error: function () {
                    $btnVerifyPhone.removeAttr('disabled');
                }
            });
        },
        onInputPhoneKeyup: function () {
            if (Taxi.validatePhone(this.$inputPhone.val())) {
                this.$btnGetCode.removeAttr('disabled');
            } else {
                this.$btnGetCode.attr('disabled', 'disabled');
            }
        },
        onInputCodeKeyup: function () {
            if (Taxi.validatePhone(this.$inputPhone.val()) &&
                Taxi.validateCode(this.$inputCode.val())) {
                this.$btnVerifyPhone.removeAttr('disabled');
            } else {
                this.$btnVerifyPhone.attr('disabled', 'disabled');
            }
        },
        destroy: function() {
            clearInterval(this.interval);
            this.interval = -1;
        },
        init: function () {
            var options = this.options = LoadManager.getPageOptions();
            this.create();
        }
    };
module.exports = exports;



});
;define('taxi:widget/settings/settings.js', function(require, exports, module){

/**
 * @file 设置页js
 */
'use strict';

var cookie = require('common:widget/cookie/cookie.js'),
    popup = require('common:widget/popup/popup.js'),
    exports = {
        create: function () {
            var $el = $('.taxi-widget-settings'),
                $inputPhone = $el.find('.input-phone'),
                $btnModify = $el.find('.btn-modify'),
                $btnHelp = $el.find('.btn-help'),
                $btnTerms = $el.find('.btn-terms');


            $inputPhone.val(cookie.get('BAIDU_TAXI_PHONE'));
            if(!Taxi.validatePhone($inputPhone.val())) {
                $btnModify.attr('disabled', 'disabled');
            }

            $btnModify.on('click', $.proxy(this.onBtnModifyClick, this));
            $inputPhone.on('keyup', $.proxy(this.onInputPhoneKeyup, this));
            $btnHelp.on('click', $.proxy(this.onArticleButtonClick, this));
            $btnTerms.on('click', $.proxy(this.onArticleButtonClick, this));

            this.$el = $el;
            this.$btnModify = $btnModify;
            this.$inputPhone = $inputPhone;
        },
        onArticleButtonClick: function(e) {
            var type = e.currentTarget.className.split('-')[1];

            LoadManager.loadPage('about', {
                type: type
            });
        },
        onBtnModifyClick: function () {
            var phone = this.$inputPhone.val();
            LoadManager.loadPage('verify', {
                phone: phone,
                referrer: 'settings'
            });
        },
        onInputPhoneKeyup: function() {
            if(Taxi.validatePhone(this.$inputPhone.val())) {
                this.$btnModify.removeAttr('disabled');
            } else {
                this.$btnModify.attr('disabled', 'disabled');
            }
        },
        init: function () {
            this.create();
        }
    };

module.exports = exports;

});
;define('taxi:widget/about/about.js', function(require, exports, module){

/**
 * @file 文本页面
 */
'use strict';

var stat = require('common:widget/stat/stat.js'),
    exports = {
    create: function() {
        var $el = $('.taxi-widget-about'),
            $nav = $el.find('.taxi-widget-nav'),
            options = this.options,
            type = options && options.type;

        $nav.find('.title').text(({
            help: '打车攻略',
            terms: '条款与声明'
        })[type]);
        $el.find('.' + type).show();

        if(type === 'help') {
            stat.addStat(STAT_CODE.TAXI_HELP);
        } else {
            stat.addStat(STAT_CODE.TAXI_TERMS);
        }
    },
    init: function() {
        this.options = LoadManager.getPageOptions();

        if(!this.options) {
            popup.open({
                text: '系统异常',
                layer: true,
                onClose: function() {
                    LoadManager.loadPage('home');
                }
            })
        }

        this.create();
    }
};

module.exports = exports;

});
;/**
 * @file 界面加载管理器
 * @author liushuai02@baidu.com
 */

(function (global, BigPipe, undefined) {
    'use strict';

    var popup = require('common:widget/popup/popup.js'),
        cookie = require('common:widget/cookie/cookie.js'),
        util = require('common:static/js/util.js'),
        LoadManager = {
            pageControllerMap: {
                home: require('taxi:widget/home/home.js'),
                waiting: require('taxi:widget/waiting/waiting.js'),
                resubmit: require('taxi:widget/resubmit/resubmit.js'),
                response: require('taxi:widget/response/response.js'),
                verify: require('taxi:widget/verify/verify.js'),
                settings: require('taxi:widget/settings/settings.js'),
                about: require('taxi:widget/about/about.js')
            },
            getPageOptions: function () {
                return util.urlToJSON(cookie.get('BAIDU_TAXI_PAGE_OPTIONS')) || {};
            },
            /**
             * 发起打车相关请求
             * @param {object} options 请求的参数
             * @param {object} options.data 请求的url参数
             * @param {function} options.success 请求成功回调函数
             * @param {function} options.error 请求失败回调函数
             */
            request: function (options) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/mobile/webapp/taxi/api/' + util.jsonToQuery($.extend({}, options.data, {
                        api: 2,
                        os: 'webapp'
                    })),
                    success: function (data) {
                        if (data && data.errno === 0) {
                            if (options.success && $.isFunction(options.success)) {
                                options.success(data);
                            }
                        } else {
                            if (options.error && $.isFunction(options.error)) {
                                options.error(data);
                            }
                        }
                    },
                    error: function(xhr, type, error) {
                        popup.open({
                            text: '当前网络无法使用，请稍后重试！',
                            layer: true
                        });
                        if($.isFunction(options.error) && xhr && (xhr.errno > 0)) {
                            options.error();
                        }
                    },
                    complete: options.complete
                });
            },
            loadPage: function (page, options) {
                var id, that = this, lastPage, pageController, $wrapper = $('#wrapper');

                page = page || that.getPageState('lastPage') || 'home';
                if (options) {
                    if (typeof(options) === 'object') {
                        options = util.jsonToQuery(options);
                    }
                    cookie.set('BAIDU_TAXI_PAGE_OPTIONS', options);
                }

                id = 'taxi-pagelet-' + page;

                BigPipe.asyncLoad({id: id}, options, function () {
                    popup.close();
                    $('<div/>').attr({
                        id: id
                    }).appendTo($wrapper.html(''));

                    // 当前页与上一页不一样时，认为是页面间跳转，否则视为页面初始刷新，不做销毁处理
                    if (that.getPageState('lastPage') !== page) {
                        // 销毁上一个页面
                        lastPage = that.getPageState('lastPage');
                        pageController = that.pageControllerMap[lastPage];
                        if (pageController && pageController.destroy && $.isFunction(pageController.destroy)) {
                            pageController.destroy();
                        }

                        that.setPageState('lastPage', page);
                    }
                });
            },
            route: function () {
                var that = this, orderId;

                orderId = cookie.get('BAIDU_TAXI_ORDER_ID');
                if (orderId) {
                    this.request({
                        data: {
                            qt: 'orderstatus',
                            order_id: orderId
                        },
                        success: function (data) {
                            var status = data.info && data.info.status;

                            switch (status) {
                                // 第三方数据返回，但已过期120s，进入重发页面
                                case -1:
                                    that.loadPage('resubmit');
                                    break;
                                // 第三方抢单数据已返回，进入司机应答页
                                case 2:
                                    that.loadPage('response');
                                    break;
                                // 订单创建成功，进入推送页
                                case 1:
                                    that.loadPage('waiting');
                                    break;
                                // 订单过期、无效、成单、结束清除状态cookie回到首页
                                case 3:
                                case -2:
                                case 3:
                                case 4:
                                    cookie.remove('BAIDU_TAXI_PAGE_STATE');
                                    that.loadPage('home');
                                    break;
                                default:
                                    cookie.remove('BAIDU_TAXI_PAGE_STATE');
                                    that.loadPage('home');
                                    break;

                            }

                            // 保存订单状态
                            that.setPageState('status', status);
                            // 保存订单存在时间
                            that.setPageState('existTime', data.info.exist_time);
                        },
                        error: function (xhr, type, error) {
                            cookie.remove('BAIDU_TAXI_PAGE_STATE');
                            that.loadPage('home');
                        }
                    });
                } else {
                    this.loadPage(this.getPageState('lastPage'));
                }
            },
            getPageState: function (key) {
                var pageState = util.urlToJSON(cookie.get('BAIDU_TAXI_PAGE_STATE'));

                return pageState && pageState[key];
            },
            setPageState: function (key, value) {
                var pageState = util.urlToJSON(cookie.get('BAIDU_TAXI_PAGE_STATE'));

                pageState[key] = value;
                cookie.set('BAIDU_TAXI_PAGE_STATE', util.jsonToQuery(pageState));
            },
            removePageState: function (key) {
                this.setPageState(key, undefined);
            },
            init: function () {
                popup.open({
                    text: '正在加载...',
                    layer: true,
                    autoCloseTime: 0
                });
                this.route();
            }
        };

    LoadManager.init();
    global.LoadManager = LoadManager;
}(window, BigPipe));


;/**
 * @file taxi模块公用方法库
 * @author liushuai02@baidu.com
 */

(function () {
    'use strict';

    var util = require('common:static/js/util.js'),
        popup = require('common:widget/popup/popup.js'),
        Taxi;

    Taxi = {
        resize: function() {
            var $main = $('#main'),
                $header = $('header');

            $main.height(window.innerHeight - $header.height());
        },
        validatePhone: function (phone) {
            return (/^1\d{10}$/g).test(phone);
        },
        validateCode: function (code) {
            return (/^\d{4}$/g).test(code);
        }
    };

    if (typeof window.onorientationchange !== 'undefined') {
        window.addEventListener('orientationchange', Taxi.resize, false);
    } else {
        window.addEventListener('resize', Taxi.resize, false);
    }
    if (util.isAndroid()) {
        window.addEventListener('resize', Taxi.resize, false);
    }

    window.Taxi = Taxi;
}());


;define('taxi:widget/common/nav/nav.js', function(require, exports, module){

var exports = {
    create: function () {
        var $el = $('.taxi-widget-nav'),
            $btnBack = $el.find('.btn-back');

        $btnBack.on('click', $.proxy(this.onBtnBackClick, this));
    },
    onBtnBackClick: function (e) {
        var $currentTarget = $(e.currentTarget),
            back = $currentTarget.attr('data-back');
        if (back) {
            LoadManager.loadPage(back);
        } else {
            LoadManager.loadPage('home');
        }
    },
    init: function () {
        this.create();
    }
};
module.exports = exports;

});