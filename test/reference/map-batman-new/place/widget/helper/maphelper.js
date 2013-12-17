/**
 * @fileOverview 列表页地图页
 * @author shegnxuanwei@baidu.com
 * @data 2013-10-29
 */

var mapConst = require('common:static/js/mapconst.js'),
    url = require('common:widget/url/url.js'),
    util = require('common:static/js/util.js'),
    locator = require('common:widget/geolocation/location.js'),
    searchData = require('common:static/js/searchdata.js'),
    GRControl = (require('place:widget/genericre/genericre.js')).init(),
    stat = require('common:widget/stat/stat.js');

module.exports = {

    /**
     * 当前选中的标注点的索引
     */
    _selectedIndex: -999,

    // 多义线自定义样式，根据索引值确定
    polylineStyles: [{
        stroke: 6,
        color: "#3a6bdb",
        opacity: 0.65
    }, {
        stroke: 6,
        color: "#3a6bdb",
        opacity: 0.75
    }, {
        stroke: 4,
        color: "#30a208",
        opacity: 0.65,
        // strokeStyle: "dashed"
    }, {
        stroke: 5,
        color: "#3a6bdb",
        opacity: 0.65
    }, {
        stroke: 6,
        color: "#3a6bdb",
        opacity: 0.5
    }, {
        stroke: 4,
        color: "#30a208",
        opacity: 0.5,
        strokeStyle: "dashed"
    }, {
        stroke: 4,
        color: "#575757",
        opacity: 0.65,
        strokeStyle: "dashed"
    }],

    // POI气泡
    poiMarkers: [],

    // 公交、地铁线路，目前只显示一条
    transitLines: [],

    // 道路的polyline对象集合
    roadPolylines: [],

    // 公交线路的polyline对象
    transitPolylines: [],

    // 公交站点点坐标
    stationPoints: [],

    // 公交站点标注
    stationMarkers: [],

    /**
     * 初始化方法
     * @param  {Object} BMap BMap单例，由外部异步请求赋值
     * @param  {Object} data 后端sAction返回数据
     */
    init: function (mapView, BMap, data, searchDataResult) {
        this.mapView = mapView || require('common:widget/map/map.js'); // map二次封装实例
        this.BMap = BMap || require('common:widget/map/map.js'); // BMap API
        this.map = this.mapView.getMap(); // map地图实例
        // 保存详情页进入时检索的searchDataResult，列表进详情采用列表数据searchDataResult
        this.data = searchDataResult && searchDataResult.content ? searchDataResult : data;
        
        // 重置选择点序号，保证重复进入时能重新选择新序号
        this._selectedIndex = -999;

        var curUrl = url.get(),
            query = curUrl.query,
            pageState = curUrl.pageState,
            index = pageState.i || 0;

        delete pageState['vt'];
        delete pageState['i'];

        var isSingle = false; // isSingle表示单点，即通过uid展现的poi或者任意分享点
        var newId = $.param(query) + '|' + $.param(pageState); // uid根据query和pagestate确定唯一性
        var curId = this.mapView.displayId;

        // 现在去掉此策略
        // if (newId != curId) {
            // 移除底图所有Overlays
            // 这里设计接口放在BMap里统一协调处理
            this.mapView.clearOverlays();

            // 添加Poi到Overlays
            this.addPoiOverlays(this.data, curUrl);

            // 添加泛需求麻点
            this.mapView.displayId = newId;
        // }

        // 选择对应的poi点
        // index字段格式例如'uid,xxxx'
        if (typeof index == 'string' && index.split(',')[0] == 'uid') {
            this.selectHotspotMarker(index.split(',')[1]);
        } else {
            this.selectPoiMarker(index);
        }
    },

    /**
     * 添加地图覆盖物(Overlays)，并设置地图视野(Viewport)
     * @param {Object} sAction返回数据
     * @param {Object} url对象
     */
    addPoiOverlays: function (data, curUrl) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var query = curUrl.query,
            pageState = curUrl.pageState;
        var isShowAll = data.listInfo ?　data.listInfo.isShowAll : undefined;
        var mapData = this.processMapData(data, curUrl.pageState, isShowAll);
        var cityCode = mapData.currentCity ? mapData.currentCity.code : 1;
        var nbSearchResultType = [36, 38, 39]; // 表示周边搜索的type，用于判断是否添加中心点标注

        if (!mapData.isSharePoint && mapData.points.length > 0) {
            // 添加标注覆盖物和信息窗口
            this.addPoiMarkers(mapData.points);

            mapView.iwController.get(mapConst.IW_POI).setData(mapConst.IW_POI, {
                json: mapData.content,
                cityCode: cityCode
            }).switchTo(0);

            listener.on('infowindow.' + mapConst.IW_POI, 'click', function (name, evt) {
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

            // 检查是否需要添加周边检索的中心点标注
            if (nbSearchResultType.indexOf(mapData.resultType) > -1 &&
                query.center_rank == 1 &&
                query.nb_x && query.nb_y) {
                this.addCenterPoiMarker(new BMap.Point(query.nb_x, query.nb_y));
            }
        } else { // 如果没有poiMarkers，包括共享点和单纯公交(717)或者道路(玲珑路)
            me.poiMarkers = [];
            me.mapView.poiMarkers = [];
        }

        // todo
        // 任意点分享
        if (mapData.isSharePoint && mapData.points.length > 0) {
            this.addSingleMarker(mapData.points[0], mapData.content[0]);

            mapView.iwController.get(mapConst.IW_SHR).setData(mapConst.IW_SHR, {
                json: mapData.content
            }).switchTo(0);

            listener.on('infowindow.' + mapConst.IW_SHR, 'click', function (event, data) {
            });
        }

        // isSingle表示单点，即通过uid展现的poi或者任意分享点
        // 泛需求底图处理
        if (!mapData.isSingle) {
            this.addGRHotspotsLayer(this.data); // 通过详情result和列表data获取
        }

        this.transitLines = mapData.transitLines; // 处理线路和气泡均显示时，Marker点击的序号需要顺延

        // 添加线路
        if (this.transitLines.length > 0) {
            // 列表通常是2条线路，但展示地图时仅显示第一条
            this.addTransitPolyline(this.transitLines[0], function (data) {
                // 视野由所有的poi点以及公交线路上所有站点来决定
                mapView.setViewport(data.stationPoints.concat(mapData.points));
            });
        } else {
            // 根据坐标设置地图视野
            mapView.setViewport(mapData.points);
        }

        // 增加底图可点气泡消失策略
        map.addEventListener("onvectorclick", function (e) {
            var iconInfo = e.iconInfo;
            if (iconInfo.uid && iconInfo.name && iconInfo.point) {
                me.switchSelectedMarker(-999);
            }
        });
    },

    /**
     * 为地图展示准备poi数据，这里需要考虑强展现情况
     * @param {Object} 原始数据，应至少包含content字段
     * @param {Object} json化的pageState部分
     * @param {boolean} 是否展现所有数据，该内容由后端数据接口返回
     */
    processMapData: function (data, pageState, isShowAll) {
        if (!data) return;

        var result = {
            points: [],
            content: [],
            transitLines: [],
            isSingle: false,
            resultType: data.result.type,
            currentCity: data.current_city
        };

        // 是否全部显示还要考虑pageState，如果showall为1表明用户在界面上点击了显示全部
        var showAllOnMap;
        if (typeof isShowAll != 'undefined') {
            showAllOnMap = isShowAll || !! (pageState && pageState.showall == 1);
        } else {
            // 在详情页，没有showStatus，只能根据pageState来判断
            showAllOnMap = !! (pageState && pageState.showall == 1);
        }
        // 如果是泛需求，则认为一定没有强展现，即都展现
        if (result.resultType != 11) {
            showAllOnMap = true;
        }
        var poiResults = data.content;

        // 解析坐标
        if (poiResults instanceof Array) {
            // 通常为一个列表结果
            for (var i = 0; i < poiResults.length; i++) {
                var curPoi = poiResults[i];
                if (!showAllOnMap && curPoi.acc_flag != 1) {
                    // 强展现状态且该点属于非强展现点
                    continue;
                }
            
                if (curPoi.poiType == mapConst.POI_TYPE_BUSLINE ||
                    curPoi.poiType == mapConst.POI_TYPE_SUBLINE) {
                    // 只在map上显示一条
                    result.transitLines.push(curPoi);
                    // 线路类型不记入poi数组中
                    continue;
                }
                var geo = util.parseGeo(curPoi.geo);
                result.points.push(util.getPointByStr(geo.points));
                result.content.push(curPoi);
            }
        } else {
            // 认为poiResults就是一个对象，一般通过uid获取单个poi数据
            if (!poiResults.geo && poiResults.point) { // PC用户标记任意点，分享过来，数据来自于userflag/share.php
                var formatPoint = poiResults.point.replace('|', ',');
                // 将任意点坐标转换成poi单点坐标结构，为了后续数据处理保持统一
                poiResults.geo = "1|" + formatPoint + ';' + formatPoint + '|' + formatPoint;
                poiResults.poiType = mapConst.POI_TYPE_NORMAL;
                poiResults.name = poiResults.title;
                result.isSharePoint = true; // 但是，这里缺phpui逻辑... todo
            }
            var geo = util.parseGeo(poiResults.geo);
            if (poiResults.poiType != mapConst.POI_TYPE_BUSLINE &&
                poiResults.poiType != mapConst.POI_TYPE_SUBLINE) {
                result.points.push(util.getPointByStr(geo.points));
                result.content.push(poiResults);
            } else {
                // 这个“点”是条公交或地铁线路
                result.transitLines.push(poiResults);
            }

            result.isSingle = true;
        }

        return result;
    },

    /**
     * 添加poi搜索的标注，通过添加坐标点数组来创建，通常数组长度为10
     * @param {Array<Point>} 坐标点数组
     * @return {Array<Marker>} 标注数组
     */
    addPoiMarkers: function (points) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var markers = [];
        for (var i = 0, len = points.length; i < len; i++) {
            // 闭包为了保持回调函数里的index索引值
            (function () {
                var index = i;
                var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(21, 30), {
                    anchor: new BMap.Size(11, 30),
                    imageOffset: new BMap.Size(0, 32 * index)
                });

                var marker = new mapView.CustomMarker(icon, points[index], {
                    className: "mkr_trans",
                    isAnimation: false,
                    click: function () {
                        // POImarker点击量
                        stat.addStat(COM_STAT_CODE.MAP_POI_MARKER_CLICK);

                        me.selectPoiMarker(index + me.transitLines.length);
                    }
                });

                map.addOverlay(marker);
                markers.push(marker);
            })();
        }
        me.poiMarkers = markers;
        me.mapView.poiMarkers = markers; // 设置到mapView，保证有POI气泡时不自动显示定位iw

        return markers;
    },

    /**
     * 增加泛需求麻点
     * 需要异步请求泛需求数据，然后再铺图
     */
    addGRHotspotsLayer: function (data) {
        var me = this,
            mapView = this.mapView;

        // resultType不是11就说明有泛需求内容, 11表示普通检索列表页
        if (!data || !data.result || !data.result.type || data.result.type == 11) {
            return;
        }

        me.grControl = mapView.grControl = GRControl;
        GRControl.setMapView(mapView);
        GRControl.setGRData(data);
        // 增加泛需求麻点click回调方法
        GRControl.onGRHotspotClick = function (evt) {
            // 泛需求麻点marker点击量
            stat.addStat(COM_STAT_CODE.MAP_GR_MARKER_CLICK);

            me.switchSelectedMarker(-999);
        };
    },

    /**
     * 为周边检索添加中心的蓝色箭头水滴标识
     * @param {Point} 坐标点
     * @return {Marker} 标注
     */
    addCenterPoiMarker: function (point) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(22, 30), {
            anchor: new BMap.Size(11, 30),
            imageOffset: new BMap.Size(29, 320)
        });

        var marker = new mapView.CustomMarker(icon, point, {
            className: "mkr_trans",
            click: function () {
                // POImarker点击量
                stat.addStat(COM_STAT_CODE.MAP_POI_MARKER_CLICK);

                me.setCenterMarker(-999);
            }
        });

        map.addOverlay(marker);
        marker.setZIndex(250);
        this.centerPoiMarker = marker;

        return marker;
    },

    /**
     * 移除周边检索中心点标注
     */
    removeNbCenterMarker: function () {
        if (this.centerPoiMarker) {
            this.map.removeOverlay(this.centerPoiMarker);
            this.centerPoiMarker = null;
        }
    },

    /**
     * PC任意点分享过来
     * 添加单点marker，蓝色无图案标注
     * @param {Point} 点的point对象
     * @param {Object} 贡献位置点的内容信息
     * @return {Marker} 标注
     */
    addSingleMarker: function (point, content) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(23, 32), {
            anchor: new BMap.Size(12, 32),
            imageOffset: new BMap.Size(29, 352)
        });

        var marker = new mapView.CustomMarker(icon, point, {
            className: "fix_gr_mk",
            click: function () {
                // POImarker点击量
                stat.addStat(COM_STAT_CODE.MAP_POI_MARKER_CLICK);

                mapView.iwController.get(mapConst.IW_POI).setData(mapConst.IW_POI, {
                    json: content
                }).switchTo(0);
            }
        });

        map.addOverlay(marker);

        return marker;
    },

    /**
     * 增加公交、地铁线路，例如112路
     * @param {Object} 格式化之后的数据
     * @param {Function} 添加完成之后的回调函数，因为需要异步获取数据
     */
    addTransitPolyline: function (line, cbk) {
        var me = this;

        var queryData = {
            qt: 'bsl',
            uid: line.uid,
            c: line.area
        };
        searchData.fetch(util.jsonToUrl(queryData), function (data) {

            // 移除上一次的线路覆盖物
            for (var i = 0; i < me.stationMarkers.length; i++) {
                me.removePoiOverlay(me.stationMarkers[i]);
            }

            // 移除上一次的线路画线
            for (var j = 0; j < me.transitPolylines.length; j++) {
                me.removeTransitPolyline(me.transitPolylines[j]);
            }

            // 只绘制第一条线路
            firstLine = data.content[0];

            // 绘制线路
            var line = util.parseGeo(firstLine.geo);
            if (line && line.type == 2) {
                var transitPloyline = me.addPolyline(line.points, mapConst.ROUTE_TYPE_BUS);
                me.transitPolylines.push(transitPloyline);
            }

            // 添加站点，这里改变原来的逻辑
            // 如果没有站点也调用回调函数
            if (firstLine && 　firstLine.stations) {
                me.stationPoints = [];
                me.stationMarkers = [];

                var stations = firstLine.stations;
                for (var k = 0, l = stations.length; k < l; k++) {
                    var geo = util.parseGeo(stations[k].geo);
                    if (geo.type == 1) {
                        // 公交、地铁站点圈圈和气泡
                        var point = util.getPoiPoint(geo.points);
                        me.stationPoints.push(point);
                        var marker = me.addStationMarker(point);
                        me.stationMarkers.push(marker);
                    }
                }
            }

            cbk && cbk({
                'firstLine': firstLine,
                'stationPoints': me.stationPoints
            });
        });
    },

    /**
     * 移除Poi覆盖物
     */
    removePoiOverlay: function (overlay) {
        var BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        map.removeOverlay(overlay);
        overlay = null;
    },

    /**
     * 移除当前线路
     * @param {PolyLine} polyline
     */
    removeTransitPolyline: function (polyline) {
        var BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        // 将元素从transitPolylines数组中移除
        var index = $.inArray(polyline, this.transitPolylines);
        if (index > -1) {
            this.transitPolylines.splice(index, 1);
        }

        // 移除装饰线
        if (polyline && polyline._decorativePolyline &&
            polyline._decorativePolyline instanceof BMap.Polyline) {
            map.removeOverlay(polyline._decorativePolyline);
            polyline._decorativePolyline = null;
        }

        // 移除线路主体线
        map.removeOverlay(polyline);
        polyline = null;
    },

    /**
     * 为搜索结果、公交、驾车导航结果在地图上添加路线
     * @param {string} 地理坐标
     * @param {int}   类型常量
     */
    addPolyline: function (points, type) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        if (typeof type == "undefined") {
            type = 0;
        }

        var style = this.polylineStyles[type];
        if (!style) {
            return;
        }

        var opts = {
            strokeWeight: style.stroke,
            strokeColor: style.color,
            strokeOpacity: style.opacity,
            strokeStyle: style.strokeStyle,
        };
        var polyline = new BMap.Polyline(points, opts);
        polyline._routeType = type; // 保存多义线类型
        map.addOverlay(polyline);

        // 增加装饰线
        if (type == mapConst.ROUTE_TYPE_BUS) {
            var decorativePolyline = new BMap.Polyline(points, {
                strokeWeight: style.stroke - 2,
                strokeColor: "#fff",
                strokeOpacity: 0.3
            });
            polyline._decorativePolyline = decorativePolyline;
            map.addOverlay(decorativePolyline);
        }

        return polyline;
    },

    /**
     * 添加公交站点气泡
     * @param {Point} 地理坐标
     */
    addStationMarker: function (point) {
        var BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var icon = new BMap.Icon(mapConst.DEST_MKR_PATH, new BMap.Size(11, 11), {
            anchor: new BMap.Size(5, 5),
            imageOffset: new BMap.Size(80, 15)
        });
        var marker = new mapView.CustomMarker(icon, point, {
            className: "dest_mkr"
        });
        map.addOverlay(marker);
        return marker;
    },

    /**
     * 高亮选中某麻点气泡
     * @param  {string} uid
     */
    selectHotspotMarker: function (uid) {
        var BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;
        // 其实这里就是请求qt=inf，然后弹出POI弹框
        // 有必要从genericrequest.js抽离
        GRControl.setMapView(mapView);
        GRControl.sendInfRequest(uid);
    },

    /**
     * 高亮选中某POI气泡
     * @param  {int} index 列表结果索引值（0-9）
     */
    selectPoiMarker: function (index) {
        index = parseInt(index, 10);
        if (isNaN(index)) {
            return;
        }

        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        index = index - this.transitLines.length;
        // 兼容inf接口后端只返回一条记录，而不像webapp一样返回数组，shengxuanwei
        index = Math.min(index, this.poiMarkers.length - 1);

        if (this._selectedIndex == index) {
            // 这里要重新显示信息窗口，仅处理普通点
            // 解决在地图上点击正处于选择状态的点
            if (index > -1) {
                // 选择的是普通点
                // iwControl.switchTo(0, index, this.transitLines.length);
            }
            return;
        }

        this.clearRoadPolylines();

        // 取消泛需求点的选择
        if (this.grControl && this.grControl.marker) {
            this.grControl.marker.hide();
        }

        if (index > -1) {
            var iwOverlay = mapView.iwController.get(mapConst.IW_POI);
            // 选择的是普通点
            iwOverlay.switchTo(index); // todo this.transitLines.length

            // 变换标注索引，用于poi检索的10个标注的切换
            this.switchSelectedMarker(index);

            // 检测POI是否为道路类型，如果是添加道路的多义线
            var poiData = iwOverlay.getPoiData();
            if (poiData && poiData.ty == mapConst.GEO_TYPE_LINE) {
                this.addRoadPolylines(poiData);
            }

            // 变换中心点
            this.setCenterMarker(index);
        } else {
            // 选择的是公交线路
            var newIndex = index + this.transitLines.length;
            if (this.transitLines[newIndex]) {
                this.addTransitPolyline(this.transitLines[newIndex], function (data) {
                    // 视野由所有的poi点以及公交线路上所有站点来决定
                    mapView.setViewport(data.stationPoints);

                    // infoWindow显示在第一个站点
                    var firstLine = data.firstLine,
                        firstStation = firstLine.stations[0],
                        point = util.geoToPoint(firstStation.geo);
                    // 这里调用trsInfoWindow，所以数据格式需要mock交通类数据格式
                    mapView.iwController.get(mapConst.IW_BSL).setData(mapConst.IW_BSL, {
                        json: [{
                            content: "<b>{0}</b>".format(firstLine.name),
                            uid: firstStation.uid
                        }],
                        points: [{
                            p: point.lng + "," + point.lat
                        }]
                    }).switchTo(0);

                    listener.on('infowindow.' + mapConst.IW_BSL, 'click', function (event, data) {
                        var instance = data.instance;

                        // 公交气泡进详情
                        stat.addStat(COM_STAT_CODE.MAP_IW_BSL_DETAIL);

                        url.update({
                            module: 'place',
                            action: 'detail',
                            query: {
                                foo: 'bar'
                            },
                            pageState: {
                                vt: 'list',
                                i: instance.index
                            }
                        }, {
                            trigger: true,
                            queryReplace: false,
                            pageStateReplace: true
                        });
                    });
                });
            }
        }

        this._selectedIndex = index;

        // todo, update hash
        // app.updateHash({
        //     pageState: {i: originIndex}
        // }, {replace: true});
    },

    /**
     * 更改中心点和水滴的切换效果
     * @param {number} 索引
     */
    setCenterMarker: function (index) {
        if (!this.centerPoiMarker) return;

        for (var i = 0, n = this.poiMarkers.length; i < n; i++) {
            var _p = this.poiMarkers[i]._point,
                _cp = this.centerPoiMarker._point,
                _pLat = _p.lat.toString().slice(0, -1),
                _pLng = _p.lng.toString().slice(0, -1),
                _cpLat = _cp.lat.toString().slice(0, -1),
                _cpLng = _cp.lng.toString().slice(0, -1);

            // 找到和中心点相等的点
            if (_pLat == _cpLat && _pLng == _cpLng) {
                if (index == undefined || (index > -1 && index != i)) {
                    this.centerPoiMarker.setZIndex(200);
                    this.poiMarkers[i].setZIndex(150);
                } else {
                    this.centerPoiMarker.setZIndex(150);
                    this.poiMarkers[i].setZIndex(200);
                    // todo
                    // iwControl.switchTo(0, i);
                    // iwControl.show(_p);
                }
                return;
            }
        }

        // 没有重复点时，点中心标识的处理
        if (index == -999) {
            // iwControl.hide();
        }
    },

    /**
     * 变换标注索引，用于poi检索的10个标注的切换
     * @param {number} 变换的标注索引
     */
    switchSelectedMarker: function (index) {
        if (!this.poiMarkers) return;

        // 1.还原成红色气泡
        if (this._selectedIndex >= 0) {
            var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(21, 30), {
                anchor: new BMap.Size(11, 30),
                imageOffset: new BMap.Size(0, 32 * this._selectedIndex)
            });

            if (this.poiMarkers[this._selectedIndex]) {
                this.poiMarkers[this._selectedIndex]._div.className = "";
                this.poiMarkers[this._selectedIndex].setIcon(icon);
                this.poiMarkers[this._selectedIndex].setZIndex(200);
            }
        }

        // 2.index在范围内则添加对应的蓝色气泡
        if (index < 0 || index >= this.poiMarkers.length) {
            this._selectedIndex = -999;
        } else {
            var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(26, 36), {
                anchor: new BMap.Size(13, 36),
                imageOffset: new BMap.Size(58, 40 * index)
            });

            this.poiMarkers[index]._div.className = "mkr_trans";
            this.poiMarkers[index].setIcon(icon);
            this.poiMarkers[index].setZIndex(300);
            this._selectedIndex = index;
        }

        for (var i = 0, n = this.poiMarkers.length; i < n; i++) {
            this.poiMarkers[i]._div.className = "mkr_trans";
        }
    },

    /**
     * 显示道路，例如检索八卦一路，玲珑路等，显示POI同时显示线路
     * @param {Object} 该道路对应的poi数据
     */
    addRoadPolylines: function (poiData) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var queryData = {
            qt: 'ext',
            uid: poiData.uid,
            c: poiData.area,
            l: 18 // 请求线路需要附带l参数
        };
        searchData.fetch(util.jsonToUrl(queryData), function (data) {
            if (data && data.content && data.content.geo) {
                var geo = util.parseGeo(data.content.geo);
                if (geo.type == 2) {
                    if (typeof geo.points == "string") {
                        me.roadPolylines.push(me.addPolyline(geo.points));
                    } else {
                        for (var i = 0, l = geo.points.length; i < l; i++) {
                            if (!geo.points[i]) {
                                continue;
                            }
                            me.roadPolylines.push(me.addPolyline(geo.points[i]));
                        }
                    }
                }
            }
        });
    },

    /**
     * 清除道路折线
     */
    clearRoadPolylines: function () {
        if (!this.roadPolylines) return;
        for (var i = 0, l = this.roadPolylines.length; i < l; i++) {
            this.removeTransitPolyline(this.roadPolylines[i]);
            this.roadPolylines[i] = null;
        }
        this.roadPolylines = [];
    }
};