define('taxi:widget/response/response.js', function(require, exports, module){

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