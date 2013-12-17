define('place:widget/movielist/movielist.js', function(require, exports, module){

/**
 * @file place列表页处理逻辑
 */

var url = require("common:widget/url/url.js");
var util = require("common:static/js/util.js");
var stat = require('common:widget/stat/stat.js');

var wd = $('.common-widget-nav .title span').text();
var _cacheData;

var bindShowAll = function () {
	var $showAllBtn = $("#place-widget-movielist-showall");
	$showAllBtn.on("click",showAll);
}

var bindPageBtn = function(){
	$pageNav = $(".place-widget-movielist .page-btn");
	$.each($pageNav, function (index,item) {
		var $dom = $(item);
		$dom.on("click", function(evt){
            var btn = $(evt.target),
                type = btn.data("type"),
                href = btn.data("url");

            // 添加“上一页”“下一页”的点击量统计 by cdq
            stat.addCookieStat(STAT_CODE.PLACE_LIST_PAGE_CHANGE, {'wd': wd,type:type});

			if(!btn.hasClass("unclick")) {
				url.navigate(href,{
					replace : true
				})
			}
		});
	})
}

/**
 * 显示所有
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
var showAll = function (evt) {
	var $poiList = $(".place-widget-movielist .place-list"),
		$pageNav = $(".place-widget-movielist .pagenav"),
		$showAllBtn = $("#place-widget-movielist-showall");

	$showAllBtn.hide();
	$poiList.removeClass("acc-list");
	$pageNav.show();

	// 添加强展现量统计  by cdq
	stat.addStat(STAT_CODE.PLACE_MAINRES_OPEN);
}

var bindList = function () {
	var $poiList = $(".place-widget-movielist");
	$poiList.on("click", "li", function(evt){
		var $item = $(this),
			href = $item.data("href"),
            name = $item.find('.rl_li_title').text(),
            isGen = _cacheData && _cacheData["isGenRequest"],
            isGwj = _cacheData && _cacheData["activity"],
            target = evt.target;
            
        // 过滤路线按钮，防止重复触发
        if(target.tagName.toLowerCase() === "a") {
        	return;
        }
        isGen = isGen == 1 ? 1 : 0;
        stat.addCookieStat(STAT_CODE.PLACE_LIST_CLICK, {'wd': wd, 'name': name, 'is_gen' : isGen, 'is_gwj': isGwj}, function(){
        	url.navigate(href);
        });
    });
}

var saveData = function ( data ) {
	_cacheData = data;
}

var bind = function () {
	bindShowAll();
	bindPageBtn();
	bindList();
}


var init = function ( data ) {
	saveData(data);
	bind();
}

module.exports.init = init;

});