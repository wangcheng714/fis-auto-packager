/**
 * @file localStorage封装
 */
define('taxi:static/js/storage.js', function (require, exports, module) {
    'use strict';

    function capitalize(s) {
        return s.replace(/./, function(m) {return m.toUpperCase()});
    }

    var localStorage = window.localStorage,
        page = _APP_HASH.page;

    exports = {
        /**
         * 设置值
         * @param key
         * @param value
         * @return {number} 无异常设置成功返回true，否则返回异常码
         */
        set: function (key, value) {
            try {
                localStorage.setItem('baiduTaxi'
                    + capitalize(page) + capitalize(key), value);
                return 0;
            } catch (e) {
                if (e instanceof window.DOMException) {
                    return e.code;
                }
            }
        },
        /**
         * 取值
         * @param key
         */
        get: function (key) {
            return localStorage.getItem('baiduTaxi'
                + capitalize(page) + capitalize(key));
        },
        /**
         * 移除值
         * @param key
         */
        remove: function (key) {
            localStorage.removeItem('baiduTaxi'
                + capitalize(page) + capitalize(key));
        },
        /**
         * 清除所有值
         */
        clear: function () {
            localStorage.clear();
        }
    };

    module.exports = exports;
});

