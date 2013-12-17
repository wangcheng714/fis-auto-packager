define('third:widget/hotcity/hotcity.js', function(require, exports, module){

/**
 * @file 所有城市组件逻辑
 */

var setCity = require("third:widget/setcity/setcity.js");


module.exports.init = function () {
	bind();
}

var bind = function	(){
	var $hotCity = $(".third-widget-hotcity");
	$hotCity.on("click", ".city-item", _onClickCity);
}

var _onClickCity = function(e) {
	var $dom = $(e.target);
	var opts = {};
	var cityName = $dom.text();
	var cityId = $dom.data("cityid");
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