define('common:widget/geolocation/html5geolocation.js', function(require, exports, module){

/** 
* @file html5定位
* @author nichenjian@baidu.com
*/ 
'use strict';

var geolocation = require('common:widget/geolocation/location.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    metricStat  = require('common:widget/stat/metrics-stat.js');
/*
* 封装百度定位接口对象
*/
var BGeoLoc = {
  
    // 定位请求host
    host    : "http://loc.map.baidu.com/wloc?",
  
    //定位请求参数
    param : {
        x     : "",
        y     : "",
        r     : "",
        prod  : "maponline"
    },
  
    /**
    * 获取定位请求参数
    * @param {Number} x 经度
    * @param {Number} y 纬度
    * @param {Number} r 误差
    */
    getReqQuery : function(x, y, r){
        var param  = { x : x || "", y : y || "", r : r || "" },
            result = [],
            query = '',
            me = this;

        $.extend(me.param, param);
        $.each(me.param, function(item){
            result.push(item + '=' + me.param[item]);
        })

        return result.join('&');
    },

    /**
    * 请求百度定位接口
    * @param {String} query 请求参数
    * @param {Function} cbk 请求成功后的回调函数
    */
    request : function(query, cbk){
        var baidu = {};
        baidu._callback = function (response){
            cbk && cbk(response);
        }
        window.baidu = baidu;
        var url = this.host + query + "&addr=city|district|street|city_code&fn=_callback&t=" + new Date().getTime();
        $.ajax({
            url: url,
            dataType : 'jsonp'
        });
        this._delay = window.setTimeout(function(){ 
            broadcaster.broadcast('geomethod.fail',{
            message: 'html5 geolocation fail'
            });
        }, 15000);
    }
};

/*
* 封装geolocation对象
*/
var HtmlGeoLoc = {
    getCurrentPosition : function(onSuccess, onFailure, opts){
        return navigator.geolocation.getCurrentPosition(onSuccess, onFailure, opts);
    },
    
    watchPosition      : function(onSuccess, onFailure, opts){
        return navigator.geolocation.watchPosition(onSuccess, onFailure, opts);
    },
    
    clearWatch         : function(id){
        navigator.geolocation.clearWatch(id);
    }
};

var Html5GeoLocation = {
    /**
     * html5定位的初始化
     * @param {object} data = {
     *    id : 'first' //第几次调起html5定位
     *    par: 30000   //html定位超时时间  
     * }
     */
    init: function(data){
        this._data = data || {};
        this._config = {
            enableHighAccuracy: true,
            maximumAge: 60000,
            timeout: this._data.par || 30000,
            accuracy: 200000000
        };
        this._getCurrentPosition(HtmlGeoLoc);
    },
    /**
     * 获取当前的位置，发起Html5定位
     * @param {object} loc 
     */
    _getCurrentPosition: function(loc){
        metricStat.addStat("geo", "html5_geo_all", 1, true);//html5定位总数统计
        loc.getCurrentPosition(this._onSuccess, this._onFailure, this._config);
    },
    /**
     * 定位成功的回调
     * @param {object} data
     */
    _onSuccess: function(data){
        var me = Html5GeoLocation,
            coords,
            accuracy;

        coords = data.coords;
        accuracy = coords.accuracy;

        //精度在允许的范围，且存在经纬度
        if(accuracy < me._config.accuracy 
            && coords.longitude != 0 
            && coords.latitude != 0){
            me._getPosSuccess(data, {success: me.onWlocSuccess});
        }else{
            broadcaster.broadcast('geomethod.fail',{});
        }

        //定位误差半径统计
        metricStat.addStat("geo", "wlan_geo_radius", parseInt(accuracy, 10));
    },
    /**
     * 定位失败回调
     * @param {object} data
     */
    _onFailure: function(data){
        var me = Html5GeoLocation;
            
        //html5定位失败统计
        metricStat.addStat("geo", "html5_geo_fail", {error:data.code, messgae:data.message}, true);
        broadcaster.broadcast('geomethod.fail',data);
    },
    /**
     * 用户是否拒绝定位
     * @param {object} msg
     * @return {bool} 
     */
    _isUserDeny : function(msg){
        if(msg && msg.code == 1){
            if((util.isIOS() 
                && msg.message.toLowerCase() == "user denied geolocation") 
                || util.isAndroid()){
                    return true;
            } else {
                return false;
            }
        }
    },
    /**
     * 获取反地理编码的结果
     * @param {object} data 定位获取的经纬度
     * @param {object} opts 
     */
    _getPosSuccess: function(data, opts){
        if(!data) return;
        var me = this,
            coords = data.coords;
        if(coords){
            var param = BGeoLoc.getReqQuery(coords.longitude, coords.latitude, coords.accuracy),
                time;
            
            me._isFirstSetLoc = true;
            var id = me._data.id;
            BGeoLoc.request(param, function(json){
                if(BGeoLoc._delay) {
                    window.clearTimeout(BGeoLoc._delay);
                }

                if(typeof json === 'object'){
                    //统计html5成功获取坐标信息
                    var data = {},
                        addr = json.addr;
                    // 如果没有point则认为定位失败，触发30min事件
                    if(!json.point) {
                        broadcaster.broadcast('geomethod.fail',{
                            message: 'has no point'
                        });
                        return;
                    }

                    data = {
                        addr: {
                            'city': addr.city,
                            'cityCode': addr.city_code,
                            'district': addr.district,
                            'street': addr.street,
                            'accuracy': coords.accuracy
                        },
                        point: json.point
                    };

                    $.extend(data,{
                        type: 'html5',
                        isExactPoi: json.point ? true : false,
                        isSaveLocInCookie : true
                    });
                    metricStat.addStat("geo", "html5_get_geo_suc", {id: id}, true);
                    broadcaster.broadcast('geomethod.success',data);
                }
            });
        }
    }
};

module.exports = Html5GeoLocation;


});