/**
 * @fileOverview 顶部bannner策略
 * @authod yuanzhijia@baidu.com
 * @date 2013-10-24
 */
var cookie = require("common:widget/cookie/cookie.js"),
    util = require("common:static/js/util.js"),
    stat = require('common:widget/stat/stat.js'),
    app = require('common:widget/url/url.js');
module.exports = {
    init: function(bannerHide) {
        this.bannerHide = bannerHide || false;
        this.bind();
        this.render();
    },
    bind: function() {
        var me = this;
        me.closeBtn = $('#banner_close_button');
        me.bannerCon = $('#common-widget-top-banner');
        me.appbutton = $("#banner_install_button");
    },
    render: function() {
        var me = this,
            url = app.get();
        me.os = util.isAndroid() ? "android" : util.isIPhone() ? "iphone" : util.isIPad() ? "ipad" : "unknown";
        me.action = url.action;
        me.module = url.module;
        me.pageState = url.pageState;
        me.a = window.a;
        $(window).on("pageshow",function(){
            if ($('#downBox').length > 0) {
                $('#downBox').hide();

            }
            clearTimeout(window.a);
        });
        me.closeBtn.on('click', $.proxy(me._onClose, this));
        me.displayBanner();
    },
    displayBanner: function() {
        //展示banner策略
        var me = this,
            ua = navigator.userAgent,
            $info = "点击下载手机地图，省90%流量";
        if (cookie.get("hdBanner") || me.isHideBanner()) {
            me.hideBanner();
            return;
        }
        me.showBanner();
        if (util.isIPhone()&&(ua.indexOf("Safari")>0)) {
            me.appbutton.html('点击打开手机地图，省90%流量');
            util.bindHrefStat(me.appbutton, function(){
                    alert('将打开百度地图客户端');
                    $(document.body).append("<iframe src= 'baidumap://map/' id='callapp' width='0' height='0' style='border: 0;display: none;'/>");
                    window.a = setTimeout(function(){
                    util.DownBox.showTb(); 
                    stat.addStat(COM_STAT_CODE.TOP_BANNER_APP_ERROR_OPEN);}, 1500);
                    return false;
                });
     }else{
                me.appbutton.attr('data', util.getClientUrl('download'));
                util.isInstalledClient(function(openurl) {
                me.appbutton.html('点击打开手机地图，省90%流量').attr('data', openurl);
                me.appbutton.addClass("open");
                util.bindHrefStat(me.appbutton, function(){
                    stat.addStat(COM_STAT_CODE.TOP_BANNER_APP_OPEN, {os: me.os});
                });
            }, function(downloadurl) {
                me.appbutton.html($info).attr('data', downloadurl);
                util.bindHrefStat(me.appbutton, function(){
                    stat.addStat(COM_STAT_CODE.TOP_BANNER_APP_DOWNLOAD, {os: me.os});
                });
            }, me.appbutton.attr('uid'));
        }
    },
    _onClose: function(evt) {
        var me = this;
        me.hideBanner();
        var options = {
            domain: location.hostname,
            path: '/mobile',
            expires: 3 * 24 * 60 * 60 * 1000
        };
        cookie.set("hdBanner", "true", options);
        stat.addStat(COM_STAT_CODE.INDEX_TOP_BANNER_CLICK);
    },
    hideBanner: function(animate) {
        var me = this;
        me.bannerCon.hide();
    },
    showBanner: function(animate) {
        var me = this;
        me.bannerCon.show();
        stat.addStat(COM_STAT_CODE.INDEX_TOP_BANNER_SHOW);
    },
    isHideBanner: function() {
        if(this.bannerHide) {
            localStorage['hbt'] = Date.now();
            return true;
        }else{
            if(localStorage['hbt']){
                //设置有效期为15分钟
                if(Date.now() > Number(localStorage['hbt']) + 1000*60*15){
                    localStorage.removeItem('hbt');
                    return false;
                }else{
                    return true;
                }
            }else{
                return false;
            }
        }
    },
}