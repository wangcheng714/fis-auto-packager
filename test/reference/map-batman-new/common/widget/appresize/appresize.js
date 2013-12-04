/**
 * @fileoverview 屏幕尺寸变化处理
 * @author lbs-web@baidu.com
 * @require jican@baidu.com
 */
'use strict';
var util = require('common:static/js/util.js');

module.exports = {

    init: function () {
        var _this = this;
        this.bind();
        this.setMainHeight();
        $(document.body).css("min-height", window.innerHeight);
    },

    bind: function () {
        listener.on('common', 'sizechange', $.proxy(this.update, this));

        if (typeof window.onorientationchange !== 'undefined') {
            window.addEventListener('orientationchange', this.resize, false);

            if (util.isAndroid()) {
                window.addEventListener('resize', this.resize, false);
            }
        } else {
            window.addEventListener('resize', this.resize, false);
        }
        
        // 每次页面加载后，需要重设内容区域的高度，使footer保持在底部 
        listener.on('common.page', 'switchend', $.proxy(this.setMainHeight,this));

    },

    getAppHeight : function () {
        var winHeight = window.innerHeight,
            headerHeight = $('.common-widget-header').height(),
            searchboxHeight = $('.index-widget-searchbox').height(),
            tabHeight = $('.index-widget-tabgroup').height(),
            navHeight = $('.common-widget-nav').height(),
            footerHeight = $('.common-widget-footer').height(),
            bottomBannerHeight = $('.common-widget-bottom-banner').height(),
            minHeight = winHeight - (headerHeight + footerHeight + bottomBannerHeight),
            mapTop = headerHeight+ searchboxHeight + navHeight + tabHeight,
            mapHeight = winHeight - mapTop;
            
        return {
            min: minHeight,
            mapTop : mapTop,
            mapHeight : mapHeight,
            header : headerHeight,
            footer : footerHeight,
            bottom: bottomBannerHeight
        };
    },

    setMainHeight : function(){
        var appHeight = this.getAppHeight();
        $('#main').css({
            'min-height': appHeight.min
        });
    },

    update: function () {

        var appHeight = this.getAppHeight();
        $('#main').css({
            'min-height': appHeight.min
        });
        $('.common-widget-map').css({
            'height': appHeight.mapHeight,
            'top': appHeight.mapTop
        });
    },
    resize : function (evt) {
            /* mod by zhijia
            *bug ios在输入法弹起的情况下，横竖屏会黑屏。
            *fix orientationchange单独处理。*/
            function _reset(){
                setTimeout(function() {
                    $(document.body).css("min-height", window.innerHeight); // 重设body的min-height
                }, 1);

                listener.trigger('common', 'sizechange',{
                    width: evt.target.innerWidth,
                    height: evt.target.innerHeight,
                    delay: true
                });
            }
            var etype = evt.type;
            var fnDictionaries = { //事件字典 方便扩展
                "onorientationchange": function() {
                    setTimeout(function() {
                        _reset();
                    }, 1000);
                },
                "resize": function() {
                    _reset();
                }
            };
            etype && fnDictionaries[etype]();
        }
};