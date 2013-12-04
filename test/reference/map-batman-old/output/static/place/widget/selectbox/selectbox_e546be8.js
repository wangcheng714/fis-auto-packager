define('place:widget/selectbox/selectbox.js', function(require, exports, module){

/**
 * @file 筛选框逻辑
 */

var url = require("common:widget/url/url.js"),
	loc  = require('common:widget/geolocation/location.js'),
	util   = require('common:static/js/util.js'),
	stat = require('common:widget/stat/stat.js'),
	selects = $(".place-widget-selectbox select"),
	selectForm = $(".place-widget-selectbox select"),
	_selectType,what,
	adpatConfig = {
		takeout : {
			"pl_dist" : "radius",
			"pl_sort_type" : "sortType",
			"pl_sort_rule" : "orderType",
			"pn" : "pageNum"
		}
	},
	_data;

module.exports.init = function(data){
	var	wd, srcname;
	(_data = data || {}) && (wd = _data.wd) && (srcname = _data.srcname)
	bind();
	_selectType = _data.select_type;
	what = _data.what;

	//添加place列表页筛选条件的展现量统计
	stat.addStat(STAT_CODE.PLACE_LIST_FILTER_VIEW, {'wd': wd, 'srcname': srcname});
}

/**
 * 绑定事件
 */
var bind = function () {

	var len = selects.length,
		i = 0;

	$.each(selects, function(index, item){
		$(item).on("change",handleSelect);
	});

	$(".city-select").on("click", _onClickCity);
}

var handleSelect = function(evt){
	var target = evt.target,
        type = $(target).closest('select').attr('name'),
        selectedIndex = $(target)[0].selectedIndex,
        $selectedOption = $($(target)[0][selectedIndex]),
        value = $selectedOption.text(),
        wd = _data.wd,
		srcname = _data.srcname;
    
    //添加筛选条件的点击统计
    switch(type){
        case 'pl_dist':
            stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_RANGE_CLICK, {'wd': wd, 'range': value, 'srcname': srcname});
            break;
        case 'pl_sort_type':
            stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_SORT_CLICK, {'wd': wd, 'sort': value, 'srcname': srcname});
            break;
        case 'pl_sub_type':
            stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_CATEGORY_CLICK, {'wd': wd, 'type': value, 'srcname': srcname});
            break;
        default :
    }
    
	_changeTitle(target);
	_submitSelect();
}

/**
 * 修改筛选框标题
 * @param  {HTMLElement} dom 筛选框的dom节点   
 */
var _changeTitle = function(dom){
    var $select = $(dom);
    var selectedIndex = $select[0].selectedIndex;
    var selectedOption = $($select[0][selectedIndex]);
    var value = selectedOption.text();
    var $title = $select.parent().children(".select_title");
    $title.html(value);
}

/**
 * 完成筛选
 */
var _submitSelect = function(){
	var query = url.get().query;
	var param = _getSelectParams();
	var c = loc.getCityCode();
	param = $.extend(param,{
		"pn" : 0
	});

	query = $.extend(query,param,{
		c : c
	});

	if(_selectType === "takeout") {
		query = paramAdapt(query, _selectType);
	}

	if(query.pl_tonight_sale_flag_section) {
		delete query.pl_tonight_sale_flag_section;
	}

	// 处理筛选框全市逻辑
	if(query.pl_dist == "全市") {
		delete query.center_rank;
	} else if(query.nb_x && query.nb_y) {
		query.center_rank = 1;
	}
	// 处理电影预定逻辑
	if(query.pl_sort_type == "movie_book") {
		query.pl_movie_book_section="1,1";
	}else{
		query.pl_movie_book_section="0,+";
	}

	url.update({
		query : query,
		pageState : {
			show_select : 1
		}
	},{
		queryReplace : true,
		replace : true
	});
}

/**
 * 获取筛选参数
 */
var _getSelectParams = function(){
	var param = {},
		_name,
		_value,
		paramKey;
	$.each(selects,function(index,item){
		var _param = {},
			$item = $(item),
			parent = $item.parent("select-box");
		_name = $(item).attr("name");
		_value = $(item).val();
		switch(_name) {
			case "pl_sub_type" : 
				_param["wd"] = _value;
				_param["pl_sub_type"] = _value;
				break;
			case "pl_sort_type" :
				_param["pl_sort_type"] = _value.split("__")[0];
				_param["pl_sort_rule"] = _value.split("__")[1] || 0;
				break;
			case "pl_dist" :
				_param["pl_dist"] = _value;
				break;

		}
		param = $.extend(param,_param);
	});

	return param;
}

/**
 * 进行参数转换
 * @param  {Object} paramObj 参数
 * @return {[type]}          [description]
 */
var paramAdapt = function(paramObj,type) {
	if(!paramObj || !type) {
		return;
	}

	var _param = $.extend({},paramObj);
	var config = adpatConfig[type];

	$.each(config, function(key,transKey){

		var paramValue = _param[key];
		if(paramValue){
			_param[transKey] = paramValue;
		}
		if( key !== "pl_sort_rule" && paramValue == "0" ) {
			delete _param[transKey];
		}
		delete _param[key];
	});

	return _param;
}


var _onClickCity = function (evt) {
	var cityType = loc.getCityType(),
		cityCode = loc.getCityCode(),
		urlParam = url.get(),
		referQuery = urlParam.query || {},
		referPagestate = urlParam.pageState  || {},
		wd = _data.wd,
		srcname = _data.srcname;

	referQuery.wd = what || referQuery.wd;

	// 如果当前是区县，则获取上一级的城市code
	if(cityType === 3) {
		cityCode = loc.getUpCityCode() || cityCode;
	}

	refer_query = util.jsonToUrl(urlParam.query || {});
	refer_pagestate =  util.jsonToUrl(urlParam.pageState || {});

	// 添加城市检索统计
	stat.addCookieStat(STAT_CODE.PLACE_SELECT_CLICK_CITY, {'wd': wd, 'srcname': srcname});

	url.update({
		module : "index",
		action : "setmylocation",
		query : {
			c : cityCode
		},
		pageState : {
			refer_query : refer_query,
			refer_pagestate : refer_pagestate,
			list_type : "business_area"
		}
	},{
		queryReplace : true,
		pageStateReplace : true
	});
}


});