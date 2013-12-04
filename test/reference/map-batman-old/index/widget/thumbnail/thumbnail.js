/**
 * @fileOverview 首页缩略图
 * @author jican@baidu.com
 * @date 2013-7-30
 */

var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    util = require("common:static/js/util.js"),
    url = require('common:widget/url/url.js'),
    popup = require('common:widget/popup/popup.js'),
    locator = require('common:widget/geolocation/location.js');
    stat = require('common:widget/stat/stat.js');

var STATE = {
        'start'     : 1, //开始 即定位中
        'success'   : 2, //成功
        'fail'      : 0  //失败
    },
    THUMB_DATA = {
        type    : 0,
        level   : 16,
        height  : 101,
        width   : window.innerWidth-22,
        url     : null,
        host    : 'http://snap.map.baidu.com/?qt=snap&data='
    };


module.exports = {

    flag : {
        'appreszie' : false,
        'wait'      : undefined
    },

    state : 'start',

    init : function () {
        this.prevPoint = undefined;
        this.render();
        this.bind();
    },

    render : function () {
        this.thumbImg       = $('.thumb-img');
        this.thumbWrap      = $('.thumb-wrap');
        this.locbarTxt      = $('.locbar-txt');
        this.centerMarker   = $('.center-marker');
        this.geoBtn         = $('.thumb-left');
        this.inBtn          = $('.in-btn');
        this.errorCnt       = $('.error-cnt');
        this.thumbLink      = $('.thumb-link');

        this.setState('start');
        this.setUserHeading();
    },

    bind : function () {

        var _this = this;

        _this.geoBtn.on('click', function (e) {
            //增加首页“定位”按钮点击量
            stat.addStat(STAT_CODE.STAT_THUNB_START_GEO);
            _this.startGeo();
            e.stopImmediatePropagation();
            e.stopPropagation();
            return;
        });

        _this.thumbImg.on('load', function(){           
            _this.errorCnt.hide();
            _this.thumbImg.show();
            _this.geoBtn.show();
            _this.hideLoading();
        });

        _this.thumbImg.on('error', function(){
            _this.errorCnt.show();
            _this.thumbImg.hide();
            _this.centerMarker.hide();
            _this.hideLoading();
        });
        
        broadcaster.subscribe('geolocation.success', function () {
            this.successCBK();
        }, this);

        broadcaster.subscribe('geolocation.fail', function () {
            this.failCBK();
        }, this);

    },

    //定位成功回调函数
    successCBK: function () {
        if(!this.flag.appreszie) {
            broadcaster.subscribe('sizechange', function () {
                this._appReSize();
            }, this);
            this.flag.appreszie = true;
        }
        this.setState('success');
    },

    //定位失败回调
    failCBK: function () {
        this.setState('fail');
    },

    //设置当前状态
    setState: function(state){
        this.flag.state = state;
        this.addStateToLog(state);
        switch(state){
            case 'start': {     //开始定位
                this.state = 'start';
                this.showLoading();
                this.waitForLoc(8);
                break;
            }
            case 'success':  {  //定位成功
                this.state = 'success';
                this.hideLoading();
                this.setLocation();
                break;
            }
            case 'fail': {          //定位失败
                this.state = 'fail';
                this.hideLoading();
                this.centerMarker.hide();
                popup.open({text:'定位失败'});
                this.setLocation();
                if(this.flag.wait) {
                    window.clearTimeout(this.flag.wait);
                }
                break;
            }
        }
    },

    addStateToLog : function (state) {
        if(state !== "success" && state !== "fail") {
            return;
        }

        var log = {
            code : STAT_CODE.STAT_THUMB_IMG_CLICK,
            state : state
        }
        this.thumbLink.data("log",JSON.stringify(log));
    },

    //主动发起定位请求
    startGeo: function(){
        this.setState('start');
        locator.startGeo(); 
    },

    waitForLoc : function (second) {
        var _this = this;
        if(_this.flag.wait) {
            window.clearTimeout(_this.flag.wait);
        }
        _this.flag.wait = window.setTimeout(function () {
            if(_this.state!='success'){
                _this.failCBK();
            }
        }, second * 1000);
    },

    //设置用户方向
    setUserHeading : function () {
        var userHeading = require('userheading.js');
        if (userHeading.isSupport()) {
            this.centerMarker.addClass('navi-marker');
            var dom = $('.center-marker div').get(0);
            userHeading.start(dom);
        }
    },

    //设置当前位置
    setLocation: function(){
        var isExactPoi,
            address,
            point = locator.getCenterPoi();

        if(this._unEqualPoint(point)) {
            this.prevPoint = point;
            this._setThumbUrl();
        } else if(this.prevPoint != undefined) {
            this.hideLoading();
        } 

        this._setLocBarAddress();
        this._setGeoBtnStatus();
        this._setSearchBoxCity();
    },

    //显示loading
    showLoading : function () {
        util.showLoading(this.thumbWrap);
        this.locbarTxt.html('正在定位您的位置...');
    },

    //隐藏loading
    hideLoading : function () {
        util.hideLoading(this.thumbWrap);
    },

    _setLocBarAddress : function(address) {
        var addr = address || locator.getAddress();
        this.locbarTxt.html(addr);
    },

    _setSearchBoxCity : function (city) {
        var city = city || locator.getCity();
        $('.se-city-wd').html(city);
    },

    _setGeoBtnStatus : function() {
        if(locator.hasExactPoi()) {
            this.geoBtn.removeClass('geo-fail');
        } else {
            this.geoBtn.addClass('geo-fail');
        }
    },

    _setThumbUrl : function(imgUrl) {
        var _this = this,
            url = imgUrl || _this._getThumbUrl();

        if(locator.hasExactPoi()) {
            _this.centerMarker.show();
        } else {
            _this.centerMarker.hide();
        }
        _this.thumbImg.attr("src", url);
    },

    _appReSize : function  () {
        var _this = this;
        if(util.isAndroid()) {
            setTimeout(function() {
                THUMB_DATA['width'] = window.innerWidth - 22;
            },800)
        } else {
            THUMB_DATA['width'] =  window.innerWidth - 22;
        }
        _this._setThumbUrl();
    },

    _equalPoint : function (point) {
        return (
            this.prevPoint && 
            this.prevPoint.x == point.x && 
            this.prevPoint.y == point.y
        );
    },

    _unEqualPoint : function (point) {
        return (
            this.prevPoint == undefined ||
            point.x != this.prevPoint.x ||
            point.y != this.prevPoint.y
        );
    },

    _getThumbUrl: function(point) {

        //根据获取图的类型设置不同级别
        if(THUMB_DATA['type'] == 0) {
            if(locator.getCity() == "全国") {
                THUMB_DATA['level'] = 3;
            } else if(locator.hasExactPoi()) {
                THUMB_DATA['level'] = 16;
            } else {
                THUMB_DATA['level'] = 10;
            }
        } else {
            THUMB_DATA['level'] = 10;
        }

        //如果传入中心点为空，取当前定位中心点
        if(point == undefined) {
            point = locator.getCenterPoi();
        }

        var param = {
            'retype'    : 1,
            'src'       : 'webapp',
            'level'     : THUMB_DATA['level'],
            'center'    : point.x + " " + point.y,
            'height'    : 101,
            'width'     : THUMB_DATA['width'],
            'coordtype' : 'M',
            'pictype'   : THUMB_DATA['type']
        }

        return THUMB_DATA.host + JSON.stringify(param);
    }
}