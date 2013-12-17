define('index:widget/surface/surface.js', function(require, exports, module){

/*
 * @fileoverview 浮层隐藏
 * @author xiaole@baidu.com
 * @date 2013/10/30
 */

module.exports = {

    init : function () {
        this.bind();
    },

    bind : function () {
        $('.close').on('click', function() {
            $('.return-wap').hide();
            $('.common-widget-back-top').css('bottom', '0');
        });
    }
}

});