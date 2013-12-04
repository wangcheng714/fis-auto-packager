/**
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

