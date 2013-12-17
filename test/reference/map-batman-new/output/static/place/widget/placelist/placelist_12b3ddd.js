define('place:widget/placelist/placelist.js', function(require, exports, module){

/**
 * @file place列表页处理逻辑
 */

var url = require("common:widget/url/url.js"),
	util = require("common:static/js/util.js"),
	stat = require('common:widget/stat/stat.js'),
	loc = require('common:widget/geolocation/location.js'),
	_cacheData,
	searchFlag;

function bindEvents() {
	'use strict';
	$('.btn-book[industry="scope"]').on('click', scopeBookClick);
	$(".place-widget-placelist").on('click', 'li', listClick);
	$("#place-widget-placelist-showall").on("click", showAll);
	bindPageBtn();
}

function unBindEvents() {
	'use strict';

	$('.btn-book[industry="scope"]').off('click', scopeBookClick);
	$(".place-widget-placelist").off('click', 'li', listClick);
	$("#place-widget-placelist-showall").off("click",showAll);
}

function scopeBookClick( evt ) {
	'use strict';

	var $li = $(evt.target).closest('li'),
		name = find('.list-tit').text(),
		srcname = $li.attr('srcname'),
        wd = $('.common-widget-nav .title span').text();

	stat.addCookieStat(STAT_CODE.PLACE_SCOPE_LIST_BOOK_CLICK, {'wd': wd, 'name': name, 'srcname': srcname, 'entry': searchFlag});
}

function bindPageBtn(){
	'use strict';

	var $navBtns = $(".place-widget-placelist .page-btn");
	$.each($navBtns, function (index,item) {
		var $dom = $(item);
		$dom.on("click", function( evt ){
            var btn = $(evt.target),
                type = btn.data("type"),
                href = btn.data("url"),
                wd = $('.common-widget-nav .title span').text();

            // 添加“上一页”“下一页”的点击量统计 by cdq
            stat.addCookieStat(STAT_CODE.PLACE_LIST_PAGE_CHANGE, {'wd': wd,type:type});
			if(!btn.hasClass("unclick")) {
				url.navigate(href,{
					replace : true
				})
			}

			evt.stopPropagation();
    		evt.stopImmediatePropagation();
		});
	})
}

/**
 * 显示所有
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function showAll( evt ) {
	'use strict';

    var $navMapLink = $("#nav_maplink");

	$("#place-widget-placelist-showall").hide();
	$(".place-widget-placelist .place-list").removeClass("acc-list");
	$(".place-widget-placelist .list-pagenav").show();
    $navMapLink.attr('href', $navMapLink.attr('href') + '&showall=1');

    // 添加强展现量统计  by cdq
    stat.addStat(STAT_CODE.PLACE_MAINRES_OPEN);

	evt.stopPropagation();
    evt.stopImmediatePropagation();
}

function listClick( evt ) {
	'use strict';

	var $item = $(this),
		href = $item.data("href"),
        name = $item.find('.list-tit').text(),
        isGen = _cacheData && _cacheData["isGenRequest"],
        target = evt.target,
        srcname = $item.attr('srcname'),
        wd = $('.common-widget-nav .title span').text();
        
    // 过滤路线按钮，防止重复触发
    if($(target).closest('a').length) {
    	return;
    }
    isGen = isGen == 1 ? 1 : 0;
    stat.addCookieStat(STAT_CODE.PLACE_LIST_CLICK, {'wd': wd, 'name': name, 'is_gen' : isGen, 'srcname': srcname, 'entry': searchFlag}, function(){
        url.navigate( href );
    });

    evt.stopPropagation();
    evt.stopImmediatePropagation();
}

/**
*获取URL的searchFlag参数
**/
function getFlag() {
	'use strict';

	var reg = /searchFlag=([A-Za-z]+)/g,
		matches;

	(matches = reg.exec(location.href)) && (searchFlag = matches[1])

}

function saveData( data ) {
	'use strict';

	_cacheData = data;
}

module.exports = {
	init: function( data ) {
		saveData(data);
		bindEvents();
		getFlag();

		//添加POI结果页的展现量
	    var wd = $('.common-widget-nav .title span').text();
	    stat.addStat(STAT_CODE.PLACE_LIST_VIEW, {'wd': wd});

	    if(loc.hasExactPoi()){
	        stat.addStat(STAT_CODE.PLACE_LIST_GEO_SUC);
	    }else{
	        stat.addStat(STAT_CODE.PLACE_LIST_GEO_FAIL);
	    }
	}
};


});