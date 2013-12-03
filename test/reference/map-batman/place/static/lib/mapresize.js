define('place:static/lib/mapresize.js', function(require, exports, module){

/**
 * @fileoverview 屏幕尺寸变化处理
 *
 */
var util = require('common:static/js/util.js');

// 屏幕尺寸变化处理
var mapResize = {

    h: 0,
    // 显示高度记录
    w: 0,
    // 显示宽度记录
    tm: 1000,
    // 计时器频率
    interval: null,
    ua: navigator.userAgent.toLowerCase(),

    init: function() {
        this.startMgr();
    },

    startMgr: function() {

        //var hasBind = false;
        if(typeof window.onorientationchange != 'undefined') {
            window.addEventListener('orientationchange', this.resize, false);

        } else {

            window.addEventListener('resize', this.resize, false);
            //hasBind = true;
        }

        if(util.isAndroid()) {

            window.addEventListener('resize', this.resize, false);
        }
        // 为了兼容iphone uc浏览器，绑定reseize事件
        // if((util.isIPhone() || util.isIPod()) && this.ua.indexOf("safari") < 0 && this.ua.indexOf("mqqbrowser") < 0) {
        //     if(this.ua.indexOf("os 5_1 ") > -1) {
        //         return;
        //     }
        //     this.isForUC = true;
        //     

        //     window.addEventListener('resize', this.resize, false);
        // }

        // this.w = window.innerWidth; // 初始化设置
        // this.h = window.innerHeight; // 初始化设置
    },

    endMgr: function() {
        clearInterval(this.interval);
        this.interval = null;
    },

    resize: function(evt) {
        // var win = window,
        //     winW = win.innerWidth;
        // if(mapResize.isForUC && winW === mapResize.w) { // FIXED: this -> window;
        //     return;
        // }

        // //menu.openAni(); //侧边栏打开动画？应该没有用吧 暂时没发现用处，我注释掉了 -by jz
        // //FIXED：避免5830默认浏览器不能完全缩进地址栏，页面高度不停变化的情况；
        // var span = Math.abs(win.innerHeight - mapResize.h);
        // if(span < 60) { // 经验值
        //     return;
        // }

        // mapResize.w = win.innerWidth; // 重新设置
        // mapResize.h = win.innerHeight; // 重新设置
        //app.eventCenter.trigger('sizechange', {width: evt.target.innerWidth, height: evt.target.innerHeight, delay:true});

        // var cover = $('#bmap_pop_cover');
        // //重置cover的高度和宽度
        // if(cover && cover.css('display') !== 'none'){
        //     cover.css({
        //         'width' : mapResize.w,
        //         'height': mapResize.h
        //     })
        // }
        return;

        //todolyx delete mapresize
        // win.tfCon && win.tfCon.setPos(); // 调整交通流量控件的位置
        /*win.mnPop && win.mnPop.setPos(); // 调整menu的显示位置 
        win.dtCon0 && win.dtCon0.setPos(); // 调整测距控件的显示位置
        win.mapSubway && win.mapSubway.setPos(); // 调整地铁专题图的显示尺寸；
        win.dropDownList && win.dropDownList.setPos();

        win.TelBox.telBox && win.TelBox.telBox.setPos();
        win.TxtBox.tBox && win.TxtBox.tBox.setPos();

        topNav.setPageSize(function() {
            topNav.setSize();
        });*/
    }
};



module.exports = mapResize;


});