/**
 * @fileOverview 商圈筛选逻辑
 */

var url = require("common:widget/url/url.js");
var util = require("common:static/js/util.js");
var searchData = require("common:static/js/searchdata.js");


var _dataCache,
	_areaList = {},
	cityData,
	BUSINESS_SPLIT = "     ",
	dataPath = "/mobile/?&from=maponline&tn=m01&ie=utf-8&data_version=11252019";


var saveData = function (content) {
	if(!content) {
		return;
	}

	addAreaItem(content.area_code,content);
	// 保存城市信息
	if(content.area_type == 2) {
		cityData = content;
	}

	if( content.sub ) {
		$.each(content.sub,function (index,item) {
			addAreaItem(item.area_code, item);
		});
	}

}

var addAreaItem = function (areaCode,areaData) {
	if(!areaData || !areaCode) {
		return;
	}
	_areaList[areaCode] = areaData;
}

var getAreaItem = function (areaCode) {
	return _areaList[areaCode];
}

var bind = function () {
	var $wrapper = $(".index-widget-bussinesslist");
	$wrapper.on("click", ".top-title", toggleList);
	$wrapper.on("click", "[jsaction]", eventHandler);

}

/**
 * 完成商圈选择
 * @return {void}
 */
var completeSelete = function (areaCode) {
	if(!areaCode) {
		return;
	}


	var areaItem = getAreaItem(areaCode),
		urlParam = url.get(),
		query = urlParam.query || {},
		pageState = urlParam.pageState || {},
		referQuery = util.urlToJSON(pageState.refer_query) || {},
		referPagestate = util.urlToJSON(pageState.refer_pagestate) || {},
		_state = {},
		_qurey = {},
		wd = referQuery.wd,
		c;


	_state = $.extend({},_state,referPagestate,{
		dist_name : areaItem.area_name,
		"keep_stay" : 1
	});

	if( wd && wd.indexOf(BUSINESS_SPLIT) > -1) {
		wd = wd.split(BUSINESS_SPLIT)[1];
	}

	// 如果是商圈，需要添加空白分隔符
	if( areaItem.area_type == 10 ) {
		wd = areaItem.area_name + BUSINESS_SPLIT + wd;
		c = cityData.area_code;
	} else {
		c = areaItem.area_code;
	}

	_qurey = $.extend(_qurey,referQuery,{
		c : c,
		wd : wd,
		pn : 0
	});


	delete _qurey.nb_x;
	delete _qurey.nb_y;
	delete _qurey.center_rank;

	url.update({
		module: 'place',
		action: 'list',
		query : _qurey,
		pageState : _state
	});

}

var listSub = function (areaCode, container) {
	if(!areaCode || !container) {
		return;
	}
	var loaded = container.data("loaded");
	var _query = "/?qt=sub_area_list&level=1&business_flag=1";
	var list = container.next();
	var visible;
	if( container.data("loaded") == 1 ) {
		if(list.hasClass("hide")) {
			list.data("visible","1");
			hideOther();
			scrollToEle(container);
		} else {
			hideOther();
		}
	} else {
		_query += "&areacode=" +  areaCode;
		searchData.fetch(_query,function(json){
			var _json = json || {};
			var content = json.content;
			hideOther();
			if(content) {
				saveData(content);
				appendSubList(content, container);
			}
		}, function () {

		});
	}

}

var scrollToEle = function (ele) {
	if(!ele){
		return;
	}
	var top = ele.offset().top;

	window.scrollTo(0,top);

}

var hideOther = function () {
	$(".index-widget-bussinesslist .sub_list .sub_list").not("hide").each(function (index,item) {
		if($(item).data("visible") == 1) {
			$(item).removeClass("hide");
		} else {
			$(item).addClass("hide");
		}
		// 重设item
		$(item).data("visible","0");
	});

}

var appendSubList = function (data, ele) {
	var tpl = __inline("sublist.tmpl");
	var html = tpl(data);


	$(html).insertAfter(ele);
	ele.data("loaded", "1");
	ele.data("visible", "1");
	scrollToEle(ele);

}

/**
	* 跳转到list页
	* @param {object} data 事件返回的数据
	*/
var switchToList = function(data){
	var me = this,
		pagestate,
		query,
		searchQuery,
		state;

	pagestate = me.get('pagestate');
	query = util.getReqParam(pagestate.refer_query) || {};
	state = util.getReqParam(pagestate.refer_pagestate) || {};


	state = $.extend(state,{
		dist_name : data.isBusiness ? '' : data.name,
		"keep_stay" : 1
	});

	//切分关键字
	var wd = query.wd.split(mapConst.BUSINESS_SPLIT);
	wd = wd[1] ? wd[1] : query.wd;

	searchQuery = {
		wd: data.isBusiness ? data.name + '     ' +wd : wd,
		c : data.isBusiness ? data.cityCode : data.subCode,
		pn : 0	// 设置页码为第一个页
	}

	$.extend(query, searchQuery);

	app.updateHash({
		module: 'place',
		action: 'list',
		query: query,
		pageState: state
	},{
		trigger: true,
		queryReplace: true,
		pageStateReplace: true
	})
};


/**
 * 切换列表显示状态
 * @param  {Event} evt
 * @return {void}
 */
var toggleList = function (evt) {
	var $dom = $(this);
	$dom.next().toggleClass("hide");
}

var eventHandler = function (evt) {
	var $ele = $(this),
		areaCode = $ele.data("areacode"),
		action = $ele.attr("jsaction"),
		jsactionHandler = {
			"complete" : completeSelete,
			"listsub" : listSub,
		},
		handler = jsactionHandler[action];

	if($.isFunction(handler)) {
		handler(areaCode, $ele);
	}

}


module.exports.init = function (data) {
	saveData(data);

	bind();
}
