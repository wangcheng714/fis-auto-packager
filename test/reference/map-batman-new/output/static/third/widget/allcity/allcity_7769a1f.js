define('third:widget/allcity/allcity.js', function(require, exports, module){

/**
 * @file 所有城市组件逻辑
 */

var setCity = require("third:widget/setcity/setcity.js");
var indexPath = "http://" + location.host + "/mobile/webapp/index/index";


module.exports.init = function() {
	bind();
}

var bind = function() {
	var $cityWrap = $(".third-widget-allcity");
	$cityWrap.on("click", ".select-letter span", _onClickLetter);
	$cityWrap.on("click", ".city-item", _onClickCity);
}

var _onClickLetter = function(e) {
	var $dom = $(e.target);
	var href = $dom.data("href");
	window.location.replace(href);
}

var _onClickCity = function(e) {
	var $dom = $(e.target);
	var opts = {};
	var cityId = $dom.data("cityid");
	var cityName = $dom.data("short-city")?$dom.data("short-city"): $.trim($dom.data("city"));
	var x = $dom.data("x");
	var y = $dom.data("y");
	
	opts.cityName = cityName;
	opts.cityId   = cityId;

	if(x && y){
		opts.x = x;
		opts.y = y;
	}
	setCity.setAndRedirect(opts);
}


});