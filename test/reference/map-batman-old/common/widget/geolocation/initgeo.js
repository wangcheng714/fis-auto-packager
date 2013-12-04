/**
* @file 初始化定位
* @author nichenjian@baidu.com
* @date 2013-11-06
*/
'use strict';

var loc     = require('common:widget/geolocation/location.js'),
	cookie  = require('common:widget/cookie/cookie.js'),
	storage = require('common:static/js/localstorage.js'),
	stat    = require('common:widget/stat/stat.js'),
	url     = require('common:widget/url/url.js');

var InitGeo = {
	init: function(){
		this._resetCurrentCity();
		this._initGeo();	
		this._changeCity();
	},
	/**
	* 重置_CURRENT_CITY
	* _DEFAULT_CITY是后端返回的ip定位的结果，而_CURRENT_CITY返回的是检索的当前城市
	*/
	_resetCurrentCity: function(){
		var defaultCity = window._DEFAULT_CITY,
			storage = window.localStorage;

		//设置_DEFAULT_CITY的值，如果不存在，默认取全国
		try{
			if(defaultCity.index){
				storage.setItem('_DEFAULT_CITY', JSON.stringify(window._DEFAULT_CITY));
				cookie.set('DEFAULT_CITY', '1', {expires: 1000*60*5, path: '/'});			
			}else if(storage.getItem("_DEFAULT_CITY")){					
				window._DEFAULT_CITY = JSON.parse(storage.getItem("_DEFAULT_CITY")) || {};
			}else{
				window._DEFAULT_CITY = {
					addrbyip: '{"error":1,"content":""}',
					default_city: "全国",
					index: '{"content":{"baike":0,"city_type":0,"cname":"\u5168\u56fd","code":1,"count_info":null,"geo":"1|11590057.96,4489812.75;11590057.96,4489812.75|11590057.96,4489812.75;","if_current":1,"level":0,"sup":0,"sup_bus":0,"sup_business_area":0,"sup_lukuang":0,"sup_subway":0,"uid":"b04c4accaab2fb7f410245f2"},"mo":{"data":{"mo_text":"\u4e0b\u8f7d\u767e\u5ea6\u624b\u673a\u5730\u56fe","mo_color":"#ff0000","mo_layer_text":"\u79bb\u7ebf\u4f7f\u7528\uff0c\u770190%\u6d41\u91cf\uff01","popup_img1":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/86bd8022f311d822940c36647c0aa131_143_221.jpg","popup_img2":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/94383d365350ba776eaee9d9daaf2387_143_221.jpg","popup_img3":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/c6c9811cff704539cc97e1fa385df81d_143_221.jpg","popup_title1":"\u641c\u7d22\u5468\u8fb9\u7f8e\u98df\u3001\u9152\u5e97\u3001\u5728\u7ebf\u9884\u5b9a","popup_title2":"\u5408\u7406\u8def\u7ebf\u89c4\u5212\uff0c\u514d\u8d39\u8bed\u97f3\u5bfc\u822a","popup_title3":"\u6700\u65b0\u56e2\u8d2d\u4f18\u60e0\u6298\u6263\u4fe1\u606f","popup_version_iphone":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/18a9fef8f8276dedb1d8129a36ceb181_25_26.png","popup_version_andriod":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/e87051a70c258e51bb947a95789ca815_25_26.png","banner_home":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/8cf335e0d9f4c9e0f8656c1e369c7f67_316_100.jpg","banner_poi":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-16\/6f90db9e61476f2cd8975c3fac3c70a8_316_100.jpg","banner_bus":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-16\/b39713e7c4cbf5a27c72308d1846248f_316_100.jpg","banner_driving":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-16\/8a512aa177b13df62758f7326f4a5682_316_100.jpg"}},"result":{"jump_back":0,"qid":"","time":0,"type":1},"current_city":{"code":1,"sup":0,"sup_bus":0,"sup_business_area":0,"sup_lukuang":0,"sup_subway":0,"type":0,"up_province_name":"\u4e2d\u56fd"}}',
					loopindex: -1
				}
				cookie.set('DEFAULT_CITY', '0', {expires: -1000, path: '/'});			
			}
		}catch(e){}

		//如果不存在CURRENT_CITY, 将DEFAULT_CITY的值赋给CURRENT_CITY
		if(!window._CURRENT_CITY){
			var location = JSON.parse(_DEFAULT_CITY.index) || {},
			 	content = location.content || {};
			window._CURRENT_CITY = {
				code: content.code || 1,
				geo: content.geo || '',
				name: content.cname || '',
				sup: content.sup || 0,
				sup_bus: content.sup_bus || 0,
				sup_business_area: content.sup_business_area || 0,
				sup_lukuang: content.sup_lukuang || 0,
				sup_subway: content.sup_subway || 0,
				type: content.city_type || 0,
				up_province_name: content.up_province_name || '',
				reset_cur: 1
			};
		}
	},
	/**
	* 初始化定位
	*/
	_initGeo: function(){
	    try{
            if(!this._hasStorageLoc()){
		    	this._initIpGeo();	
	    	}
	    }catch(e){
	    	//读取localStorage失败，初始化ip定位
	    	this._initIpGeo();
	    }
	    //异步请求定位组件，初始化定位
	    require.async('common:widget/geolocation/geolocation.js', function(exports){
            exports.init();
        });
	},
    /**
     * 从localStorage中获取定位结果
     * @param {string} name 获取的key
     * @return {object} 定位的结果
     */
    getLocFromStorage: function (name) {
        var me = this;
        var storage = window.localStorage;
        if (storage) {
            try {
                var loc = storage.getItem(name);
                return JSON.parse(loc);
            } catch (e) {
                return;
            }
        }
    },
    /**
     * 是否缓存了定位数据
     * 若已缓存5分钟内的定位，则直接缓存的定位初始化
	 * 缓存的位置可能是精确位置，也可能是非精确位置，如上海等，若已经缓存了5分钟内的位置
	 * 刷新页面时仍读取缓存的位置，这时候就不用初始化ip定位
     * @return {bool}
     */
    _hasStorageLoc: function () {
        var me = this;
        var _loc = me.getLocFromStorage('webapp-loc');
        var _myLoc = me.getLocFromStorage('webapp-myloc');
        var time = new Date().getTime();
        //缓存的定位在5分钟内，则直接读取缓存的数据
        if (_myLoc && _myLoc.isExactPoi === true) {
            if (parseInt(_myLoc.t) + 1000 * 60 * 5 > time) {
                loc._mylocation = _myLoc;
                //标识从localStorage中获取我的位置定位信息
                $.extend(loc._mylocation,{
                    type: 'storage'
                });
                window._INIT_MYLOC_SUC = true;
            }
        }

        //缓存的位置非ip定位，且定位时间在5分钟内
        if (_loc && _loc.type !== 'ip') {
            if (parseInt(_loc.t) + 1000 * 60 * 5 > time) {
                loc._location = _loc;
                //标识从localStorage中获取定位信息
                $.extend(loc._location,{
                    type : 'storage'
                });
                window._NO_COVER_LOC = true;
                window._INIT_LOC_SUC = true;
                return true;
            }
        }

        return false;
    },
	/**
	* 初始化ip定位
	*/
	_initIpGeo: function(){
		var location, content, geo, point, level;
	    location = JSON.parse(_DEFAULT_CITY.index) || {};
	    content  = location && location.content;
	    geo      = content && content.geo;
	    level    = content.level;
	    point    = geo.split(';')[1].split('|')[0].split(',');

	    if(content.code == 1){
	    	content.name = '全国';
	    }

	    if(content.code != 1){
	    	//统计ip定位到城市级别
	    	stat.addStat(COM_STAT_CODE.STAT_IP_GEO_IN_CITY);
	    }

	    //构造定位的数据
	    var locationData = {
	        addr: {
	            city: content.cname,
	            cityCode: content.code
	        },
	        point: {
	            x: point[0],
	            y: point[1]
	        },
	        level: level,
	        type : 'ip',
	        isExactPoi: false,
	        isGeoEnd: false,
	        isSaveLocInStorage: false
	    };
	    //初始化定位信息
	    loc.setAddress(locationData);
	},
	/**
	* 切城处理，若当前返回的城市code和定位的citycode不一致，则切换城市信息
	*/
	_changeCity: function(){
		var city = window._CURRENT_CITY,
			pageState = url.get().pageState || {};

		if(city && city.reset_cur != 1){
			//当前城市和定位城市不一致，或者后端标识强制替换位置
			if((city.code != loc.getCityCode() && city.code != loc.getUpCityCode())
			 || city.is_update_city == 1){
	            var point = city.geo && city.geo.split(';')[0].split('|')[1].split(',');

	            //不存在中心点，直接返回
	            if(point === undefined){
	                return;
	            }

			    if(city.code == 1){
			    	city.name = '全国';
			    }

	            var upCityCode = null;
	            //当前定位是区
	            if(city.type === 3){
	                upCityCode = city.up_cityid;
	            }
	            //将全国的level切换到4
	            var level = city.level != 0 ? city.level : 4; 
	            var locData = {
	                addr: {
	                    city: city.name,
	                    cityCode: city.code,
	                    cityType: city.type,
	                    upCityCode: upCityCode
	                },
	                point: {
	                    x: point[0],
	                    y: point[1]
	                },
	                level: level,
                    isSaveLocInCookie: true
	            }	

	            //系统定位时的切城的结果不能被覆盖，除非用户手动发起定位
	            window._NO_COVER_LOC = false;
	            loc.setAddress(locData);
	            window._NO_COVER_LOC = true;        
			}
		}
	}
}

InitGeo.init();
