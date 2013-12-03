/**
 * @file 返回条导航逻辑
 */

var appHistory = require("common:widget/apphistory/apphistory.js");

var indexPath = "http://" + location.host + "/mobile/webapp/index/index";
// 是否返回到上一个replace的url上
var isBackReplaceAble = false;
/**
 * 绑定返回按钮事件
 * @return {void} 
 */
var bind = function  () {
	var backBtn = $(".common-widget-nav .back-btn");
	backBtn.on("click", function(){
		back();
	});
}


var redirectToindex = function () {
	window.location.href = indexPath;
};

var storageKey = "_lastPageUrl";

var _historyBack = function () {
    var _lastPageUrl = window.localStorage.getItem(storageKey);
	// 如果是上一页保存了上一页信息的，从localStorage取
	// 采用replace方法，会进这个逻辑
    if(typeof _lastPageUrl === "string") {
        window.localStorage.removeItem(storageKey);
        window.location.replace(_lastPageUrl);
    } else {
        history.back();
    }
}


var back = function () {

	if(appHistory.isAppNavigator()) {
		if ( isBackReplaceAble === true ) {
			_historyBack();
		} else {
		    window.localStorage.removeItem(storageKey);
			history.back();
		}
	} else {
	    window.localStorage.removeItem(storageKey);
		redirectToindex();
	}
}

var init = function (isReplace) {
	isBackReplaceAble = !!isReplace;
	bind();
}

module.exports.init = init;