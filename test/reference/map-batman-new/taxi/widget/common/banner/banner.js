/**
 * @file 广告banner
 * @author liushuai02@baidu.com
 */
'use strict';

var storage = require('taxi:static/js/storage.js'),
    exports = {
        create: function () {
            var $el = this.$el = $('.taxi-widget-banner'),
                $btnClose = $el.find('.btn-close'),
                cityCode;

            $btnClose.on('click', $.proxy(this.onBtnCloseClick, this));
            listener.on('common.geolocation', 'success', $.proxy(this.onGeoSuccess, this));

            if (cityCode = storage.get('cityCode')) {
                this.loadActivate({
                    cityCode: cityCode
                });
            }
            this.$el = $el;
        },
        onGeoSuccess: function (event, data) {
            if (data.addr.cityCode) {
                this.loadActivate(data.addr);
            }
        },
        loadActivate: function (data) {
            var that = this, activityData;
            if (data.cityCode) {
                if (activityData = sessionStorage.getItem('activityData')) {
                    that.buildBanner(JSON.parse(activityData));
                }
                LoadManager.request({
                    data: {
                        qt: 'activity',
                        city_code: data.cityCode,
                        phone: storage.get('phone'),
                        width: window.innerWidth * window.devicePixelRatio
                    },
                    success: function (data) {
                        sessionStorage.setItem('activityData', JSON.stringify(data));
                        that.buildBanner(data);
                    }
                });
            }
        },
        buildBanner: function (data) {
            this.$el.html('').append([
                    '<a href="',
                    data.info.activity_url,
                    '" style="background: url(',
                    data.info.verify_ad_url,
                    ') 0 0 no-repeat; background-size: cover"',
                    ' ></a>'
                ].join('')).css({
                    'visibility': 'visible'
                });
        },
        onBtnCloseClick: function () {
            this.$el.hide();
        },
        init: function () {
            this.create();
        }
    };

module.exports = exports;