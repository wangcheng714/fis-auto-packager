define('place:widget/genericre/genericre-vector.js', function(require, exports, module){

/**
 * @fileOverview矢量麻点对原栅格麻点进行适配
 * @author yuanzhijia@baidu.com
 * @data 2013-12-03
 */
var BMap,
    mapConst = require('common:static/js/mapconst.js'),
    stat = require('common:widget/stat/stat.js'),
    locator = require('common:widget/geolocation/location.js'),
    GenericreVector = GenericreVector || {};
$.extend(GenericreVector, {
    init: function() {
        this.bind();
    },
    bind: function() {
        var me = this;
        if (me.hasbinded) {
            return;
        };
        me.hasbinded = true;
        listener.on('infowindow.' + mapConst.IW_GRT, 'click', function(name, evt) {
            var id = evt.id,
                data = evt.data,
                instance = evt.instance;
            switch (id) {
                case 'iw-l':
                    instance.nbSearch(data.name, data.geo);
                    break;
                case 'iw-c':
                    instance.detailSearch(data.uid);
                    break;
                case 'iw-r':
                    instance.lineSearch(data.name, data.geo);
                    break;
                default:
                    break;
            }
        });
        var map = me.map;
        // 矢量底图可点
        map.addEventListener("click", function(e) {
            if (me.marker) {
                me.map.removeOverlay(me.marker);
                me.marker = null;
            }
            return;
        });
        map.addEventListener("onvectorclick", function(e) {
            var iconInfo = e.iconInfo;
            if (e.from == 'madian') {
                //添加蓝点
                var pt = new BMap.Point(iconInfo.point.x, iconInfo.point.y),
                    iwOverlay = me.mapView.iwController.get(mapConst.IW_GRT);
                /*添加蓝点*/
                if (me.marker) {
                    me.marker.setPoint(pt);
                } else {
                    me.marker = me.addGRMarker(pt);
                }
                me.marker.show();
                iwOverlay.setData(mapConst.IW_GRT, {
                    json: [{
                        uid: iconInfo.uid,
                        name: iconInfo.name,
                        geo: "1|" + pt.lng + ',' + pt.lat
                    }]
                }).switchTo(0);
                // 泛需求麻点marker点击量
                stat.addStat(COM_STAT_CODE.MAP_GR_MARKER_CLICK);
                // 跳过底图可点弹框
                iwOverlay.skipClickHandler = true;
            }
        });
    },
    addGRMarker: function(point) {
        var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(23, 32), {
            anchor: new BMap.Size(11, 30),
            imageOffset: new BMap.Size(29, 352)
        });

        var marker = new this.mapView.CustomMarker(icon, point, {
            className: "fix_gr_mk"
        });

        this.map.addOverlay(marker);
        return marker;
    },
    setMapView: function(mapView) {
        //初始化map对象
        var me = this;
        me.mapView = mapView;
        me.map = mapView.getMap();
        BMap = mapView.getBMap();
        //初始化矢量适配类
        if (!me.hasbinded) {
            me.init();
        }
    },
    setGRData: function(data) {
        //初始化矢量麻点layer  将data传递给api
        var keyWord = encodeURIComponent(data['result']['return_query']),
            cityCode = locator.getCityCode() || 1,
            me = this,
            vectorMap = me.map;
        if (data.current_city) {
            if ('code' in data.current_city) {
                cityCode = data['current_city']['code'];
            };
        };
        me.vectorMdLayer = new BMap.VectorMDLayer(keyWord, cityCode);
        vectorMap.addTileLayer(me.vectorMdLayer)
    },
    clearCache: function() {
        //矢量麻点自动消除
        var me = this,
            vectorMap = me.map;
        vectorMap.removeTileLayer(me.vectorMdLayer);
        return;
    }
});
module.exports = GenericreVector;

});