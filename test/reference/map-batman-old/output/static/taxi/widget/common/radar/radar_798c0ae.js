define('taxi:widget/common/radar/radar.js', function(require, exports, module){

/**
 * @file 雷达动画图标
 * @author liushuai02@baidu.com
 */
'use strict';
var exports = {
    create: function() {

        this.$el = $('.taxi-widget-radar');
        this.$inner = this.$el.find('.inner');

        this.currentStep = 0;
        this.maxStep = 9;
        this.timeperframe = 150;

        // 计算雷达高度
        this.$el.css({
            height: (innerHeight - 110) + 'px',
            visibility: 'visible'
        });
    },
    start: function() {
        this.interval = setInterval($.proxy(this.oneMove, this), this.timeperframe);
    },
    oneMove: function() {
        var $inner = this.$inner, innerWidth = $inner.width();

        $inner.css('background-position-y', -(((++this.currentStep)%this.maxStep) * innerWidth) + 'px');
    },
    destroy: function() {
        clearInterval(this.interval);
        this.interval = -1;
    },
    init: function() {
        this.create();
        this.start();
    }
};

module.exports = exports;



});