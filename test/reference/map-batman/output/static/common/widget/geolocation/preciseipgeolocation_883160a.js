define('common:widget/geolocation/preciseipgeolocation.js', function(require, exports, module){

/**
* @fileOverview 精确IP定位
* @author chengbo
*/
'use strict';

var broadcaster = require('common:widget/broadcaster/broadcaster.js');

var PreciseIPGeoLocation = {
	/**
	 * 精确ip定位初始化
	 * @param {object} [data] 
	 */
	init : function(data){
		this._startGeo();
	},	
	/** 开始精确ip定位 */
	_startGeo : function(){		
		var addrbyip = _DEFAULT_CITY.addrbyip;
		if(addrbyip){
			this._getDetailLoc(eval('('+addrbyip+')'));			
		}else{
			broadcaster.broadcast('geomethod.fail',{});
		}
	},
	/*
	* 获取ip定位中的具体位置
	* @param {object} data initdata中的数据
	* @author chengbo
	*/
	_getDetailLoc : function(data){
		var me = this,
			content = data && data.content,
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
				street: loc.street || null,
				accuracy:loc.accuracy || null
			},
			point: {
				x: point.x || null,
				y: point.y || null
			},
			isGeoSuc: true,
			isExactPoi: true,
			type: 'preciseip',
			isUserDeny: false,
            isSaveLocInCookie : true
		};
		broadcaster.broadcast('geomethod.success',location);
	}
};

module.exports = PreciseIPGeoLocation;

});