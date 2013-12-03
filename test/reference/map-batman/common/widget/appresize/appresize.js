/**
 * @fileoverview 屏幕尺寸变化处理
 * @author lbs-web@baidu.com
 * @require jican@baidu.com
 */
'use strict';
var util = require('common:static/js/util.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),

    appresize = {

        init: function () {
            this.update();
            this.bind();
        },

        bind: function () {
            broadcaster.subscribe('sizechange', this.update, this);
            if (typeof window.onorientationchange !== 'undefined') {
                window.addEventListener('orientationchange', this.resize, false);
            } else {
                window.addEventListener('resize', this.resize, false);
            }
            if (util.isAndroid()) {
                window.addEventListener('resize', this.resize, false);
            }
        },

        update: function () {
            var winHeight = window.innerHeight,
                headerHeight = $('.common-widget-header').height(),
                footerHeight = $('.common-widget-footer').height(),
                bottomBannerHeight = $('.common-widget-bottom-banner').height(),
                minHeight = winHeight - (headerHeight + footerHeight + bottomBannerHeight);
            $('#main').css({
                'min-height': minHeight
            });
        },

        resize: function (evt) {
            /* mod by zhijia
            *bug ios在输入法弹起的情况下，横竖屏会黑屏。
            *fix orientationchange单独处理。*/
            function _reset(){
                broadcaster.broadcast('sizechange', {
                    width: evt.target.innerWidth,
                    height: evt.target.innerHeight,
                    delay: true
                });
            }
            var etype = evt.type;
            var fnDictionaries = {  //事件字典 方便扩展
                    "onorientationchange":function(){
                        setTimeout(function(){
                            _reset();
                        },1000);
                    },
                    "resize":function(){
                        _reset();
                    }
                };
            etype && fnDictionaries[etype]();
        }
    };

appresize.init();