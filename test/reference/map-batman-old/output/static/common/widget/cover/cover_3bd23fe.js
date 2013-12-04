define('common:widget/cover/cover.js', function(require, exports, module){

/**
 * @fileOverview 下载客户端封面
 * @author houhongru@baidu.com
 * @date 2013-10-28
 */

/* Configuration for jshint Gutter (Sublime plugin) */
/* global $:false, require:false, module:false */

'use strict';

var cookie = require('common:widget/cookie/cookie.js'),
    stat = require('common:widget/stat/stat.js'),
    util = require("common:static/js/util.js");

module.exports = {
    netype: 0,
    os: util.isAndroid() ? "android" : util.isIPhone() ? "iphone" : util.isIPad() ? "ipad" : "unknown",
    /**
     * 初始化，如果符合展示封面条件，则绑定监听事件，并显示封面
     */
    init: function() {
        if (this.isShowCover()) {
            this.adjustScreen();
            this.bind();
            this.initOpenDownload();
            this.showCover();
        }
    },

    /**
     * 检测是否要显示封面
     * @return {boolean} 如果需要显示返回true，否则返回false
     */
    isShowCover: function() {
        var hdCover = cookie.get('hdCover'),
            referRE = /(^$)/i,
            fromWiseTabRE = /itj=45/i,
            thirdRE = /third_party/i,
            refer = document.referrer,
            url = location.href;
        return !(hdCover == 1) // 未设置名为hdCover的cookie
        && (referRE.test(refer) // 来源为空（直接来源）
            || fromWiseTabRE.test(url)) // 来源于大搜索
        && !(thirdRE.test(url)) // 非第三方导流
        && (this.netype == 1);  //wifi网络下
    },

    /**
     * 事件绑定
     */
    bind: function() {
        //debugger;
        $('#to-webapp').on('click', $.proxy(this.closeCover, this));
        $('#cover-close').on('click', $.proxy(this.closeCover, this));

        if (this.getDevice() == 'ipad') {

            $('#cover-container').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

            $('#body-cover').on('click', $.proxy(this.closeCover, this));
        }
    },

    /**
     * 显示封面
     */
    showCover: function() {
        var me = this;
        stat.addStat(COM_STAT_CODE.COVER_DISPLAY, {'os': me.os}); 
        $('#body-cover').css({
            display: 'block'
        });
    },

    /**
     * 显示Webapp
     */
    showWebapp: function() {
        var me = this;
        stat.addStat(COM_STAT_CODE.COVER_HIDE, {'os': me.os}); 
        $('#body-cover').css({
            display: 'none'
        });
    },

    /**
     * 下载客户端
     */
    initOpenDownload: function() {
        var me = this;
        var download_open_href = $("#app-download"),
            download_open_txt = $("#download_open");
        download_open_href.attr('data', util.getClientUrl('download'));
        util.isInstalledClient(function(openurl) {
            download_open_txt.html('打开');
            download_open_href.attr('data', openurl);
            util.bindHrefStat(download_open_href, function(){
                stat.addStat(COM_STAT_CODE.COVER_APP_OPEN, {'os': me.os});
            });
        }, function(downloadurl) {
            download_open_txt.html('下载');
            download_open_href.attr('data', downloadurl);
            util.bindHrefStat(download_open_href, function(){
                stat.addStat(COM_STAT_CODE.COVER_APP_DOWNLOAD, {'os': me.os});
            });
        });
    },

    /**
     * 关闭封面
     */
    closeCover: function() {

        var options = {
            // domain: 'map.baidu.com',
            path: '/mobile',
            expires: 24 * 60 * 60 * 1000
        };

        cookie.set('hdCover', 1, options);
        this.showWebapp();
    },

    /**
     * 获取设备类型
     * @return {String} 根据平台返回iphone、ipad、android或者unknow
     */
    getDevice: function() {

        var platform = 'unknow',
            ua = navigator.userAgent;

        if (ua.match(/Android/i)) {

            platform = 'android';

        } else if (ua.match(/iPhone/)) {

            platform = 'iphone';

        } else if (ua.match(/iPad/)) {

            platform = 'ipad';

        } else {

            platform = 'unknow';

        }

        return platform;

    },

    /**
     * 大屏幕手机适配
     */
    adjustScreen: function() {

        var offset = document.documentElement.clientHeight - 423;

        offset = (offset > 0) ? (offset / 2) : 0;

        $('#cover-container').css({
            top: offset + 'px'
        });

    }

};

});