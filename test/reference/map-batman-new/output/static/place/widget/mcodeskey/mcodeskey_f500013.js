define('place:widget/mcodeskey/mcodeskey.js', function(require, exports, module){

/**
 * @description 兑换码承接页面
 * @author zhangyong 
 */
var locator = require('common:widget/geolocation/location.js'),
	stat    = require('common:widget/stat/stat.js'),
	HTTP    = "http://"+window.location.host,
	bound   = {};

//获取城市定位信息
function codesLocate() {
	var cityCode = locator.getCityCode() || 1;
	if (locator.hasExactPoi()) {
		bound.point_x = locator.getPointX();
		bound.point_y = locator.getPointY();
		bound.city_id = cityCode;
	}
}
//获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.href.substr(1).match(reg);
    if (r !== null) {
        return decodeURIComponent(r[2]);
    } else {
        return null;
    }
}
//跳转到影院列表页面
function exchange(){
	$("#exchange").click(function(){
		var code = GetQueryString("code"),
			sign = GetQueryString("sign");
		if(bound.city_id){
			var locatr = "&"+$.param(bound);
		}else{
			var locatr = "";
		}
        stat.addStat(STAT_CODE.PLACE_CODES_PV, {'state': 'codesreport' });
		location.href = HTTP+"/mobile/webapp/place/codes/force=simple&qt=city&code="+code+"&sign="+sign+locatr;
	});
}
//跳转到电影泛列表页
function bannerLink(){
	$("#banner").click(function(){
		location.href = HTTP + "/mobile/webapp/search/search/foo=bar&qt=s&wd=电影院&c=131&searchFlag=sort/center_name=北京市";
	});
}
//初始化
function initialize() {
	codesLocate();
	bannerLink();
	exchange();
}

module.exports = {
	initialize: initialize
};

});