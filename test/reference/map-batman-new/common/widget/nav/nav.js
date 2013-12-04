/**
 * @file 返回条导航逻辑
 */

var url = require("common:widget/url/url.js"),
    pagemgr = require("common:widget/pagemgr/pagemgr.js");

// 是否返回到上一个replace的url上
var isBackReplaceAble = false;
/**
 * 绑定返回按钮事件
 * @return {void}
 */
var bind = function () {
    var backBtn = $(".common-widget-nav .back-btn");
    backBtn.on("click", function () {
        back();
    });
}

var storageKey = "_lastPageUrl";

var _historyBack = function () {
    var _lastPageUrl = window.localStorage.getItem(storageKey);
    // 如果是上一页保存了上一页信息的，从localStorage取
    // 采用replace方法，会进这个逻辑
    if (typeof _lastPageUrl === "string") {
        window.localStorage.removeItem(storageKey);
        url.navigate(_lastPageUrl,{
            replace : true,
            storageKey : false
        })
    } else {
        history.back();
    }
}


var back = function () {
    if (!pagemgr.isLandingPage() || window._APP_HASH.third_party === 'aladdin') {
        if (isBackReplaceAble === true) {
            _historyBack();
        } else {
            window.localStorage.removeItem(storageKey);
            history.back();
        }
    } else {
        //当前落地页是hao123过来的落地页，返回到hao123
        if(window._APP_HASH.module === 'third' 
            && (window._APP_HASH.action === 'transit' 
                || window._APP_HASH.action === 'weather'
                || window._APP_HASH.action === 'traffic')){
            window.localStorage.removeItem(storageKey);
            history.back();
        }else{
            window.localStorage.removeItem(storageKey);
            url.toIndex();
        }
    }
}
var init = function (isReplace) {
    isBackReplaceAble = !! isReplace;
    bind();
}

module.exports.init = init;