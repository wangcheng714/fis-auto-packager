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
