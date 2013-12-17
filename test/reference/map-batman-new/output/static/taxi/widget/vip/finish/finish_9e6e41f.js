define('taxi:widget/vip/finish/finish.js', function(require, exports, module){

/**
 * @file vip版用户已上车
 * @author liushuai02@baidu.com
 */
'use strict';

var exports = {
    create: function () {
        var $el = $('.taxi-widget-vip-finish'),
            $seconds = $el.find('.seconds'),
            $logo = $el.find('.logo'),
            $loading = $el.find('.loading'),
            $text = $el.find('.text'),
            second = 5;

        $seconds.text(second);
        this.interval = setInterval(function () {
            if (second === 0) {
                location.href = 'http://taxi.map.baidu.com';
            } else {
                $seconds.text(second--);
            }
        }, 1000);

        $logo.on('click', $.proxy(this.onLogoClick, this));

        LoadManager.request({
            data: $.extend({
                qt: 'ordercomment',
                comment_type: 4
            }, this.options),
            complete: function () {
                $loading.hide();
                $text.show();
            }
        });

        this.$logo = $logo;
    },
    onLogoClick: function () {
        location.href = 'http://taxi.map.baidu.com';
        this.$logo.off('click');
    },
    destroy: function () {
        clearInterval(this.interval);
    },
    init: function () {
        this.options = LoadManager.getPageOptions();
        this.create();
    }
};

module.exports = exports;



});