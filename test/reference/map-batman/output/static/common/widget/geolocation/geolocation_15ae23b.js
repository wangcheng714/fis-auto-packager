define('common:widget/geolocation/geolocation.js', function(require, exports, module){

/**
 * @file 定位流程处理
 * @author nichenjian@baidu.com
 */
'use strict';

var html5Geo     = require('common:widget/geolocation/html5geolocation.js'),
    nativeGeo    = require('common:widget/geolocation/nativegeolocation.js'),
    shareGeo     = require('common:widget/geolocation/sharegeolocation.js'),
    preciseipGeo = require('common:widget/geolocation/preciseipgeolocation.js'),
    urlGeo       = require('common:widget/geolocation/urlgeolocation.js'),
    myPosition   = require('common:widget/geolocation/myposition.js'),
    broadcaster  = require('common:widget/broadcaster/broadcaster.js'),
    metricStat   = require('common:widget/stat/metrics-stat.js'),
    util         = require('common:static/js/util.js'),
    storage      = require('common:static/js/localstorage.js'),
    url          = require('common:widget/url/url.js');

var Geolocation = {
    //上次定位是否失败
    _IS_LAST_GEO_FAIL: false,

    //当前定位方式的索引
    _GEO_METHOD_INDEX: 0,

    //当前定位的方式组合
    _GEO_ARRAY : [],

    /**
    * 定位初始化
    * 绑定定位监听的事件，发起定位(多次init也只会调起一次定位)
    */
    init: function () {
        this._bindEvent();
        this.startGeo({
            isInitGeo: true,
            isNoCoverLoc: window._NO_COVER_LOC
        });     
    },
    _bindEvent: function () {
        var me = this;

        //避免重复绑定定位事件
        if(me._hasBindEvent === true){
            return;
        }
        me._hasBindEvent = true;

        //html5定位初始化事件
        broadcaster.subscribe('html5Geolocation.start', function (data) {
            html5Geo.init(data);
        });

        //native定位初始化事件
        broadcaster.subscribe('nativeGeolocation.start', function (data) {
            nativeGeo.init(data);
        });

        //共享位置time时间内定位初始化事件
        broadcaster.subscribe('shareGeo.start', function (data) {
            // 共享定位异步化，解决落地页图区挪图bug
            setTimeout(function () {
                shareGeo.init(data);
            }, 0);
        });

        //精确ip定位开始定位初始化事件
        broadcaster.subscribe('preciseipGeo.start', function (data) {
            setTimeout(function () {
                preciseipGeo.init(data);
            }, 0);
        });

        //url定位
        broadcaster.subscribe('urlgeolocation.start', function (data) {
            setTimeout(function () {
                urlGeo.init(data);
            }, 0);
        });

        //定位成功事件
        broadcaster.subscribe('geolocation.success', function (loc) {
            me._geoSuccess(loc);
        });

        //定位失败事件
        broadcaster.subscribe('geolocation.fail', function (msg) {
            me._geoFail(msg);
        });

        //单个定位方法失败回调
        broadcaster.subscribe('geomethod.fail', function (data) {
            me._geoMethodFail(data);
        });

        //单个定位方法成功回调
        broadcaster.subscribe('geomethod.success', function (data) {
            me._geoMethodSuccess(data);
        });
    },
    /**
     * 用户手动定位的入口
     * @param {object} [opts] 定位的参数
     * opts = {
     *    isInitGeo: 从init发起的定位（系统定位）
     *    isNoCoverLoc : 当前的位置是否不能覆盖
     *    success  : 定位成功的回调
     * }
     */
    startGeo: function (opts) {
        var _opt = opts || {};
        //上次定位是否失败
        this._IS_LAST_GEO_FAIL = false; 
        //定位开始的时间
        this._time = Date.now();   
        // 是否是系统发送的定位请求     
        this._isInitGeo = _opt.isInitGeo || false;
        //回调函数，在定位成功后执行。
        this.sucCallback = _opt.success || function () {};
        //开始定位统计
        metricStat.start("geo", {expire: 50});
        //统计定位总请求数
        metricStat.addStat('geo', 'start_geo_loc');
        //是否覆盖当前的位置, true表示不能覆盖
        window._NO_COVER_LOC = _opt.isNoCoverLoc || false;
        //系统定位
        if(_opt.isInitGeo === true){
            if(!this._checkStorageGeoStatus()
                || !this._checkStorageMyLocStatus()
                ){
                this._startGeo();
            }
        //手动定位，获取精确的位置
        }else{
            this._startGeo();
        }
    },
    _startGeo: function(){
        //初始化定位的数据
        this._initGeoData();
        //重置当前定位的是第一种方式
        this._GEO_METHOD_INDEX = 0;
        //开始发起定位
        this._useNextMethod();
    },
    /**
     * 检查localStorage位置的状态
     * @return {bool} 是否已经拿到位置
     */
    _checkStorageGeoStatus: function(){
        var me = this;
        //读取localStorage定位成功            
        if(window._INIT_LOC_SUC === true){
            var locator = require('common:widget/geolocation/location.js');
            //增加延时,避免派发事件过早
            setTimeout(function(){
                broadcaster.broadcast('geolocation.success', locator._location);             
            },0);
            return true;
        }else{
            return false;
        }
    },
    /**
     * 检查localStorage中我的位置获取状态
     * @return {bool} 是否已经拿到我的位置
     */
    _checkStorageMyLocStatus: function(){
        if(window._INIT_MYLOC_SUC === true){
            var locator = require('common:widget/geolocation/location.js');
            //增加延时,避免派发事件过早
            setTimeout(function(){
                broadcaster.broadcast('geolocation.mylocsuc', locator._mylocation);   
            },0);
            return true;
        }else{
            return false;
        }
    },
    /**
     * 定位成功后，需要将定位后的结果转换成cookie存储的格式
     * @param {object} loc 定位数据
     * @return {array} cookie中缓存的定位数据对象
     */
    _formatToCookie : function (loc) {
        var addr = loc.addr || {},
            point = loc.point || {},
            type = '',
            t = (new Date()).getTime() + "",
            locInfo = [];

        //未返回精确度，默认给出1000米的精确范围
        addr.accuracy = addr.accuracy || 1000;
        //未返回当前的城市，默认给出全国的cityCode
        addr.cityCode = addr.cityCode || 1;
        if (!point.x 
            || !point.y
            || !addr.cityCode
            ) {
            return;
        }

        locInfo.push(parseInt(point.x));
        locInfo.push(parseInt(point.y));
        locInfo.push(addr.accuracy);
        locInfo.push(addr.cityCode);
        locInfo.push(t);

        return locInfo;
    },
    /**
     * 将地址等信息保存在localStorage中
     * @param {object} loc
     */
    _saveAddressInStorage: function(loc){
        var addr = loc.addr || {},
            point = loc.point || {};

        var data = {
            address   : addr.address,
            city      : addr.city,
            district  : addr.district,
            street    : addr.street,
            x         : parseInt(point.x),
            y         : parseInt(point.y)
        };
        //保存cookie对应的address信息
        storage.addData('webapp-location-cookie', JSON.stringify(data));
    },
    /**
     * 定位成功回调
     * @param {object} 定位数据
     */
    _geoSuccess: function (loc) {
        var me = this,
            type = loc.type,
            isExactPoi = loc.isExactPoi,
            isSaveLocInCookie = loc.isSaveLocInCookie,
            saveLoc;

        //添加定位成功统计
        me._addStatGeoSuc(loc);
        //若是精确点，且非共享位置，则将位置信息记录在cookie中
        if (isExactPoi && type !== 'share' && type !== 'storage') {
            if (isSaveLocInCookie === false) {//位置是否允许存储
                return;
            } else {
                saveLoc = this._formatToCookie(loc);
                //新cookie格式将不保存address等信息，将这些信息保存在localstorage中
                this._saveAddressInStorage(loc);
                myPosition.save(saveLoc);
            }
        }

        if (isExactPoi === true) {
            me._IS_LAST_GEO_FAIL = false;//上次定位成功
        }

        me.sucCallback && me.sucCallback(loc);//定位成功时，执行回调
        me.sucCallback = null;//执行回调完成后将回调置空，防止回调的多次执行
    },
    /**
     * 定位失败回调
     * @param {object} msg 定位失败的信息
     */
    _geoFail: function (msg) {
        var me = this;
        //app.location.isGeoSuc = false;//定位失败
        me._IS_LAST_GEO_FAIL = true;//上次定位失败
        me._addStatGeoFail(msg);//添加定位失败统计
        me.sucCallback && (me.sucCallback = null);//定位失败后，若回调存在，则将回调置空，防止回调的重复执行
    },
    /**
     * 添加时间统计
     * @return {number} time 定位所需的时间(单位s)
     */
    _getStatTime: function () {
        var time = Date.now();
        time = Math.ceil((time - this._time) / 1000);
        return time;
    },
    /**
     * 添加定位的统计
     * @param {object} loc 定位数据
     */
    _addStatGeoSuc: function (loc) {
        var me = this,
            time;

        time = me._getStatTime(); //定位所需时间

        if(loc.isExactPoi && loc.type != null){
            metricStat.addStat('geo', 'geo_suc_all');//统计定位总成功数
        }

        switch(loc.type){
            case 'share' :
                if(loc.minutes == 5){
                    metricStat.addStat('geo', 'share_geo_five_suc', {time : time}); //统计五分钟内共享位置定位成功
                }
                if(loc.minutes == 30){
                    metricStat.addStat('geo', 'share_geo_thirty_suc', {time : time});//统计三十分钟内共享位置定位成功
                }
                break;
            case 'native':
                metricStat.addStat('geo', 'native_geo_suc', {time : time});//统计native定位成功
                break;
            case 'html5' :
                metricStat.addStat('geo', 'wlan_geo_success', {time : time});//统计html5定位成功
                break;
            case 'preciseip':
                metricStat.addStat('geo', 'preciseip_geo_sucess', {time : time});//添加精确IP定位统计
                break;
            case 'url':
                metricStat.addStat('geo', 'url_geo_sucess', {time : time});// 添加url定位统计
                break;
            case 'storage': 
                if(loc.isExactPoi){
                    metricStat.addStat('geo', 'storage_geo_success', {time : time});//添加localStorage定位统计
                }
                break;
        }
        metricStat.submit("geo");
    },
    /**
     * 定位失败的统计
     * @param {object} msg 定位失败的数据
     */
    _addStatGeoFail: function (msg) {
        metricStat.addStat('geo', 'wlan_geo_error', {error:msg.code, messgae:msg.message});//统计定位失败次数，针对html5定位
        metricStat.submit("geo");
    },
    /*
     * 单个定位方法成功回调
     * @param {object} data回调参数
     * @author chengbo
     */
    _geoMethodSuccess: function (data) {
        var locator = require('common:widget/geolocation/location.js');
        locator.setAddress(data, this.isInitGeo);
        this._geoindex = 0;
    },
    /*
     * 单个定位方法失败回调
     * @param {object} data回调参数
     * @author chengbo
     */
    _geoMethodFail: function (data) {
        var me = this;
        me._useNextMethod(data);
    },
    /**
     * 初始化相关数据
     * 设置数组缓存当前的定位方式队列
     * @author chengbo
     */
    _initGeoData: function () {
        var native1   = {geostr: 'nativeGeolocation.start', param: {id: 'first'}},
            native2   = {geostr: 'nativeGeolocation.start', param: {id: 'second'}},
            share_5   = {geostr: 'shareGeo.start', param: {par: 5, id: '5min'}},
            share_30  = {geostr: 'shareGeo.start', param: {par: 30, id: '30min'}},
            preciseip = {geostr: 'preciseipGeo.start', param: {}},
            html51    = {geostr: 'html5Geolocation.start', param: {id: 'first', par: 30000}},
            html52    = {geostr: 'html5Geolocation.start', param: {id: 'second', par: 30000}},
            url       = {geostr: 'urlgeolocation.start', param: {}};

        if (util.isAndroid() === true) {
            this._GEO_ARRAY = [url, share_5, native1, preciseip, html51, native2, share_30, html52];
        } else {
            this._GEO_ARRAY = [url, share_5, html51, preciseip, share_30, html52];
        }
    },
    /*
     * 一次调用定位方法
     * @param  定位失败，回传的失败信息
     * @author chengbo
     */
    _useNextMethod: function (data) {
        var tmpgeoobj = this._GEO_ARRAY[this._GEO_METHOD_INDEX];
        if (tmpgeoobj) {
            tmpgeoobj.geostr = tmpgeoobj.geostr || '';
            tmpgeoobj.param = tmpgeoobj.param || {};
            this._GEO_METHOD_INDEX++;
            broadcaster.broadcast(tmpgeoobj.geostr, tmpgeoobj.param);
        }
        else {
            broadcaster.broadcast('geolocation.fail', data);
        }
    }
};

/**
 * @module common:widget/geolocation/geolocation
 */
module.exports = Geolocation;


});