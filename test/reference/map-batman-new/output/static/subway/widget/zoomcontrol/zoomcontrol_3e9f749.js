define('subway:widget/zoomcontrol/zoomcontrol.js', function(require, exports, module){

/**
 * @file 放大缩小按钮控件
 * @author <shengxuanwei@baidu.com>
 */
module.exports = {

    init: function() {
        'use strict';

        this.bind();
    },

    bind: function() {
        var self = this;

        $("#swZoomOut").on("touchstart", function(evt) {
            $("#swZoomOut").addClass("zoom_btn_tap");
            evt.target.handled = true; // 保证图区的tap事件不触发
        });
        $("#swZoomOut").on('click', function(evt) {
            $("#swZoomOut").removeClass("zoom_btn_tap");
            listener.trigger('subway', 'swZoomOut');
        });

        $("#swZoomIn").on("touchstart", function(evt) {
            $("#swZoomIn").addClass("zoom_btn_tap");
            evt.target.handled = true; // 保证图区的tap事件不触发
        });
        $("#swZoomIn").on('click', function(evt) {
            $("#swZoomIn").removeClass("zoom_btn_tap");
            listener.trigger('subway', 'swZoomIn');
        });

        listener.on('subway', 'swZoomEnd', this.reset, this);
    },

    reset: function(evt, opts) {
        opts = opts || {};

        $("#swZoomOut").removeClass("disable_zoom_btn");

        if (opts.isMinScale) {
            $("#swZoomOut").addClass("disable_zoom_btn");
        }

        $("#swZoomIn").removeClass("disable_zoom_btn");

        if (opts.isMaxScale) {
            $("#swZoomIn").addClass("disable_zoom_btn");
        }
    }

};

});