/**
 * @file 验证手机界面
 * @author liushuai02@baidu.com
 */
'use strict';
var storage = require('taxi:static/js/storage.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    stat = require('common:widget/stat/stat.js'),
    taxirequester = require('taxi:widget/common/taxirequester/taxirequester.js'),
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
                phone = this.$inputPhone.val(),
                refreshText = function () {
                    $btnGetCode.text(time + '秒');
                    time--;
                };

            $btnGetCode.attr('disabled', 'disabled');
            $inputPhone.attr('disabled', 'disabled');


            LoadManager.request({
                data: {
                    qt: 'sendcode',
                    phone: phone
                },
                success: function () {
                    LoadManager.setPageOptions('phone', phone);
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
                    switch (data.errno) {
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

            popup.open({
                text: '正在验证手机号...',
                layer: true,
                autoCloseTime: 0
            });

            LoadManager.request({
                data: {
                    qt: 'verifycode',
                    phone: phone,
                    code: this.$inputCode.val()
                },
                success: function (data) {
                    popup.close();
                    if (data.info.is_pass === 1) {
                        // 根据来源进入不同的页面
                        storage.set('phone', phone);

                        delete options['referrer'];
                        switch (referrer) {
                            case 'home':
                                taxirequester.request($.extend({}, options, {
                                    qt: 'userreq',
                                    phone: phone
                                }));
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
                    popup.close();
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
        destroy: function () {
            clearInterval(this.interval);
            this.interval = -1;
        },
        init: function () {
            this.options = LoadManager.getPageOptions();
            this.create();
        }
    };
module.exports = exports;

