define('transit:widget/crossdetail/crossdetail.js', function(require, exports, module){

'use strict';

var stat = require('common:widget/stat/stat.js'),
	util = require('common:static/js/util.js');

module.exports = {
	init: function(){
		this.bindEvent();
	},
	bindEvent: function(){
        var $el = $('.transit-widget-crossdetail');

		$('.train-booking').on('click', $.proxy(this._addTrainStat, this));
		$('.air-booking').on('click', $.proxy(this._addAirStat, this));
        $el.find('.incity-plan').on('click', $.proxy(this.onIncityPlanClick, this));
	},
	_addTrainStat: function(e){
		var target = e.target;
		var number = $(target).data('tel');
		if(util.isAndroid()){
			util.TelBox.showTb(number);
		}else{
			window.location.href = "tel:" + number;
		}
		stat.addStat(STAT_CODE.CROSS_CITY_TRAIN_ORDER_CLICK);
		return false;
	},
	_addAirStat: function(){
		stat.addStat(STAT_CODE.CROSS_CITY_AIR_ORDER_CLICK);
	},
    onIncityPlanClick: function(e) {
        var $currentTarget = $(e.currentTarget);

        stat.addCookieStat(STAT_CODE.CROSS_CITY_INCITY_PLAN_CLICK);
        window.open($currentTarget.data('href'), '_self');
    }
}

});
;define('transit:widget/crosslist/crosslist.js', function(require, exports, module){

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
;define('transit:widget/list/list.js', function(require, exports, module){

/**
 * @fileOverview 换乘详情页
 * @author yuanzhijia@baidu.com
 * @date 2013-10-29
 */
 var DateScrollPicker = require('common:widget/datescrollpick/datescrollpicker.js'),
     url = require('common:widget/url/url.js'),
     broadcaster = require('common:widget/broadcaster/broadcaster.js'),
     popup = require('common:widget/popup/popup.js'),
     stat = require('common:widget/stat/stat.js'),
     locator = require('common:widget/geolocation/location.js'),
     util = require('common:static/js/util.js');
 module.exports = {
    init : function (data) {
        this.render(data);
        this.bind(data);
    },
    render : function (data) {
        var me  = this,
            parseurl = url.get();
        me.selectedTool = $('#takesubwayselect');
        me.start = $('.start-time .text')[0];
        me.action = parseurl.action;
        me.module = parseurl.module;
        me.pageState = parseurl.pageState;
        me.query = parseurl.query;
        me.initDateSelector(data.result);
        me._initPage(data);  
    },
    /*初始化页面的一些容器让页面*/
    _initPage:function(data){
        var me  = this;
        //检查当前城市是否有地铁
        var supportCityInfo = util.ifSupportSubway(locator.getCityCode());
        if (!supportCityInfo) {
            (me.selectedTool).attr("disabled","disabled");
        };
        if(decodeURIComponent(me.query.f) == "[0,2,4,7,5,8,9,10,11]"){
            $("#takesubwayselect option[value='1']")[0].selected = true;
        }
    },
    bind : function(data){
        var me = this,
            start = me.start;
        $(start).text(this.displayDateTimeText);
        if(!this.pk){
            this.pk = new DateScrollPicker(start, {
                onselect: function(date){
                    me._selectStartTime(date.datetime);
                }
            });
        }
        this.pk.applyTo(start);
        broadcaster.subscribe('sizechange', $.proxy(function(){
            this.pk && this.pk.hide();
        }, this));
        me.selectedTool.on("change",$.proxy(me._onselectchange,this));
    },
    _onselectchange:function(e){
        var type = $("#takesubwayselect").val(),
            me = this;
        me.query.f = (type == '1'? '[0,2,4,7,5,8,9,10,11]':null);
        if (type==1) {
            //添加不坐地铁统计
            stat.addCookieStat({code:STAT_CODE.BUS_STRATEGY_CLICK, type:4});
        };
        url.update({
            module: me.module,
            action: me.action,
            query : me.query,
            pageState : me.pageState
        });
    },
    initDateSelector: function(result){
        /*展示前先提示*/
        var tip = '',
            rplt = result.rplt;
            switch(rplt){
                case 1:  
                    tip = '已经为您屏蔽当前停运的方案!';
                    break;
                case 2:
                case 3:
                    tip = '此时没有可用公交方案，已显示全部方案!';
                    break;
                default:break;
        }
        if (tip!="") {
            popup.open({text:tip});
        };
        var me = this,
            date = new Date();
            //query = parseurl.query;
        if(result && result.exptime){
            //iphone uc下不支持 Date.parse静态方法， 所以做特殊处理
            var resultDate = result.exptime.split('T');
            var resYMD = resultDate[0].split('-');
            var resMM = resultDate[1].split(':');
            date.setYear(resYMD[0]);
            date.setMonth(resYMD[1]-1);
            date.setDate(resYMD[2]);
            date.setHours(parseInt(resMM[0]));
            date.setMinutes(parseInt(resMM[1]));
            //不足10分钟的向上加到十分钟
            date = new Date(date.getTime() + ((10-(resMM[1]%10)))%10*60000);

        }
        this.startDateTime = date.format('yyyy-MM-dd hh:mm');
        this.displayDateTimeText = this.formatDisplayText(this.startDateTime);
        
        //初始化默认工具为0， 全部
        //this.selectedTool = quezry.f == '[0,2,4,7,5,8,9,10,11]' ? '1' : '0';
    },
    formatDisplayText: function(datetime){
        var curDate = new Date();
        var curMonth = curDate.getMonth() + 1;
        
        var dt = datetime.split(' ');
        var ymd = dt[0].split('-');
        var hms = dt[1].split(':');
        
        var days = DateScrollPicker.getMday(curMonth);
        
        var date = curDate.getDate();
        var searchMonth = ymd[1] + '';
        var searchDay = ymd[2] + '';
        
        ymd[1] = parseInt(searchMonth.indexOf('0') == 0 ? searchMonth.substring(1) : searchMonth);
        ymd[2] = parseInt(searchDay.indexOf('0') == 0 ? searchDay.substring(1) : searchDay);
        
        if(curMonth  == ymd[1]){
            var dd = ymd[2];
            if(date == dd){
                return '今天 ' + dt[1] + ' 出发';
            }else if((dd - date) == 1){
                return '明天 ' + dt[1] + ' 出发';
            }else{
                return datetime;
            }
        }else if(ymd[1] - curMonth == 1){
            if(date == days){
                 if(ymd[2] == 1){
                     return '明天 ' + dt[1] + ' 出发';
                 }
            }
        }
        return datetime;
    },
    _selectStartTime:function(datetime){
        var me  = this;
        $(me.start).html(me.formatDisplayText(datetime));
        //日期选择完成更新跳转
        me.query.version = '5';
        me.query.exptype = 'dep';
        me.query.exptime = datetime;
        url.update({
            module: me.module,
            action: me.action,
            query : me.query,
            pageState : me.pageState
        });
    }
 }

});