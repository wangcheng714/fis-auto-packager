define('index:widget/curloc/curloc.js', function(require, exports, module){

/**
 * @file 当前位置
 */

var broadcaster  = require('common:widget/broadcaster/broadcaster.js');
var loc  = require('common:widget/geolocation/location.js');

module.exports.init =  function () {
    broadcaster.subscribe('geolocation.success', updateMyPos, this);
};

var updateMyPos = function (data) {	
	var $dom = $(".widget-index-curloc .current-city"),
		locTxt = loc.getAddress();
	$dom.html(locTxt);
}




});