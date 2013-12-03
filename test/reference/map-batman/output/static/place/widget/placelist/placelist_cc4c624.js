define('place:widget/placelist/placelist.js', function(require, exports, module){

/**
 * @file place列表页处理逻辑
 */

var url = require("common:widget/url/url.js"),
	util = require("common:static/js/util.js"),
	stat = require('common:widget/stat/stat.js'),
	loc = require('common:widget/geolocation/location.js'),
	$showAllBtn = $("#place-widget-placelist-showall"),
	$poiList = $(".place-widget-placelist"),
	wd = $('.common-widget-nav .title span').text(),
	_cacheData,
	searchFlag,
	$scopeBook = $('.btn-book[industry="scope"]');

function bindEvents() {
	'use strict';

	$scopeBook.on('click', scopeBookClick);
	$poiList.on('click', 'li', listClick);
	$showAllBtn.on("click", showAll);
	$poiList.on("click", ".mod_tel_content", telClick);
	bindPageBtn();
	
}

function unBindEvents() {
	'use strict';

	$scopeBook.off('click', scopeBookClick);
	$poiList.off('click', 'li', listClick);
	$showAllBtn.off("click",showAll);
	$poiList.off("click", ".mod_tel_content", telClick);
}

function scopeBookClick( evt ) {
	'use strict';

	var $li = $(evt.target).closest('li'),
		name = find('.rl_li_title').text(),
		srcname = $li.attr('srcname');

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
                href = btn.data("href");

            // 添加“上一页”“下一页”的点击量统计 by cdq
            stat.addCookieStat(STAT_CODE.PLACE_LIST_PAGE_CHANGE, {'wd': wd,type:type});

			if(!btn.hasClass("unclick")) {
				href = "http://" + location.host + href;
				window.location.replace(href);
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

	var $poiList = $(".place-widget-placelist .place-list"),
		$pageNav = $(".place-widget-placelist .pagenav");

	$showAllBtn.hide();
	$poiList.removeClass("acc-list");
	$pageNav.show();

	// 添加强展现量统计  by cdq
	stat.addStat(STAT_CODE.PLACE_MAINRES_OPEN);

	evt.stopPropagation();
    evt.stopImmediatePropagation();
}

function listClick( evt ) {
	'use strict';

	var $item = $(this),
		url = $item.data("href"),
        name = $item.find('.rl_li_title').text(),
        isGen = _cacheData && _cacheData["isGenRequest"],
        target = evt.target,
        srcname = $item.attr('srcname');
        
    // 过滤路线按钮，防止重复触发
    if(target.tagName.toLowerCase() === "a") {
    	return;
    }
    isGen = isGen == 1 ? 1 : 0;
    stat.addCookieStat(STAT_CODE.PLACE_LIST_CLICK, {'wd': wd, 'name': name, 'is_gen' : isGen, 'srcname': srcname, 'entry': searchFlag}, function(){
        location.href = "http://" + window.location.host + url;
    });

    evt.stopPropagation();
    evt.stopImmediatePropagation();

}

function telClick( evt ) {
	'use strict';

	var $a = $(this).find("a"),
		tel = $a.data("tel"),
	    wd = $('.common-widget-nav .title span').text(),
	    $li = $(evt.target).closest("li"),
	    name = $li.find(".rl_li_title").text(),
	    srcname = $li.attr('srcname');
	    
	if(util.isAndroid()) {
		$a.attr('href','javascript:void(0)');
        util.TelBox.showTb(tel);
	} else {
		window.location.href = "tel:" + tel;
	}

	// 发送电话拨打量统计 by cdq
	stat.addStat(STAT_CODE.PLACE_LIST_TELEPHONE_CLICK, {'wd': wd, 'name':name, 'srcname':srcname, 'entry': searchFlag});
	
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