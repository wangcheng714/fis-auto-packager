/**
 * @file 所有城市组件逻辑
 */

var setCity = require("common:widget/setcity/setcity.js");


module.exports.init = function() {
	bind();
}

var bind = function() {
	var $hotCity = $(".index-widget-hotcity");
	$hotCity.on("click", ".city-item", _onClickCity);
}

var _onClickCity = function(e) {
	var $dom = $(e.target);
	var cityName = $dom.text();
	var cityId = $dom.data("cityid");
	var cityeng = $dom.data("cityeng");
	setCity.setAndRedirect(cityName, cityId, cityeng);
}