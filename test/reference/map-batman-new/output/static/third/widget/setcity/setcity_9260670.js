define('third:widget/setcity/setcity.js', function(require, exports, module){

/**
 * @file 设置城市
 */

var cookie = require("common:widget/cookie/cookie.js");
var util = require("common:static/js/util.js");
var url = require("common:widget/url/url.js");
var indexPath = "http://" + location.host + "/mobile/webapp/index/index";
var subwayPath = "http://" + location.host + "/mobile/#subway/show/city=";


var cookieOptions = {
	path: "/mobile/",
	expires: 60 * 60 * 24
};

var BUSINESS_SPLIT = "     ";

var _cacheCity = {
	cityName: "",
	cityId: "",
};

var redirectToindex = function() {
	window.location.href = indexPath;
};

var _saveCity = function(cityName, cityId) {
	_cacheCity.cityName = cityName;
	_cacheCity.cityId = cityId;
};

/**
 * 设置城市
 * @param  {string} opts.cityName 城市名
 * @param  {string} opts.cityId 城市id
 * @param  {string} opts.x x坐标
 * @param  {string} opts.y y坐标
 * @return {string}
 */
var setAndRedirect = function(opts) {
	var url      = require("common:widget/url/url.js");
	var _opts    = opts || {};
	var cityName = _opts.cityName;
	var cityId   = _opts.cityId;
	var x        = _opts.x;
	var y        = _opts.y;
	var query    = url.get().query;
	var refer    = query.refer;

	if(!refer){
		return;
	}

	var referQuery = getReferQuery(refer);

	//将cityName和cityId存在url中
	var cquery = $.extend(referQuery.query, {
		city: cityName,
		code : cityId
	});
	//如果存在坐标点，将坐标带到url中
	if(x && y){
		cquery.city_x = x;
		cquery.city_y = y;
	}

	//保存cookie
	cookie.set("setCityName", cityName, cookieOptions);

	//跳转到对应的页面
	url.update({
		module: referQuery.module,
		action: referQuery.action,
		query : cquery
	},{
        queryReplace: true
    });
};

/**
 * 通过refer获取refer的url对象
 * @param {string} str refer的query
 * @return {object} refer对应的url对象
 */
var getReferQuery = function(str){
	if(!str){
		return;
	}
	var str = decodeURIComponent(str).slice(1);
    var pathArrs = str.split('/');
    var product = pathArrs[0];
    var style = pathArrs[1];
    var module = pathArrs[2];
    var action = pathArrs[3];
    var query = pathArrs[4];
    var pageState = pathArrs[5] || "";

    return {
	    'module': module,
	    'action': action,
	    'query': util.urlToJSON(query || ''),
	    'pageState': util.urlToJSON(pageState || '')
    };

};

var redirect = function() {
	var urlParam = url.get(),
		query = urlParam.query,
		pageState = urlParam.pageState,
		referQuery,
		opts;


	if (pageState.refer_query) {
		referQuery = util.urlToJSON(pageState.refer_query);
		referPageState = util.urlToJSON(pageState.refer_pagestate);
		//若关键词包含 商圈+'     '+关键字，将商圈去掉，保留关键字
		if (referQuery.wd && referQuery.wd.split(BUSINESS_SPLIT)[1]) {
			referQuery.wd = referQuery.wd.split(BUSINESS_SPLIT)[1];
		}

		//如果是外卖页的refer,则跳转到外卖，否则跳转到place页
		if (referQuery.qt === 'wm' || referPageState.search == "takeout") {
			opts = getWmOptions(referQuery, referPageState);
		} else {
			opts = getOptions(referQuery, referPageState);
		}
		redirectToRefer(opts);
	} else {
		redirectToindex();
	}

};

var getOptions = function(query) {

	var _query = query || {};

	_query.c = _cacheCity.cityId || _query.c;
	// 删除中心点信息
	delete _query.nb_x;
	delete _query.nb_y;
	opts = {
		'module': 'place',
		'action': 'list',
		'query': _query,
		'pageState': {
			'dist_name': _cacheCity.cityName
		}
	};

	return opts;
};

var getWmOptions = function(query, pageState) {
	var _query = query || {};
	var _pageState = pageState || {};
	_query.cityId = _cacheCity.cityId || _query.c;
	_query.c = _query.cityId;
	_query.pageNum = 1;
	_query.m = 'searchBrands';
	// 查找城市级别的外卖，删除中心点等其他信息
	delete _query.nb_x;
	delete _query.nb_y;
	delete _query.pointX1;
	delete _query.pointY1;
	delete _query.radius;
	delete _query.sortType;
	delete _query.orderType;

	_pageState = $.extend(_pageState, {
		'citysearch': 1,
		'center_name': _cacheCity.cityName
	});

	opts = {
		'module': 'place',
		'action': 'takeout',
		'query': _query,
		'pageState': _pageState
	};

	return opts;
};

var redirectToRefer = function(opts) {

	// return;
	if (opts && opts.module && opts.action) {
		url.update(opts);
	} else {
		redirectToindex();
	}

};

var redirectToindex = function() {
	window.location.href = indexPath;
};

var redirectToSubway = function(city) {
	window.location.href = subwayPath + city;
};
/**
 * 设置城市
 * @param  {string} cityName 城市名
 * @return {string}
 */
module.exports.setAndRedirect = setAndRedirect;


});