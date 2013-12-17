define('taxi:widget/channel/channel.js', function(require, exports, module){

'use strict';

var util = require('common:static/js/util.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    vcode = require('taxi:widget/common/vcode/vcode.js'),

    exports = {
        create: function () {
            var $el = $('.taxi-widget-channel'),
                $btnGetTicket = $el.find('.btn-get-ticket'),
                $phoneInput = $el.find('.phone-input'),
                $btnLater = $el.find('.btn-later'),
                $dialogSuccess = $el.find('.dialog.success'),
                $dialogOne = $el.find('.dialog.one'),
                $dialogInvalid = $el.find('.dialog.invalid');

            $btnGetTicket.on('click', $.proxy(this.onBtnTicketClick, this));
            $btnLater.on('click', $.proxy(this.onBtnLaterClick, this));

            this.$el = $el;
            this.$phoneInput = $phoneInput;
            this.$dialogSuccess = $dialogSuccess;
            this.$dialogOne = $dialogOne;
            this.$dialogInvalid = $dialogInvalid;
        },
        onBtnTicketClick: function () {
            var that = this, phone;

            phone = this.$phoneInput.val();

            if (!phone) {
                popup.open({
                    text: '请输入手机号！',
                    layer: true
                });
                return false;
            }

            if (!Taxi.validatePhone(phone)) {
                popup.open({
                    text: '手机号格式错误！',
                    layer: true
                });
                return false;
            }

            if(!vcode.getCode()) {
                popup.open({
                    text: '请输入验证码！',
                    layer: true
                });
                return false;
            }

            LoadManager.request({
                data: {
                    qt: 'bddiscount',
                    phone: phone,
                    channel: util.urlToJSON(location.search.split('?')[1]).channel,
                    code: vcode.getCode(),
                    vcode: vcode.getVCode()
                },
                success: function () {
                    that.$dialogSuccess.css({
                        display: '-webkit-box'
                    });
                },
                error: function (data) {
                    if (data && typeof(data.errno) === 'number') {
                        switch (data.errno) {
                            case -400:
                                that.$dialogOne.css({
                                    display: '-webkit-box'
                                });
                                break;
                            case -401:
                            case -402:
                                that.$dialogInvalid.css({
                                    display: '-webkit-box'
                                });
                                break;
                            case -403:
                                popup.open({
                                    text: '验证码错误！',
                                    layer: true
                                });
                                break;
                            default:
                                popup.open({
                                    text: '获取失败，请稍后重试！',
                                    layer: true
                                });
                                break;
                        }
                    }
                }
            });
        },
        onBtnLaterClick: function () {
            this.$dialogSuccess.css({
                display: 'none'
            });
        },
        init: function () {
            this.create();
        }
    };

module.exports = exports;

});