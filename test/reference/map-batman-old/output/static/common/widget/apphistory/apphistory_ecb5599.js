define('common:widget/apphistory/apphistory.js', function(require, exports, module){

/**
 * 判断是否是相同host
 * @return {Boolean}
 */
var isAppNavigator = function () {
	var referHost = getReferHost();
	return window.location.host === referHost;
};

var getReferHost = function () {
	var refer = document.referrer,
		hostReg = /^.*?\/\/(.*?)(\/|\?|\#|$)/i,
		match = refer.match(hostReg),
		referHost;
	if(match) {
		referHost = match[1];
	}

	return referHost;
};

var isLanding = function () {
	var referHost = getReferHost();
	return window.location.host !== referHost;
};

module.exports = {
	isLanding : isLanding,
	isAppNavigator : isAppNavigator
};

});