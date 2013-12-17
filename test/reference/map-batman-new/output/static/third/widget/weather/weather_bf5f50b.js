define('third:widget/weather/weather.js', function(require, exports, module){

/**
 * 查天气组件
 */

var url = require("common:widget/url/url.js");
module.exports.init = function() {
	bind();
	render();
};

var curPage = 1;

var bind = function() {
	$(".tab").bind('click', tabSwitch);
	$(".switch").bind('click', switchCity);

};

var render = function() {
	if(localStorage['tab'] && localStorage['tab'] == 2){
		renderTab(2);
	}else{
		renderTab(1);
	}
};

var tabSwitch = function(e) {
	setTabStyle($(e.target));
	setTabContent($(e.target));
};

var setTabStyle = function(target) {
	target.siblings().removeClass("active");
	target.addClass("active");
};

var setTabContent = function(target){
	if(target.attr('id') == 'today_btn'){
		$('.detail_week').hide();
		$('.detail_today').show();
		curPage = 1;
	} else if(target.attr('id') == 'week_btn'){
		$('.detail_week').show();
		$('.detail_today').hide();
		curPage = 2;
	}
};

var renderTab = function(idx){
	if(idx == 1) {
		setTabStyle($("#today_btn"));
		$(".detail_today").show();
		$('.detail_week').hide();
	}else if(idx == 2){
		setTabStyle($("#week_btn"));
		$(".detail_today").hide();
		$('.detail_week').show();
	}
	localStorage['tab'] = 1;
};

var switchCity = function(e){
	localStorage['tab'] = curPage;
	var path = window.location.pathname;
	url.update({
		module: 'third',
		action: 'changecity',
		query : {'refer': encodeURIComponent(path)},
	});
};


});