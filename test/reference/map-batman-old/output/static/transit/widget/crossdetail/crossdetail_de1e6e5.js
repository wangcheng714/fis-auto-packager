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