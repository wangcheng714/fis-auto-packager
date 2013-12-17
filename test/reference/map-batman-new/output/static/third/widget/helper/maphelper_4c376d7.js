define('third:widget/helper/maphelper.js', function(require, exports, module){

/**
 * @fileOverview 第三方的路况落地页
 * @author nichenjian@baidu.com
 * @data 2013/11/28
 */
'use strict';

var mapView  = require('common:widget/map/map.js'),
    mapConst = require('common:static/js/mapconst.js'),
    locator  = require('common:widget/geolocation/location.js'),
    url      = require('common:widget/url/url.js'),
    popup    = require('common:widget/popup/popup.js'),
    util     = require('common:static/js/util.js');

module.exports = {

    init: function () {
        mapView.clearOverlays();
        this._centerAndZoom();
    },

    _centerAndZoom: function(){
        var point = this.getCityPoint();
        var map   = mapView.getMap();
        var _this = this;
        var pageState = url.get().pageState;
        map.enableLoadTiles = true;
        map.centerAndZoom(point, 12);

        listener.on('common.map', 'addlazycontrol', function (evt, args) {
            if (pageState && pageState.traffic === 'on') {
                if(!util.need2ShowTraffic(_this.code)){
                    mapView.trafficControl.hide();
                    _this._showTips();
                }else{
                    mapView.trafficControl.show();
                }
            }
        });

    },

    //获取当前城市的中心点
    getCityPoint: function(){
        var query  = url.get().query,
            curLoc = window._CURRENT_CITY,
            point;
        //当前url中包含坐标点
        if(query.city_x && query.city_y){
            this.code = query.code;
            point = [query.city_x, query.city_y];
        }else{
            //当前定位城市是全国，默认给出北京市的结果
            if(curLoc.code === 1){
                this.code = 131;
                point = [12958160, 4825907];
            }else{
                this.code = curLoc.code;
                point = this.getPoint(curLoc);
            }
        }

        return new BMap.Point(point[0], point[1]);
    },
    /**
     * 显示提示信息
     */
    _showTips : function() {
        var map = mapView.getMap();
        var zoom = map.getZoom();
        var vt = url.get().pageState.vt;
        var curHash = window._APP_HASH;

        if (zoom > 9 && (vt == 'map' || /map/i.test(curHash.page))) {
            popup.open({text:'当前城市暂无实时路况数据'});
        }
    },
    /**
    * 获取中心点
    * @param {object} content 位置信息 
    * @return {array} point 当前的中心点(墨卡托坐标)
    */
    getPoint: function(content){
        if(content.geo){
            return content.geo.split(';')[1].split('|')[0].split(',');
        }else{
            return [12958160, 4825907];
        }
    }
};

});