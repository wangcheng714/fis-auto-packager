define('third:widget/curloc/curloc.js', function(require, exports, module){

/**
 * @file 当前位置
 */

var loc  = require('common:widget/geolocation/location.js');

module.exports.init =  function () {
    listener.on('common.geolocation', 'success', updateMyPos, this);
};

var updateMyPos = function (data) {	
	var $dom = $(".widget-index-curloc .current-city"),
		locTxt = loc.getAddress();
	$dom.html(locTxt);
}




});