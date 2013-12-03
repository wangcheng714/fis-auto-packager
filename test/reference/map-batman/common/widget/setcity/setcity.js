/**
 * @file 设置城市
 */

var cookie = require("common:widget/cookie/cookie.js");
var url = require("common:widget/url/url.js");
var util = require("common:static/js/util.js");
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
 * @param  {string} cityName 城市名
 * @return {string}
 */
var setAndRedirect = function(cityName, cityId, cityEng) {
	if (typeof cityName !== "string") {
		return;
	}
	if (window._APP_HASH.page == 'setsubwaycity') {
		redirectToSubway(cityEng);
	} else {
		// 保存城市信息
		_saveCity(cityName, cityId);
		cookie.set("setCityName", cityName, cookieOptions);
		redirect();
	}
	return cityName;
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

// var setCity = function () {
// 	if(state.refer_query){
// 		var query = util.urlToJSON(state.refer_query) || {};
// 		var pageState = util.urlToJSON(state.refer_pagestate) || {};

// 		//若关键词包含 商圈+'     '+关键字，将商圈去掉，保留关键字
// 		if(query.wd && query.wd.split(mapConst.BUSINESS_SPLIT)[1]){
// 			query.wd = query.wd.split(mapConst.BUSINESS_SPLIT)[1];
// 		}

// 		//如果是外卖页的refer,则跳转到外卖，否则跳转到place页
// 		if(query.qt === 'wm'){
// 			query.cityId = data.cur_area_id || query.c;
// 			query.c      = query.cityId;
// 			query.pageNum = 1;
// 			query.m = 'searchBrands';
// 			// 查找城市级别的外卖，删除中心点等其他信息
// 			delete query.nb_x;
// 			delete query.nb_y;
// 			delete query.pointX1;
// 			delete query.pointY1;
// 			delete query.radius;
// 			delete query.sortType;
// 			delete query.orderType;

// 			pageState = $.extend(pageState,{
// 					'citysearch' : 1,
// 					'center_name': data.cur_area_name
// 			});

// 			opts = {
// 				'module' : 'place',
// 				'action' : 'takeout',
// 				'query'  : query,
// 				'pageState': pageState
// 			};
// 		}else{
// 			query.c = data.cur_area_id || query.c;
// 			// 删除中心点信息
// 			delete query.nb_x;
// 			delete query.nb_y;
// 			opts = {
// 				'module': 'place',
// 				'action': 'list',
// 				'query' :  query,
// 				'pageState' : {
// 					'dist_name' : data.cur_area_name
// 				}
// 			};
// 		}

// 	}else{
// 		opts = {
// 			'module': 'index',
// 			'action': 'index'
// 		};
// 	}
// };

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