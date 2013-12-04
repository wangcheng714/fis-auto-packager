define('common:widget/geolocation/urlgeolocation.js', function(require, exports, module){

/**
* @fileOverview 读取url定位定位
* @author chengbo
*/
'use strict';
//测试url: http://map.baidu.com/mobile/webapp/index/index/locMC=12948098|4845189
var	broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    metricStat  = require('common:widget/stat/metrics-stat.js');

module.exports = {

	//host
	lochost: 'http://map.baidu.com',

	/**
	 * url定位初始化 
	 * @param {object} data 
	 */
	init : function(data){
		//发起定位
		this._startGeo();
	},	
	/** 开始url定位 */
	_startGeo : function(){	
		var me = this;
		var coords = me.getContainLoc()
		if(coords){
			me.getDetailLoc(coords);
		}else{
			broadcaster.broadcast('geomethod.fail',{});
		}
	},
	/**
	 * 获取反地理编码的结果
	 * @param {array} coords = [x,y] x,y分别为坐标
	 */
	getDetailLoc : function(coords){
		var me    = this;
		var point = coords || [],
			url   =  me.lochost + '/mobile/?qt=geo&x=' + point[0] + '&y=' + point[1] +'&type=url&callback=';
		if(!point[0] || !point[1]){
			broadCaster.broadcast('geomethod.fail',{});
			return;
		}else{
			//发起url定位的统计
	        metricStat.addStat("geo", "url_geo_startget");
			$.ajax({
				url: url,
				dataType: 'jsonp',
				success: function(data){
					var content = data && data.content,
						loc = content && content.address_detail,
						point = content && content.point,
						location;

					if(data.error != 0 || content.address == ""){
						broadcaster.broadcast('geomethod.fail',{});
						return;
					}

					location = {
						addr: {
							address: content.address || null,
							city: loc.city || null,
							cityCode: loc.city_code || 1,
							district: loc.district || null,
							street: loc.street || null
						},
						point: {
							x: point.x || null,
							y: point.y || null
						},
						isGeoSuc: true,
						isExactPoi: true,
						type: 'url',
	                    isSaveLocInCookie: true,
						isUserDeny: false
					}
					broadcaster.broadcast('geomethod.success',location);				
				},
				error: function(){
					broadcaster.broadcast('geomethod.fail',{});
				}
			});
		}
	},

	/** 
	 * 获取href中的坐标
     * @param {array} 坐标数组 
	 */
	getContainLoc : function(){
		var tmphref = decodeURI(window.location.href);
		var index  = tmphref.indexOf('locMC=');
		var locstring = '';
		var locindex = '';
		var coords = [];
		if(index < 0)
		{
			return;
		}
		index+=6;
		locstring = tmphref.substr(index,tmphref.length);
		locindex = locstring.indexOf('|');

		if(locindex > 0)
		{
			coords = [];
			coords[0] = locstring.substr(0,locindex);
			coords[1] = locstring.substr(locindex+1,locstring.length);
			return coords;
		}
		else
		{
			return;
		}
	}
};


});