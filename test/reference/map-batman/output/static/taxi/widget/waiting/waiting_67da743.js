define('taxi:widget/waiting/waiting.js', function(require, exports, module){

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