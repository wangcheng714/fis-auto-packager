/**
 * @file 列表工具条
 */
 
var bindBtn = (function(){
	var listTool = $(".place-widget-listtool");
	var btn = listTool.find(".select-btn");
	btn.on("click",function(){
		var stat = stat = require('common:widget/stat/stat.js'),
			wd = $('.common-widget-nav .title span').text();

		!$(this).hasClass('up') &&
			(stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_CLICK, {'wd': wd}))

		$(this).toggleClass("up");
		listTool.toggleClass("hide-extend");
	});
})();


exports = bindBtn;