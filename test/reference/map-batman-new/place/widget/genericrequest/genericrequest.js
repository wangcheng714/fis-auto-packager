/**
 * @fileoverview 泛需求组件
 * shengxuanwei@baidu.com
 * 2013-11-06
 */
var mapConst = require('common:static/js/mapconst.js'),
    util = require('common:static/js/util.js'),
    loc = require('common:widget/geolocation/location.js'),
    BMap = require('common:widget/api/api.js'),
    searchData = require('common:static/js/searchdata.js'),
    MDLayer = require('place:widget/genericlayer/genericlayer.js');

// 泛需求底图蓝点Icon
function GenRequest() {
    // 当前JSON数据存储
    this.json = null;
    // 查询关键字，用以判断是否需要删除旧地图
    this.qWord = "";
    // 查询城市，用以判断是否需要删除旧地图
    this.qCity = -1;
    // 当前地图是否泛需求状态
    this.isGRequest = false;
    // 前端存储麻点数据
    this.genDataLst = {};
    // 前端存储麻点id的数组，用以对genDataLst数据的使用频率和删除管理
    this.genDataIdLis = [];
    // 当前已提交给底图可点系统的瓦片id
    this.spotOnId = "";
    // 气泡
    this.marker = null;
    // 当前视野的瓦片id集合
    this.curBoundTiles = [];
    // 中心点记录程序，用以判断是否发出请求
    this.curCenterPoint = null;
    // 检索type记录,type=1是普通泛需求，type=2是全国检索
    this.types = {
        /* poi检索泛需求普通结果 */
        "36": {
            "t": 1
        },
        /* 周边检索普通结果 */
        "38": {
            "t": 1
        },
        /* 视野内检索普通结果 */
        "39": {
            "t": 1
        }
    };
}

$.extend(GenRequest.prototype, {
    /**
     * 初始化，清除缓存
     */
    initialize: function () {
        this.clearCache();
    },

    /**
     * 设置mapView对象
     * @param {MapView}
     */
    setMapView: function (mapView) {
        this.mapView = mapView;
        this.map = mapView.getMap();
        this.bindSpotClickEvent();
    },

    /**
     * 绑定麻点点击的事件
     */
    bindSpotClickEvent: function () {
        var me = this;
        if (this.binded) {
            return;
        }

        this.binded = true;
        var hotspotClickHandler = function (e) {
            var iwOverlay = me.mapView.iwController.get();
            if (iwOverlay.skipClickHandler) return;

            var spotArr = e.spots;

            // 点击非麻点，如图区其他部分            
            if (!spotArr || spotArr.length < 1 || !(spotArr[0].getUserData().tag) || spotArr[0].getUserData().tag != "GR_DATA") {
                if (me.marker) {
                    me.map.removeOverlay(me.marker);
                    me.marker = null;
                }
                return;
            }

            me.onGRHotspotClick && me.onGRHotspotClick(e);

            var userData = spotArr[0].getUserData().userdata;
            var uid = userData.uid;
            var name = userData.name;

            me.showPoiInfoWindow(spotArr[0].getPosition(), uid, name);
        };

        listener.on('infowindow.' + mapConst.IW_GRT, 'click', function (name, evt) {
            var id = evt.id,
                data = evt.data,
                instance = evt.instance;

            switch(id) {
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

        this.map.addEventListener("onhotspotclick", hotspotClickHandler);
    },

    /**
     * 初始化设置数据
     * API方法
     * @public
     * @param {json} 检索的原始数据
     */
    setGRData: function (json) {
        if (!json) return;
        this.json = json;

        // 重新设置状态
        this.clearListener();
        this.resetStatus();
    },

    /**
     * 重新设置状态
     */
    resetStatus: function () {
        /*是否普通检索，还是全国检索*/
        var type = this.json.result.type.toString();
        if (!this.types[type]) return;
        this.isGRequest = true;
        if (this.types[type].t == 1) {
            // 重新添加底图
            this.addGRMap();
            // 重新添加底图麻点数据处理
            this.addMDRequest();
        } else if (this.types[type].t == 2) {
            this.clearGRMap();
            this.clearListener();
        }
        // 添加地图事件监控
        this.addMDEvent();
        // 保存当前的地图中心点
        this.curCenterPoint = this.map.centerPoint;
    },
    /**
     * 清除麻点缓存、底图、地图事件监控
     * 更换wd或组件时调用
     */
    clearCache: function () {
        //this.json = null;
        this.isGRequest = false;
        this.genDataLst = {};
        this.genDataIdLis = [];
        this.spotOnId = "";
        this.curBoundTiles = [];
        if (this.marker) {
            this.map.removeOverlay(this.marker);
            this.marker = null;
        }
        this.clearListener();
        this.map.clearHotspots();
        this.qWord = "";
        this.qCity = -1;
        this.clearGRMap();
    },
    /**
     * 清除事件监听
     */
    clearListener: function () {
        if (!this.map) {
            return;
        }

        this.map.removeEventListener("load", window.bindMDRequest);
        this.map.removeEventListener("moveend", window.bindMDRequest);
        this.map.removeEventListener("zoomend", window.bindMDRequest);
        this.map.removeEventListener("mapcontainerresize", window.bindMDRequest);
    },
    /**
     * 清除已存在的地图
     */
    clearGRMap: function () {
        var tilelayer = GenRequest.MDLayer;
        if (tilelayer) {
            this.map.removeTileLayer(tilelayer);
            this.qWord = "";
            this.qCity = -1;
            this.genDataLst = {};
            this.genDataIdLis = [];
        }
        GenRequest.MDLayer = null;

        // 隐藏气泡
        if (this.marker) {
            this.marker.hide();
        }
    },
    /**
     * 重新添加栅格麻点图
     */
    addGRMap: function () {
        if (!this.json) return;

        var wd = this.json.result.return_query || "";
        if (this.qWord != wd || this.qCity != loc.getCityCode()) {
            this.clearGRMap();
            if (this.json.result.type == 38 && this.map.zoomLevel < 11) return;

            this.qWord = wd;
            this.qCity = loc.getCityCode().cityCode;
            var bounds = new BMap.Bounds(-21364736, -10616832, 23855104, 15859712);
            var mdLayer = new MDLayer({
                json: this.json,
                transparentPng: false
            });
            this.map.addTileLayer(mdLayer);
            GenRequest.MDLayer = mdLayer;
        }
    },
    /**
     * 发送麻点图数据请求
     */
    sendMDRequest: function () {
        var me = this;
        setTimeout(function () {
            me._sendMDRequest();
        }, 1);
    },
    /**
     * 视野变化时，请求新的底图数据
     */
    _sendMDRequest: function () {
        var me = this;
        if (!me.json || !me.isGRequest) return;
        var tPOIs = this.map.getViewTiles();
        var ids = [];
        this.curBoundTiles = [];
        for (var i = 0, n = tPOIs.length; i < n; i++) {
            var tId = this.map.getZoom() + "_" + tPOIs[i].x + "_" + tPOIs[i].y;
            this.curBoundTiles.push(tId);
            if (!me.genDataLst[tId]) { // 需要限制9张
                ids.push(tPOIs[i].x + "_" + tPOIs[i].y);
            }
        }
        if (ids.length == 0) return;
        this.map.clearHotspots();
        var url = [];
        url.push("/?qt=");
        url.push("bkg_data&c=" + loc.getCityCode() + "&ie=utf-8&wd=" + encodeURIComponent(me.json.result.return_query));
        if (window["placeParam"]) {
            url.push(window["placeParam"]);
        }
        //麻点抽稀 by yangjian01
        url.push("&rn=4");
        var b = this.map.getBounds();
        var bs = "(" + b.getSouthWest().lng + "," + b.getSouthWest().lat + ";" + b.getNorthEast().lng + "," + b.getNorthEast().lat + ")";
        url.push("&l=" + this.map.zoomLevel + "&xy=" + ids.join(",") + "&callback=getMData&b=" + bs);
        $.ajaxJSONP({
            url: url.join("")
        });
    },
    /**
     * 添加底图麻点数据处理
     */
    addMDRequest: function () {
        this.sendMDRequest();
    },
    /**
     * 点击麻点数据，添加蓝色气泡和POI弹框
     */
    showPoiInfoWindow: function (pt, uid, name) {
        if (!pt || !uid || !name) return;

        pt = new BMap.Point(pt.lng, pt.lat);

        // 绘制蓝色气泡
        if (this.marker) {
            this.marker.setPoint(pt);
        } else {
            this.marker = this.addGRMarker(pt);
        }
        this.marker.show();

        // 弹出弹框
        iwOverlay = this.mapView.iwController.get(mapConst.IW_GRT);
        iwOverlay.setData(mapConst.IW_GRT, {
            json: {
                uid: uid,
                name: name,
                geo: "1|" + pt.lng + ',' + pt.lat
            }
        }).switchTo(0);
        // 跳过底图可点弹框
        iwOverlay.skipClickHandler = true;
    },
    /**
     * 添加泛需求的蓝marker
     * @param {Point} 坐标点
     * @return {Marker} 标注
     */
    addGRMarker: function(point) {
        var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(23, 32), {
            anchor: new BMap.Size(12, 32),
            imageOffset: new BMap.Size(29, 352)
        });

        var marker = new this.mapView.CustomMarker(icon, point, {
            className: "fix_gr_mk"
        });

        this.map.addOverlay(marker);

        return marker;
    },
    /**
     * "i=uid,****"格式url落地，指定麻点展现
     * API方法
     * @public
     */
    sendInfRequest: function (uid) {
        if (!uid) return;
        var me = this;
        var pars = "qt=inf&uid=" + uid;
        searchData.fetch(pars, function (data) {
            var c = data.content;
            var pt = util.getPointByStr(util.parseGeo(c.geo).points);
            me.showPoiInfoWindow(pt, uid, c.name);
        });
    },
    /**
     * 麻点数据获取后的回调函数
     * @param {json} 获取的最新数据
     *   json = [
     *        {"uid_num":50, "err_no":0, "tileid":"12_790_294", "uids":[]},
     *        .....
     *        {"uid_num":50, "err_no":0, "tileid":"12_790_294", "uids":[]}
     *   ]
     */
    getGRData: function (json) {
        if (!json) return;
        for (var i = 0, n = json.length; i < n; i++) {
            var j = [];
            var js = json[i];
            for (var ii = 0, nn = js.uids.length; ii < nn; ii++) {
                j.push({
                    pt: new BMap.Point(js.uids[ii].x, js.uids[ii].y),
                    bd: [30, 16, 0, 16],
                    userdata: {
                        name: js.uids[ii].name,
                        uid: js.uids[ii].uid
                    },
                    tag: "GR_DATA"
                });
            }

            this.genDataLst[js.tileid] = j;
            this.genDataIdLis.push(js.tileid.toString());
            if (this.genDataIdLis.length > 30) {
                // 存储超出30张瓦片数据时，删除使用频率最小的一张数据
                var delId = this.genDataIdLis.shift();
                delete(this.genDataLst[delId]);
                delete delId;
            }
        }

        for (var i = 0, n = this.curBoundTiles.length; i < n; i++) {
            if (this.genDataLst[this.curBoundTiles[i]]) {
                var tmpD = this.genDataLst[this.curBoundTiles[i]];
                for (var ii = 0, nn = tmpD.length; ii < nn; ii++) {
                    var spotData = new BMap.Hotspot(tmpD[ii].pt, {
                        userData: tmpD[ii],
                        offsets: tmpD[ii].bd
                    });
                    this.map.addHotspot(spotData);

                }
            }
        }
    },

    /**
     * 判断是否移动够距离发起检索
     */
    hasNotMoved: function () {
        if (!this.curCenterPoint) {
            return true;
        }

        // 排除地图未初始化时就开始加载麻点图的情况
        if (this.curCenterPoint.lng === 0 && this.curCenterPoint.lat === 0) {
            this.curCenterPoint = this.map.centerPoint;
        }

        var px1 = this.map.pointToPixel(this.curCenterPoint);
        var px2 = this.map.pointToPixel(this.map.centerPoint);
        var dx = Math.abs(px1.x - px2.x);
        var dy = Math.abs(px1.y - px2.y);

        // 更新保存地图中心点
        this.curCenterPoint = this.map.centerPoint;

        if (dx >= 0.6 * this.map.width || dy >= 0.6 * this.map.height) {
            return false;
        }

        return true;
    },

    /**
     * 给缩放拖动增加泛需求请求事件的绑定
     */
    addMDEvent: function () {
        var me = this;

        // 优化，这里绑定一个事件处理函数
        if (!window.bindMDRequest) {
            window.bindMDRequest = function (evt) {
                if (evt.type === 'onmoveend' && me.hasNotMoved()) {
                    return;
                }
                me.sendMDRequest();
            };
        }

        this.map.addEventListener("load", window.bindMDRequest);
        this.map.addEventListener("moveend", window.bindMDRequest);
        this.map.addEventListener("zoomend", window.bindMDRequest);
        this.map.addEventListener("mapcontainerresize", window.bindMDRequest);
    }
});

/**
 * JSONP方式请求数据，全局回调函数
 */
window.getMData = function (json) {
    if (!json) return;
    var GRControl = require('place:widget/genericrequest/genericrequest.js');
    GRControl.getGRData(json);
};

module.exports = new GenRequest();