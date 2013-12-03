define('common:widget/geolocation/location.js', function(require, exports, module){

/**
 * @file 地理信息api
 * @author nichenjian@baidu.com
 */
 'use strict';

var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    cookie = require('common:widget/cookie/cookie.js'),
    geolocation = require('common:widget/geolocation/geolocation.js');

/**
 * @module common:widget/geolocation/location
 */
module.exports = {
    // 定位的依据(包括系统自己定位，切城, 用户选择位置等)
    _location: null,

    // 我的位置定位依据(只有系统自身定位的结果才作为我的位置)
    _mylocation: null,

    /**
     * 获取地理信息
     * @return {object} addr 地理位置信息
     */
    _getAddr: function () {
        return (this._location && this._location.addr) || {};
    },

    /**
     * 获取坐标信息
     * @return {object} point 地理坐标信息
     */
    _getPoint: function () {
        return (this._location && this._location.point) || {};
    },

    /**
     * 获取我的位置
     * @return {object} addr 我的位置地理位置信息
     */
    _getMyAddr: function () {
        return (this._mylocation && this._mylocation.addr) || {};
    },

    /**
     * 获取我的位置坐标信息
     * @return {object} point 我的位置地理位置点
     */
    _getMyPoint: function () {
        return (this._mylocation && this._mylocation.point) || {};
    },

    /**
     * 获取我的位置x坐标点
     * @return {float} x
     */
    getMyPointX: function () {
        var point = this._getMyPoint();
        return point.x ? point.x : '';
    },

    /**
     * 获取我的位置y坐标点
     * @return {float} y
     */
    getMyPointY: function () {
        var point = this._getMyPoint();
        return point.y ? point.y : '';
    },

    /**
     * 获取我的位置当前城市code
     * @return {number} 城市code
     */
    getMyCityCode: function () {
        var addr = this._getMyAddr();
        return addr.cityCode ? addr.cityCode : null;
    },

    /**
     * 返回我的位置对象
     * @return {object} 返回我当前的位置对象(系统定位)
     */
    getMyLocation: function () {
        return this._mylocation;
    },

    /**
     * 获取我的位置中心点
     * @return {object} point
     */
    getMyCenterPoi: function () {
        var me = this;
        return {
            x: me.getMyPointX(),
            y: me.getMyPointY()
        }
    },

    /**
     * 是否定位已经完成
     * return {bool}
     */
    isGeoEnd: function () {
        return this._location.isGeoEnd;
    },

    /**
     * 等待定位,默认为8秒钟
     * @param {object} {
    *   seconds         : seconds 等待的时间，默认为8秒
    *   successCallback : successCallback  获取定位信息成功的回调
    *   errorCallback   : errorCallback 获取定位信息失败的回调
    * }
     */
    waitForLoc: function (opts) {
        var me = this,
            seconds,
            successCallback,
            _hasBindEvent = false,
            errorCallback;

        //是否已经初始化完成，保证只执行一次successCallback或者errorCallback
            me._isInitSuc = false;
        if (typeof opts != 'object') {
            return;
        }

        seconds = opts.seconds || 8;
        successCallback = opts.successCallback || function () {
        };
        errorCallback = opts.errorCallback || function () {
        };

        //获取定位成功初始化操作
        function initWithLoc() {
            if (me._isInitSuc === false) {
                me._isInitSuc = true;
                successCallback();
            }
        }

        //获取定位失败初始化操作
        function initWithoutLoc() {
            if (me._isInitSuc === false) {
                me._isInitSuc = true;
                errorCallback();
            }
        }

        if(_hasBindEvent === false){
            broadcaster.subscribe('geolocation.success', function (data) {
                initWithLoc();
            });
            broadcaster.subscribe('geolocation.fail', function (data) {
                initWithoutLoc();
            });
            _hasBindEvent = true;
        }

        //判断是否已经定位成功或失败
        if (me.isGeoEnd()) {
            //若有精确位置，则进行精确位置的初始化，否则进行无位置初始化
            me.hasExactPoi() ? initWithLoc() : initWithoutLoc();
        }

        //等待8秒，若定位没有成功
        setTimeout(function () {
            initWithoutLoc();
        }, 1000 * seconds);
    },
    /**
    * 发起定位
    */
    startGeo: function(){
        this._isInitSuc = false;
        geolocation.startGeo();
    },
    /**
     * 获取上级的城市Code
     * @return {number}
     */
    getUpCityCode: function () {
        var me = this,
            addr = me._getAddr();

        return addr.upCityCode;
    },

    /**
     * 获取地理信息的全称描述
     * @return {string} address
     */
    getAddress: function () {
        var me = this,
            addr;

        addr = me._getAddr();
        return addr.address != null ? addr.address : me.getCity() + me.getDistrict() + me.getStreet();
    },

    /**
     * 获取城市名称
     * @return {string} cityName
     */
    getCity: function () {
        var addr = this._getAddr();
        return addr.city ? addr.city : '';
    },

    /**
     * 获取城市code码
     * @return {number} cityCode
     */
    getCityCode: function () {
        var addr = this._getAddr();
        return addr.cityCode ? addr.cityCode : '';
    },

    /**
     * 获取区名称
     * @return {string} district
     */
    getDistrict: function () {
        var addr = this._getAddr();
        return addr.district ? addr.district : '';
    },

    /**
     * 获取街道名称
     * @return {string} street
     */
    getStreet: function () {
        var addr = this._getAddr();
        return addr.street ? addr.street : '';
    },

    /**
     * 获取x坐标点
     * @return {float} x
     */
    getPointX: function () {
        var point = this._getPoint();
        return point.x ? point.x : '';
    },

    /**
     * 获取y坐标点
     * @return {float} y
     */
    getPointY: function () {
        var point = this._getPoint();
        return point.y ? point.y : '';
    },

    /**
     * 获取中心点
     * @return {object} point
     */
    getCenterPoi: function () {
        var me = this;
        return {
            x: me.getPointX(),
            y: me.getPointY()
        }
    },

    /**
     * 判断是否精确点
     * @return {bool}
     */
    hasExactPoi: function () {
        return !!this._location.isExactPoi;
    },

    /**
     * 返回所有定位数据
     * @return {object} location 所有的定位数据
     */
    getLocation: function () {
        return this._location;
    },

    /**
     * 返回地图的level
     * @return {number} level 地图的level
     */
    getLevel: function () {
        var me = this,
            level,
            cityCode = me.getCityCode();

        level = this._location.level;

        //定位到全国时，level展示为4
        if (cityCode == 1) {
            return 4;
        }
        //检查是否是矢量渲染，若是则level最小是16
        if (me.hasExactPoi() && cookie.get('ab')) {
            this._location.level = level > 16 ? level : 16;
        }

        return this._location.level ? this._location.level : this._location.isExactPoi ? 15 : 12;
    },

    /**
     * 返回定位成功的方式
     * @return {string} type 定位成功的方式
     */
    getType: function () {
        return this._location.type;
    },

    /**
     * 返回城市的类型
     * @return {number} cityType 定位后城市的信息，若无则返回null
     */
    getCityType: function () {
        var me = this,
            addr;

        addr = me._getAddr();
        return addr.cityType;
    },

    /**
     * 是否定位成功
     * @return {bool} isGeoSuc 判断当前是否已经定位成功
     */
    hasGeoSuc: function () {
        return this._location.isGeoSuc !== null ? this._location.isGeoSuc : null;
    },

    /**
     * 获取精确度
     * @return {number} accuracy 定位的精确度
     */
    getAccuracy: function () {
        var addr = this._getAddr();
        return addr.accuracy;
    },

    /**
     * 是否用户输入的位置
     * @return {bool}
     */
//  isUserEnterPoi: function(){
//      return this._location.type === null ? true : false;
//  },
    /**
     * 是否用户拒绝定位
     * @return {bool} isUserDeny 是否用户拒绝定位
     */
    isUserDeny: function () {
        return !!app.isUserDeny;
    },

    /**
     * 定位失败
     * @return {bool} 定位是否失败
     */
    isLocFailed: function () {
        return !!this._location.isGeoSuc;
    },

    /**
     * 是否用户输入的位置
     * @return {bool} 是否用户输入的位置
     */
    isUserInput: function () {
        return this._location.isUserInput;
    },

    /**
     * 是否用户输入的位置(内部方法)
     * @param {object} data
     * @return {bool} 是否用户输入的位置
     */
    _isUserInput: function (data) {
        var _data = data || {};
        //标识用户输入位置
        if (_data.isUserInput) {
            return true;
        }
        //定位的类型为空, 表示用户输入的位置
        if (_data.type == null) {
            return true;
        }
        return false;
    },

    /**
     * 存储定位结果在localStorage中
     */
    _saveLocInStorage: function () {
        var me = this;
        var storage = window.localStorage;
        if (storage) {
            if (me._location) {
                try {
                    storage.setItem('webapp-loc', JSON.stringify(me._location));
                } catch (e) {
                }
            }

            if (me._mylocation) {
                try {
                    storage.setItem('webapp-myloc', JSON.stringify(me._mylocation));
                } catch (e) {
                }
            }
        }
    },
    
    /**
     * 设置我的位置
     * @param {object} data 我的位置数据
     * @param {object} data.addr
     * @param {string} data.addr.city 城市名称
     * @param {string} data.addr.code 城市code
     * @param {string} data.addr.district 区名称
     * @param {string} data.addr.street 街道名称
     * @param {string} data.addr.address 位置描述信息
     * @param {number} data.addr.accuracy 精确度
     * @param {string} data.addr.upCityCode 当前区的城市code
     * @param {object} data.point
     * @param {number} data.point.x x轴坐标
     * @param {number} data.point.y y轴坐标
     * @param {string} data.type 定位的方式
     * @param {number} data.t 定位成功的时间戳
     * @param {boolean} data.isGeoSuc 是否已定位成功
     * @param {boolean} data.isExactPoi 是否是精确点
     * @param {number} data.level 地图的级别
     * @param {boolean} data.isUserDeny 用户是否拒绝定位
     * @param {number} data.minutes 共享位置定位时间
     * @param {boolean} data.isGeoEnd 定位是否已经完成
     * @param {boolean} data.isSaveLocInCookie 定位结果是否存储在cookie中
     * @param {boolean} data.isSaveLocInStorage 定位结果是否存储在locaStorage
     */
    setAddress: function (data, isInitGeo) {
        var me = this,
            _data = data || {},
            addr = _data.addr || {},
            point = _data.point || {},
            //是否是系统定位
            isInitGeo = isInitGeo || false,
            type;
        
        //后端返回中国时，页面需要展示全国
        if(addr.city == '中国'){
            addr.city = '全国';
        }

        var _location = {
            addr: {
                city: addr.city ? addr.city : '',
                cityCode: addr.cityCode ? addr.cityCode : 1,
                district: addr.district ? addr.district : '',
                street: addr.street ? addr.street : '',
                accuracy: addr.accuracy ? addr.accuracy : null,
                address: addr.address ? addr.address : null,
                cityType: addr.cityType ? addr.cityType : null,
                upCityCode: addr.upCityCode ? addr.upCityCode : null
            },
            point: {
                x: point.x ? point.x : null,
                y: point.y ? point.y : null
            },
            //定位的方式
            type: _data.type ? _data.type : null,
            t: _data.t ? _data.t : (new Date()).getTime(),
            isGeoSuc: _data.isGeoSuc ? !!_data.isGeoSuc : null,
            isExactPoi: _data.isExactPoi ? _data.isExactPoi : false,
            level: _data.level ? _data.level : false,
            isSaveLocInCookie: _data.isSaveLocInCookie || false,
            isSaveInStorage  : _data.isSaveInStorage === false ? false : true,
            minutes: _data.minutes ? _data.minutes : null,
            isInitGeo: isInitGeo,
            isUserInput: this._isUserInput(_data),
            isGeoEnd: _data.type !== 'ip' ? true : false
        };

        //当前的定位方式
        type = _location.type;

        if(isInitGeo == false){
            me._location = _location;
        }else{
            //当前的位置如果可以覆盖，则直接覆盖当前的位置
            if(window._NO_COVER_LOC !== true){
                me._location = _location;
            }           
        }

        //当前定位点是精确点，派发我的位置定位成功事件
        if (_location.isExactPoi) {
            me._mylocation = _location;
            broadcaster.broadcast('geolocation.mylocsuc', _location);
        }
        
        //将定位数据存储在localStorage中
        if(_location.isSaveInStorage){   
            me._saveLocInStorage();  
        }

        //非ip定位触发定位成功事件
        if(type !== 'ip'){  
            broadcaster.broadcast('geolocation.success', me._location);
        }
    }
};

});