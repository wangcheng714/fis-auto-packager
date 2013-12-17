define('common:widget/api/ext/menucontrol.js', function(require, exports, module){

/**
 * @fileoverview 地图菜单组件
 * @auth lujingfeng@baidu.com
 */
var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    cookie = require('common:widget/cookie/cookie.js'),
    login = require('common:widget/login/login.js'),
    pagemgr = require('common:widget/pagemgr/pagemgr.js'),
    stat = require('common:widget/stat/stat.js');

var MenuDrop = function(menuBtn){
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    // 检测是否为iPad版本
    
    var offset = new BMap.Size(53, 38);
    if (util.isIPad()) {
        offset = new BMap.Size(16, 62);
    }
    this.defaultOffset = offset;
    this.menuBtn = menuBtn;
    this.isOn = false;  // 是否被点击

}
MenuDrop.prototype = new BMap.Control();
$.extend(MenuDrop.prototype, {
    initialize: function(map){
        this._map = map;
        var menuDropContainer = this._container = document.createElement('div');
        menuDropContainer.id = 'menu-drop-container';
        menuDropContainer.style.position = 'absolute';
        menuDropContainer.className = 'menu-ctrl-drop';
        
        var listContainer = document.createElement("ul");
        listContainer.className = "menu-list-con";
        menuDropContainer.appendChild(listContainer);
        
        $(listContainer).html('<li id="menu-city" data-tab="1">切换城市</li>'+
                              '<li id="menu-pano" data-tab="2">全景</li>'+
                              '<li id="menu-info-center" data-tab="3">个人中心(<span>未登录</span>)</li>'+
                              '<li id="menu-feedback" data-tab="4">意见反馈</li>'+
                              '<li id="menu-download" data-tab="5" style="color:#00c;" data="">下载手机客户端</li>');
        
        map.getContainer().appendChild(menuDropContainer);
        this.bind();
        
        this.setCmsConfig();
        
        var handlerMenuStatus = function(evt, args) {
            var curUrl = url.get();
            if (curUrl.module !== 'index' || curUrl.action !== 'index') {
                $('#menu-city, #menu-pano, #menu-info-center').hide();
            } else {
                $('#menu-city, #menu-pano, #menu-info-center').show();
            }
        };
        
        // 非首页处理menu_icon隐藏
        listener.on('common.page', 'switchend', handlerMenuStatus);
        handlerMenuStatus('init', url.get());

        return menuDropContainer;
    },
    
    setCmsConfig: function(){
        var me = this;
        $appbutton = $('#menu-download');
        util.isInstalledClient(function(openurl) {
            $appbutton.attr('data', openurl).text("打开客户端");
        }, function(downloadurl) {
            $appbutton.attr('data', downloadurl).text("下载手机客户端");
        });
    },
    
    bind: function(){
        var map = this._map;
        var me = this;
        
        // Android 2.3去掉了fastclick，click事件点击偏差，touchstart临时解决
        var eventName = pagemgr.isSinglePageApp() ? 'click' : 'touchstart';
        $(this._container).on(eventName, function(e) {
            if (eventName === 'touchstart') {
                e.preventDefault();
                e.stopPropagation();
            }

            me.onClick(e, this);
        });
        
        $(this._container).find('li').on('touchstart', function(){
            $(this).css('background', '#eee');
        });
        $(this._container).find('li').on('touchend', function(){
            $(this).css('background', 'none');
        });
    },

    onClick: function(e, context){
        var me = context;
        var opts = url.get();
        var tab = $(e.target).data('tab');
        switch(tab){
            case 1:
                // 切换城市
                stat.addCookieStat(COM_STAT_CODE.MAP_MENU_CHANGE_CITY_CLICK);

                url.update({
                    module: 'index',
                    action: 'setmylocation',
                    query: opts.query,
                    pageState: {},
                }, {
                    trigger: true,
                    queryReplace: true,
                    pageStateReplace:true
                });
                break;
            case 2:
                // 全景
                stat.addCookieStat(COM_STAT_CODE.MAP_MENU_SVENTRY_CLICK);

                url.update({
                    module : "index",
                    action : "sventry"
                },{  
                    trigger : true,
                    pageStateReplace : true,
                    queryReplace : true
                });
                break;
            case 3:
                login.checkLogin(function(data){
                    if (!data.status) {
                        // 进入百度账户登录
                        stat.addStat(COM_STAT_CODE.MAP_MENU_USER_CENTER_CLICK);
                        login.loginAction();
                    } else {
                        // 进入个人中心
                        stat.addCookieStat(COM_STAT_CODE.MAP_MENU_USER_CENTER_CLICK);
                        login.goMycenter();
                    }
                });
                break;
            case 4:
                // 意见反馈
                stat.addCookieStat(COM_STAT_CODE.MAP_MENU_FEEDBACK_CLICK);

                // 在反馈页内部直接返回
                if (opts.module == "feedback") {
                    return;
                }
                var page_id = opts.module + "/" + opts.action,
                    hash = [opts.module, opts.action, util.jsonToUrl(opts.query), util.jsonToUrl(opts.pageState)].join("/");

                var opts = {
                    module: "feedback",
                    action: "show",
                    query: {
                        page_id: encodeURIComponent(page_id),
                        hash: encodeURIComponent(hash)
                    }
                };
                url.update(opts, {
                    trigger: true,
                    pageStateReplace: true,
                    queryReplace: true
                });
                break;
            case 5:
                // 下载/打开客户端，可能有问题
                stat.addStat(COM_STAT_CODE.MAP_MENU_BDAPP_CLICK);

                setTimeout(function(){
                    window.location.href = $(e.target).attr("data");
                }, 200);
                break;
        }
        this.menuBtn.hideMenuDrop();
    }
});

var MenuControl = function(){
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    // 检测是否为iPad版本
    
    var offset = new BMap.Size(8, 16);
    if (util.isIPad()) {
        offset = new BMap.Size(16, 62);
    }
    this.defaultOffset = offset;
    this.isOn = false;  // 是否被点击

}
MenuControl.prototype = new BMap.Control();
$.extend(MenuControl.prototype, {
    initialize: function(map){
        this._map = map;
        
        var menuContainer = this._container = document.createElement('div');
        menuContainer.id = 'menu-btn-container';
        menuContainer.style.position = 'absolute';
        menuContainer.className = 'menu-ctrl-btn';
        
        var menuIcon = document.createElement("div");
        menuIcon.className = "menu-ctrl-icon";
        menuContainer.appendChild(menuIcon);
        
        map.getContainer().appendChild(menuContainer);
        this.bind();
        
        return menuContainer;
    },
    bind: function(){
        var map = this._map;
        var me = this;
        
        this._container.onclick = $.proxy(function(){
            // 右下角Menu点击量
            stat.addStat(COM_STAT_CODE.MAP_MENU_ICON_CLICK);

            if(!this._menuDrop){
                this._menuDrop = new MenuDrop(me);
                map.addControl(this._menuDrop);
            }
            this._menuDrop[this.isOn ? 'hide':'show']();
            this.isOn = !this.isOn;
            var $status = $("#menu-info-center span");
            if(cookie.get('myUserName')){
                $status.text('已登录');
            }else{
                login.checkLogin(function(data) {
                    if (data.status) {
                        $status.text('已登录');
                    } else {
                        $status.text('未登录');
                    }
                });
            }
        }, this);
    },
    hideMenuDrop: function(){
        this.isOn = false;
        this._menuDrop && this._menuDrop.hide();
    }
});


MenuControl._className_ = 'MenuControl';

module.exports = MenuControl;

});