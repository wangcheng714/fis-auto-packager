/**
* @fileOverview 共享定位
* @author nichenjian
*/
'use strict';

var	myPosition  = require('common:widget/geolocation/myposition.js'),
	broadcaster = require('common:widget/broadcaster/broadcaster.js'),
	storage     = require('common:static/js/localstorage.js'),
    metricStat  = require('common:widget/stat/metrics-stat.js');

var CookieGeo = {
    //cookie读取的时间，默认5分钟
	_MINUTES : 5,

    /** 
     * cookie定位初始化
     * @param opts = {
	 *   par : 5 //读取的cookie时间
	 *   id  :   //当前定位的id
     * }
     */
	init: function (opts) {
		opts = opts || {};
		this._MINUTES = parseInt(opts.par) || this._MINUTES;
		this._data = opts;
		this._startGeo();
	},
	/** 发起cookie 定位 */
	_startGeo: function(){
		if(typeof this._MINUTES === 'number'){
			//优先获取baiduLoc的cookie(最新的cookie格式)，再获取旧cookie格式的定位
			var cookieLoc = myPosition.get('baiduLoc') || myPosition.get('native') || myPosition.get('web'); 
			if(cookieLoc != null){
				this._setCookieLoc(cookieLoc); //获取精确的共享位置(非精确位置共享无效)
			}else{
				this._geoFailHandler();
			}
		}else{
			this._geoFailHandler();
		}
	},
	/**
	 * 当前的cookie是否在约定的时间内
	 * @param  {number} t 存储的cookie的时间戳
	 * @return {bool} 
	 */
	_isInMinutes: function(t){
		if(!t){
			return false;
		}

		var currentTime = parseInt(Date.now()); 
		var shareTime = currentTime - 1000 * 60 * this._MINUTES;

		if(t > shareTime){
			return true;
		}else{
			return false;
		}
	},
	/**
	 * 将定位的结果格式化
     * @param  {object} loc 当前定位的结果
     * @return {object} 格式化后的定位结果
     */
	_formatLoc: function(loc){
		var crd  = loc && loc.crd;
		
		if(!crd){
			return;
		}

		return {
			addr : {
				address: loc.addr,
				city: loc.city,
				district: loc.district,
				street: loc.street,
				cityCode: loc && loc.cc,
				accuracy: crd && crd.r
			},
			point: {
				x : crd && crd.x,
				y : crd && crd.y
			},
			t : loc && loc.t,
			isUserInput: (loc && loc.tp == 'ui') ? true : false,
			type: 'share',    //定位的成功类型是share
			isExactPoi: true, //cookie中读取的位置认为是精确的位置结果
			isGeoSuc: true,   //标识定位已经完成
			minutes: this._MINUTES
		}
	},
	/**
	 * 设置cookie定位的结果
	 * @param {object} shareLoc 从cookie中读取的结果
	 */
	_setCookieLoc: function(shareLoc){
		var me = this;
		var isInMinutes = me._isInMinutes(shareLoc.t);

		//验证获取的共享位置是否是精确点,且时间点是否在约定的时间内
		if(shareLoc && shareLoc.crd && isInMinutes){
			//若cookie中已经包含addr字段, 表示从旧cookie中拿到位置
			if(shareLoc.addr){
				me._addStatAndTriggerEvent(shareLoc);
			//从新cookie中拿到位置，检查storage中是否包含反地理编码信息
			}else if(me._checkLocFromStorage(shareLoc.crd)){
				me._getLocFromStorage(shareLoc);
			//异步接口获取反地理编码的信息
			}else{
				me._getRgcLoc(shareLoc);
			}
		}else{
			me._geoFailHandler();
		}
	},
    /**
     * 通过莫卡托坐标获取当前的位置反地理编码信息
     * @param {object} shareLoc 从cookie中获取的定位信息
     */
    _getRgcLoc: function(shareLoc){
    	var me = this;
        if(!shareLoc.crd.x || !shareLoc.crd.y){
            return;
        }

        var url = "http://api.map.baidu.com/?qt=rgc_standard&x=" + shareLoc.crd.x +"&y=" + shareLoc.crd.y + "&dis_poi=" + shareLoc.crd.r + "&poi_num=10&ie=utf-8&oue=1&res=api&callback=";
        $.ajax({
            url: url,
            dataType: "jsonp", 
            success: function(data){
                var address = data.content.address;
                var addressDetail = data.content.address_detail;
                $.extend(shareLoc, {
                    addr : address,
                    city : addressDetail.city,
                    district : addressDetail.district,
                    street : addressDetail.street
                });

                storage.addData(shareLoc);
                me._addStatAndTriggerEvent(shareLoc);
            }
        }); 
    },
    /**
     * 检查localStorage中是否包含定位的反地理编码结果
     * @param {object} 当前定位的点坐标
     * @return {bool} 是否存在与当前定位点相同的坐标位置
     */
    _checkLocFromStorage: function(poi){
    	var loc, locObj;
    	if(poi == undefined){
    		return false;
    	}
    	try{
    		var loc = storage.getData('webapp-location-cookie');
			if(loc == undefined){
				return false;
			}
			//为啥要parse两次的原因待追查
			locObj = JSON.parse(JSON.parse(loc));
    	}catch(e){
    		return false;
    	}

    	//判断存储的点x,y坐标与定位的坐标是否相同
    	if(locObj.x == poi.x &&
    		locObj.y == poi.y){
    		this._locAddress = locObj;
    		return true;
    	}else{
    		return false;
    	}
    },
    /**
     * 从localStorage中读取定位的反地理编码信息
     * @return {object} 反地理编码的结果
     */
    _getLocFromStorage: function(shareLoc){
    	var addr = this._locAddress;
        $.extend(shareLoc, {
            addr : addr.address ? addr.address : addr.city + addr.district + addr.street,
            city : addr.city,
            district : addr.district,
            street : addr.street
        });
        this._addStatAndTriggerEvent(shareLoc);
    },
    /** 发送统计和派发事件 */
    _addStatAndTriggerEvent: function(data){
    	var data = this._formatLoc(data);
        metricStat.addStat("geo", "share_geo_suc", 1, true);
        broadcaster.broadcast('geomethod.success', data);
    },
    /** 定位失败的回调 **/
	_geoFailHandler: function(){
		if(this._MINUTES <= 5){
			broadcaster.broadcast('geomethod.fail',{});
			return;
		}
		if(this._MINUTES >= 30){
			broadcaster.broadcast('geomethod.fail', this._data);
			return;
		}
	}
};

/**
 * @module common:widget/geolocation/sharegeolocation
 */
module.exports = CookieGeo;
