/**
 * @file 填写订单页js
 * @author liushuai02@baidu.com
 */
'use strict';
require('common:static/js/gmu/src/widget/suggestion/suggestion.js');
require('common:static/js/gmu/src/widget/suggestion/renderlist.js');
require('common:static/js/gmu/src/widget/suggestion/sendrequest.js');

var util = require('common:static/js/util.js'),
    storage = require('taxi:static/js/storage.js'),
    geolocation = require('common:widget/geolocation/geolocation.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    addprice = require('taxi:widget/common/addprice/addprice.js'),
    stat = require('common:widget/stat/stat.js'),

    exports = {
        create: function () {
            var that = this,
                $el = $('.taxi-widget-vip-home'),
                $btnSubmit = $el.find('.btn-submit'),
                $nearbyCarInfo = $el.find('.nearby-car-info'),
                $addPrice = $el.find('.add-price'),
                $routeStart = $el.find('input[name=route_start]'),
                $routeEnd = $el.find('input[name=route_end]'),
                $phone = $el.find('input[name=phone]'),
                $form = $el.find('.home'),
                $inputPanel = $el.find('.input-panel'),
                $btnBackToForm = $el.find('.btn-back-to-form'),
                $btnConfirm = $el.find('.btn-confirm'),
                $formInputWrapper = $el.find('.home .input-wrapper'),
                $btnOrderlist = $el.find('.btn-orderlist'),
                $btnRegister = $el.find('.btn-register');

            // 绑定提交订单事件
            $btnSubmit.on('click', $.proxy(this.onBtnSubmitClick, this));
            $btnBackToForm.on('click', $.proxy(this.onBtnBackToFormClick, this));
            $btnConfirm.on('click', $.proxy(this.onBtnConfirmClick, this));
            $btnOrderlist.on('click', $.proxy(this.onBtnOrderlistClick, this));
            $btnRegister.on('click', $.proxy(this.onBtnRegisterClick, this));
            $formInputWrapper.on('click', $.proxy(this.onFormInputClick, this));


            listener.on('common.geolocation', 'success', function (event, data) {
                that.onGeoSuccess(data);
            });
            listener.on('common.geolocation', 'fail', $.proxy(this.onGeoFail, this));

            this.suggestion = new gmu.Suggestion('#sug-target', {
                source: 'http://map.baidu.com/su',
                cbKey: 'callback',
                listCount: 4, // SUG条目
                appendContanier: '.input-panel', //是否挂在body下面
                historyShare: false,
                quickdelete: false
            });
            this.suggestion.on('select', $.proxy(this.onBtnConfirmClick, this));

            // 将其他方法用到的变量附加到this
            this.$el = $el;
            this.$nearbyCarInfo = $nearbyCarInfo;
            this.$addPrice = $addPrice;
            this.$btnSubmit = $btnSubmit;
            this.$form = $form;
            this.$inputPanel = $inputPanel;
            this.$routeStart = $routeStart;
            this.$routeEnd = $routeEnd;
            this.$phone = $phone;
        },
        onBtnSubmitClick: function () {
            var verifyResult = this.verifyInput(),
                options = util.urlToJSON(this.$el.find('form').serialize()),
                text;

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

            if(!options.phone) {
                options.phone = options['third_phone'];
            }

            if (verifyResult < 0) {
                switch (verifyResult) {
                    case -1:
                        text = "客人电话号码格式错误！";
                        break;
                    case -2:
                        text = '请输入起点!';
                        break;
                    case -3:
                        text = '请输入终点!';
                        break;
                    default:
                        break;
                }
                popup.open({
                    text: text,
                    layer: true
                });
                return false;
            }

            this.submit(options);
        },
        submit: function (options) {
            // 发送请求
            popup.open({
                text: '正在发送打车请求...',
                layer: true,
                autoCloseTime: 0
            });

            LoadManager.request({
                data: options,
                success: function (data) {
                    storage.set('orderId', data.info.order_id);
                    storage.set('orderStartTime', Date.now());
                    popup.open({
                        text: '订单发送成功！',
                        layer: true
                    });
                    stat.addStat(STAT_CODE.TAXI_USERREQ, {
                        addPrice: options.add_price
                    });
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -121:
                            text = '发单太频繁，请稍后再试！';
                            break;
                        case -101:
                            text = '请求参数错误！';
                            break;
                        default:
                            text = '系统错误！';
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        },
        onFormInputClick: function (e) {
            var $input = $(e.currentTarget).find('input'),
                type = $input.attr('name');

            this.$form.hide();
            this.$inputPanel.show();
            this.$inputPanel.attr('data-type', type);
            this.$inputPanel.find('.poi-input').val($input.val()).focus();
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
        onBtnOrderlistClick: function() {
            LoadManager.loadPage('vip/orderlist');
        },
        onBtnRegisterClick: function() {
            LoadManager.loadPage('vip/verify', {
                referrer: 'vip/home'
            });
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

                storage.set('cityCode', cityCode);
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
            var routeStart = this.$routeStart.val(),
                routeEnd = this.$routeEnd.val(),
                phone = this.$phone.val();

            if(phone && !Taxi.validatePhone(phone)) {
                return -1;
            }
            if (!routeStart) {
                return -2;
            }
            if (!routeEnd) {
                return -3;
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
                    $el.find('[name=third_phone]').val(storage.get('thirdPhone'));
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
        destroy: function () {

        },
        init: function () {
            this.create();
            this.getCityList($.proxy(geolocation.init, geolocation));
        }
    };

module.exports = exports;
