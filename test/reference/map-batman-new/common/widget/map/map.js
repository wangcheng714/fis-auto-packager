/**
 * @fileoverview 地图组件
 * @author jican@baidu.com
 * @date 2013/10/23
 */

var mapConst = require('common:static/js/mapconst.js'),
    pagemgr = require('common:widget/pagemgr/pagemgr.js'),
    util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    appresize = require('common:widget/appresize/appresize.js'),
    locator = require('common:widget/geolocation/location.js'),
    iwController = require('common:widget/map/iwcontroller.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = {
    /**
     * 图片路径常量 业务模块可能会用到
     */
    MARKERS_PATH         : __uri('/static/images/markers.png'),
    DEST_MKR_PATH        : __uri('/static/images/dest_mkr.png'),
    NAVI_MKR_PATH        : __uri('/static/images/navigation.png'),
    DRV_DIRECTION_PATH   : __uri('/static/images/drv_dest.png'),
    DRV_KEY_POI_PATH     : __uri('/static/images/drv_pin.png'),
    BUS_DIRECTION_PATH   : __uri('/static/images/bus_direction.png'),
    /**
     * 是否初始化
     */
    _initialized : false,
    /**
     * 驾车规划路线
     */
    driveRoutes: [],
    /**
     * 线路规划的起终点标注
     */
    destPois: [],
    /**
     * 地图组件初始化入口
     * @param {Function} cbk 回调
     */
    init: function (cbk) {
        if(!this._initialized) {
            this._init(cbk);
        } else {
            this.show(); // 非初始化状态需要先将地图show出来
            cbk && cbk(this._BMap);
            this.trafficControl.update();
        }
    },
    /**
     * 地图组件真正初始化函数 
     * @param {Function} cbk 回调
     */
    _init: function (cbk) {
        var _this = this;
        // 底图性能监控初始化
        (require('common:widget/monitor/maplog.js')).init();
        // 派发底图开始事件
        listener.trigger('common.map', 'start');
        // 获取异步组件 保存引用到当前对象
        this._getAsyncWidget(function(){
            var BMap = _this._BMap = arguments[0];
            listener.trigger('common.map', 'jsloaded'); // 派发JS加载完成事件
            $.each(arguments, function (index, item) {
                if(item._className_) {
                    if(/InfoWindow/.test(item._className_)) {
                        iwController[item._className_] = item;
                    } else {
                        _this[item._className_] = item;
                    }
                }
            });
            _this._initMap();
            _this._initialized = true;
            cbk && cbk(BMap);
        });
    },
    /**
     * 设置底图为矢量图
     */
    setVector: function () {
        this._map.config.vectorMapLevel = 12;
    },
    /**
     * 设置底图为栅格图
     */
    setRaster: function () {
        this._map.config.vectorMapLevel = 99;
        if(window._WISE_INFO && window._WISE_INFO.netspeed <= 300){
            this._map.enableHighResolution();
        }
    },
    /**
     * 设置地图视野 对外公开
     * @param {Array<Point>} 同map的setViewport参数第一个
     * @param {ViewportOptions} 同map的setViewport参数第二个
     */
    setViewport: function(data, options){
        var viewport = this._map.getViewport(data, options);
        var center = viewport.center;
        var zoom = viewport.zoom;
        this._centerAndZoom(center, zoom);
    },
    /**
     * 设初始化地图 如果center类型为Point时，zoom必须赋值
     * 除了首页其他模块不建议直接使用
     * @param {Point} center 中心点
     * @param {Number} zoom 级别
     */
    _centerAndZoom: function (center, zoom) {
        // 根据定位结果设置地图位置
        if (!center || !zoom) {
            center = new BMap.Point(
                locator.getPointX(),
                locator.getPointY()
            );
            zoom = locator.getLevel();
        }
        this._map.enableLoadTiles = true;
        this._map.centerAndZoom(center, zoom);
    },
    /**
     * 底图初始化 只会被执行一次 
     */
    _initMap: function () {

        // 常量
        this.DEST_MARKER_SIZE = new this._BMap.Size(29, 35);
        this.DEST_MARKER_ANCHOR = new this._BMap.Size(15, 34);
        this.DEST_DRIVER_DIR_SIZE = new this._BMap.Size(18, 18);

        // 显示地图容器
        this.show();

        // 创建地图实例
        var map = this._map = new this._BMap.Map('map-holder', {
            maxZoom: 18,
            minZoom: 3,
            drawMargin: 0,
            enableFulltimeSpotClick: true,
            enableHigholution: false, // 默认使用低分辨率效果
            vectorMapLevel: 12  // 默认开启矢量底图
        });

        // 先禁止加载瓦片
        map.enableLoadTiles = false;
        map.enableInertialDragging();

        // 绑定事件
        this._bindEvent();
        // 初始化地图控件
        this._initControl();
        // 派发JS加载完成事件
        listener.trigger('common.map', 'init', map);
    },
    /**
     * 隐藏地图容器
     */
    hide: function  () {
        $('.common-widget-map').css('visibility', 'hidden');
    },
    /**
     * 显示地图容器
     */
    show: function () {
        //显示地图容器之前需要先计算页面宽高和地图容器位置
        appresize.update();
        $('.common-widget-map').css('visibility', 'visible');
        this._fixCenterPos();
    },
    /**
     * 监听事件
     */
    _bindEvent: function () {

        var _this = this,
            map = this._map,
            BMap = this._BMap;

        // 绑定图区事件 增加底图可点功能 
        this._bindMapClick();

        // 监听定位成功
        listener.on('common.geolocation', 'success', function (event, data) {

            var href = url.get(),
                module = href.module,
                action = href.action,
                pageState = href.pageState || {},
                isLanding = pagemgr.isLandingPage(),
                center = new BMap.Point(data.point.x, data.point.y);

            if (
                data.isExactPoi &&
                data.type != null && 
                ( // 如果是系统定位,且没有指定参数，则不加气泡
                    data.isInitGeo === false ||
                    pageState.showmygeo == 1 ||
                    (module == 'index' && action == 'index' && isLanding)
                ) && !locator.isUserInput()
            ) {

                _this.addGLCenter(center);
                
            } else if( //用户输入的位置, 不添加指南针
                data.type == null && 
                _this.geolocationMarker != undefined && 
                locator.isUserInput()
            ) {
                _this._map.removeOverlay(_this.geolocationMarker);
                _this.geolocationMarker = undefined;
            }
            var radius = data.addr.﻿accuracy;
            if (radius !== null) {
                _this.addGLCircle(center, radius);
            }

            // 如果是系统定位，则不进行挪图
            // 如果是首页index/index模块并且是落地页，挪图。 by likun

            if(
                data.isInitGeo === false || 
                pageState.showmygeo == 1 || 
                (module == 'index' && action == 'index' && isLanding)
            ){
                // 根据定位点设置地图位置
                _this._map.centerAndZoom(center, locator.getLevel());
            }

            //ipad首页就有图区，所以首页定位成功后要挪图要加定位点
            if(util.isIPad()) {
                if(
                    data.isExactPoi && 
                    data.type != null &&
                    module == "index" && 
                    action == "index"
                ) {
                    _this.addGLCenter(center);
                } else {
                    _this.iwController.get().hide();
                }
                if(module == "index" && action == "index") {
                    _this._map.centerAndZoom(center, locator.getLevel());
                }
            }
            
        }, this);

        // 监听底图load事件延迟添加控件
        map.addEventListener("ontilesloaded", function () {
            _this._addLazyControl();
            map.removeEventListener("ontilesloaded", arguments.callee);
        });
        map.addEventListener('onvectorloaded', function () {
            _this._addLazyControl();
            map.removeEventListener("onvectorloaded", arguments.callee);
        });

        // 3秒未出图则强制加载控件
        _this.addControlTimer = window.setTimeout(function () {
            _this._addLazyControl();
        }, 3000);

        // 监听页面切换完成 目前只能通过pagename判断是否需要隐藏地图
        listener.on('common.page', 'pageloaded', function () {
            if(!/map/.test(window._APP_HASH.page)) {
                _this.hide();
            }
        });
    },
    /**
     * 绑定地图点击事件
     * 事件派发顺序: 
     * iw.touchstart -> map.click -> iw.click -> hotstop.click -> vector.click
     */
    _bindMapClick: function () {
        var _this = this,
            map = this._map;

        listener.on('infowindow.' + mapConst.IW_VCT, 'click', function (name, evt) {
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

        // 矢量底图可点
        map.addEventListener("onvectorclick", function(e) {
            if (e.form == "madian") {
                //麻点和底图派发的是同一事件 此处阻止继续进行事件调度 by zhijia
                return;
            };
            var iwOverlay = _this.iwController.get();

            // 这里有两个地方会跳过，shengxuanwei@baidu.com
            // 1. 麻点可点的情况下，不出底图可点
            // 2. 弹框下面的底图可点
            if (iwOverlay && iwOverlay.skipClickHandler) return;
            if (e.from == "base") {
                var iconInfo = e.iconInfo;
                if (iconInfo.uid && iconInfo.name && iconInfo.point) {
                    // 矢量地图可点统计
                    stat.addStat(COM_STAT_CODE.MAP_VECTOR_MARKER_CLICK);

                    var pt = map.pixelToPoint(iconInfo.point);
                    iwOverlay = _this.iwController.get(mapConst.IW_VCT);
                    iwOverlay.setData(mapConst.IW_VCT, {
                        json: [{
                            uid: iconInfo.uid,
                            name: iconInfo.name,
                            geo: "1|" + pt.lng + ',' + pt.lat
                        }]
                    }).switchTo(0);
                }
            };
        });
        map.addEventListener("click", function (e) {
            var iwOverlay = _this.iwController.get();
            if (!iwOverlay) return;
            // 最新注释如下，shengxuanwei@baidu.com，2013-11-07
            // iwOverlay.handled表示此事件交由iwOverlay内部处理，保证每次map.click都代理判断，重置skipClickHandler，此参数由iw.touchstart发起，由map.click结束；
            // iwOverlay.skipEvent表示除了iw.click事件之后的地图要素在各自click事件内部不处理；
            if (iwOverlay.handled) {
                iwOverlay.handled = false;
                iwOverlay.skipClickHandler = true;
            } else {
                iwOverlay.skipClickHandler = false;
                iwOverlay.hide();
            }

        });
        map.addEventListener('touchstart', function (e) {
            // 这里去除了iPad判断
            _this.menuControl && _this.menuControl.hideMenuDrop();
            _this.geoControl && _this.geoControl.hideInfoBar();
        });
    },

    /**
     * 添加地图控件
     */
    _addSyncControl: function () {
        var BMap = this._BMap,
            map = this._map;
        // 根据当前位置信息添加定位点,这两个点重合且非用户输入的位置才添加蓝点
        if (this.isMyCenter()) {
            var nowCenter = locator.getCenterPoi(),
                centerPoint = new BMap.Point(nowCenter.x, nowCenter.y),
                radius = locator.getAccuracy();
            this.addGLOverlay(centerPoint, radius);
        }

        // 路线规划上一步、下一步控件 需要同步添加
        this.lineStepControl = new this.LineStepControl();
        map.addControl(this.lineStepControl);
        this.lineStepControl.hide();

        // 添加信息窗口管理控件 需要同步添加
        this.iwController = iwController.init(map);
        map.addOverlay(this.iwController.get());
    },
    /**
     * 添加延迟地图控件
     */
    _addLazyControl: function () {
        if(this._isAddControl) {
            return;
        }
        this._isAddControl = true;
        var map = this._map;
        // 添加交通流量控件
        map.addControl(this.trafficControl);
        // 添加缩放控件
        map.addControl(this.zoomControl);
        // 添加菜单控件
        !util.isIPad() && map.addControl(this.menuControl);
        // 添加定位控件
        map.addControl(this.geoControl);
        // 添加比例尺控件
        map.addControl(this.scaleControl);
        listener.trigger('common.map', 'addlazycontrol');
    },
    /**
     * 初始化地图控件
     */
    _initControl: function () {
        var _this = this,
            map = this._map,
            BMap = this._BMap;

        // 初始化路况控件
        this.trafficControl = new this.TrafficControl();
        this.trafficControl.addEventListener('click', function (e) {
            // 交通路况marker点击量
            stat.addStat(COM_STAT_CODE.MAP_TRAFFIC_MARKER_CLICK);

            var iwOverlay = _this.iwController.get(mapConst.IW_TFC);
            iwOverlay.setData(mapConst.IW_TFC, {
                json: [e.data]
            }).switchTo(0);

            // todo 隐藏单点和泛需求蓝色气泡
            _this._singleMarker && _this._singleMarker.hide();
            _this.grMarker && _this.grMarker.hide();
        });
        
        this.trafficControl.addEventListener('removelayer', function (e) {
            _this.iwController.get(mapConst.IW_TFC).hide();
        });

        // 初始化缩放控件
        this.zoomControl = new this.ZoomControl();

        // 初始化菜单控件
        if(!util.isIPad()){
            this.menuControl = new this.MenuControl();
        }
        
        // 初始化定位控件
        this.geoControl = new this.GeoControl();

        // 初始化比例尺控件
        var scaleAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
        var scaleOffset = new BMap.Size(52, 22);
        if (util.isIPad()) {
            scaleAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
            scaleOffset = new BMap.Size(16, 16);
        }
        this.scaleControl = new BMap.ScaleControl({
            anchor: scaleAnchor,
            offset: scaleOffset
        });

        // 添加同步控件
        this._addSyncControl();
    },
    /**
     * 获取异步组件
     * @param {function} cbk 回调函数
     */
    _getAsyncWidget : function (cbk) {
        require.async([
            'common:widget/api/api.js',
            'common:widget/api/ext/circleoverlay.js',
            'common:widget/api/ext/custommarker.js',
            'common:widget/api/ext/geocontrol.js',
            'common:widget/api/ext/linestepcontrol.js',
            'common:widget/api/ext/menucontrol.js',
            'common:widget/api/ext/zoomcontrol.js',
            'common:widget/api/ext/trafficcontrol.js',
            'common:widget/api/ext/userheading.js',
            'common:widget/api/ext/poiinfowindow.js',
            'common:widget/api/ext/trsinfowindow.js',
            'common:widget/api/ext/tfcinfowindow.js'
        ], cbk);
    },
    /**
     * 判断当前位置和定位点是否重合
     */
    isMyCenter : function () {
        var nowCenter = locator.getCenterPoi(),
            locCenter = locator.getMyCenterPoi();
        if (
            locator.hasExactPoi() && !locator.isUserInput() &&
            locCenter &&
            locCenter.x == nowCenter.x && 
            locCenter.y == nowCenter.y
        ){
            return true;
        } else {
            return false;
        }
    },
    /**
     * 自定义覆盖物Marker类
     * @return CustomMarker
     */
    getCustomMarker: function () {
        return this.CustomMarker;
    },
    /**
     * 获取地图API类
     * @return BMap
     */
    getBMap: function(){
        return this._BMap;
    },
    /**
     * 获取地图实例
     * @return Map
     */
    getMap: function(){
        return this._map || {};
    },
    /**
     * 获取InfoWindow实例
     * @param {Number} type mapConst.IW_*** 可选，不传则获取当前
     * @return {InfoWindow} 信息窗口实例
     */
    getInfoWindow: function(type){
        return this.iwController.get(type);
    },
    /**
     * 获取路线规划控件
     * @return {LineStepControl}
     */
    getLineStepControl: function(){
        return this.lineStepControl;
    },
    /**
     * 打开定位点的气泡
     */
    openGeoIw: function () {
        var pt = locator.getMyCenterPoi();
        var iwOverlay = this.iwController.get(mapConst.IW_CNT);
        iwOverlay.setData(mapConst.IW_CNT, {
            json: [{
                name: mapConst.MY_GEO,
                html: "<b>{0}</b><p>{1}</p>".format(mapConst.MY_GEO, locator.getAddress()),
                geo: "1|" + pt.x + ',' + pt.y
            }]
        }).switchTo(0);
    },
    /**
     * 定位点气泡点击事件
     */
    _bindGeoIWEvent: function () {
        listener.on('infowindow.' + mapConst.IW_CNT, 'click', function (name, evt) {
            var id = evt.id,
                data = evt.data,
                instance = evt.instance;
            switch(id) {
                case 'iw-l':
                    instance.nbSearch(data.name, data.geo);
                    break;
                case 'iw-c':
                    url.update({
                        module: 'index',
                        action: 'mylocation'
                    }, {
                        trigger: true,
                        queryReplace: true,
                        pageStateReplace: true
                    });
                    break;
                case 'iw-r':
                    instance.lineSearch(data.name, data.geo);
                    break;
                default:
                    break;
            }
        });
    },
    /**
     * 修订定位点的位置
     */
    _fixCenterPos: function () {
        var _this = this;
        setTimeout(function () {
            _this.geolocationMarker && _this.geolocationMarker.draw();
        }, 100);
    },
    /**
     * 添加定位结果的标注
     * @param {Point} 坐标
     * @return {Marker} 标注示例
     */
    addGLCenter: function(point) {
        var _this = this,
            map = this._map,
            BMap = this._BMap;

        // 定位结果标注只允许添加一个
        if (!this.geolocationMarker) {
            var icon = new BMap.Icon(this.DEST_MKR_PATH, new BMap.Size(14, 14), {
                anchor: new BMap.Size(7, 7),
                imageOffset: new BMap.Size(80, 0)
            });
            var mkr = new this.CustomMarker(icon, point, {
                className: 'dest_mkr',
                click: function () {
                    // 定位marker点击量
                    stat.addStat(COM_STAT_CODE.MAP_GEOLOCATION_MARKER_CLICK);
                    _this.openGeoIw();
                }
            });
            mkr.enableMassClear = false; // 保证不被clearOverlays清除
            map.addOverlay(mkr);
            this.geolocationMarker = mkr;
            this.addUserHeading(mkr);
            this._bindGeoIWEvent();
            this._fixCenterPos();
        } else {
            this.geolocationMarker.setPoint(point);
        }

        listener.trigger('common.map', 'addcenter');

        return this.geolocationMarker;
    },

    /**
     * 添加定位点支持显示用户方位
     * @param {CustomMarker} mkr 定位点marker
     */
    addUserHeading: function (mkr) {
        if(!mkr) {
            return;
        }
        // 用户输入的位置, 则不显示指南针
        if (this.UserHeading.isSupport() && !locator.isUserInput()) {
            mkr.setIcon(new BMap.Icon(this.NAVI_MKR_PATH, new BMap.Size(38, 40), {
                anchor: new BMap.Size(19, 20)
            }));
            mkr.setClassName('navi_mkr');
            this.UserHeading.start(mkr.getContainer());
        }
    },
    /**
     * 添加定位结果的误差范围圆圈 只会添加一次 内部保证！
     * @param {Point} 圆圈的中心点
     * @param {number} 误差半径，单位米
     * @return {Circle} 圆圈实例
     */
    addGLCircle: function(point, accuracy) {
        // 定位误差半径只允许有一个
        if (!this.geolocationCircle) {
            var circle = new this.CircleOverlay(point, accuracy);
            this._map.addOverlay(circle);
            this.geolocationCircle = circle;
        } else {
            this.geolocationCircle.setInfo(point, accuracy);
        }
        return this.geolocationCircle;
    },

    /**
     * 添加定位相关的覆盖物
     * @param {Point} 圆圈的中心点
     * @param {number} 误差半径，单位米
     */
    addGLOverlay: function (point, radius) {
        var circle,
            center = this.addGLCenter(point);
        if (radius !== null) {
            this.addGLCircle(point, radius);
        }
        return {
            center : center,
            circle : circle
        }
    },

    /**
     * 移除当前地图上所有由于与检索结果相关的覆盖物
     * 即不会移除定位标注和定位误差圆圈
     */
    clearOverlays: function() {
        // 清除麻点栅格
        if (this.grControl) {
            this.grControl.clearCache();
        }
        // 隐藏infoWindow
        var iwOverlay = this.iwController.get();
        if (iwOverlay) {
            iwOverlay.hide();
        }
        // 隐藏路线上下一步控件
        if(this.lineStepControl){
            this.lineStepControl.hide();
        }
        this._map.clearOverlays();
    },
    /**
     * 移除掉某个数组中的覆盖物
     * @param {Array<Overlay>}
     */
    removeOverlayInArray: function(overlayArr){
        for (var i = 0; i < overlayArr.length; i ++) {
            this._map.removeOverlay(overlayArr[i]);
        }
        overlayArr = [];
    },
    /**
     * 为搜索结果、公交、驾车导航结果在地图上添加路线
     * @param {string} 地理坐标
     * @param {type}   类型常量
     */
    addRoute: function(points, type) {

        var config = mapConst.ROUTE_DICT;

        if (typeof type == "undefined") {
            type = 0;
        }
        if (!config[type]) {
            return;
        }
        var conf = config[type];
        var plen = points.length;
        var opts = {
            strokeWeight: conf.stroke,
            strokeColor: conf.color,
            strokeOpacity: conf.opacity,
            strokeStyle: conf.strokeStyle
        }
        var pline = new this._BMap.Polyline(points, opts);
        this._map.addOverlay(pline);
        pline._routeType = type;

        //装饰线
        if (type == mapConst.ROUTE_TYPE_BUS) {
            var pline2 = new this._BMap.Polyline(points, {
                strokeWeight: conf.stroke - 2,
                strokeColor: "#fff",
                strokeOpacity: 0.3
            });
            pline._p = pline2;
            this._map.addOverlay(pline2);
        }
        return pline;
    },
    /**
     * 添加驾车路线
     * @param {Object} obj NavTrans
     */
    addDriveRoute: function(points) {
        var route = this.addRoute(points, mapConst.ROUTE_TYPE_DRIVE);
        this.driveRoutes.push(route);
        return route;
    },
    /**
     * 移除驾车路线
     */
    removeDriveRoute: function(){
        this.removeOverlayInArray(this.driveRoutes);
    },
    /**
     * 移除当前线路
     * @param {PolyLine} p 
     */
    removeRoute: function(p) {
        if (p && p._p instanceof this._BMap.Polyline) {
            this._map.removeOverlay(p._p);
            p._p = null;
        }
        this._map.removeOverlay(p);
        p = null;
    },
    /**
     * 选择当前线路
     * @param {PolyLine} p 
     */
    selectRoute: function(p) {
        if (!(p instanceof this._BMap.Polyline)) {
            return;
        }
        var colors = ["#ff0103", "#ff0103", "#ff0103", "#ff0103", "#ff0103", "#ff0103", "#ff0103"];
        if (colors[p._routeType]) {
            p.setStrokeColor(colors[p._routeType]);
            p.draw(); // api的bug需要重绘一下，api修复后可去掉
        }
    },
    /**
     * 取消选择当前线路
     * @param {PolyLine} p 
     */
    unselectRoute: function(p) {
        if (!(p instanceof this._BMap.Polyline)) {
            return;
        }
        var colors = ["#3a6bdb", "#3a6bdb", "#30a208", "#3a6bdb","#3a6bdb","#30a208","#575757"];
        if (colors[p._routeType]) {
            p.setStrokeColor(colors[p._routeType]);
            p.draw();// api的bug需要重绘一下，api修复后可去掉
        }
    },
    /**
     * 添加驾车途径关键点标注
     */
    addKeyPoiMarker: function(point, text, type){
        var pt = util.getPoiPoint(point);
        if (!pt){
            return;
        }

        var offsetY = type ? 0 : 22;
        var ico = new this._BMap.Icon(this.DRV_KEY_POI_PATH, new this._BMap.Size(24, 22),{
            anchor: new this._BMap.Size(12, 22),
            imageOffset: new this._BMap.Size(0, offsetY)
        });
        var mkr = new this.CustomMarker(ico, pt);
        var label = document.createElement('div');
        label.className = 'nplb';
        label.style.width = text.length + 'em';
        label.innerHTML = text;
        this._map.addOverlay(mkr);
        mkr._div.appendChild(label);
        return mkr;
    },
    /**
     * 为导航添加方向标注
     * @param Point 坐标点
     * @param Number 方向参数 0表示正北
     */
    addDirectionMarker: function(point, dir) {
        var pt = util.getPoiPoint(point);
        if (!pt) {
            return;
        }
        if (dir < 0 || dir > 12) {
            dir = 0;
        }
        var offsetX = dir * 18;
        var icon = new this._BMap.Icon(this.DRV_DIRECTION_PATH, this.DEST_DRIVER_DIR_SIZE, {
            anchor: new this._BMap.Size(9, 9),
            imageOffset: new this._BMap.Size(offsetX, 0)
        });
        var mkr = new this.CustomMarker(icon, pt, {
            className: "drv_dest"
        });
        this._map.addOverlay(mkr);
        return mkr;
    },
    /**
     * 添加起始和终点标注 公交\驾车\步行
     * @param {String} point 地理坐标点
     * @param {Number} index 标注索引
     */
    addDestPoi: function(point, index) {
        point = util.getPoiPoint(point);
        if (point) {
            var icon = new this._BMap.Icon(this.DEST_MKR_PATH, this.DEST_MARKER_SIZE, {
                anchor: this.DEST_MARKER_ANCHOR,
                imageOffset: new this._BMap.Size(29 * index, 0)
            });
            var mkr = new this.CustomMarker(icon, point, {
                className: "dest_mkr"
            });
            this._map.addOverlay(mkr);
            mkr.setZIndex(400);
            this.destPois.push(mkr);
            return mkr;
        }
    },
    /**
     * 移除起始和终点标注 跨模块
     */
    removeDestPoi: function(){
        this.removeOverlayInArray(this.destPois);
    }
};