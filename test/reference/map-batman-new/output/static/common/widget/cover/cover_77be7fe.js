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
        this.initOpenDownload();
    },

    sendStat : function() {
        if(__cover.hasClosed === true) {
            stat.addStat(COM_STAT_CODE.COVER_HIDE, {'os': this.os});
            // 重置参数，防止统计重发
            __cover.hasClosed = false;
        }
    },

    /**
     * 显示封面
     */
    showCover: function() {
        stat.addStat(COM_STAT_CODE.COVER_DISPLAY, {'os': me.os}); 
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
        $('#wrapper').css('display','block');
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
    }
    
};

});