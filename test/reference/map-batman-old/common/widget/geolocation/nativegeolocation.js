/**
* @file native定位
* @author nichenjian@baidu.com
*/
'use strict';

var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    metricStat = require('common:widget/stat/metrics-stat.js'),
    geohost = 'http://127.0.0.1:6259/';

/**
 * @module common:widget/geolocation/nativegeolocation
 */
var NativeGeoLocation = {

	//host
	lochost: 'http://map.baidu.com',

	//apn接口的url
	apnUrl : geohost + 'getapn?callback=getApnCallback',
	
	//apinfo接口的url
	apinfoUrl: geohost + 'getlocstring?timeout=0&callback=getapinfo',
	
	//geolocation接口的url
	locSdkUrl: geohost + 'geolocation?timeout=12000&callback=getGeoByNative',
	
	/** 
	 * native定位初始化
	 * @param {object} data = {
	 *    id : first 当前的定位次数
	 * }
	 */
	init : function(data){
		//apn接口是否超时
		this._isApnTimeout      = false; 
		//native获取位置的接口是否Ok
		this._isNativeAvailable = false;
		//native获取位置是否超时                 
		this._isNativeTimeout   = false;
		//locsdk获取是否超时
		this._isLocsdkTimeout   = false;
		//apinfo获取是否超时
		this._isApinfoTimeout   = false;
		//当前定位是否已经成功
		this._isGeoSuc          = false;
		//apinfo定位成功
		this._isApinfoSuc       = false;
		//locsdk定位成功
		this._isLocsdkSuc       = false;
		//locsdk定位失败
		this._isLocsdkFail      = true;
		//apinfo定位失败
		this._isApinfoFail      = true;
		//是否定位超时
		this.outofdate          = false;
		//url参数
		this._data              = data || {};
		//开始native定位
		this.checkApn();
	},	
	/** 检查apn接口是否能够连接 */
	checkApn : function(){
		var me = this;
		$.ajax({
			'url': me.apnUrl,
			'dataType': 'jsonp',
			'success' : function(data) {
				if(me._isApnTimeout === false){
					if(data && data.error === 0){
						me._isNativeAvailable = true;
						me.nativeGeo && me.nativeGeo();
					}
				}
			}	
		})
		//两秒超时策略
		me.checkApnTimeout(2);
	},
	/**
	* 检查apn接口是否获取超时
	* @param {number} seconds 
	**/
	checkApnTimeout : function(seconds){
		var me = this;
		setTimeout(function(){
			if(me._isNativeAvailable === false){
				me._isApnTimeout = true;
				broadcaster.broadcast('geomethod.fail',{});
			}
		},1000 * seconds);
	},
	/** 
	 * native 定位入口 
     * 同时调用apinfo和locsdk两种定位方式
	 */
	nativeGeo : function(){
		//开始apinfo的定位
		this.geobyApinfo();
		//开始locsdk的定位
		this.geobyLocsdk();
        metricStat.addStat('geo', 'native_geo_all', 1, true);
	},
	/*
	*  当定位失败时调用
	*  @param {type} type: locsdk or apinfo 
	*/
	nativeGeofailed : function(type){
		var me = this;
		if(type == "locsdk"){
			me._isLocsdkFail = true;
		}else if(type == "apinfo"){
			me._isApinfoFail = true;
		}

		if(me._isLocsdkFail && me._isApinfoFail && !me.outofdate)
		{
			me.outofdate = true;
			broadcaster.broadcast('geomethod.fail',{});
			//native定位失败统计
            metricStat.addStat('geo', 'native_geo_fail', 1, true);
		}
	},
	/*
	* 从pushservice apinfo中获取定位信息
	*/
	geobyApinfo : function(){
		var me = this;
		$.ajax({
			'url' : me.apinfoUrl,
			'dataType' : 'jsonp',
			'success' : function(data){
				if(data.error === 0 && me._isApinfoTimeout === false){
					me.getLocation(data);
				}else{
                    metricStat.addStat('geo', 'native_geo_apinfo_fail', {id : data.error}, true);
					me.nativeGeofailed("apinfo");
				}
                metricStat.addStat('geo', 'native_get_geo_suc', {id : 'apinfo'}, true);
            }
		})
		
		me.checkApinfoTimeout(12);
	},
	/** 通过locsdk 获取定位的信息 */
	geobyLocsdk : function(){
		var me = this;
		$.ajax({
			'url': locSdkUrl,
			'dataType': 'jsonp',
			'success' : function(data){
				if(data.error === 0 && me._isLocsdkTimeout === false){
					me.getDetailLoc(data);
				}else{
					me.nativeGeofailed("locsdk");
				}
                metricStat.addStat('geo', 'native_get_geo_suc', {id : 'locsdk'}, true);
			}
		});

		me.checkLocsdkTimeout(12);
	},
	/**
	 * locsdk定位超时控制 
	 * @param {number} seconds 
	 */
	checkLocsdkTimeout : function(seconds){
		var me = this;
		setTimeout(function(){
			if(me._isLocsdkSuc === false || !me._isGeoSuc){
				me._isLocsdkTimeout = true;
				me.nativeGeofailed("locsdk");
			}
		}, 1000 * seconds);
	},
	/*
	* apinfo定位超时控制
	*/
	checkApinfoTimeout : function(seconds){
		var me = this;
		setTimeout(function(){
			if(me._isApinfoSuc === false || !me._isGeoSuc){
				me._isApinfoTimeout = true;
				me.nativeGeofailed("apinfo");
			}
		},1000*seconds);
	},
	/*
	* 获取定位反地理编码信息
	* @param {url} 异步请求位置的url
	*/
	getLocbyUrl : function(url){
		var me = this,
			id = me._data.id;
			$.ajax({
				url: url,
				'dataType': 'jsonp',
				success: function(data){
					var content = data && data.content,
						loc = content && content.address_detail,
						point = content && content.point,
						location;
					
					if(me.outofdate)
					{
						return;
					}

					if(data.error != 0 || content.address == "")
					{
						if(data.reqtype == 'apinfo' || data.reqtype == 'locsdk')
						{
							me.nativeGeofailed(data.reqtype);
						}
						else
						{
							me.outofdate = true;  //保证失败只能调用一次失败
							broadcaster.broadcast('geomethod.fail',{});
						}
						
						return;
					}

					if(data.error == 0 && data.reqtype == 'apinfo')  //定位依据成功返回定位数据显示
					{
                        metricStat.addStat('geo', 'url_geo_apinfo_suc_back', 1, true);
					}

					if(me._isGeoSuc) // 保证位置数据只能被存储一次
					{
						return;
					}
					me._isGeoSuc = true;
					location = {
						addr: {
							address: content.address || null,
							city: loc.city || null,
			 				cityCode: loc.city_code || 1,
							district: loc.district || null,
							street: loc.street || null,
							accuracy: loc.accuracy
						},
						point: {
							x: point.x || null,
							y: point.y || null
						},
						isGeoSuc: true,
						isExactPoi: true,
						type: 'native',
						isUserDeny: false,
                        isSaveLocInCookie : true
					}
					broadcaster.broadcast('geomethod.success',location);
                    metricStat.addStat('geo', 'native_geo_getinfo_suc', {type:data.reqtype, id:id}, true);
                }
			})
	},
	getLocation : function(data){
		var me = this;
		var apinfoarray = data.locstring.split("&");
		var totalinfo = apinfoarray[0]+"|"+apinfoarray[1];
		var url =  me.lochost + '/mobile/?qt=geo&apinfo='+totalinfo+'&type=apinfo&callback=';
		me._isApinfoSuc = true;
		me.getLocbyUrl(url);
	},
	getDetailLoc : function(data){
		var me = this,
			url = me.getRgcUrl(data);
		me._isLocsdkSuc = true;
		me.getLocbyUrl(url);
 
	},
	getRgcUrl: function(data){
		var px = data.coords.longitude,
			py = data.coords.latitude,
			radius = data.coords.accuracy,
			me = this,
			url;
		url = px && py ? me.lochost + '/mobile/?qt=geo&x=' + px + '&y=' + py + '&radius='+radius+ '&type=locsdk&callback=' : '';	
		return url;
	}
}

module.exports = NativeGeoLocation;
