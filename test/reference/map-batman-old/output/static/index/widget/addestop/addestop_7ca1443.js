define('index:widget/addestop/addestop.js', function(require, exports, module){

/**
 * @fileOverview 添加到桌面
 * @author yuanzhijia@baidu.com
stat */
var app = require('common:widget/url/url.js'),
    util = require("common:static/js/util.js"),
    handlecook = require("common:widget/cookie/cookie.js"),
    stat = require('common:widget/stat/stat.js');
module.exports = {
    init : function () {
        this.render();
        this.bind();
    },
    /**
    * 将页面元素填充至this
    */
    render : function () {
        var me  = this;
        me.isosres = false;
        me.os = util.isAndroid() ? "android" : util.isIPhone() ? "iphone" : util.isIPad() ? "ipad" : "unknown";
        me.isios7 = util.getIosVersion();
    },
    /**
    * 给元素绑定事件
    */
    bind : function () {
        var me = this;
        me._adddestop();
        window.addEventListener("orientationchange",function(e){
               if (me.isosres) {
                   if(!handlecook.get('addestopShow')){
                        var stab =$('#se_tabgroup'),
                        sheight = stab.height();
                        stab.css("height",sheight+1);
                        var addpos = (document.documentElement.clientWidth)/2 - 91;
                        var addcon = document.getElementById('adddesktop-con');
                        if(!me.isios7) {
                            if((window.orientation == 90) || (window.orientation == -90)){
                                addpos = addpos - 40;
                            }
                        }
                        addcon.setAttribute("style","left:"+addpos+"px;bottom: 10px;bottom: 10px;");   
                        //万不得已而为之 IOS5 position:fixed 与 scrollTo 共存的 bug BYZHIJIA
                        stab.css("height",stab.height() - 1);
                   }
               };
        });
    },
    _adddestop:function(){
        var me  = this,
         opts = window._APP_HASH,
                module = opts.module,
                action = opts.action,
                pagestate = (app.get()).pageState || {},
                ua = navigator.userAgent,
                na = navigator.appVersion,
                isUC = /\s+UC\s+/i.test(ua) || /\s+UC\s+/i.test(ua) || /UCWeb/i.test(ua) || /UCBrowser/i.test(ua) || /UCWeb/i.test(na) || /UCBrowser/i.test(na),
                isSafari = (me.os=="iphone") && (ua.indexOf("Safari")>0),
                d = document;
        if(isSafari){
            //添加到从桌面打开统计
            if(window.navigator.standalone){
                //util.addStat(STAT_CODE.STAT_FROMDESTOP_OPEN);
                return;
            }
        }
        if(action == "index" && module=="index"){
            if (pagestate.tab!="line" &&pagestate.vt!="map") {
                if(me.os !="ipad"){
                    //显示发送到桌面 by zhijia
                    if (isUC || isSafari) {
                        if(!handlecook.get('addestopShow')){
                            d.gE = function(id){
                                return document.getElementById(id);
                            };
                            //code by zhijia for adddesktop
                            var adddesktop = adddesktop || function(){};
                            adddesktop.prototype = {
                                init:function(){
                                    var me = this;
                                    me.render();
                                    me.bind();
                                },
                                render:function(){
                                    var me = this;
                                    me.closebtn = d.gE('adddestop_close_con');
                                },
                                bind:function(){
                                    var me  = this;
                                    me.closebtn.addEventListener('click', me.closeAddestop, false);
                                },
                                closeAddestop:function(){
                                    d.gE('adddesktop-con').style.display="none";
                                    var cookieValue ={
                                        domain    : location.hostname,
                                        path      : '/',
                                        expires : 1000 * 60 * 24 * 3
                                    };

                                    //关闭添加到桌面框策略
                                    handlecook.set('addestopShow',true,cookieValue); 
                                }
                            };
                            var adddesktopobj = new adddesktop;
                            adddesktopobj.init();
                            var tipel= d.gE('adddesktop-con-tip'),//三角元素
                                addcon = d.gE('adddesktop-con'),//整个容器
                                typebj = d.gE('adddesktop-con-star');//不同设备的放到桌面icon
                            isUC && (function(){
                                addcon.setAttribute("style","top: 10px;");
                                typebj.className = "ucaddbg adddesktop-con-star";
                            })();
                            isSafari && (function(){
                                me.isosres = true; //标识需要旋转的时候重新定义位置
                                tipel.setAttribute("style","-webkit-transform: rotate(180deg);left: 82px;top: 75px;");
                                var addpos = (document.documentElement.clientWidth)/2 - 91;
                                addcon.setAttribute("style","left:"+addpos+"px;bottom: 10px;");
                                if (me.isios7) {
                                    typebj.className = "ios7addbg adddesktop-con-star";
                                }else{
                                    typebj.className = "iphoneaddbg adddesktop-con-star";
                                }
                                d.gE('addestop').innerHTML = '再"添加至主屏幕"';
                            })();
                            //添加到桌面展现量
                            stat.addStat(STAT_CODE.STAT_ADDDESTOP_SHOW);
                            addcon.style.display="";
                        }
                    }
                }
            }else{
                $('#adddesktop-con').hide(); 
            }
        }else{
            $('#adddesktop-con').hide();
        }
    }
}

});