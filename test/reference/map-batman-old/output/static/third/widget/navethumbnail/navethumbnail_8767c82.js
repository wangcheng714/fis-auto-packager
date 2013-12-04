define('third:widget/navethumbnail/navethumbnail.js', function(require, exports, module){

/**
 * @fileOverview 线路页缩略图
 * @author yuanzhijia@baidu.com
 * @date 2013-08-01
 */
var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    util = require("common:static/js/util.js"),
    geolocator = require('common:widget/geolocation/geolocation.js'),
    locator    = require('common:widget/geolocation/location.js'),
    loc = locator,
    searchData    = require("common:static/js/searchdata.js"),
    stat = require('common:widget/stat/stat.js');
// 私有常量
var GEO_TIMEOUT     = 8,
    THUMB_DATA      = {
        type    : "0,2",
        level   : 16,
        height  : 101,
        width   : window.innerWidth-22,
        url     : null,
        host    : 'http://snap.map.baidu.com/?qt=snap&data='
    },
data = window['_CURRENT_CITY'],
cname = data.name;
util.showLoading($('#poipic-area'));
module.exports = {
    init : function () {
        this.render();
        this.bind();
    },
    render : function () {
        this.thumbImage     = $('#mapimg');
        this.errorCnt       = $('.error-cnt');  
        this.thumbImageA  = $('#right-a');
        this.subwayBtn = $('#subwayBtn');
        this.cityNameCnt = $('#cityNameCnt');
        this.nearbus =  $('#nb-bus');
        this.nearbusspan = $('#busspan');
        this.nearsubway = $('#nb-subway');
        this.nearsubwayspan = $('#stationspan');
        this.imgcon = $('#route-pic');
    },

    bind : function () {
        var _this = this;
        broadcaster.subscribe('geolocation.mylocsuc', function  () {

            _this.setLocation();
        }, this);
        broadcaster.subscribe('geolocation.fail', function  () {

            _this.thumbImageA.hide();
            _this.errorCnt.show();
        }, this);
        broadcaster.subscribe('sizechange', function (argument) {
            _this._appReSize();
        }, this);
        _this._trafficsubway();
    },
    /**
    *地铁和路况优先load 如果等待定位会load很长时间 相信同步的code
    */
    _trafficsubway:function(){
        var me  = this;
        if(cname!="全国"){
            me.imgcon.show();
            me._setThumbUrl();
            //检查当前城市是否有地铁
            var supportCityInfo = util.ifSupportSubway(locator.getCityCode());
            if(!supportCityInfo) {
                me.subwayBtn.hide();
            } else {
                var sarr = supportCityInfo.split(',')
                me.subwayBtn.attr("href","/mobile/webapp/subway/show/city="+sarr[0]+"/ref=index&forcesample=old_sample_1309");
                me.cityNameCnt.html(sarr[1]+"市地铁线路图");
                me.subwayBtn.show();
                stat.addStat(STAT_CODE.STAT_LINEINDEX_SUBWAYBTN_DISPLAY);
            }
        }
    },
    /**
     * 页面重设宽度
     */
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
    /**
     * 通过解析GEO 获取当前城市的 point
     */
    setLocation: function(){
        var me = this;
        //if(cname!="全国"){
            if (locator.getMyCityCode() == data.code) {
                //附近公交和地铁
                me._getNearbyData();
            };
        //}
    },
    /**
     * 设置缩略图
     */
    _setThumbUrl : function() {
        var _this = this,
            url = _this._getThumbUrl();
        /*if(locator.hasExactPoi()) {
            //_this.centerMarker.show();
        } else {
           // _this.centerMarker.hide();
        }*/
        _this.thumbImage.attr("src", url);
        util.hideLoading($('#poipic-area'));
    },
    /**
     * 根据传入坐标获取缩略图服务的url
     */
    _getThumbUrl: function() {
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
        var point;
        if(data) {
            //data = data.index);
            JSONdata = data.geo;
            cityPoint = util.geoToPoint(JSONdata);
            point ={
                x:0,
                y:0
            }
            point.x = cityPoint.lng;
            point.y = cityPoint.lat;           
        }else{
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
        //var data = '{"retype":"1","src":"webapp", "level":' + THUMB_DATA['level'] + ',"center":"' + point.x + " " + point.y + '","height":101,"width":' + THUMB_DATA['width'] +',"coordtype":"M","pictype":"' + THUMB_DATA['type'] + '"}';
        return THUMB_DATA.host + JSON.stringify(param);
    },
    /**
     *取数据附近的地铁站和公交站
     *@author yuanzhijia@baidu.com
     */
    _getNearbyData : function() {
        var me = this;
        //if(locator.hasExactPoi()) { //非周边检索
            var queryBus = $.param(me._getQueryByWd("公交站").query);
            var querySubway = $.param(me._getQueryByWd("地铁站").query);

            searchData.fetch(queryBus, $.proxy(me._cbGetBusStation, this));
            searchData.fetch(querySubway, $.proxy(me._cbGetSubwayStation, this));
        //}
    },
    /**
     *取附近公交站和地铁站的URL组合
     *@author yuanzhijia@baidu.com
     */
    _getQueryByWd: function(wd) {
        var query = {
            qt: 's',
            wd: wd,           
            c: locator.getMyCityCode()
        };

        var pageState = {};

        //if(locator.hasExactPoi()) { //非周边检索
            query["center_rank"] = 1; //以位置为中心点进行周边检索 
            query["nb_x"] = locator.getMyPointX();
            query["nb_y"] = locator.getMyPointY();
        //}
        return {query:query,pageState:pageState};
    },
    /**
     *取附近公交站回调
     *@author yuanzhijia@baidu.com
     */
    _cbGetBusStation: function(json) {

        var me = this;
        if(json == undefined || json.content.length == 0)  return;
        var st = json.content[0] || "";
        me.nearbusspan.text(st.name + '-公交站');
        me.nearbusspan.attr('href','/mobile/webapp/place/detail/qt=inf&uid='+st.uid+'&c='+locator.getMyCityCode()+'/tab=line');
        me.nearbus.show();
        stat.addStat(STAT_CODE.STAT_LINEINDEX_BUS_DISPLAY);
    },
    /**
     *取附近地铁站回调
     *@author yuanzhijia@baidu.com
     */
    _cbGetSubwayStation: function(json) {
        var me = this;
        if(json == undefined || json.content.length == 0)  return;
        var sub = undefined;
        // debugger;
        for(var i = 0, len = json.content.length; i < len; i++) {
            if(json.content[i].poiType == 3) {
                sub = json.content[i];
                break;
            }
        }

        if(sub == undefined) return;

        var st = sub || "",
            sName = st.name + '-地铁站';
        me.nearsubwayspan.text(sName);
        me.nearsubwayspan.attr('href','/mobile/webapp/place/detail/qt=inf&uid='+st.uid+'&c='+locator.getMyCityCode()+'/tab=line');
        me.nearsubway.show();
        stat.addStat(STAT_CODE.STAT_LINEINDEX_SUBWAY_DISPLAY);
    }
}

});