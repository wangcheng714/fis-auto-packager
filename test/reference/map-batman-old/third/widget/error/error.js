/**
 * @file 错误页处理逻辑
 */

var storageKey = "_lastPageUrl";

var init = function(){
	$('.back-last-page').on('click', function(){
		back();
	})

}

var back = function () {
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

module.exports.init = init;