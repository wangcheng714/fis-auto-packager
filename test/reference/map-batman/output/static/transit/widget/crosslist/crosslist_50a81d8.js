define('transit:widget/crosslist/crosslist.js', function(require, exports, module){

var url        = require('common:widget/url/url.js'),
	datepicker = require('common:widget/datepicker/datepicker.js'),
	util       = require('common:static/js/util.js'),
	stat       = require('common:widget/stat/stat.js');

module.exports = {
	init: function(){
		var startTime = this._getStartTime();
		$('#dateBox span').html(startTime);
		this.bindEvent();
	},
	bindEvent: function(){
		$('#dateBox').on('click', $.proxy(this._popupDateBox, this));
		$('select').on('change', $.proxy(this._changeStragety, this));
	},
	_bindFilterEvent: function(){
		$('#filter-cancel').on('click', $.proxy(this._hideFilterbox, this));
		$('#filter-finish').on('click', $.proxy(this._hideFilterbox, this));
	},
	/**
	* 用户的出发时间(若选择明天，则页面展示明天出发，否则展示日期)
	* @return {string} 
	*/
	_getStartTime: function(){
		var me = this;
		var startTime;
		var query = url.get().query || {};
		var date  = query.date;
		var today = new Date();
		var tomorrow = today.getTime() + 1000 * 60 * 60 * 24;
		var tDate = new Date(tomorrow);
		var todayDate = me._getDate(today);
		var tomorrowDate = me._getDate(tDate);

		if(date === tomorrowDate || date === undefined){
			startTime = '明天出发';
		}else if(date === todayDate){
			startTime = '今天出发';
		}else{
			startTime = date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
		}

		return startTime;
	},
	/**
	* 获取date,如20130608
	* @param {object} date对象
	* @return {string} 
	*/
	_getDate: function(tDate){
		var tyear = tDate.getFullYear() + '';
		var tmonth = (tDate.getMonth() + 1) + '';
		var tdate = tDate.getDate() + '';
		var cDate = tyear + (tmonth.length === 1 ? '0' + tmonth : tmonth) + (tdate.length === 1 ? '0' + tdate : tdate);
		return cDate; 
	},
	/**
	* 隐藏筛选的框
	*/
	_hideFilterbox: function(){
		$('#filter-box').hide();
	},
	/**
	* 用户点击筛选策略
	* @param {e} 事件对象
	*/
	_changeStragety: function(e){
		var target = e.target;
		var value = target.value;
		var csy;
		switch(value){
			case "价格由低到高":
				csy = 7;
				break;
			case "价格由高到低":
				csy = 8;
				break;
			case "出发时间由早到晚":
				csy = 5;
				break;
			case "出发时间由晚到早":
				csy = 6;
				break;
			case '全程时间由少到多':
				csy = 3;
				break;
		}
		//策略点击统计
		stat.addCookieStat(STAT_CODE.CROSS_CITY_STRAGETY_CLICK);

		url.update({
			query:{
				csy : csy,
				rn  : 5 
			}
		},{
			trigger : true
		})
	},
	/**
	* 弹出日期选择框
	* @param {object} e
	*/
	_popupDateBox: function(e){
		var me = this;

		// TODO Fis在inline的时候存在bug，压缩会报错
		var tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div id="filter-box"><div class="handler"><button id="filter-cancel">取消</button><button id="filter-finish">完成</button></div><div id="date-content"></div><div id="strategy-content"></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
		tpl = tpl();

		if($('#filter-box').length == 0){
        	$('body').append(tpl);
        	me._bindFilterEvent();		
		}

		var dateBox = $('#date-content');
		var planBox = $('#strategy-content');
		var date = new Date();
		var dateInfo = $("#dateBox span").html();
		var container = $('#filter-box');
		var curDate;

		if(dateInfo === '今天出发'){
			curDate = date;
		}else if(dateInfo === '明天出发'){
			curDate = new Date(date.getTime() + 1000 * 60 * 60 * 24);
		}else{
			var dateArr = dateInfo.match(/(\d{4})-(\d{2})-(\d{2})/);
			curDate = new Date(dateArr[1], parseInt(dateArr[2]) - 1, dateArr[3]);
		}
		
		dateBox.datepicker({
			minDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
			date   : curDate,
			//用户切换日期
			valuecommit: function(e, date, dateStr){
				stat.addCookieStat(STAT_CODE.CROSS_CITY_DATE_CLICK);
				var d = dateStr.split('-').join('');
				url.update({
					query: {
						date: d,
						rn  : 5
					}
				},{
					trigger: true
				});
			}
		});
		planBox.hide();
		dateBox.show();
		container.show();
		me._simulationFixed();
	},
	/**
	* 模拟ipad下不被识别的fixed属性
	*/
	_simulationFixed : function(){
        var filterBox = $("#filter-box");      	
        if(util.isIPad()){
			filterBox.css({'bottom':0, 'position':'absolute'});
            function handler(event) {
                var top = window.innerHeight + document.body.scrollTop  - 283;
                filterBox.css('top',top);
            }
            $(document).on("scroll", handler);

            //绑定一次事件
            if(!this._hasBindDateBoxEvent){
            	this._bindDateBoxEvent();
            	this._hasBindDateBoxEvent = true;
            }
        }else{
        	filterBox.css({'bottom':0, 'position':'fixed'});
        }
	},
}

});