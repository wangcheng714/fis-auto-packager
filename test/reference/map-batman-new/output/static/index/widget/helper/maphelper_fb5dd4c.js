define('index:widget/helper/maphelper.js', function(require, exports, module){

/**
 * @fileOverview 首页底图页面
 * @author jican@baidu.com
 * @data 2013/10/28
 */

var mapView = require('common:widget/map/map.js'),
    mapConst = require('common:static/js/mapconst.js'),
    locator = require('common:widget/geolocation/location.js'),
    url = require('common:widget/url/url.js');

module.exports = {

    init: function (page, data) {
        this.saveLocation(data);
        mapView.clearOverlays();
        mapView._centerAndZoom();
        this.openInfoWindow();
    },

    openInfoWindow: function () {
        setTimeout(function () {
            var curHash = window._APP_HASH,
                infowindow = mapView.iwController.get();
            //系统定位点和中心点重合，添加蓝点的时候弹出“我的位置”弹出框
            if (!locator.isUserInput()) {
                if (mapView.isMyCenter()) {
                    infowindow && mapView.openGeoIw();
                } else {
                    infowindow && infowindow.hide();
                }
            }
        }, 100);
    },

    /**
    * 缓存定位信息
    * @param {object} data 从model获取的数据 
    */
    saveLocation: function(data) {
        if (!data) return;

        var me = this,
            result,
            isSpecialPoi,
            level,
            content;

        //是否是特殊点,如钓鱼岛等
        isSpecialPoi = data.result.type === 26 ? true : false;

        content = isSpecialPoi ? data.current_city : data.content;
        point = isSpecialPoi ? data.content[0].split(',') : me.getPoint(content);
        level = isSpecialPoi ? data.content[1] : content.level;

        //若是全国，则level调整为4
        level = level !== 0 ? level : 4;

        result = {
            addr:{
                city: isSpecialPoi ? content.name : content.pcname ? content.pcname : content.cname,
                address: isSpecialPoi ? content.name : content.pcname ? content.pcname + content.cname : content.cname,
                cityCode: content.pccode ? content.pccode : content.code,
                cityType: data.current_city.type
            },
            point: {
                x: point[0],
                y: point[1]
            },
            isExactPoi: false,
            level: level,
            isGeoSuc: true
        };

        //利用location接口设置当前的位置
        locator.setAddress(result);
    },

    /**
    * 获取中心点
    * @param {object} content 位置信息 
    * @return {array} point 当前的中心点(墨卡托坐标)
    */
    getPoint: function(content){
        return content.geo.split(';')[1].split('|')[0].split(',');
    }
};

});