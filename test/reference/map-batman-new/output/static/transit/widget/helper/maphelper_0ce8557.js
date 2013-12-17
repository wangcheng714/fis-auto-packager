define('transit:widget/helper/maphelper.js', function(require, exports, module){

"use strict";
/**
 * @fileOverview 首页底图页面
 * @author jican@baidu.com
 * @data 2013/10/28
 */

var util = require('common:static/js/util.js'),
    mapConst = require('common:static/js/mapconst.js'),
    searchData = require('common:static/js/searchdata.js'),
    mapView = require('common:widget/map/map.js'),
    url = require('common:widget/url/url.js'),
    stat = require('common:widget/stat/stat.js');

/**
 * 处理公交站名称 末尾添加"站"
 * @param {String} stopName 公交站名
 * @return {String} name xxx站
 */
function fixStopName(name) {
    var index = name.lastIndexOf('站'),
        len = name.length - 1;
    name = (index === len) ? name : (name + '站');
    return name;
}

/**
 * 处理公交线名称
 * @param {String} name
 * @author jican
 */
function fixLineName(name) {
    var index = name.indexOf('(');
    name = (index >= 0 ? name.substring(0, index) : name);
    return name += (!/\D+/.test(name)) ? '路' : '';
}

/**
 * 格式化路线距离字符串
 * @param {String} dis 距离
 * @author jican
 */
function fixDistance(dis) {
    var result = "";
    if (dis > 0 && dis <= 10) {
        result = 10 + "米";
    } else if (dis > 10) {
        result = dis < 1000 ? (dis / 10).toFixed(0) * 10 + "米" : (dis / 1000).toFixed(1) + "公里";
    }
    return result;
}

var map, BMap;

module.exports = {
    // 换乘站标注
    transPois: [],
    // 公交线路集合
    routeLines: [],
    // 起点到上车点线路集合
    sWalkLines: [],
    // 换乘站之间的线路
    tWalkLines: [],
    // 下车站到重点线路
    eWalkLines: [],
    // 线路的bounds
    routeBounds: [],
    // 方案索引
    _index: -1,
    // 当前选择的步骤
    _currentStep: -1,
    // infoWindow索引
    _infoWinIndex: 0,
    // walk线路方向指引
    directionMarkers: [],
    // 当前方案walk起点线路
    sWalkPoint: [],
    // 当前方案换乘walk线路
    tWalkPoint: [],
    // 当前方案walk终点线路
    eWalkPoint: [],
    sCurWalkType: [],
    tCurWalkType: [],
    eCurWalkType: [],
    // 公交路线规划的线路覆盖物
    transitRoutes: [],
    // 公交规划步行线路的覆盖物
    walkRoutes: [],
    // 公交路线步行方向覆盖物
    busDirectionMarkers: [],
    // 线路类型，公交、地铁、轮渡
    lineType: [
        [0, 2, 3, 4, 5, 6, 7, 9, 10, 11],
        [1, 12, 13, 14],
        [8]
    ],
    isEventBind: false,

    init: function(data) {
        var appHash = url.get(),
            module = appHash.module,
            action = appHash.action,
            query = util.jsonToQuery(appHash.query),
            pageState = appHash.pageState || {},
            index = (pageState.i || 0) * 1;

        BMap = this.BMap = mapView.getBMap(),
        map = this.map = mapView.getMap();

        this.initMapData(data);
        this.fill(index, data.content.source);
        this.renderMap(pageState, query);
    },

    initMapData: function(data) {

        this.start = data.result.start;
        this.end = data.result.end;

        this.sWalkBounds = [];
        this.tWalkBounds = [];
        this.eWalkBounds = [];
        this.routeBounds = [];
        this.sWalkPoints = [];
        this.tWalkPoints = [];
        this.eWalkPoints = [];
        this.sWalkType = [];
        this.tWalkType = [];
        this.eWalkType = [];
        this.routePoints = [];
        this.transPoints = [];
        this.busType = [];
        this.stopUids = [];
        this.stopPois = [];
        this.transWins = [];
        this.stepIndex = [];
        this.clickIndex = [];
        this.hasSubwayLine = false;
    },

    /**
     * 添加终点步行数据
     * @author jican
     * @date 2013/01/21
     */
    _addStartWalk: function(i, r, route, stops, lines, listItem) {
        var stratStop = stops[0];
        if (stratStop.walk && stratStop.walk.distance > 0) {
            var sWalk = stratStop.walk,
                sGetOff = stratStop.getOff,
                sGetOn = stratStop.getOn;

            listItem.detail.push({
                'type': 11, //11代表步行
                'dis': fixDistance(sWalk.distance),
                'stop': fixStopName(sGetOn.name)
            });
            this.stepIndex[i].push(0);
        }
    },

    /**
     * 添加终点步行数据
     * @author jican
     * @date 2013/01/21
     */
    _addEndWalk: function(i, r, route, stops, lines, listItem) {
        var endStop = stops[stops.length - 1];
        if (endStop && endStop.walk.distance > 0) {
            var eWalk = endStop.walk;
            listItem.detail.push({
                'type': 11, //11代表步行
                'dis': fixDistance(eWalk.distance),
                'stop': fixStopName(this.end.wd)
            });
            this.stepIndex[i].push(0);
        }
    },

    /**
     * 遍历途经站点数据
     * @author jican
     * @date 2013/01/21
     */
    _eachStops: function(i, r, route, listItem) {

        var stops = route.stops[0],
            lines = route.lines[0];

        //step3: 循环站点信息
        for (var k = 0, kLen = stops.length; k < kLen; k++) {

            var stop = stops[k],
                walk = stop.walk,
                on = stop.getOn,
                off = stop.getOff,
                offGeo = util.parse2Geo(off.geo),
                onGeo = util.parse2Geo(on.geo);

            var onName, offName, startUID, endUID, walkGeo;
            //起点
            if (k === 0) {
                onName = fixStopName(on.name),
                offName = fixStopName(stops[1].getOff.name),
                startUID = (stop.getOn && stop.getOn.uid !== "" && this.isStartStop === 1) ?
                    stop.getOn.uid : this.start.uid;

                if (this.clickIndex[i] === undefined) {
                    this.transPoints[i].push([offGeo.points, off.name, -1]);
                    this.transPoints[i].push([onGeo.points, onName, this.busType[i][k].t]);
                } else {
                    this.transPoints[i][2 * k] = [offGeo.points, off.name, -1];
                    this.transPoints[i][2 * k + 1] = [onGeo.points, onName, this.busType[i][k].t];
                }

                if (walk && walk.geo && walk.distance > 0) {
                    walkGeo = util.parse2Geo(walk.geo);
                    try {
                        walkGeo.points += (';' + this.transPoints[i][1][0]);
                    } catch (e) {
                        //
                    }
                    //添加起点步行到站的点 by jican
                    this.sWalkPoints[i].push(walkGeo.points);
                    this.sWalkBounds[i].push(walkGeo.bound);
                    //添加线路是否为精确线路参数 by likun
                    if (typeof walk.real !== 'undefined') {
                        this.sWalkType[i].push(walk.real);
                    } else {
                        // -99表示real不存在
                        this.sWalkType[i].push(-99);
                    }
                }

                //添加起点POI气泡内容
                this.transWins[i].push({
                    title: this.start.wd,
                    poi: offGeo.points,
                    suid: startUID
                });

                //添加起点上车站弹出气泡信息
                this.transWins[i].push({
                    title: onName + "上车",
                    info: "(" + fixLineName(lines[k].name) + ")",
                    poi: onGeo.points,
                    tip: lines[k].tip,
                    startTime: lines[k].startTime,
                    endTime: lines[k].endTime
                });
            }

            //换乘点
            if (k > 0 && k < stops.length - 1) {

                onName = fixStopName(on.name),
                offName = fixStopName(off.name);

                if (this.clickIndex[i] === undefined) {
                    this.transPoints[i].push([offGeo.points, offName, this.busType[i][k - 1].t]);
                    this.transPoints[i].push([onGeo.points, onName, this.busType[i][k].t]);
                } else {
                    this.transPoints[i][2 * k] = [offGeo.points, offName, this.busType[i][k - 1].t];
                    this.transPoints[i][2 * k + 1] = [onGeo.points, onName, this.busType[i][k].t];
                }

                if (walk && walk.geo && walk.distance >= 0) {
                    walkGeo = util.parse2Geo(walk.geo);
                    try {
                        walkGeo.points = this.transPoints[i][2 * k][0] + ';' +
                            walkGeo.points + ';' +
                            this.transPoints[i][2 * k + 1][0];
                    } catch (e) {
                        //
                    }
                    this.tWalkPoints[i].push(walkGeo.points);
                    this.tWalkBounds[i].push(walkGeo.bound);
                    //添加线路是否为精确线路参数 by likun
                    if (typeof walk.real !== 'undefined') {
                        this.tWalkType[i].push(walk.real);
                    } else {
                        // -99表示real不存在
                        this.tWalkType[i].push(-99);
                    }
                }

                //添加换乘点下车站弹出气泡信息
                var info = "到" + onName + "上车";
                if (this.busType[i][k - 1].t === 1 && this.busType[i][k].t === 1) {
                    info = "换乘" + this.busType[i][k].n;
                }

                this.transWins[i].push({
                    title: offName + "下车",
                    poi: offGeo.points
                })

                //添加换乘点上车站弹出气泡信息
                offName = fixStopName(stops[k + 1].getOff.name);

                this.transWins[i].push({
                    title: onName + "上车",
                    poi: onGeo.points,
                    info: "(" + fixLineName(lines[k].name) + ")",
                    tip: lines[k].tip,
                    startTime: lines[k].startTime,
                    endTime: lines[k].endTime
                });
            }

            //终点
            if (k === stops.length - 1) {

                offName = fixStopName(off.name),
                endUID = (stop.getOff && stop.getOff.uid != "" && this.isEndStop == 1) ?
                    stop.getOff.uid : this.end.uid;

                if (this.clickIndex[i] === undefined) {
                    this.transPoints[i].push([offGeo.points, offName, this.busType[i][k - 1].t]);
                    this.transPoints[i].push([onGeo.points, on.name, -1]);
                }

                if (walk && walk.geo && walk.distance > 0) {
                    walkGeo = util.parse2Geo(walk.geo);
                    try {
                        var tempTranPoint = this.transPoints[i];
                        walkGeo.points = tempTranPoint[tempTranPoint.length - 2][0] + ';' + walkGeo.points;
                    } catch (e) {
                        //
                    }
                    this.eWalkPoints[i].push(walkGeo.points);
                    this.eWalkBounds[i].push(walkGeo.bound);
                    //添加线路是否为精确线路参数 by likun
                    if (typeof walk.real !== 'undefined') {
                        this.eWalkType[i].push(walk.real);
                    } else {
                        // -99表示real不存在
                        this.eWalkType[i].push(-99);
                    }
                }

                //添加换乘点下车站弹出气泡信息
                this.transWins[i].push({
                    title: offName + "下车",
                    poi: offGeo.points
                });

                this.transWins[i].push({
                    title: this.end.wd,
                    poi: onGeo.points,
                    suid: endUID
                });
            }
        }
    },

    /**
     * 遍历途经线路数据
     * @author jican
     * @date 2013/01/21
     */
    _eachLines: function(i, r, route, stops, lines, listItem) {
        var linesLen = 0;

        //过滤线路数量
        lines.forEach(function(line) {
            if ($.isPlainObject(line)) {
                linesLen++;
            }
        });
        var nonLinesLen = lines.length - linesLen;

        //非线路元素为10个时， 表示已经选择首末班方案了
        //非末班车的搜索非线路元素为7个
        if (nonLinesLen === 10) {
            listItem.tip = lines[lines.length - 1];
            var arriveTime = lines[lines.length - 2];
            try {
                arriveTime = arriveTime.split('T')[1];
                arriveTime = arriveTime.split(':');

                listItem.arriveTime = arriveTime[0] + ':' + arriveTime[1];
            } catch (e) {
                listItem.arriveTime = '';
            }
        }

        //step2: 循环线路信息
        for (var j = 0; j < linesLen; j++) {
            if (typeof lines[j] === 'object') {
                var orLines = [],
                    orLinesPop = [],
                    line = lines[j],
                    geo = util.parse2Geo(line.geo),
                    title = fixLineName(line.name), //路线名称
                    type = line.type || 0, //路线类型
                    stop = stops[j], //当前线路对应的站点
                    walk = stop.walk, //当前线路对应的步行
                    getOn = stop.getOn,
                    getOff = stop.getOff, //当前线路对应的到达
                    nextStop = stops[j + 1],
                    nextWalk = nextStop.walk,
                    nextGetOff = nextStop.getOff,
                    nextGetOffName = fixStopName(nextGetOff.name),
                    nextGetOffExit = (nextWalk.sname || '').trim();
                nextGetOffExit = nextGetOffExit ? '(' + nextGetOffExit + ')' : '';

                this.busType[i].push({
                    t: type,
                    n: title
                });
                this.routePoints[i].push(geo.points);
                this.routeBounds[i].push(geo.bound);

                if (nonLinesLen === 10) {
                    //首末班车方案是否显示判断, 根据开始站的首班风险判断
                    if (j === 0) {
                        if (line.tip === 1) {
                            listItem.tip = -1;
                        }
                    }
                }

                //type=1 代表当前方案线路中含有地铁线
                if (type === 1) {
                    this.hasSubwayLine = true;
                }
                //添加二次请求站点uid
                if (this.clickIndex[i] === undefined) {
                    this.stopUids[i].push(line.st_uid);
                    this.stopUids[i].push(line.ed_uid);
                }

                //遍历一个方案中的所有lines 添加也可换乘信息字符串
                for (var f = 0, temp = [], fl = route.lines.length; f < fl; f++) {
                    var tempLine = route.lines[f][j],
                        tempName = fixLineName(tempLine.name),
                        tempUid = tempLine.uid;
                    //根据当前线路索引和线路UID判断是否有可换乘线路
                    if (f !== r && line.uid !== tempUid) {
                        if (temp.indexOf(tempUid) === -1) { //当有两个路线均有可换乘线路的时候去重
                            temp.push(tempUid);
                            orLines.push({
                                'i': i,
                                'r': f,
                                'l': j,
                                'n': tempName
                            });
                            orLinesPop.push(tempName);
                        }
                    }
                }

                if (j > 0 && j < 7) {
                    if (getOn.name !== getOff.name || walk && walk.distance >= 25) {
                        //添加中途步行描述
                        var viaWalk = {
                            'type': 11, // 11代表步行
                            'dis': fixDistance(walk.distance)
                        };
                        if (this.busType[i][j - 1].t === 1 && this.busType[i][j].t === 1) {
                            viaWalk['line'] = title;
                        } else {
                            viaWalk['stop'] = fixStopName(getOn.name);
                        }
                        listItem.detail.push(viaWalk);
                        this.stepIndex[i].push(0);
                    }
                }

                listItem.title.push(title);

                listItem.detail.push({
                    'type': type,
                    'line': title,
                    'other': orLines,
                    'num': line.station_num,
                    'stop': nextGetOffName,
                    'exit': nextGetOffExit,
                    'tip': line.tip,
                    'endTime': line.endTime,
                    'startTime': line.startTime
                });

                this.stepIndex[i].push(1);
            }
        }
    },

    fill: function(index, data) {

        var linesLen = 0,
            route = data,
            stops = route.stops[0],
            lines = route.lines[0],
            stopsLen = stops.length,
            stratStop = stops[0],
            endStop = stops[stopsLen - 1];

        //过滤线路数量
        lines.forEach(function(line) {
            if ($.isPlainObject(line)) {
                linesLen++;
            }
        });

        var listItem = {
            'time': '',
            'distance': '',
            'title': [],
            'detail': [],
            'tip': 0
        };

        // 下面这些数据用来添加地图
        this.sWalkBounds[index] = this.sWalkBounds[index] || [];
        this.tWalkBounds[index] = this.tWalkBounds[index] || [];
        this.eWalkBounds[index] = this.eWalkBounds[index] || [];
        this.routeBounds[index] = this.routeBounds[index] || [];
        this.sWalkPoints[index] = this.sWalkPoints[index] || [];
        this.tWalkPoints[index] = this.tWalkPoints[index] || [];
        this.eWalkPoints[index] = this.eWalkPoints[index] || [];
        this.sWalkType[index] = this.sWalkType[index] || [];
        this.tWalkType[index] = this.tWalkType[index] || [];
        this.eWalkType[index] = this.eWalkType[index] || [];
        this.routePoints[index] = this.routePoints[index] || [];
        this.transPoints[index] = this.transPoints[index] || [];
        this.busType[index] = this.busType[index] || [];
        this.stopUids[index] = this.stopUids[index] || [];
        this.stopPois[index] = this.stopPois[index] || [];
        this.transWins[index] = [];
        this.stepIndex[index] = [];

        // step1: 添加起点步行描述
        this._addStartWalk(index, 0, route, stops, lines, listItem);
        // step2: 遍历线路信息
        this._eachLines(index, 0, route, stops, lines, listItem);
        // step3：遍历站点信息
        this._eachStops(index, 0, route, listItem);
        // step4: 添加终点步行描述
        this._addEndWalk(index, 0, route, stops, lines, listItem);
    },

    /**
     * 外部使用的入口方法，渲染某条方案在地图上
     * @param {Object} pageState
     * @param {Object} query
     */
    renderMap: function(pageState, query) {
        // 处理地图
        pageState = pageState || {};
        // 方案
        var index = (pageState.i || 0) * 1;
        // 步骤
        var step = -1; // 默认step为-1
        if (typeof pageState.step !== 'undefined') {
            step = pageState.step * 1;
        }
        // 将query+pagestate(不包括vt参数)作为guid，防止重复刷新地图状态
        var pageStatePart = {};
        $.extend(pageStatePart, pageState);
        // 下面排除一些不应算作id的内容，以后可能还会添加
        delete pageStatePart['vt'];
        delete pageStatePart['step'];
        var newId = util.jsonToUrl(query) + '|' + util.jsonToUrl(pageStatePart);
        var curId = mapView.displayId;

        //if (newId != curId) {
        if (!this.isEventBind) {
            mapView.getMap().addEventListener("zoomend", $.proxy(this.addDirectionMarker, this));
            mapView.getMap().addEventListener("gestureend", $.proxy(this.addDirectionMarker, this));
            mapView.getMap().addEventListener("load", $.proxy(this.addDirectionMarker, this));
            mapView.getMap().addEventListener("dragend", $.proxy(this.addDirectionMarker, this));
            mapView.getMap().addEventListener("titlesend", $.proxy(this.addDirectionMarker, this));
            this.isEventBind = true;
        }

        mapView.clearOverlays();
        // 移除当前
        this.removeCurrentOverlay();
        // 添加路线站点
        this.addPoiRoute(index, 0, step);

        mapView.getLineStepControl().show();

        // 设置信息窗口数据
        this.setInfoWindow(index);
        mapView.displayId = newId;

        //}

        this.selectStep(index, step);
    },

    /**
     * 选择某条方案中具体的步骤
     * 需要在调用renderMap之后调用该方法
     * @param {number} 步骤索引
     */
    selectStep: function(index, step) {
        // 判断步骤对应的是步行还是公交线路
        // 并选择正确的infoWindow位置
        var _currentZoomLevel = mapView._map.zoomLevel;

        this._index = index;
        if (step === -1) {
            //if (this.redRoute) {
            // 这里必须进行判断，否则会出现这样的bug：
            // LBSWEBAPP-1734
            // 具体原因还不知道，否则会出现marker位置计算错误的现象
            // 这段逻辑暂时不用了
            // mapView.unselectRoute(this.redRoute);
            //}
            this._currentStep = 0;
            return;
        }
        if (step < 0 || step > this.stepIndex[index].length) {
            // 非法的step值
            return;
        }
        if (step === this.stepIndex[index].length) {
            // 选择了最后一个点，应该把之前的道路取消
            if (this.redRoute) {
                mapView.unselectRoute(this.redRoute);
            }
        }
        var stepType = this.stepIndex[index][step];
        if (stepType === 0) {
            // 该步骤为步行
            var walkType;
            if (step === 0) {
                walkType = 0;
            } else if (step === this.stepIndex[index].length - 1) {
                walkType = 2;
            } else {
                walkType = 1;
            }
            this.highWalk(index, this.getWalkIndex(this.stepIndex[index], step, walkType), walkType);
        }
        if (stepType === 1) {
            // 该步骤为公交线路
            this.highRoute(index, this.getRouteIndex(this.stepIndex[index], step));
        }
        this.swiPop(index, this.getInfoWindowIndex(this.stepIndex[index], step));
        this._currentStep = step;
        //低分手机在横屏后点击上一步或下一步后，地图层级变成3，在这里检查一下然后进行重置层级
        if (mapView._map.zoomLevel <= 3) {
            this.map.setZoom(_currentZoomLevel);
        }
    },
    getWalkIndex: function(stepIndex, curStep, walkType) {
        if (walkType === 2) {
            return 0;
        }
        var resultIndex = 0;
        for (var i = 0; i < curStep; i++) {
            if (stepIndex[i] === 0) {
                resultIndex++;
            }
        }
        if (walkType === 1) {
            resultIndex--;
        }
        return resultIndex;
    },
    getRouteIndex: function(stepIndex, curStep) {
        var resultIndex = 0;
        for (var i = 0; i < curStep; i++) {
            if (stepIndex[i] === 1) {
                resultIndex++;
            }
        }
        return resultIndex;
    },
    getInfoWindowIndex: function(stepIndex, curStep) {
        var resultIndex = 0;
        for (var i = 0; i <= curStep; i++) {
            if (i > 0) {
                if (stepIndex[i] === stepIndex[i - 1]) {
                    // 如果两个相邻step的类型一致，则说明少了步行
                    // infoWindow的索引应该多增加1
                    resultIndex++;
                }
            }
            if (i === curStep) {
                break;
            }
            resultIndex++;
        }
        if (stepIndex[0] === 1) {
            // 如果这个方案一开始就没有步行，则index也要再加1
            resultIndex++;
        }
        return resultIndex;
    },
    /**
     * lineControl的控制
     * @return {boolean} 表示按钮点击是否成功
     */
    pre: function() {
        var newIndex = this._infoWinIndex - 1;
        if (newIndex < 0 || newIndex > this.transWins[this._index].length - 1) {
            return false;
        }
        this.swiPop(this._index, newIndex);
        var step = this.getListIndexFromInfoWinIndex(this._index, newIndex);
        if (this.redRoute) {
            mapView.unselectRoute(this.redRoute);
        }
        if (step !== -999) {
            this.selectStep(this._index, step);
        }
        return true;
    },
    /**
     * lineControl的控制
     * @return {boolean} 表示按钮点击是否成功
     */
    next: function() {
        var newIndex = this._infoWinIndex + 1;
        if (newIndex < 0 || newIndex > this.transWins[this._index].length - 1) {
            return false;
        }
        this.swiPop(this._index, newIndex);
        var step = this.getListIndexFromInfoWinIndex(this._index, newIndex);
        if (this.redRoute) {
            mapView.unselectRoute(this.redRoute);
        }
        if (step !== -999) {
            this.selectStep(this._index, step);
        }
        return true;
    },
    /**
     * 添加POI和线路
     * @param {String} n 方案索引
     * @param {String} r 一个方案中的也可换乘线路索引
     * @param {String} l 一个方案中的线路索引
     */
    addPoiRoute: function(n, r, l) {

        this.addLine(n, r, l); //添加线路
        this.addPoi(n, r, l); //添加POI

        var bps, points; //bounds & points

        if (this.routeBounds[n]) { //将地图定位的合适的级别与中心
            bps = this.routeBounds[n].concat(this.sWalkBounds[n], this.tWalkBounds[n], this.eWalkBounds[n]);
        }
        points = util.getBPoints(bps);
        if (points) {
            this.setView(points);
        }
    },
    setInfoWindow: function(index, opts) {
        opts = opts ? opts : {};
        var type = opts.type === 1 ? 1 : 0;
        var thisIndex = (opts.ext && this.tempIndex !== undefined) ? this.tempIndex : 0;
        var data = this.formatTransWins(this.transWins[index]);

        this.getInfoWindow().setData(mapConst.IW_BUS, {
            json: data.json,
            points: data.points
        }).switchTo(0);
        mapView.getLineStepControl().setIWCon(this);
        mapView.getLineStepControl().disableBtn('pre');

        listener.on('infowindow.' + mapConst.IW_BUS, 'click', function(name, evt) {
            var id = evt.id;

            switch (id) {
                case 'iw-c':
                    // 跳入公交列表
                    stat.addCookieStat(COM_STAT_CODE.MAP_IW_BUS_LIST);

                    url.update({
                        pageState: {
                            vt: 'list'
                        }
                    }, {});
                    break;
                default:
                    break;
            }
        });
    },

    formatTransWins: function(wins) {
        var json = [],
            points = [];
        for (var i = 0, len = wins.length; i < len; i++) {
            var win = wins[i],
                content = win.title;
            if(win.tip && win.tip == '1'){
                content = content + '<p class="iw-c-tip">首班发车'+ win.startTime+'</p>';
            }else if(win.tip == '2'){
                content = content + '<p class="iw-c-tip">末班发车'+ win.endTime + '</p>';
            }
            json.push({
                content: content
            });
            points.push({
                p: wins[i].poi
            });
        }
        return {
            json: json,
            points: points
        };
    },

    getInfoWindow: function() {
        return mapView.iwController.get(mapConst.IW_BUS);
    },

    /**
     * 添加起点,换乘点,终点 POI
     * @param {String} n 方案索引
     * @param {String} r 一个方案中的也可换乘线路索引
     * @param {String} l 一个方案中的线路索引
     */
    addPoi: function(n, r, l) {
        var _this = this;
        var transPoint = this.transPoints[n];
        if (!transPoint) return;
        var transLen = transPoint.length;
        var i, j;
        for (i = 0, j = 0; i < transLen; i++) {
            var tranPoi;
            if (i === 0) { //起点
                tranPoi = mapView.addDestPoi(transPoint[i][0], mapConst.DEST_START);
            } else if (i === transLen - 1) { //终点
                tranPoi = mapView.addDestPoi(transPoint[i][0], mapConst.DEST_END);
            } else if (i > 0 && i < transLen - 1) { //换乘点
                var ltype = _this.getLineType(transPoint[i][2]);
                var icontype = 0;
                if (ltype === 0) {
                    icontype = mapConst.TRANS_TYPE_BUS;
                } else if (ltype === 1) {
                    icontype = mapConst.TRANS_TYPE_SUB;
                } else if (ltype == 2) {
                    icontype = mapConst.TRANS_TYPE_BUS;
                }
                tranPoi = this.addTransPoi(transPoint[i][0].toString(), icontype);

            }
            if (tranPoi) {
                tranPoi._div.ontouchend = _this.getClickMarker(tranPoi, n, i);
                _this.transPois = _this.transPois || [];
                _this.transPois.push(tranPoi);
            }
        }

    },

    /**
     * 添加公交换乘标注
     * @param {String} point 地理坐标点
     * @param {Number} type 类型
     */
    addTransPoi: function(point, type) {
        var pt = util.getPoiPoint(point);
        var offsetY = 55;
        switch (type) {
            case mapConst.TRANS_TYPE_BUS:
                offsetY = 0;
                break;
            case mapConst.TRANS_TYPE_SUB:
                offsetY = 21;
                break;
        }
        var icon = new BMap.Icon(mapView.DEST_MKR_PATH, new BMap.Size(21, 21), {
            anchor: new BMap.Size(10, 10),
            imageOffset: new BMap.Size(59, offsetY)
        });
        var mkr = new mapView.CustomMarker(icon, pt, {
            className: "dest_mkr"
        });
        map.addOverlay(mkr);
        this.transPois.push(mkr);
        return mkr;
    },

    /**
     * 返回线类型 0公交，1，地铁，2轮渡
     * @param {Number} type JSON数据线路类型
     */
    getLineType: function(type) {
        var len = this.lineType.length,
            i, j;
        for (i = 0; i < len; i++) {
            var arr = this.lineType[i];
            for (j = 0; j < arr.length; j++) {
                var t = arr[j];
                if (t === type) {
                    return i;
                }
            }
        }
    },
    /**
     * 图区关键站Marker点击事件
     * @param {Marker} tranPoi  关键站marker
     * @param {String} n        方案索引
     * @param {String} i        关键站索引
     */
    getClickMarker: function(tranPoi, n, i) {
        var me = this;
        return function() {
            // 公交节点marker点击量
            stat.addStat(COM_STAT_CODE.MAP_BUS_DIR_MARKER_CLICK);

            me.map.panTo(tranPoi._point);
            me.swiPop(n, i, 0);
        };
    },
    /**
     * 点击步骤在气泡内显示步骤详情
     * @param {String}  i     方案索引
     * @param {String}  step  步骤索引
     */
    swiPop: function(i, step) {

        // 增加置灰上下一步控件按钮逻辑 by jican
        var lineStepControl = mapView.getLineStepControl();
        if(step===0){
            lineStepControl.disableBtn('pre');
        } else {
            lineStepControl.ableBtn('pre');
        }
        if(step>=(this.transWins[i].length-1)){
            lineStepControl.disableBtn('next');
        } else {
            lineStepControl.ableBtn('next');
        }

        if (step < 0 || step > this.transWins[i].length - 1) {
            return;
        }
        this._infoWinIndex = step;
        var infoWindow = this.getInfoWindow();
        infoWindow.switchTo(step);
    },
    /**
     * 根据infoWindow的索引返回对应的列表页步骤step索引
     */
    getListIndexFromInfoWinIndex: function(index, infoWinIndex) {
        for (var step = 0; step < this.stepIndex[index].length; step++) {
            // 遍历所有的step，找到与这个infoWindowIndex对应的step
            if (infoWinIndex === this.getInfoWindowIndex(this.stepIndex[index], step)) {
                return step;
            }
        }
        return -999;
    },
    /**
     * 添加线路
     * @param {String} n 方案索引
     * @param {String} r 一个方案中的也可换乘线路索引
     * @param {String} l 一个方案中的线路索引
     */
    addLine: function(n, r, l) {
        var me = this;
        //添加所有换乘公交线路
        var routePoints = this.routePoints[n];

        if (!routePoints) {
            return;
        }
        var i, rlen, swlen, twlen, ewlen, walkLine;
        for (i = 0, rlen = routePoints.length; i < rlen; i++) {
            var routeLine = this.addTransitRoute(routePoints[i].toString());
            this.routeLines.push(routeLine);
        }

        //添加起点步行线路
        var sWalkPoints = this.sWalkPoints[n];
        var sWalkType = this.sWalkType[n];
        this.sWalkPoint = sWalkPoints;
        this.sCurWalkType = sWalkType;

        for (i = 0, swlen = sWalkPoints.length; i < swlen; i++) {
            walkLine = this.addWalkRoute(sWalkPoints[i].toString(), sWalkType[i]);
            this.sWalkLines.push(walkLine);
        }
        //添加所有换乘点步行线路
        var tWalkPoints = this.tWalkPoints[n];
        var tWalkType = this.tWalkType[n];
        this.tWalkPoint = tWalkPoints;
        this.tCurWalkType = tWalkType;
        for (i = 0, twlen = tWalkPoints.length; i < twlen; i++) {
            walkLine = this.addWalkRoute(tWalkPoints[i].toString(), tWalkType[i]);
            this.tWalkLines.push(walkLine);
        }
        //添加所有终点步行线路
        var eWalkPoints = this.eWalkPoints[n];
        var eWalkType = this.eWalkType[n];
        this.eWalkPoint = eWalkPoints;
        this.eCurWalkType = eWalkType;

        for (i = 0, ewlen = eWalkPoints.length; i < ewlen; i++) {
            walkLine = this.addWalkRoute(eWalkPoints[i].toString(), eWalkType[i]);
            this.eWalkLines.push(walkLine);
        }
        this.addDirectionMarker();
    },
    /**
     * 添加步行线路
     */
    addWalkRoute: function(points, type) {
        var route;
        if (type === 1) {
            route = mapView.addRoute(points, mapConst.ROUTE_TYPE_WALK);
        } else {
            route = mapView.addRoute(points, mapConst.ROUTE_TYPE_UNSURE);
        }
        this.walkRoutes.push(route);
        return route;
    },
    /**
     * 添加换乘线路
     */
    addTransitRoute: function(points) {
        var route = mapView.addRoute(points, mapConst.ROUTE_TYPE_BUS);
        this.transitRoutes.push(route);
        return route;
    },
    /**
     * 添加公交路线中步行方向箭头
     * @param  {[type]} lineArr [description]
     * @param  {[type]} mapView [description]
     * @return {[type]}         [description]
     * by likun
     */
    addArrow: function(lineArr, mapView) {
        var CustomMarker = mapView.CustomMarker,
            lineArr = lineArr.split(';');
        var i;
        //初始化
        for (i = 0; i < lineArr.length; i++) {
            var tmpPoint = lineArr[i].split(',');
            lineArr[i] = new BMap.Point(tmpPoint[0], tmpPoint[1]);
        }
        var lastArr = -1000;

        var p0 = map.pointToPixel(lineArr[0]),
            angel, offsetY, icon, mkr;

        if (p0 !== 0) {
            for (i = 0; i < lineArr.length - 1; i++) {
                p0 = map.pointToPixel(lineArr[i]);
                var p1 = map.pointToPixel(lineArr[i + 1]);
                var dist = (p0.x - p1.x) * (p0.x - p1.x) + (p0.y - p1.y) * (p0.y - p1.y);
                if (dist < 324) {
                    continue;
                }
                //角度
                angel = Math.atan2(lineArr[i + 1].lat - lineArr[i].lat, lineArr[i + 1].lng - lineArr[i].lng);

                angel = angel - (Math.PI / 2);

                angel > 0 ? (angel = angel - 2 * Math.PI) : angel = angel;
                angel = -angel;

                offsetY = Math.round(angel / (Math.PI / 8)) * 22;


                if (offsetY === lastArr) {
                    continue;
                }


                icon = new BMap.Icon(mapView.BUS_DIRECTION_PATH, new BMap.Size(17, 17), {
                    anchor: new BMap.Size(9, 9),
                    imageOffset: new BMap.Size(0, offsetY)
                });
                
                mkr = new CustomMarker(icon, lineArr[i], {
                    className: 'bus_direction',
                    enableMassClear: false
                });
                
                lastArr = offsetY;

                map.addOverlay(mkr);
                this.busDirectionMarkers.push(mkr);
            }
        } else {

            for (i = 0; i < lineArr.length - 1; i++) {

                //角度
                angel = Math.atan2(lineArr[i + 1].lat - lineArr[i].lat, lineArr[i + 1].lng - lineArr[i].lng);

                angel = angel - (Math.PI / 2);

                angel > 0 ? (angel = angel - 2 * Math.PI) : angel = angel;
                angel = -angel;

                offsetY = Math.round(angel / (Math.PI / 8)) * 22;

                if (offsetY === lastArr) {
                    continue;
                }

                icon = new BMap.Icon(MapView.BUS_DIRECTION_PATH, new BMap.Size(17, 17), {
                    anchor: new BMap.Size(9, 9),
                    imageOffset: new BMap.Size(0, offsetY)
                });
                mkr = new CustomMarker(icon, lineArr[i], {
                    className: 'bus_direction',
                    enableMassClear: false
                });

                lastArr = offsetY;

                map.addOverlay(mkr);
                this.busDirectionMarkers.push(mkr);
            }
        }
    },

    /**
     * 给步行路线添加箭头
     * @param  {[type]} lineArr [description]
     * @param  {[type]} map     [description]
     * @return {[type]}         [description]
     * by likun
     */
    addDirectionMarker: function(e) {
        var me = this;
        // 先移除之前的
        try {
            this.removeArrowMarkers();
            var i, swlen;
            for (i = 0, swlen = me.sWalkPoint.length; i < swlen; i++) {
                if (me.sCurWalkType[i] === 1) {
                    this.addArrow(me.sWalkPoint[i], mapView);
                }
            }

            for (i = 0; i < me.tWalkPoint.length; i++) {
                if (me.tCurWalkType[i] === 1) {
                    this.addArrow(me.tWalkPoint[i], mapView);
                }
            }
            for (i = 0, swlen = me.eWalkPoint.length; i < swlen; i++) {
                if (me.eCurWalkType[i] === 1) {
                    this.addArrow(me.eWalkPoint[i], mapView);
                }
            }
        } catch (e) {

        }
    },

    /**
     * 高亮公交地铁线路
     * @param {String}  n   方案索引
     * @param {String}  r   一个方案中的换乘线路索引
     */
    highRoute: function(n, r) {
        // 设置地图最佳缩放层级和位置
        var bounds = [this.routeBounds[n][r]],
            points = util.getBPoints(bounds);
        this.setView(points);

        mapView.unselectRoute(this.redRoute); //取消当前飘红线路

        if (this.routeLines) {
            this.redRoute = this.routeLines[r];
            mapView.selectRoute(this.redRoute);
        }
    },

    /**
     * 高亮步行线路
     * @param {String}  n   方案索引
     * @param {String}  r   一个方案中所有步行线路索引
     * @param {String}  t   步行类型
     */
    highWalk: function(n, r, t) {
        this.map.enableLoadTiles = true;
        mapView.unselectRoute(this.redRoute);
        this.redRoute = null;
        var bounds = [];
        t = parseInt(t, 10);
        switch (t) {
            case 0: // 起点到上车站的步行线路
                if (this.sWalkLines[r]) {
                    this.redRoute = this.sWalkLines[r];
                    bounds.push(this.sWalkBounds[n][r]);
                }
                break;
            case 1: // 换乘站之间的步行线路
                if (this.tWalkLines[r]) {
                    this.redRoute = this.tWalkLines[r];
                    bounds.push(this.tWalkBounds[n][r]);
                }
                break;
            case 2: // 下车站到终点的步行线路
                if (this.eWalkLines[r]) {
                    this.redRoute = this.eWalkLines[r];
                    bounds.push(this.eWalkBounds[n][r]);
                }
                break;
        }
        mapView.selectRoute(this.redRoute);
        // 设置地图最佳缩放层级和位置
        var points = util.getBPoints(bounds);
        this.setView(points);
    },
    /**
     * 根据坐标点数组设置地图视野
     * @param {Array<Point>}
     */
    setView: function(points) {
        mapView.setViewport(points, {
            margins: mapConst.ROUTE_MARGINS,
            enableAnimation: false
        });
    },

    removeCurrentOverlay: function() {
        if (!mapView) {
            return;
        }
        this.removePoi();
        this.removeRoute();
        this.removeArrow();
        mapView.getLineStepControl().hide();
        mapView.displayId = '';
        this._currentStep = -1;
        this._infoWinIndex = 0;
    },

    removeArrowMarkers: function() {
        mapView.removeOverlayInArray(this.busDirectionMarkers);
    },

    // 移除起终点和换乘点标注
    removePoi: function() {
        mapView.removeDestPoi();
        this.removeTransPoi();
        this.transPois = [];
    },

    removeWalkRoute: function(points) {
        mapView.removeOverlayInArray(this.walkRoutes);
    },

    removeTransPoi: function() {
        mapView.removeOverlayInArray(this.transPois);
    },

    removeTransitRoute: function(points) {
        for (var i = 0; i < this.transitRoutes.length; i++) {
            mapView.removeRoute(this.transitRoutes[i]);
        }
        this.transitRoutes = [];
    },

    // 移除线路覆盖物
    removeRoute: function() {

        // 移除换乘中的所有公交线路
        this.removeTransitRoute();

        this.routeLines = [];

        // 移除起点步行线路
        // 移除所有换乘点步行线路
        // 移除终点步行线路
        this.removeWalkRoute();
        this.sWalkLines = [];
        this.tWalkLines = [];
        this.eWalkLines = [];
    },

    removeArrow: function() {
        // 移除公交线路步行方向marker
        this.removeArrowMarkers();
        this.sWalkPoint = [];
        this.tWalkPoint = [];
        this.eWalkPoint = [];
    }
};

});