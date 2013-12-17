define('common:widget/initapp/initapp.js', function(require, exports, module){

/**
 * @fileOverview 初始化地图需要用到的组件
 */

var appResize = require('common:widget/appresize/appresize.js'),
	popup = require('common:widget/popup/popup.js'),
	pagemgr = require('common:widget/pagemgr/pagemgr.js'),
	FastClick =require('common:widget/fastclick/fastclick.js');


var init = function () {

	// 初始化高度
	appResize.init();

	// 初始化页面管理组件
	pagemgr.init();

	// 在多页切换时不加载FastClick, 解决android 2.3及以下的版本的击穿问题
    if (pagemgr.isSinglePageApp()) {
	   // 初始化FastClick
	   new FastClick(document.body);
    }

	// 绑定全局函数
	bind();
};

var bind = function() {
	if(pagemgr.isLandingPage()){
		listener.on('common.page', 'switchstart', showTip);
		listener.on('common.page', 'switchend', closeTip);
		listener.on('common.page', 'switchend', resetScroll);
	}
};

var preventDefault = function proxy(e) {
    var element = e.target,
        parent = element,
        selector = ".clickable";

    while (parent !== document.body) {

        if ($.zepto.matches(parent, selector)) {

    		e.preventDefault();
            return;
        } else {
            parent = parent.parentNode;
        }
    }
};

var resetScroll = function(){

	window.scrollTo(0,1);
};

var showTip = function(){
	popup.open({text:'正在加载中'});
};

var closeTip = function(){
	popup.close();
};


module.exports.init = init;



});