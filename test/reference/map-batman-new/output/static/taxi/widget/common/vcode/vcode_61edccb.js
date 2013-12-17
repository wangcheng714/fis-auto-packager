define('taxi:widget/common/vcode/vcode.js', function(require, exports, module){

/**
 * @file 验证码组件
 * @author liushuai02@baidu.com
 */
'use strict';
var vCodeUrl = "http://map.baidu.com/maps/services/captcha?cb=?",
    imageUrl = 'http://map.baidu.com/maps/services/captcha/image';

module.exports = {
    create: function() {
        var $el = $('.taxi-widget-common-vcode'),
            $imageCode = $el.find('.image-code'),
            $inputVCode = $el.find('.input-vcode'),
            $inputCode = $el.find('.input-code'),
            $btnRefresh = $el.find('.btn-refresh');

        $btnRefresh.on('click', $.proxy(this.fetchVCode, this));

        this.$imageCode = $imageCode;
        this.$inputVCode = $inputVCode;
        this.$inputCode = $inputCode;
    },
    fetchVCode: function () {
        var that = this, vcode;
        $.ajax({
            url: vCodeUrl + '&t=' + (new Date()).getTime(),
            dataType: 'jsonp',
            success: function (data) {
                if (data.result.error === 0) {
                    vcode = data.content.vcode;
                    that.$imageCode.attr('src', imageUrl + '?vcode=' + vcode);
                    that.$inputVCode.val(vcode);
                }
            }
        });
    },
    getCode: function() {
        return this.$inputCode.val();
    },
    getVCode: function() {
        return this.$inputVCode.val();
    },
    init: function() {
        this.create();
        this.fetchVCode();
    }
};

});