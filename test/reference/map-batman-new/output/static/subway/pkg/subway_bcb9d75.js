/**
 * @file 抽象坐标点
 * 
 */
define('subway:static/js/base/coords.js', function (require, exports, module) {
    function Coords(x, y) {
        this.x = x;
        this.y = y;
    }

    Coords.prototype.toString = function() {
        return [this.x, this.y].join(",");
    };

    Coords.prototype.floor = function() {
        return new Coords(this.x>>0, this.y>>0);
    };

    module.exports = Coords;
});
;/**
 * @file 地铁线路
 * @param {String} lid  名称；
 * @param {String} lb   标注文字；
 * @param {String} slb  简称，去除了“线”字；
 * @param {String} uid  加密编码；
 * @param {Int} n   站点数量；
 * @param {Boolean} loop 环线；
 * @param {Float} lbx  标注起始坐标X
 * @param {Float} lby  标注起始坐标Y
 * @param {Float} lbr  北京机场专线值不为0.0；
 * @param {String} lc 颜色RGB值；
 */
define('subway:static/js/base/line.js', function (require, exports, module) {
    function Line(lid, lb, slb, uid, n, loop, lbx, lby, lbr, lc) {
        this.lid = lid;
        this.lb = lb;
        this.slb = slb;
        this.uid = uid;
        this.n = n;
        this.loop = loop;
        this.lbx = lbx;
        this.lby = lby;
        this.lbr = lbr;
        this.lc = lc;
        this.stations = [];
    }

    module.exports = Line;
});
;/**
 * @file 地铁站点
 * @param {} sid   名称；
 * @param {} lb    标注文字；
 * @param {} uid  加密编码；
 * @param {} px   坐标X；
 * @param {} py   坐标Y；
 * @param {} x    绘制坐标X；
 * @param {} y    绘制坐标Y；
 * @param {} rx   标注大小X；
 * @param {} ry   标注大小Y；
 * @param {} st   是否绘制隐藏站点，用于绘制曲线；
 * @param {} ex   是否中转站；
 * @param {} iu   是否绘制，用于隐藏并行换乘站，如四惠、四惠东；
 * @param {} rc   是否圆角，配置st参数；
 * @param {} slb  暂时无用；
 * @param {} ln   div的Name值；
 * @param {} color   颜色RGB值；
 * @param {} icon    站点图标，仅用于机场航站楼；
 * @param {} dx   站点绘制偏移X，香港和上海；
 * @param {} dy   站点绘制偏移Y，香港和上海；
 * @param {} trs_x   并行线路之间的中转站点图标的绘制偏移量
 * @param {} trs_y   并行线路之间的中转站点图标的绘制偏移量
 * @param {} interval 发车间隔；
 */
define('subway:static/js/base/station.js', function (require, exports, module) {
    function Station(sid, lb, uid, px, py, x, y, rx, ry, st, ex, iu, rc, slb, ln, color, icon, dx, dy, trs_x, trs_y) {
        this.sid = sid;
        this.lb = lb;
        this.uid = uid;
        this.px = px;
        this.py = py;
        this.x = x;
        this.y = y;
        this.rx = rx;
        this.ry = ry;
        this.st = st;
        this.ex = ex;
        this.iu = iu;
        this.rc = rc;
        this.slb = slb;
        this.ln = ln;
        this.color = color;
        this.icon = icon;
        this.dx = dx;
        this.dy = dy;
        this.trs_x = trs_x;
        this.trs_y = trs_y;
    }

    module.exports = Station;
});
;var util = require('common:static/js/util.js'),
    searchData = require('common:static/js/searchdata.js'),
    Coords = require('subway:static/js/base/coords.js'),
    Station = require('subway:static/js/base/station.js'),
    Line = require('subway:static/js/base/line.js');

/**
 * @file 城市地铁
 * @param {String} shortName     城市简称
 * @param {String} fullName      城市全称
 * @param {String} lines_number  线路数量
 * @param {Integer} canvas_width  canvas宽度
 * @param {Integer} canvas_height canvas长度
 * @param {Float} transformScale  地图放大系数
 */
define('subway:static/js/base/subway.js', function (require, exports, module) {

    function Subway(shortName, fullName, lines_number) {
        this.fullName = fullName;
        this.shortName = shortName;
        this.lines_number = lines_number;
        this.lines = [];
        this.width = null;
        this.height = null;
    }

    /**
     * 遍历查找线路或站点；
     * 过滤线路或站点，建议采用 this instanceof Line | this instanceof Station；
     * @param  {Function} fn 查询判断函数
     * @return {Array}      线路、站点数组
     */
    Subway.prototype.findBy = function(fn) {
        var v = [];

        if (typeof fn === "function") {
            var line;
            for (var i = this.lines.length - 1; i >= 0; i--) {
                line = this.lines[i];
                fn.apply(line) && v.push(line);
                for (var j = line.stations.length - 1; j >= 0; j--) {
                    var station = line.stations[j];
                    fn.apply(station) && v.push(station);
                }
            }
        }

        return v;
    };


    /**
     * 遍历获取最近站点；
     * @param  {Coords} coords 墨卡托坐标；
     * @param  {int} tolerance 容忍区间
     */
    Subway.prototype.findNearestStation = function(coords, type, tolerance) {
        var minValue = Number.POSITIVE_INFINITY,
            curValue = 0,
            curStation = null,
            key = (type === 'point' ? 'p' : '');

        if (coords && coords.x && coords.y) {
            var lines = this.lines;
            for(var i = 0; i < lines.length; i++) {
                var line = lines[i];

                for(var j = 0; j < line.stations.length; j++) {
                    var station = line.stations[j];
                    if (station.iu) {
                        curValue = Math.pow(station[key + 'x'] - coords.x, 2) + Math.pow(station[key + 'y'] - coords.y, 2);
                        if(curValue < minValue) {
                            minValue = curValue;
                            curStation = station;
                        }
                    }
                }
            }
        }

        // 如果最小值超过容忍值，不返回结果
        if (tolerance > 0 && minValue > (tolerance * tolerance)) {
            return;
        }

        return curStation;
    };

    /**
     * 获取线路对象的起始点名称，可能是第一个也可能是最后一个；
     */
    Subway.prototype.findLineOneWayDirection = function(line, name) {
        var first_station, last_station;
        if (name) { // 优先根据sname定位首站点Station的sid；
            var stations = this.findBy(function() {
                return this instanceof Station && this.st && this.sid && this.lid == line.lid && this.sid == name;
            });
            if (stations.length === 0) { // 无法根据sid找到定位站点；默认取首站点；
                first_station = line.stations[0];
                last_station = line.stations[line.stations.length - 1];
            } else {
                first_station = stations[0];
                if (line.stations[0] == first_station) {
                    for (var i = line.stations.length - 1; i > 0; i--) {
                        if (line.stations[i].st) {
                            last_station = line.stations[i];
                            break;
                        }
                    }
                } else {
                    for (var j = 0; j < line.stations.length; j++) {
                        if (line.stations[j].st) {
                            last_station = line.stations[j];
                            break;
                        }
                    }
                }
            }
        } else { // 同无法根据sid匹配情况，取首站点；
            first_station = line.stations[0];
            last_station = line.stations[line.stations.length - 1];
        }

        return {
            firstStation : first_station,
            lastStation : last_station
        };
    };

    /**
     * 解析站点数据，返回站点详情数据
     */
    Subway.prototype.parseStationExt = function(data) {
        var self = this;

        if (data && data.content && data.content.ext && data.content.ext.line_info) {
            var foundLines = {};
            var lostLineExt = [];

            // 根据返回的线路名称检索Line对象；
            $.each(data.content.ext.line_info, function (index, info) {
                var remoteLineName = info.line_name;
                if (foundLines[remoteLineName] === undefined) {
                    // 按照lid严格匹配遍历Subway对象；
                    var lines = self.findBy(function() {
                        //this.lid和remoteLineName可能并不全相等,是包含的关系
                        return this instanceof Line && this.lid.indexOf(remoteLineName) >= 0;
                    });
                    
                    if (lines.length === 0) {
                        lostLineExt.push(info);
                    } else {
                        foundLines[remoteLineName] = {
                            line: lines[0], // 保存本地对象；
                            ext: [info]
                        };
                    }
                } else {
                    foundLines[remoteLineName].ext.push(info);
                }
            });

            ////////////////////////////////////////////////
            // Hack：处理一端相同一端不同的站点情况，例如上海10号线和11号线；
            $.each(lostLineExt, function (index, info) {
                var remoteLineName = info.line_name;
                var remoteTerminals = info.terminals;

                // 按照lid宽松匹配遍历Subway对象；
                var lines = self.findBy(function() {
                    return this instanceof Line &&
                        this.lid.indexOf(remoteLineName) === 0 &&
                        this.lid.indexOf(remoteTerminals) > 0;
                });
                
                if (lines.length === 0) {
                    return;
                } else {
                    $.each(lines, function(i, line) {
                        var localLineName = line.lid;
                        if (foundLines[localLineName] === undefined) {
                            foundLines[localLineName] = {
                                line: line, // 保存本地对象；
                                ext: [info],
                                lost: true
                            };
                        } else {
                            // 去除重复站点；
                            var inExtArray = false;
                            $.each(foundLines[localLineName].ext, function(j, ext) {
                                if (ext.terminals == info.terminals) {
                                    inExtArray = true;
                                }
                            });
                            if (!inExtArray) {
                                foundLines[localLineName].ext.push(info);
                            }
                        }
                    });
                }
            });
            
            var mistake_line_name = [];
            $.each(foundLines, function(name, line) {
                if (line.lost && line.ext.length == 1) {
                    mistake_line_name.push(name);
                }
            });

            $.each(mistake_line_name, function(index, name) {
                foundLines[name] = null;
                delete foundLines[name];
            });
            /////////////////////////////////////////////////
            var _lines = [];
            $.each(foundLines, function (name, obj) {
                var line = obj.line,
                    ext = obj.ext,
                    _line = {};

                _line.color = line.lc;
                _line.name = line.lid;
                _line.dirs = [];
                $.each(ext, function(i, info) {
                    _line.dirs.push({
                        name: info.terminals,
                        startTime: info.first_time,
                        endTime: info.last_time
                    });
                });

                _lines.push(_line);
            });

            var foundStations = self.findBy(function() {
                return this instanceof Station && this.st && this.uid === data.content.uid;
            });

            if (foundStations.length === 0) {
                foundStations = this.findBy(function() {
                    return this instanceof Station && this.st && this.sid && data.content.name.indexOf(this.sid) === 0;
                });
                if (foundStations.length === 0) {
                    return;
                }
            }

            var station = foundStations[0];
            var points = util.parseGeo(data.content.geo).points;

            return {
                station: station,
                points: points,
                lines: _lines
            };
        }
    };

    /**
     * 获取站点详情数据
     * @param {string} qt参数
     * @param {string} uid
     * @param {Function} 回调函数
     * @param {Object} 可选配置参数
     */
    Subway.prototype.getStationExt = function(qt, uid, successCallback, failureCallback) {
        var self = this;

        // 保存最近一次的请求信息
        self._currentQueryUID = uid;

        var url = 'qt=' + qt + "&c=" + this.cityCode + "&uid=" + uid;
        searchData.fetch(url, function(data) {
            if (uid === self._currentQueryUID) { // 仅处理最近一次请求回调
                self._currentQueryUID = null;
                data = self.parseStationExt(data);
                successCallback && successCallback(data);
            }
        }, function(error) {
            failureCallback && failureCallback(error);
        });
    },

    module.exports = Subway;

});
;/*! Hammer.JS - v1.0.6dev - 2013-09-30
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2013 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

define('subway:static/js/libs/hammer.js', function (require, exports, module) {
    'use strict';

/**
 * Hammer
 * use this to create instances
 * @param   {HTMLElement}   element
 * @param   {Object}        options
 * @returns {Hammer.Instance}
 * @constructor
 */
var Hammer = function(element, options) {
    return new Hammer.Instance(element, options || {});
};

// default settings
Hammer.defaults = {
    // add styles and attributes to the element to prevent the browser from doing
    // its native behavior. this doesnt prevent the scrolling, but cancels
    // the contextmenu, tap highlighting etc
    // set to false to disable this
    stop_browser_behavior: {
		// this also triggers onselectstart=false for IE
        userSelect: 'none',
		// this makes the element blocking in IE10 >, you could experiment with the value
		// see for more options this issue; https://github.com/EightMedia/hammer.js/issues/241
        touchAction: 'none',
		touchCallout: 'none',
        contentZooming: 'none',
        userDrag: 'none',
        tapHighlightColor: 'rgba(0,0,0,0)'
    }

    // more settings are defined per gesture at gestures.js
};

// detect touchevents
Hammer.HAS_POINTEREVENTS = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;
Hammer.HAS_TOUCHEVENTS = ('ontouchstart' in window);

// dont use mouseevents on mobile devices
Hammer.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i;
Hammer.NO_MOUSEEVENTS = Hammer.HAS_TOUCHEVENTS && window.navigator.userAgent.match(Hammer.MOBILE_REGEX);

// eventtypes per touchevent (start, move, end)
// are filled by Hammer.event.determineEventTypes on setup
Hammer.EVENT_TYPES = {};

// direction defines
Hammer.DIRECTION_DOWN = 'down';
Hammer.DIRECTION_LEFT = 'left';
Hammer.DIRECTION_UP = 'up';
Hammer.DIRECTION_RIGHT = 'right';

// pointer type
Hammer.POINTER_MOUSE = 'mouse';
Hammer.POINTER_TOUCH = 'touch';
Hammer.POINTER_PEN = 'pen';

// touch event defines
Hammer.EVENT_START = 'start';
Hammer.EVENT_MOVE = 'move';
Hammer.EVENT_END = 'end';

// hammer document where the base events are added at
Hammer.DOCUMENT = window.document;

// plugins namespace
Hammer.plugins = {};

// if the window events are set...
Hammer.READY = false;

/**
 * setup events to detect gestures on the document
 */
function setup() {
    if(Hammer.READY) {
        return;
    }

    // find what eventtypes we add listeners to
    Hammer.event.determineEventTypes();

    // Register all gestures inside Hammer.gestures
    for(var name in Hammer.gestures) {
        if(Hammer.gestures.hasOwnProperty(name)) {
            Hammer.detection.register(Hammer.gestures[name]);
        }
    }

    // Add touch events on the document
    Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_MOVE, Hammer.detection.detect);
    Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_END, Hammer.detection.detect);

    // Hammer is ready...!
    Hammer.READY = true;
}

/**
 * create new hammer instance
 * all methods should return the instance itself, so it is chainable.
 * @param   {HTMLElement}       element
 * @param   {Object}            [options={}]
 * @returns {Hammer.Instance}
 * @constructor
 */
Hammer.Instance = function(element, options) {
    var self = this;

    // setup HammerJS window events and register all gestures
    // this also sets up the default options
    setup();

    this.element = element;

    // start/stop detection option
    this.enabled = true;

    // merge options
    this.options = Hammer.utils.extend(
        Hammer.utils.extend({}, Hammer.defaults),
        options || {});

    // add some css to the element to prevent the browser from doing its native behavoir
    if(this.options.stop_browser_behavior) {
        Hammer.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior);
    }

    // start detection on touchstart
    Hammer.event.onTouch(element, Hammer.EVENT_START, function(ev) {
        if(self.enabled) {
            Hammer.detection.startDetect(self, ev);
        }
    });

    // return instance
    return this;
};


Hammer.Instance.prototype = {
    /**
     * bind events to the instance
     * @param   {String}      gesture
     * @param   {Function}    handler
     * @returns {Hammer.Instance}
     */
    on: function onEvent(gesture, handler){
        var gestures = gesture.split(' ');
        for(var t=0; t<gestures.length; t++) {
            this.element.addEventListener(gestures[t], handler, false);
        }
        return this;
    },


    /**
     * unbind events to the instance
     * @param   {String}      gesture
     * @param   {Function}    handler
     * @returns {Hammer.Instance}
     */
    off: function offEvent(gesture, handler){
        var gestures = gesture.split(' ');
        for(var t=0; t<gestures.length; t++) {
            this.element.removeEventListener(gestures[t], handler, false);
        }
        return this;
    },


    /**
     * trigger gesture event
     * @param   {String}      gesture
     * @param   {Object}      [eventData]
     * @returns {Hammer.Instance}
     */
    trigger: function triggerEvent(gesture, eventData){
        // optional
        if(!eventData) {
            eventData = {};
        }
      
        // create DOM event
        var event = Hammer.DOCUMENT.createEvent('Event');
        event.initEvent(gesture, true, true);
        event.gesture = eventData;

        // trigger on the target if it is in the instance element,
        // this is for event delegation tricks
        var element = this.element;
        if(Hammer.utils.hasParent(eventData.target, element)) {
            element = eventData.target;
        }

        element.dispatchEvent(event);
        return this;
    },


    /**
     * enable of disable hammer.js detection
     * @param   {Boolean}   state
     * @returns {Hammer.Instance}
     */
    enable: function enable(state) {
        this.enabled = state;
        return this;
    }
};


/**
 * this holds the last move event,
 * used to fix empty touchend issue
 * see the onTouch event for an explanation
 * @type {Object}
 */
var last_move_event = null;


/**
 * when the mouse is hold down, this is true
 * @type {Boolean}
 */
var enable_detect = false;


/**
 * when touch events have been fired, this is true
 * @type {Boolean}
 */
var touch_triggered = false;


Hammer.event = {
    /**
     * simple addEventListener
     * @param   {HTMLElement}   element
     * @param   {String}        type
     * @param   {Function}      handler
     */
    bindDom: function(element, type, handler) {
        var types = type.split(' ');
        for(var t=0; t<types.length; t++) {
            element.addEventListener(types[t], handler, false);
        }
    },


    /**
     * touch events with mouse fallback
     * @param   {HTMLElement}   element
     * @param   {String}        eventType        like Hammer.EVENT_MOVE
     * @param   {Function}      handler
     */
    onTouch: function onTouch(element, eventType, handler) {
		var self = this;

        this.bindDom(element, Hammer.EVENT_TYPES[eventType], function bindDomOnTouch(ev) {
            var sourceEventType = ev.type.toLowerCase();

            // onmouseup, but when touchend has been fired we do nothing.
            // this is for touchdevices which also fire a mouseup on touchend
            if(sourceEventType.match(/mouse/) && touch_triggered) {
                return;
            }

            // mousebutton must be down or a touch event
            else if( sourceEventType.match(/touch/) ||   // touch events are always on screen
                sourceEventType.match(/pointerdown/) || // pointerevents touch
                (sourceEventType.match(/mouse/) && ev.which === 1)   // mouse is pressed
            ){
                enable_detect = true;
            }

            // mouse isn't pressed
            else if(sourceEventType.match(/mouse/) && ev.which !== 1) {
                enable_detect = false;
            }


            // we are in a touch event, set the touch triggered bool to true,
            // this for the conflicts that may occur on ios and android
            if(sourceEventType.match(/touch|pointer/)) {
                touch_triggered = true;
            }

            // count the total touches on the screen
            var count_touches = 0;

            // when touch has been triggered in this detection session
            // and we are now handling a mouse event, we stop that to prevent conflicts
            if(enable_detect) {
                // update pointerevent
                if(Hammer.HAS_POINTEREVENTS && eventType != Hammer.EVENT_END) {
                    count_touches = Hammer.PointerEvent.updatePointer(eventType, ev);
                }
                // touch
                else if(sourceEventType.match(/touch/)) {
                    count_touches = ev.touches.length;
                }
                // mouse
                else if(!touch_triggered) {
                    count_touches = sourceEventType.match(/up/) ? 0 : 1;
                }

                // if we are in a end event, but when we remove one touch and
                // we still have enough, set eventType to move
                if(count_touches > 0 && eventType == Hammer.EVENT_END) {
                    eventType = Hammer.EVENT_MOVE;
                }
                // no touches, force the end event
                else if(!count_touches) {
                    eventType = Hammer.EVENT_END;
                }

                // store the last move event
                if(count_touches || last_move_event === null) {
                    last_move_event = ev;
                }

                // trigger the handler
                handler.call(Hammer.detection, self.collectEventData(element, eventType, self.getTouchList(last_move_event, eventType), ev));

                // remove pointerevent from list
                if(Hammer.HAS_POINTEREVENTS && eventType == Hammer.EVENT_END) {
                    count_touches = Hammer.PointerEvent.updatePointer(eventType, ev);
                }
            }

            //debug(sourceEventType +" "+ eventType);

            // on the end we reset everything
            if(!count_touches) {
                last_move_event = null;
                enable_detect = false;
                touch_triggered = false;
                Hammer.PointerEvent.reset();
            }
        });
    },


    /**
     * we have different events for each device/browser
     * determine what we need and set them in the Hammer.EVENT_TYPES constant
     */
    determineEventTypes: function determineEventTypes() {
        // determine the eventtype we want to set
        var types;

        // pointerEvents magic
        if(Hammer.HAS_POINTEREVENTS) {
            types = Hammer.PointerEvent.getEvents();
        }
        // on Android, iOS, blackberry, windows mobile we dont want any mouseevents
        else if(Hammer.NO_MOUSEEVENTS) {
            types = [
                'touchstart',
                'touchmove',
                'touchend touchcancel'];
        }
        // for non pointer events browsers and mixed browsers,
        // like chrome on windows8 touch laptop
        else {
            types = [
                'touchstart mousedown',
                'touchmove mousemove',
                'touchend touchcancel mouseup'];
        }

        Hammer.EVENT_TYPES[Hammer.EVENT_START]  = types[0];
        Hammer.EVENT_TYPES[Hammer.EVENT_MOVE]   = types[1];
        Hammer.EVENT_TYPES[Hammer.EVENT_END]    = types[2];
    },


    /**
     * create touchlist depending on the event
     * @param   {Object}    ev
     * @param   {String}    eventType   used by the fakemultitouch plugin
     */
    getTouchList: function getTouchList(ev/*, eventType*/) {
        // get the fake pointerEvent touchlist
        if(Hammer.HAS_POINTEREVENTS) {
            return Hammer.PointerEvent.getTouchList();
        }
        // get the touchlist
        else if(ev.touches) {
            return ev.touches;
        }
        // make fake touchlist from mouse position
        else {
            ev.indentifier = 1;
            return [ev];
        }
    },


    /**
     * collect event data for Hammer js
     * @param   {HTMLElement}   element
     * @param   {String}        eventType        like Hammer.EVENT_MOVE
     * @param   {Object}        eventData
     */
    collectEventData: function collectEventData(element, eventType, touches, ev) {

        // find out pointerType
        var pointerType = Hammer.POINTER_TOUCH;
        if(ev.type.match(/mouse/) || Hammer.PointerEvent.matchType(Hammer.POINTER_MOUSE, ev)) {
            pointerType = Hammer.POINTER_MOUSE;
        }

        return {
            center      : Hammer.utils.getCenter(touches),
            timeStamp   : new Date().getTime(),
            target      : ev.target,
            touches     : touches,
            eventType   : eventType,
            pointerType : pointerType,
            srcEvent    : ev,

            /**
             * prevent the browser default actions
             * mostly used to disable scrolling of the browser
             */
            preventDefault: function() {
                if(this.srcEvent.preventManipulation) {
                    this.srcEvent.preventManipulation();
                }

                if(this.srcEvent.preventDefault) {
                    this.srcEvent.preventDefault();
                }
            },

            /**
             * stop bubbling the event up to its parents
             */
            stopPropagation: function() {
                this.srcEvent.stopPropagation();
            },

            /**
             * immediately stop gesture detection
             * might be useful after a swipe was detected
             * @return {*}
             */
            stopDetect: function() {
                return Hammer.detection.stopDetect();
            }
        };
    }
};

Hammer.PointerEvent = {
    /**
     * holds all pointers
     * @type {Object}
     */
    pointers: {},

    /**
     * get a list of pointers
     * @returns {Array}     touchlist
     */
    getTouchList: function() {
        var self = this;
        var touchlist = [];

        // we can use forEach since pointerEvents only is in IE10
        Object.keys(self.pointers).sort().forEach(function(id) {
            touchlist.push(self.pointers[id]);
        });
        return touchlist;
    },

    /**
     * update the position of a pointer
     * @param   {String}   type             Hammer.EVENT_END
     * @param   {Object}   pointerEvent
     */
    updatePointer: function(type, pointerEvent) {
        if(type == Hammer.EVENT_END) {
            this.pointers = {};
        }
        else {
            pointerEvent.identifier = pointerEvent.pointerId;
            this.pointers[pointerEvent.pointerId] = pointerEvent;
        }

        return Object.keys(this.pointers).length;
    },

    /**
     * check if ev matches pointertype
     * @param   {String}        pointerType     Hammer.POINTER_MOUSE
     * @param   {PointerEvent}  ev
     */
    matchType: function(pointerType, ev) {
        if(!ev.pointerType) {
            return false;
        }

        var types = {};
        types[Hammer.POINTER_MOUSE] = (ev.pointerType == ev.MSPOINTER_TYPE_MOUSE || ev.pointerType == Hammer.POINTER_MOUSE);
        types[Hammer.POINTER_TOUCH] = (ev.pointerType == ev.MSPOINTER_TYPE_TOUCH || ev.pointerType == Hammer.POINTER_TOUCH);
        types[Hammer.POINTER_PEN] = (ev.pointerType == ev.MSPOINTER_TYPE_PEN || ev.pointerType == Hammer.POINTER_PEN);
        return types[pointerType];
    },


    /**
     * get events
     */
    getEvents: function() {
        return [
            'pointerdown MSPointerDown',
            'pointermove MSPointerMove',
            'pointerup pointercancel MSPointerUp MSPointerCancel'
        ];
    },

    /**
     * reset the list
     */
    reset: function() {
        this.pointers = {};
    }
};


Hammer.utils = {
    /**
     * extend method,
     * also used for cloning when dest is an empty object
     * @param   {Object}    dest
     * @param   {Object}    src
	 * @parm	{Boolean}	merge		do a merge
     * @returns {Object}    dest
     */
    extend: function extend(dest, src, merge) {
        for (var key in src) {
			if(dest[key] !== undefined && merge) {
				continue;
			}
            dest[key] = src[key];
        }
        return dest;
    },


    /**
     * find if a node is in the given parent
     * used for event delegation tricks
     * @param   {HTMLElement}   node
     * @param   {HTMLElement}   parent
     * @returns {boolean}       has_parent
     */
    hasParent: function(node, parent) {
        while(node){
            if(node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    },


    /**
     * get the center of all the touches
     * @param   {Array}     touches
     * @returns {Object}    center
     */
    getCenter: function getCenter(touches) {
        var valuesX = [], valuesY = [];

        for(var t= 0,len=touches.length; t<len; t++) {
            valuesX.push(touches[t].pageX);
            valuesY.push(touches[t].pageY);
        }

        return {
            pageX: ((Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2),
            pageY: ((Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2)
        };
    },


    /**
     * calculate the velocity between two points
     * @param   {Number}    delta_time
     * @param   {Number}    delta_x
     * @param   {Number}    delta_y
     * @returns {Object}    velocity
     */
    getVelocity: function getVelocity(delta_time, delta_x, delta_y) {
        return {
            x: Math.abs(delta_x / delta_time) || 0,
            y: Math.abs(delta_y / delta_time) || 0
        };
    },


    /**
     * calculate the angle between two coordinates
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {Number}    angle
     */
    getAngle: function getAngle(touch1, touch2) {
        var y = touch2.pageY - touch1.pageY,
            x = touch2.pageX - touch1.pageX;
        return Math.atan2(y, x) * 180 / Math.PI;
    },


    /**
     * angle to direction define
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {String}    direction constant, like Hammer.DIRECTION_LEFT
     */
    getDirection: function getDirection(touch1, touch2) {
        var x = Math.abs(touch1.pageX - touch2.pageX),
            y = Math.abs(touch1.pageY - touch2.pageY);

        if(x >= y) {
            return touch1.pageX - touch2.pageX > 0 ? Hammer.DIRECTION_LEFT : Hammer.DIRECTION_RIGHT;
        }
        else {
            return touch1.pageY - touch2.pageY > 0 ? Hammer.DIRECTION_UP : Hammer.DIRECTION_DOWN;
        }
    },


    /**
     * calculate the distance between two touches
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {Number}    distance
     */
    getDistance: function getDistance(touch1, touch2) {
        var x = touch2.pageX - touch1.pageX,
            y = touch2.pageY - touch1.pageY;
        return Math.sqrt((x*x) + (y*y));
    },


    /**
     * calculate the scale factor between two touchLists (fingers)
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param   {Array}     start
     * @param   {Array}     end
     * @returns {Number}    scale
     */
    getScale: function getScale(start, end) {
        // need two fingers...
        if(start.length >= 2 && end.length >= 2) {
            return this.getDistance(end[0], end[1]) /
                this.getDistance(start[0], start[1]);
        }
        return 1;
    },


    /**
     * calculate the rotation degrees between two touchLists (fingers)
     * @param   {Array}     start
     * @param   {Array}     end
     * @returns {Number}    rotation
     */
    getRotation: function getRotation(start, end) {
        // need two fingers
        if(start.length >= 2 && end.length >= 2) {
            return this.getAngle(end[1], end[0]) -
                this.getAngle(start[1], start[0]);
        }
        return 0;
    },


    /**
     * boolean if the direction is vertical
     * @param    {String}    direction
     * @returns  {Boolean}   is_vertical
     */
    isVertical: function isVertical(direction) {
        return (direction == Hammer.DIRECTION_UP || direction == Hammer.DIRECTION_DOWN);
    },


    /**
     * stop browser default behavior with css props
     * @param   {HtmlElement}   element
     * @param   {Object}        css_props
     */
    stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_props) {
        var prop,
            vendors = ['webkit','khtml','moz','Moz','ms','o',''];

        if(!css_props || !element.style) {
            return;
        }

        // with css properties for modern browsers
        for(var i = 0; i < vendors.length; i++) {
            for(var p in css_props) {
                if(css_props.hasOwnProperty(p)) {
                    prop = p;

                    // vender prefix at the property
                    if(vendors[i]) {
                        prop = vendors[i] + prop.substring(0, 1).toUpperCase() + prop.substring(1);
                    }

                    // set the style
                    element.style[prop] = css_props[p];
                }
            }
        }

        // also the disable onselectstart
        if(css_props.userSelect == 'none') {
            element.onselectstart = function() {
                return false;
            };
        }
        
        // and disable ondragstart
        if(css_props.userDrag == 'none') {
            element.ondragstart = function() {
                return false;
            };
        }
    }
};


Hammer.detection = {
    // contains all registred Hammer.gestures in the correct order
    gestures: [],

    // data of the current Hammer.gesture detection session
    current: null,

    // the previous Hammer.gesture session data
    // is a full clone of the previous gesture.current object
    previous: null,

    // when this becomes true, no gestures are fired
    stopped: false,


    /**
     * start Hammer.gesture detection
     * @param   {Hammer.Instance}   inst
     * @param   {Object}            eventData
     */
    startDetect: function startDetect(inst, eventData) {
        // already busy with a Hammer.gesture detection on an element
        if(this.current) {
            return;
        }

        this.stopped = false;

        this.current = {
            inst        : inst, // reference to HammerInstance we're working for
            startEvent  : Hammer.utils.extend({}, eventData), // start eventData for distances, timing etc
            lastEvent   : false, // last eventData
            name        : '' // current gesture we're in/detected, can be 'tap', 'hold' etc
        };

        this.detect(eventData);
    },


    /**
     * Hammer.gesture detection
     * @param   {Object}    eventData
     */
    detect: function detect(eventData) {
        if(!this.current || this.stopped) {
            return;
        }

        // extend event data with calculations about scale, distance etc
        eventData = this.extendEventData(eventData);

        // instance options
        var inst_options = this.current.inst.options;

        // call Hammer.gesture handlers
        for(var g=0,len=this.gestures.length; g<len; g++) {
            var gesture = this.gestures[g];

            // only when the instance options have enabled this gesture
            if(!this.stopped && inst_options[gesture.name] !== false) {
                // if a handler returns false, we stop with the detection
                if(gesture.handler.call(gesture, eventData, this.current.inst) === false) {
                    this.stopDetect();
                    break;
                }
            }
        }

        // store as previous event event
        if(this.current) {
            this.current.lastEvent = eventData;
        }

        // endevent, but not the last touch, so dont stop
        if(eventData.eventType == Hammer.EVENT_END && !eventData.touches.length-1) {
            this.stopDetect();
        }

        return eventData;
    },


    /**
     * clear the Hammer.gesture vars
     * this is called on endDetect, but can also be used when a final Hammer.gesture has been detected
     * to stop other Hammer.gestures from being fired
     */
    stopDetect: function stopDetect() {
        // clone current data to the store as the previous gesture
        // used for the double tap gesture, since this is an other gesture detect session
        this.previous = Hammer.utils.extend({}, this.current);

        // reset the current
        this.current = null;

        // stopped!
        this.stopped = true;
    },


    /**
     * extend eventData for Hammer.gestures
     * @param   {Object}   ev
     * @returns {Object}   ev
     */
    extendEventData: function extendEventData(ev) {
        var startEv = this.current.startEvent;

        // if the touches change, set the new touches over the startEvent touches
        // this because touchevents don't have all the touches on touchstart, or the
        // user must place his fingers at the EXACT same time on the screen, which is not realistic
        // but, sometimes it happens that both fingers are touching at the EXACT same time
        if(startEv && (ev.touches.length != startEv.touches.length || ev.touches === startEv.touches)) {
            // extend 1 level deep to get the touchlist with the touch objects
            startEv.touches = [];
            for(var i=0,len=ev.touches.length; i<len; i++) {
                startEv.touches.push(Hammer.utils.extend({}, ev.touches[i]));
            }
        }

        var delta_time = ev.timeStamp - startEv.timeStamp,
            delta_x = ev.center.pageX - startEv.center.pageX,
            delta_y = ev.center.pageY - startEv.center.pageY,
            velocity = Hammer.utils.getVelocity(delta_time, delta_x, delta_y);

        Hammer.utils.extend(ev, {
            deltaTime       : delta_time,

            deltaX          : delta_x,
            deltaY          : delta_y,

            velocityX       : velocity.x,
            velocityY       : velocity.y,

            distance        : Hammer.utils.getDistance(startEv.center, ev.center),
            angle           : Hammer.utils.getAngle(startEv.center, ev.center),
            interimAngle    : this.current.lastEvent && Hammer.utils.getAngle(this.current.lastEvent.center, ev.center),
            direction       : Hammer.utils.getDirection(startEv.center, ev.center),
            interimDirection: this.current.lastEvent && Hammer.utils.getDirection(this.current.lastEvent.center, ev.center),

            scale           : Hammer.utils.getScale(startEv.touches, ev.touches),
            rotation        : Hammer.utils.getRotation(startEv.touches, ev.touches),

            startEvent      : startEv
        });

        return ev;
    },


    /**
     * register new gesture
     * @param   {Object}    gesture object, see gestures.js for documentation
     * @returns {Array}     gestures
     */
    register: function register(gesture) {
        // add an enable gesture options if there is no given
        var options = gesture.defaults || {};
        if(options[gesture.name] === undefined) {
            options[gesture.name] = true;
        }

        // extend Hammer default options with the Hammer.gesture options
        Hammer.utils.extend(Hammer.defaults, options, true);

        // set its index
        gesture.index = gesture.index || 1000;

        // add Hammer.gesture to the list
        this.gestures.push(gesture);

        // sort the list by index
        this.gestures.sort(function(a, b) {
            if (a.index < b.index) {
                return -1;
            }
            if (a.index > b.index) {
                return 1;
            }
            return 0;
        });

        return this.gestures;
    }
};


Hammer.gestures = Hammer.gestures || {};

/**
 * Custom gestures
 * ==============================
 *
 * Gesture object
 * --------------------
 * The object structure of a gesture:
 *
 * { name: 'mygesture',
 *   index: 1337,
 *   defaults: {
 *     mygesture_option: true
 *   }
 *   handler: function(type, ev, inst) {
 *     // trigger gesture event
 *     inst.trigger(this.name, ev);
 *   }
 * }

 * @param   {String}    name
 * this should be the name of the gesture, lowercase
 * it is also being used to disable/enable the gesture per instance config.
 *
 * @param   {Number}    [index=1000]
 * the index of the gesture, where it is going to be in the stack of gestures detection
 * like when you build an gesture that depends on the drag gesture, it is a good
 * idea to place it after the index of the drag gesture.
 *
 * @param   {Object}    [defaults={}]
 * the default settings of the gesture. these are added to the instance settings,
 * and can be overruled per instance. you can also add the name of the gesture,
 * but this is also added by default (and set to true).
 *
 * @param   {Function}  handler
 * this handles the gesture detection of your custom gesture and receives the
 * following arguments:
 *
 *      @param  {Object}    eventData
 *      event data containing the following properties:
 *          timeStamp   {Number}        time the event occurred
 *          target      {HTMLElement}   target element
 *          touches     {Array}         touches (fingers, pointers, mouse) on the screen
 *          pointerType {String}        kind of pointer that was used. matches Hammer.POINTER_MOUSE|TOUCH
 *          center      {Object}        center position of the touches. contains pageX and pageY
 *          deltaTime   {Number}        the total time of the touches in the screen
 *          deltaX      {Number}        the delta on x axis we haved moved
 *          deltaY      {Number}        the delta on y axis we haved moved
 *          velocityX   {Number}        the velocity on the x
 *          velocityY   {Number}        the velocity on y
 *          angle       {Number}        the angle we are moving
 *          direction   {String}        the direction we are moving. matches Hammer.DIRECTION_UP|DOWN|LEFT|RIGHT
 *          distance    {Number}        the distance we haved moved
 *          scale       {Number}        scaling of the touches, needs 2 touches
 *          rotation    {Number}        rotation of the touches, needs 2 touches *
 *          eventType   {String}        matches Hammer.EVENT_START|MOVE|END
 *          srcEvent    {Object}        the source event, like TouchStart or MouseDown *
 *          startEvent  {Object}        contains the same properties as above,
 *                                      but from the first touch. this is used to calculate
 *                                      distances, deltaTime, scaling etc
 *
 *      @param  {Hammer.Instance}    inst
 *      the instance we are doing the detection for. you can get the options from
 *      the inst.options object and trigger the gesture event by calling inst.trigger
 *
 *
 * Handle gestures
 * --------------------
 * inside the handler you can get/set Hammer.detection.current. This is the current
 * detection session. It has the following properties
 *      @param  {String}    name
 *      contains the name of the gesture we have detected. it has not a real function,
 *      only to check in other gestures if something is detected.
 *      like in the drag gesture we set it to 'drag' and in the swipe gesture we can
 *      check if the current gesture is 'drag' by accessing Hammer.detection.current.name
 *
 *      @readonly
 *      @param  {Hammer.Instance}    inst
 *      the instance we do the detection for
 *
 *      @readonly
 *      @param  {Object}    startEvent
 *      contains the properties of the first gesture detection in this session.
 *      Used for calculations about timing, distance, etc.
 *
 *      @readonly
 *      @param  {Object}    lastEvent
 *      contains all the properties of the last gesture detect in this session.
 *
 * after the gesture detection session has been completed (user has released the screen)
 * the Hammer.detection.current object is copied into Hammer.detection.previous,
 * this is usefull for gestures like doubletap, where you need to know if the
 * previous gesture was a tap
 *
 * options that have been set by the instance can be received by calling inst.options
 *
 * You can trigger a gesture event by calling inst.trigger("mygesture", event).
 * The first param is the name of your gesture, the second the event argument
 *
 *
 * Register gestures
 * --------------------
 * When an gesture is added to the Hammer.gestures object, it is auto registered
 * at the setup of the first Hammer instance. You can also call Hammer.detection.register
 * manually and pass your gesture object as a param
 *
 */


/**
 * Tap/DoubleTap
 * Quick touch at a place or double at the same place
 * @events  tap, doubletap
 */
Hammer.gestures.Tap = {
    name: 'tap',
    index: 100,
    defaults: {
        tap_max_touchtime	: 250,
        tap_max_distance	: 10,
		tap_always			: true,
        doubletap_distance	: 20,
        doubletap_interval	: 300
    },
    handler: function tapGesture(ev, inst) {
        if(ev.eventType == Hammer.EVENT_END && ev.srcEvent.type != 'touchcancel') {
            // previous gesture, for the double tap since these are two different gesture detections
            var prev = Hammer.detection.previous,
				did_doubletap = false;

            // when the touchtime is higher then the max touch time
            // or when the moving distance is too much
            if(ev.deltaTime > inst.options.tap_max_touchtime ||
                ev.distance > inst.options.tap_max_distance) {
                return;
            }

            // check if double tap
            if(prev && prev.name == 'tap' &&
                (ev.timeStamp - prev.lastEvent.timeStamp) < inst.options.doubletap_interval &&
                ev.distance < inst.options.doubletap_distance) {
				inst.trigger('doubletap', ev);
				did_doubletap = true;
            }

			// do a single tap
			if(!did_doubletap || inst.options.tap_always) {
				Hammer.detection.current.name = 'tap';
				inst.trigger(Hammer.detection.current.name, ev);
			}
        }
    }
};


/**
 * Drag
 * Move with x fingers (default 1) around on the page. Blocking the scrolling when
 * moving left and right is a good practice. When all the drag events are blocking
 * you disable scrolling on that area.
 * @events  drag, drapleft, dragright, dragup, dragdown
 */
Hammer.gestures.Drag = {
    name: 'drag',
    index: 50,
    defaults: {
        drag_min_distance : 10,
        // Set correct_for_drag_min_distance to true to make the starting point of the drag
        // be calculated from where the drag was triggered, not from where the touch started.
        // Useful to avoid a jerk-starting drag, which can make fine-adjustments
        // through dragging difficult, and be visually unappealing.
        correct_for_drag_min_distance : true,
        // set 0 for unlimited, but this can conflict with transform
        drag_max_touches  : 1,
        // prevent default browser behavior when dragging occurs
        // be careful with it, it makes the element a blocking element
        // when you are using the drag gesture, it is a good practice to set this true
        drag_block_horizontal   : false,
        drag_block_vertical     : false,
        // drag_lock_to_axis keeps the drag gesture on the axis that it started on,
        // It disallows vertical directions if the initial direction was horizontal, and vice versa.
        drag_lock_to_axis       : false,
        // drag lock only kicks in when distance > drag_lock_min_distance
        // This way, locking occurs only when the distance has become large enough to reliably determine the direction
        drag_lock_min_distance : 25
    },
    triggered: false,
    handler: function dragGesture(ev, inst) {
        // current gesture isnt drag, but dragged is true
        // this means an other gesture is busy. now call dragend
        if(Hammer.detection.current.name != this.name && this.triggered) {
            inst.trigger(this.name +'end', ev);
            this.triggered = false;
            return;
        }

        // max touches
        if(inst.options.drag_max_touches > 0 &&
            ev.touches.length > inst.options.drag_max_touches) {
            return;
        }

        switch(ev.eventType) {
            case Hammer.EVENT_START:
                this.triggered = false;
                break;

            case Hammer.EVENT_MOVE:
                // when the distance we moved is too small we skip this gesture
                // or we can be already in dragging
                if(ev.distance < inst.options.drag_min_distance &&
                    Hammer.detection.current.name != this.name) {
                    return;
                }

                // we are dragging!
                if(Hammer.detection.current.name != this.name) {
                    Hammer.detection.current.name = this.name;
                    if (inst.options.correct_for_drag_min_distance) {
                        // When a drag is triggered, set the event center to drag_min_distance pixels from the original event center.
                        // Without this correction, the dragged distance would jumpstart at drag_min_distance pixels instead of at 0.
                        // It might be useful to save the original start point somewhere
                        var factor = Math.abs(inst.options.drag_min_distance/ev.distance);
                        Hammer.detection.current.startEvent.center.pageX += ev.deltaX * factor;
                        Hammer.detection.current.startEvent.center.pageY += ev.deltaY * factor;

                        // recalculate event data using new start point
                        ev = Hammer.detection.extendEventData(ev);
                    }
                }

                // lock drag to axis?
                if(Hammer.detection.current.lastEvent.drag_locked_to_axis || (inst.options.drag_lock_to_axis && inst.options.drag_lock_min_distance<=ev.distance)) {
                    ev.drag_locked_to_axis = true;
                }
                var last_direction = Hammer.detection.current.lastEvent.direction;
                if(ev.drag_locked_to_axis && last_direction !== ev.direction) {
                    // keep direction on the axis that the drag gesture started on
                    if(Hammer.utils.isVertical(last_direction)) {
                        ev.direction = (ev.deltaY < 0) ? Hammer.DIRECTION_UP : Hammer.DIRECTION_DOWN;
                    }
                    else {
                        ev.direction = (ev.deltaX < 0) ? Hammer.DIRECTION_LEFT : Hammer.DIRECTION_RIGHT;
                    }
                }

                // first time, trigger dragstart event
                if(!this.triggered) {
                    inst.trigger(this.name +'start', ev);
                    this.triggered = true;
                }

                // trigger normal event
                inst.trigger(this.name, ev);

                // direction event, like dragdown
                inst.trigger(this.name + ev.direction, ev);

                // block the browser events
                if( (inst.options.drag_block_vertical && Hammer.utils.isVertical(ev.direction)) ||
                    (inst.options.drag_block_horizontal && !Hammer.utils.isVertical(ev.direction))) {
                    ev.preventDefault();
                }
                break;

            case Hammer.EVENT_END:
                // trigger dragend
                if(this.triggered) {
                    inst.trigger(this.name +'end', ev);
                }

                this.triggered = false;
                break;
        }
    }
};


/**
 * Transform
 * User want to scale or rotate with 2 fingers
 * @events  transform, pinch, pinchin, pinchout, rotate
 */
Hammer.gestures.Transform = {
    name: 'transform',
    index: 45,
    defaults: {
        // factor, no scale is 1, zoomin is to 0 and zoomout until higher then 1
        transform_min_scale     : 0.01,
        // rotation in degrees
        transform_min_rotation  : 1,
        // prevent default browser behavior when two touches are on the screen
        // but it makes the element a blocking element
        // when you are using the transform gesture, it is a good practice to set this true
        transform_always_block  : false
    },
    triggered: false,
    handler: function transformGesture(ev, inst) {
        // current gesture isnt drag, but dragged is true
        // this means an other gesture is busy. now call dragend
        if(Hammer.detection.current.name != this.name && this.triggered) {
            inst.trigger(this.name +'end', ev);
            this.triggered = false;
            return;
        }

        // atleast multitouch
        if(ev.touches.length < 2) {
            return;
        }

        // prevent default when two fingers are on the screen
        if(inst.options.transform_always_block) {
            ev.preventDefault();
        }

        switch(ev.eventType) {
            case Hammer.EVENT_START:
                this.triggered = false;
                break;

            case Hammer.EVENT_MOVE:
                var scale_threshold = Math.abs(1-ev.scale);
                var rotation_threshold = Math.abs(ev.rotation);

                // when the distance we moved is too small we skip this gesture
                // or we can be already in dragging
                if(scale_threshold < inst.options.transform_min_scale &&
                    rotation_threshold < inst.options.transform_min_rotation) {
                    return;
                }

                // we are transforming!
                Hammer.detection.current.name = this.name;

                // first time, trigger dragstart event
                if(!this.triggered) {
                    inst.trigger(this.name +'start', ev);
                    this.triggered = true;
                }

                inst.trigger(this.name, ev); // basic transform event

                // trigger rotate event
                if(rotation_threshold > inst.options.transform_min_rotation) {
                    inst.trigger('rotate', ev);
                }

                // trigger pinch event
                if(scale_threshold > inst.options.transform_min_scale) {
                    inst.trigger('pinch', ev);
                    inst.trigger('pinch'+ ((ev.scale < 1) ? 'in' : 'out'), ev);
                }
                break;

            case Hammer.EVENT_END:
                // trigger dragend
                if(this.triggered) {
                    inst.trigger(this.name +'end', ev);
                }

                this.triggered = false;
                break;
        }
    }
};


    module.exports = Hammer;
  
});
;define('subway:static/js/libs/svg.js', function (require, exports, module) {

  var SVG = this.SVG = function(element) {
    if (SVG.supported)
      return new SVG.Doc(element)
  }
  
  // Default namespaces
  SVG.ns = 'http://www.w3.org/2000/svg'
  SVG.xlink = 'http://www.w3.org/1999/xlink'
  
  // Element id sequence
  SVG.did  = 1000
  
  // Get next named element id
  SVG.eid = function(name) {
    return 'svgjs' + name.charAt(0).toUpperCase() + name.slice(1) + (SVG.did++)
  }
  
  // Method for element creation
  SVG.create = function(name) {
    /* create element */
    var element = document.createElementNS(this.ns, name)
    
    /* apply unique id */
    element.setAttribute('id', this.eid(name))
    
    return element
  }
  
  // Method for extending objects
  SVG.extend = function() {
    var modules, methods, key, i
    
    /* get list of modules */
    modules = [].slice.call(arguments)
    
    /* get object with extensions */
    methods = modules.pop()
    
    for (i = modules.length - 1; i >= 0; i--)
      if (modules[i])
        for (key in methods)
          modules[i].prototype[key] = methods[key]
  }
  
  // Method for getting an eleemnt by id
  SVG.get = function(id) {
    var node = document.getElementById(id)
    if (node) return node.instance
  }
  
  // svg support test
  SVG.supported = (function() {
    return !! document.createElementNS &&
           !! document.createElementNS(SVG.ns,'svg').createSVGRect
  })()
  
  if (!SVG.supported) return false

  SVG.regex = {
    /* test a given value */
    test: function(value, test) {
      return this[test].test(value)
    }
    
    /* parse unit value */
  , unit:         /^(-?[\d\.]+)([a-z%]{0,2})$/
    
    /* parse rgb value */
  , rgb:          /rgb\((\d+),(\d+),(\d+)\)/
  
    /* test rgb value */
  , isRgb:        /^rgb\(/
    
    /* test css declaration */
  , isCss:        /[^:]+:[^;]+;?/
    
    /* test css property */
  , isStyle:      /^font|text|leading|cursor/
    
    /* test for blank string */
  , isBlank:      /^(\s+)?$/
    
    /* test for numeric string */
  , isNumber:     /^-?[\d\.]+$/
    
  }

  SVG.defaults = {
    // Default matrix
    matrix:       '1,0,0,1,0,0'
    
    // Default attribute values
  , attrs: {
      /* fill and stroke */
      'fill-opacity':   1
    , 'stroke-opacity': 1
    , 'stroke-width':   0
    , fill:       '#000'
    , stroke:     '#000'
    , opacity:    1
      /* position */
    , x:          0
    , y:          0
    , cx:         0
    , cy:         0
      /* size */
    , width:      0
    , height:     0
      /* radius */
    , r:          0
    , rx:         0
    , ry:         0
      /* gradient */
    , offset:     0
    }
    
    // Default transformation values
  , trans: function() {
      return {
        /* translate */
        x:        0
      , y:        0
        /* scale */
      , scaleX:   1
      , scaleY:   1
        /* matrix */
      , matrix:   this.matrix
      , a:        1
      , b:        0
      , c:        0
      , d:        1
      , e:        0
      , f:        0
      }
    }
    
  }

  SVG.Color = function(color) {
    var match
    
    /* initialize defaults */
    this.r = 0
    this.g = 0
    this.b = 0
    
    /* parse color */
    if (typeof color == 'string') {
      if (SVG.regex.isRgb.test(color)) {
        /* get rgb values */
        match = SVG.regex.rgb.exec(color.replace(/\s/g,''))
        
        /* parse numeric values */
        this.r = parseInt(match[1])
        this.g = parseInt(match[2])
        this.b = parseInt(match[3])
        
      }
    }
      
  }
  
  SVG.extend(SVG.Color, {
    // Default to hex conversion
    toString: function() {
      return this.toHex()
    }
    // Build hex value
  , toHex: function() {
      return '#'
        + this._compToHex(this.r)
        + this._compToHex(this.g)
        + this._compToHex(this.b)
    }
    // Private: component to hex value
  , _compToHex: function(comp) {
      var hex = comp.toString(16)
      return hex.length == 1 ? '0' + hex : hex
    }
    
  })
  
  // Test if given value is a color string
  SVG.Color.test = function(color) {
    color += ''
    return SVG.regex.isRgb.test(color)
  }
  
  // Test if given value is a rgb object
  SVG.Color.isRgb = function(color) {
    return color && typeof color.r == 'number'
  }
  
  SVG.ViewBox = function(element) {
    var x, y, width, height
      , box  = element.bbox()
      , view = (element.attr('viewBox') || '').match(/-?[\d\.]+/g)
    
    /* clone attributes */
    this.x      = box.x
    this.y      = box.y
    this.width  = element.node.clientWidth  || element.node.getBoundingClientRect().width
    this.height = element.node.clientHeight || element.node.getBoundingClientRect().height
    
    if (view) {
      /* get width and height from viewbox */
      x      = parseFloat(view[0])
      y      = parseFloat(view[1])
      width  = parseFloat(view[2])
      height = parseFloat(view[3])
      
      /* calculate zoom accoring to viewbox */
      this.zoom = ((this.width / this.height) > (width / height)) ?
        this.height / height :
        this.width  / width
  
      /* calculate real pixel dimensions on parent SVG.Doc element */
      this.x      = x
      this.y      = y
      this.width  = width
      this.height = height
    }
    
    /* ensure a default zoom value */
    this.zoom = this.zoom || 1
    
  }
  
  SVG.extend(SVG.ViewBox, {
    // Parse viewbox to string
    toString: function() {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
    }
    
  })

  SVG.BBox = function(element) {
    var box
    
    /* actual, native bounding box */
    try {
      box = element.node.getBBox()
    } catch(e) {
      box = {
        x:      element.node.clientLeft
      , y:      element.node.clientTop
      , width:  element.node.clientWidth
      , height: element.node.clientHeight
      }
    }
    
    /* include translations on x an y */
    this.x = box.x + element.trans.x
    this.y = box.y + element.trans.y
    
    /* plain width and height */
    this.width  = box.width  * element.trans.scaleX
    this.height = box.height * element.trans.scaleY
    
    /* add the center */
    this.cx = this.x + this.width / 2
    this.cy = this.y + this.height / 2
    
  }

  SVG.Element = function(node) {
    /* make stroke value accessible dynamically */
    this._stroke = SVG.defaults.attrs.stroke
    
    /* initialize style store */
    this.styles = {}
    
    /* initialize transformation store with defaults */
    this.trans = SVG.defaults.trans()
    
    /* keep reference to the element node */
    if (this.node = node) {
      this.type = node.nodeName
      this.node.instance = this
    }
  }
  
  //
  SVG.extend(SVG.Element, {
    // Move over x-axis
    x: function(x) {
      if (x) x /= this.trans.scaleX
      return this.attr('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      if (y) y /= this.trans.scaleY
      return this.attr('y', y)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
    }
    // Move element to given x and y values
  , move: function(x, y) {
      return this.x(x).y(y)
    }
    // Move element by its center
  , center: function(x, y) {
      return this.cx(x).cy(y)
    }
    // Set element size to given width and height
  , size: function(width, height) { 
      return this.attr({
        width:  width
      , height: height
      })
    }
    // Remove element
  , remove: function() {
      if (this.parent)
        this.parent.removeElement(this)
      
      return this
    }
    // Get parent document
  , doc: function(type) {
      return this._parent(type || SVG.Doc)
    }
    // Set svg element attribute
  , attr: function(a, v, n) {
      if (a == null) {
        /* get an object of attributes */
        a = {}
        v = this.node.attributes
        for (n = v.length - 1; n >= 0; n--)
          a[v[n].nodeName] = SVG.regex.test(v[n].nodeValue, 'isNumber') ? parseFloat(v[n].nodeValue) : v[n].nodeValue
        
        return a
        
      } else if (typeof a == 'object') {
        /* apply every attribute individually if an object is passed */
        for (v in a) this.attr(v, a[v])
        
      } else if (v === null) {
          /* remove value */
          this.node.removeAttribute(a)
        
      } else if (v == null) {
        /* act as a getter for style attributes */
        if (this._isStyle(a)) {
          return a == 'text' ?
                   this.content :
                 a == 'leading' && this.leading ?
                   this.leading() :
                   this.style(a)
        
        /* act as a getter if the first and only argument is not an object */
        } else {
          v = this.node.getAttribute(a)
          return v == null ? 
            SVG.defaults.attrs[a] :
          SVG.regex.test(v, 'isNumber') ?
            parseFloat(v) : v
        }
      
      } else if (a == 'style') {
        /* redirect to the style method */
        return this.style(v)
      
      } else {
        /* treat x differently on text elements */
        if (a == 'x' && Array.isArray(this.lines))
          for (n = this.lines.length - 1; n >= 0; n--)
            this.lines[n].attr(a, v)
        
        /* BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0 */
        if (a == 'stroke-width')
          this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
        else if (a == 'stroke')
          this._stroke = v
        
        /* ensure hex color */
        if (SVG.Color.test(v) || SVG.Color.isRgb(v))
          v = new SVG.Color(v).toHex()
          
        /* set give attribute on node */
        n != null ?
          this.node.setAttributeNS(n, a, v.toString()) :
          this.node.setAttribute(a, v.toString())
        
        /* if the passed argument belongs in the style as well, add it there */
        if (this._isStyle(a)) {
          a == 'text' ?
            this.text(v) :
          a == 'leading' && this.leading ?
            this.leading(v) :
            this.style(a, v)
          
          /* rebuild if required */
          if (this.rebuild)
            this.rebuild(a, v)
        }
      }
      
      return this
    }
    // Manage transformations
  , transform: function(o, v) {
      if (arguments.length == 0) {
        /* act as a getter if no argument is given */
        return this.trans
        
      } else if (typeof o === 'string') {
        /* act as a getter if only one string argument is given */
        if (arguments.length < 2)
          return this.trans[o]
        
        /* apply transformations as object if key value arguments are given*/
        var transform = {}
        transform[o] = v
        
        return this.transform(transform)
      }
      
      /* ... otherwise continue as a setter */
      var transform = []
      
      /* parse matrix */
      o = this._parseMatrix(o)
      
      /* merge values */
      for (v in o)
        if (o[v] != null)
          this.trans[v] = o[v]
      
      /* compile matrix */
      this.trans.matrix = this.trans.a
                  + ',' + this.trans.b
                  + ',' + this.trans.c
                  + ',' + this.trans.d
                  + ',' + this.trans.e
                  + ',' + this.trans.f
      
      /* alias current transformations */
      o = this.trans
      
      /* add matrix */
      if (o.matrix != SVG.defaults.matrix)
        transform.push('matrix(' + o.matrix + ')')
      
      /* add scale */
      if (o.scaleX != 1 || o.scaleY != 1)
        transform.push('scale(' + o.scaleX + ',' + o.scaleY + ')')
      
      /* add translation */
      if (o.x != 0 || o.y != 0)
        transform.push('translate(' + o.x / o.scaleX + ',' + o.y / o.scaleY + ')')
      
      /* add offset translation */
       if (this._offset && this._offset.x != 0 && this._offset.y != 0)
         transform.push('translate(' + (-this._offset.x) + ',' + (-this._offset.y) + ')')
      
      /* update transformations, even if there are none */
      if (transform.length == 0)
        this.node.removeAttribute('transform')
      else
        this.node.setAttribute('transform', transform.join(' '))
      
      return this
    }
    // Dynamic style generator
  , style: function(s, v) {
      if (arguments.length == 0) {
        /* get full style */
        return this.attr('style') || ''
      
      } else if (arguments.length < 2) {
        /* apply every style individually if an object is passed */
        if (typeof s == 'object') {
          for (v in s) this.style(v, s[v])
        
        } else if (SVG.regex.isCss.test(s)) {
          /* parse css string */
          s = s.split(';')
  
          /* apply every definition individually */
          for (var i = 0; i < s.length; i++) {
            v = s[i].split(':')
  
            if (v.length == 2)
              this.style(v[0].replace(/\s+/g, ''), v[1].replace(/^\s+/,'').replace(/\s+$/,''))
          }
        } else {
          /* act as a getter if the first and only argument is not an object */
          return this.styles[s]
        }
      
      } else if (v === null || SVG.regex.test(v, 'isBlank')) {
        /* remove value */
        delete this.styles[s]
        
      } else {
        /* store value */
        this.styles[s] = v
      }
      
      /* rebuild style string */
      s = ''
      for (v in this.styles)
        s += v + ':' + this.styles[v] + ';'
      
      /* apply style */
      if (s == '')
        this.node.removeAttribute('style')
      else
        this.node.setAttribute('style', s)
      
      return this
    }
    // Store data values on svg nodes
  , data: function(a, v, r) {
      if (arguments.length < 2) {
        try {
          return JSON.parse(this.attr('data-' + a))
        } catch(e) {
          return this.attr('data-' + a)
        }
        
      } else {
        this.attr(
          'data-' + a
        , v === null ?
            null :
          r === true || typeof v === 'string' || typeof v === 'number' ?
            v :
            JSON.stringify(v)
        )
      }
      
      return this
    }
    // Get bounding box
  , bbox: function() {
      return new SVG.BBox(this)
    }
    // Show element
  , show: function() {
      return this.style('display', '')
    }
    // Hide element
  , hide: function() {
      return this.style('display', 'none')
    }
    // Is element visible?
  , visible: function() {
      return this.style('display') != 'none'
    }
    // Return id on string conversion
  , toString: function() {
      return this.attr('id')
    }
    // Private: find svg parent by instance
  , _parent: function(parent) {
      var element = this
      
      while (element != null && !(element instanceof parent))
        element = element.parent
  
      return element
    }
    // Private: tester method for style detection
  , _isStyle: function(a) {
      return typeof a == 'string' ? SVG.regex.test(a, 'isStyle') : false
    }
    // Private: parse a matrix string
  , _parseMatrix: function(o) {
      if (o.matrix) {
        /* split matrix string */
        var m = o.matrix.replace(/\s/g, '').split(',')
        
        /* pasrse values */
        if (m.length == 6) {
          o.a = parseFloat(m[0])
          o.b = parseFloat(m[1])
          o.c = parseFloat(m[2])
          o.d = parseFloat(m[3])
          o.e = parseFloat(m[4])
          o.f = parseFloat(m[5])
        }
      }
      
      return o
    }
    
  })

  SVG.Container = function(element) {
    this.constructor.call(this, element)
  }
  
  // Inherit from SVG.Element
  SVG.Container.prototype = new SVG.Element
  
  //
  SVG.extend(SVG.Container, {
    // Returns all child elements
    children: function() {
      return this._children || (this._children = [])
    }
    // Add given element at a position
  , add: function(element, i) {
      if (!this.has(element)) {
        /* define insertion index if none given */
        i = i == null ? this.children().length : i
        
        /* remove references from previous parent */
        if (element.parent) {
          var index = element.parent.children().indexOf(element)
          element.parent.children().splice(index, 1)
        }
        
        /* add element references */
        this.children().splice(i, 0, element)
        this.node.insertBefore(element.node, this.node.childNodes[i] || null)
        element.parent = this
      }
      
      return this
    }
    // Basically does the same as `add()` but returns the added element instead
  , put: function(element, i) {
      this.add(element, i)
      return element
    }
    // Checks if the given element is a child
  , has: function(element) {
      return this.children().indexOf(element) >= 0
    }
    // Iterates over all children and invokes a given block
  , each: function(block) {
      var index,
          children = this.children()
    
      for (index = 0, length = children.length; index < length; index++)
        if (children[index] instanceof SVG.Shape)
          block.apply(children[index], [index, children])
    
      return this
    }
    // Remove a child element at a position
  , removeElement: function(element) {
      var i = this.children().indexOf(element)
  
      this.children().splice(i, 1)
      this.node.removeChild(element.node)
      element.parent = null
      
      return this
    }
    // Create a group element
  , group: function() {
      return this.put(new SVG.G)
    }
    // Create a rect element
  , rect: function(width, height) {
      return this.put(new SVG.Rect().size(width, height))
    }
    // Create circle element, based on ellipse
  , circle: function(size) {
      return this.ellipse(size, size)
    }
    // Create an ellipse
  , ellipse: function(width, height) {
      return this.put(new SVG.Ellipse().size(width, height).move(0, 0))
    }
    // Create a line element
  , line: function(x1, y1, x2, y2) {
      return this.put(new SVG.Line().plot(x1, y1, x2, y2))
    }
    // Create a wrapped polyline element
  , polyline: function(points, unbiased) {
      return this.put(new SVG.Polyline(unbiased)).plot(points)
    }
    // Create a wrapped path element
  , path: function(data, unbiased) {
      return this.put(new SVG.Path(unbiased)).plot(data)
    }
    // Create image element, load image and set its size
  , image: function(source, width, height) {
      width = width != null ? width : 100
      return this.put(new SVG.Image().load(source).size(width, height != null ? height : width))
    }
    // Create text element
  , text: function(text) {
      return this.put(new SVG.Text().text(text))
    }
    // Get the viewBox and calculate the zoom value
  , viewbox: function(v) {
      if (arguments.length == 0)
        /* act as a getter if there are no arguments */
        return new SVG.ViewBox(this)
      
      /* otherwise act as a setter */
      v = arguments.length == 1 ?
        [v.x, v.y, v.width, v.height] :
        [].slice.call(arguments)
      
      return this.attr('viewBox', v.join(' '))
    }
    // Remove all elements in this container
  , clear: function() {
      /* remove children */
      for (var i = this.children().length - 1; i >= 0; i--)
        this.removeElement(this.children()[i])
            
      return this
    }
    
  })

  ;[  'click'
    , 'dblclick'
    , 'mousedown'
    , 'mouseup'
    , 'mouseover'
    , 'mouseout'
    , 'mousemove'
    , 'mouseenter'
    , 'mouseleave'
    , 'touchstart'
    , 'touchend'
    , 'touchmove'
    , 'touchcancel' ].forEach(function(event) {
    
    /* add event to SVG.Element */
    SVG.Element.prototype[event] = function(f) {
      var self = this
      
      /* bind event to element rather than element node */
      this.node['on' + event] = typeof f == 'function' ?
        function() { return f.apply(self, arguments) } : null
      
      return this
    }
    
  })
  
  // Add event binder in the SVG namespace
  SVG.on = function(node, event, listener) {
    if (node.addEventListener)
      node.addEventListener(event, listener, false)
    else
      node.attachEvent('on' + event, listener)
  }
  
  // Add event unbinder in the SVG namespace
  SVG.off = function(node, event, listener) {
    if (node.removeEventListener)
      node.removeEventListener(event, listener, false)
    else
      node.detachEvent('on' + event, listener)
  }
  
  //
  SVG.extend(SVG.Element, {
    // Bind given event to listener
    on: function(event, listener) {
      SVG.on(this.node, event, listener)
      
      return this
    }
    // Unbind event from listener
  , off: function(event, listener) {
      SVG.off(this.node, event, listener)
      
      return this
    }
  })

  SVG.G = function() {
    this.constructor.call(this, SVG.create('g'))
  }
  
  // Inherit from SVG.Container
  SVG.G.prototype = new SVG.Container
  
  SVG.extend(SVG.G, {
    // Move over x-axis
    x: function(x) {
      return x == null ? this.trans.x : this.transform('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.trans.y : this.transform('y', y)
    }

  })

  SVG.Doc = function(element) {
    /* ensure the presence of a html element */
    this.parent = typeof element == 'string' ?
      document.getElementById(element) :
      element
    
    /* If the target is an svg element, use that element as the main wrapper.
       This allows svg.js to work with svg documents as well. */
    this.constructor
      .call(this, this.parent.nodeName == 'svg' ? this.parent : SVG.create('svg'))
    
    /* set svg element attributes */
    this
      .attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' })
      .attr('xlink', SVG.xlink, SVG.ns)
    
    /* ensure correct rendering */
    if (this.parent.nodeName != 'svg')
      this.stage()
  }
  
  // Inherits from SVG.Container
  SVG.Doc.prototype = new SVG.Container
  
  
  SVG.extend(SVG.Doc, {
    // Hack for safari preventing text to be rendered in one line.
    // Basically it sets the position of the svg node to absolute
    // when the dom is loaded, and resets it to relative a few milliseconds later.
    // It also handles sub-pixel offset rendering properly.
    stage: function() {
      var check
        , element = this
        , wrapper = document.createElement('div')
  
      /* set temporary wrapper to position relative */
      wrapper.style.cssText = 'position:relative;height:100%;'
  
      /* put element into wrapper */
      element.parent.appendChild(wrapper)
      wrapper.appendChild(element.node)
  
      /* check for dom:ready */
      check = function() {
        if (document.readyState === 'complete') {
          element.style('position:absolute;')
          setTimeout(function() {
            /* set position back to relative */
            element.style('position:relative;')
  
            /* remove temporary wrapper */
            element.parent.removeChild(element.node.parentNode)
            element.node.parentNode.removeChild(element.node)
            element.parent.appendChild(element.node)
  
            /* after wrapping is done, fix sub-pixel offset */
            element.fixSubPixelOffset()
            
            /* make sure sub-pixel offset is fixed every time the window is resized */
            SVG.on(window, 'resize', function() {
              element.fixSubPixelOffset()
            })
            
          }, 5)
        } else {
          setTimeout(check, 10)
        }
      }
  
      check()
  
      return this
    }
  
    // Fix for possible sub-pixel offset. See:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
  , fixSubPixelOffset: function() {
      var pos = this.node.getScreenCTM()
    
      this
        .style('left', (-pos.e % 1) + 'px')
        .style('top',  (-pos.f % 1) + 'px')
    }
    
  })


  SVG.Shape = function(element) {
    this.constructor.call(this, element)
  }
  
  // Inherit from SVG.Element
  SVG.Shape.prototype = new SVG.Element

  SVG.Rect = function() {
    this.constructor.call(this, SVG.create('rect'))
  }
  
  // Inherit from SVG.Shape
  SVG.Rect.prototype = new SVG.Shape

  SVG.Ellipse = function() {
    this.constructor.call(this, SVG.create('ellipse'))
  }
  
  // Inherit from SVG.Shape
  SVG.Ellipse.prototype = new SVG.Shape
  
  //
  SVG.extend(SVG.Ellipse, {
    // Move over x-axis
    x: function(x) {
      return x == null ? this.cx() - this.attr('rx') : this.cx(x + this.attr('rx'))
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.cy() - this.attr('ry') : this.cy(y + this.attr('ry'))
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.attr('cx') : this.attr('cx', x / this.trans.scaleX)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.attr('cy') : this.attr('cy', y / this.trans.scaleY)
    }
    // Custom size function
  , size: function(width, height) {
      return this.attr({
        rx: width / 2,
        ry: height / 2
      })
    }
    
  })
  
  SVG.Line = function() {
    this.constructor.call(this, SVG.create('line'))
  }
  
  // Inherit from SVG.Shape
  SVG.Line.prototype = new SVG.Shape
  
  // Add required methods
  SVG.extend(SVG.Line, {
    // Move over x-axis
    x: function(x) {
      var b = this.bbox()
      
      return x == null ? b.x : this.attr({
        x1: this.attr('x1') - b.x + x
      , x2: this.attr('x2') - b.x + x
      })
    }
    // Move over y-axis
  , y: function(y) {
      var b = this.bbox()
      
      return y == null ? b.y : this.attr({
        y1: this.attr('y1') - b.y + y
      , y2: this.attr('y2') - b.y + y
      })
    }
    // Move by center over x-axis
  , cx: function(x) {
      var half = this.bbox().width / 2
      return x == null ? this.x() + half : this.x(x - half)
    }
    // Move by center over y-axis
  , cy: function(y) {
      var half = this.bbox().height / 2
      return y == null ? this.y() + half : this.y(y - half)
    }
    // Set line size by width and height
  , size: function(width, height) {
      var b = this.bbox()
      
      return this
        .attr(this.attr('x1') < this.attr('x2') ? 'x2' : 'x1', b.x + width)
        .attr(this.attr('y1') < this.attr('y2') ? 'y2' : 'y1', b.y + height)
    }
    // Set path data
  , plot: function(x1, y1, x2, y2) {
      return this.attr({
        x1: x1
      , y1: y1
      , x2: x2
      , y2: y2
      })
    }
    
  })


  SVG.Polyline = function() {
    this.constructor.call(this, SVG.create('polyline'))
  }
  
  // Inherit from SVG.Shape
  SVG.Polyline.prototype = new SVG.Shape
  
  SVG.Path = function(unbiased) {
    this.constructor.call(this, SVG.create('path'))
    
    this.unbiased = !!unbiased
  }
  
  // Inherit from SVG.Shape
  SVG.Path.prototype = new SVG.Shape
  
  SVG.extend(SVG.Path, {
    // Private: Native plot
    _plot: function(data) {
      return this.attr('d', data || 'M0,0')
    }
    
  })

  SVG.extend(SVG.Polyline, SVG.Path, {
    // Move over x-axis
    x: function(x) {
      return x == null ? this.bbox().x : this.transform('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.bbox().y : this.transform('y', y)
    }
    // Set the actual size in pixels
  , size: function(width, height) {
      var scale = width / this._offset.width
      
      return this.transform({
        scaleX: scale
      , scaleY: height != null ? height / this._offset.height : scale
      })
    }
    // Set path data
  , plot: function(data) {
      var x = this.trans.scaleX
        , y = this.trans.scaleY
      
      /* native plot */
      this._plot(data)
      
      /* store offset */
      this._offset = this.transform({ scaleX: 1, scaleY: 1 }).bbox()
      
      /* get and store the actual offset of the element */
      if (this.unbiased) {
        this._offset.x = this._offset.y = 0
      } else {
        this._offset.x -= this.trans.x
        this._offset.y -= this.trans.y
      }
      
      return this.transform({ scaleX: x, scaleY: y })
    }
    
  })

  SVG.Image = function() {
    this.constructor.call(this, SVG.create('image'))
  }
  
  // Inherit from SVG.Element
  SVG.Image.prototype = new SVG.Shape
  
  SVG.extend(SVG.Image, {
    
    // (re)load image
    load: function(url) {
      return (url ? this.attr('href', (this.src = url), SVG.xlink) : this)
    }
    
  })

  var _styleAttr = ('size family weight stretch variant style').split(' ')
  
  SVG.Text = function() {
    this.constructor.call(this, SVG.create('text'))
    
    /* define default style */
    this.styles = {
      'font-size':    16
    , 'font-family':  'Helvetica, Arial, sans-serif'
    , 'text-anchor':  'start'
    }
    
    this._leading = 1.2
    this._base = 0.276666666
  }
  
  // Inherit from SVG.Element
  SVG.Text.prototype = new SVG.Shape
  
  SVG.extend(SVG.Text, {
    // Move over x-axis
    x: function(x, a) {
      /* act as getter */
      if (x == null) return a ? this.attr('x') : this.bbox().x
      
      /* set x taking anchor in mind */
      if (!a) {
        a = this.style('text-anchor')
        x = a == 'start' ? x : a == 'end' ? x + this.bbox().width : x + this.bbox().width / 2
      }
      
      return this.attr('x', x)
    }
    // Move center over x-axis
  , cx: function(x, a) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
    }
    // Move center over y-axis
  , cy: function(y, a) {
      return y == null ? this.bbox().cy : this.y(a ? y : y - this.bbox().height / 2)
    }
    // Move element to given x and y values
  , move: function(x, y, a) {
      return this.x(x, a).y(y)
    }
    // Move element by its center
  , center: function(x, y, a) {
      return this.cx(x, a).cy(y, a)
    }
    // Set the text content
  , text: function(text) {
      /* act as getter */
      if (text == null)
        return this.content
      
      /* remove existing lines */
      this.clear()
      
      /* update the content */
      this.content = SVG.regex.isBlank.test(text) ? 'text' : text
      
      var i, il
        , lines = text.split('\n')
      
      /* build new lines */
      for (i = 0, il = lines.length; i < il; i++)
        this.tspan(lines[i])
        
      return this.attr('textLength', 1).attr('textLength', null)
    }
    // Create a tspan
  , tspan: function(text) {
      var tspan = new SVG.TSpan().text(text)
      
      /* add new tspan */
      this.node.appendChild(tspan.node)
      this.lines.push(tspan)
      
      return tspan.attr('style', this.style())
    }
    // Set font size
  , size: function(size) {
      return this.attr('font-size', size)
    }
    // Set / get leading
  , leading: function(value) {
      /* act as getter */
      if (value == null)
        return this._leading
      
      /* act as setter */
      this._leading = value
      
      return this.rebuild('leading', value)
    }
    // rebuild appearance type
  , rebuild: function() {
      var i, il
        , size = this.styles['font-size']
      
      /* define position of all lines */
      for (i = 0, il = this.lines.length; i < il; i++)
        this.lines[i].attr({
          dy: size * this._leading - (i == 0 ? size * this._base : 0)
        , x: (this.attr('x') || 0)
        , style: this.style()
        })
      
      return this
    }
    // Clear all lines
  , clear: function() {
      /* remove existing child nodes */
      while (this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild)
      
      this.lines = []
      
      return this
    }
    
  })
  
  // tspan class
  SVG.TSpan = function() {
    this.constructor.call(this, SVG.create('tspan'))
  }
  
  // Inherit from SVG.Shape
  SVG.TSpan.prototype = new SVG.Shape
  
  // Include the container object
  SVG.extend(SVG.TSpan, {
    // Set text content
    text: function(text) {
      this.node.appendChild(document.createTextNode(text))
      
      return this
    }
    
  })

  SVG.Nested = function() {
    this.constructor.call(this, SVG.create('svg'))
    
    this.style('overflow', 'visible')
  }
  
  // Inherit from SVG.Container
  SVG.Nested.prototype = new SVG.Container

  SVG._stroke = ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
  SVG._fill   = ['color', 'opacity', 'rule']
  
  
  // Prepend correct color prefix
  var _colorPrefix = function(type, attr) {
    return attr == 'color' ? type : type + '-' + attr
  }
  
  /* Add sugar for fill and stroke */
  ;['fill', 'stroke'].forEach(function(method) {
    var extension = {}
    
    extension[method] = function(o) {
      var indexOf
      
      if (typeof o == 'string' || SVG.Color.isRgb(o))
        this.attr(method, o)
      
      else
        /* set all attributes from _fillAttr and _strokeAttr list */
        for (index = SVG['_' + method].length - 1; index >= 0; index--)
          if (o[SVG['_' + method][index]] != null)
            this.attr(_colorPrefix(method, SVG['_' + method][index]), o[SVG['_' + method][index]])
      
      return this
    }
    
    SVG.extend(SVG.Shape, extension)
    
  })
  
  SVG.extend(SVG.Element, {
    // Scale
    scale: function(x, y) {
      return this.transform({
        scaleX: x,
        scaleY: y == null ? x : y
      })
    }
    // Matrix
  , matrix: function(m) {
      return this.transform({ matrix: m })
    }
    // Opacity
  , opacity: function(value) {
      return this.attr('opacity', value)
    }
  
  })
  
  
  if (SVG.Text) {
    SVG.extend(SVG.Text, {
      // Set font 
      font: function(o) {
        for (var key in o)
          key == 'anchor' ?
            this.attr('text-anchor', o[key]) :
          _styleAttr.indexOf(key) > -1 ?
            this.attr('font-'+ key, o[key]) :
            this.attr(key, o[key])
        
        return this
      }
      
    })
  }

  module.exports = SVG;
  
});
;/**
 * @file XMLDocumentParser，XML数据解析
 */
var Station = require('subway:static/js/base/station.js'),
    Line = require('subway:static/js/base/line.js'),
    Subway = require('subway:static/js/base/subway.js');

define('subway:static/js/parser/xmldocumentparser.js', function (require, exports, module) {

    var XMLDocumentParser = function(xmlDoc, transformScale) {
        this.xmlDoc = xmlDoc;

        /**
         * 地图放大系数，默认1.3；
         * @type {Float}
         */
        this.transformScale = transformScale || 1.3;

        this.marginRatio = 1.1;
    };

    XMLDocumentParser.prototype.parse = function() {
        if (!this.xmlDoc) {
            return null;
        }

        var subwayXMLDoc = this.xmlDoc.getElementsByTagName("sw")[0]; // 获取根要素；
        var subway = this.parseSubway(subwayXMLDoc);
        var bounds = {
            left: Number.POSITIVE_INFINITY,
            right:  Number.NEGATIVE_INFINITY,
            top:  Number.POSITIVE_INFINITY,
            bottom: Number.NEGATIVE_INFINITY
        };
        var n1, n2, n3, n4;
        var lines = [];
        var linesXMLDoc = this.xmlDoc.getElementsByTagName("l"); // 获取线路；
        for (var i = 0; i < linesXMLDoc.length; i++) {
            var line = this.parseLine(linesXMLDoc[i]);
            var stations = [];
            var stationsXMLDoc = linesXMLDoc[i].getElementsByTagName("p"); // 获取站点；
            for (var j = 0; j < stationsXMLDoc.length; j++) {
                var station = this.parseStation(stationsXMLDoc[j]);
                // 增加Station的lid属性；
                station.lid = line.lid;

                if (station.x < bounds.left) {
                    bounds.left = station.x;
                    n1 = station.sid;
                }
                if (station.x > bounds.right) {
                    bounds.right = station.x;
                    n2 = station.sid;
                }
                if (station.y < bounds.top) {
                    bounds.top = station.y;
                    n3 = station.sid;
                }
                if (station.y > bounds.bottom) {
                    bounds.bottom = station.y;
                    n4 = station.sid;
                }
                stations.push(station);
            }
            line.stations = stations;
            lines.push(line);
        }

        var offset_x = (bounds.left * this.marginRatio) >> 0,
            offset_y = (bounds.top * this.marginRatio) >> 0;

        for (var x = 0; x < lines.length; x++) {
            var _line = lines[x];
            _line.lbx -= offset_x;
            _line.lby -= offset_y;

            for (var y = 0; y < _line.stations.length; y++) {
                var _station = _line.stations[y];
                _station.x -= offset_x;
                _station.y -= offset_y;
                _station.lc = _line.lc; // 赋值线路的标识色值
            }
        }

        subway.bounds = bounds;
        subway.lines = lines;
        subway.width = (Math.abs(bounds.left - bounds.right) * this.marginRatio) >> 0;
        subway.height = (Math.abs(bounds.bottom - bounds.top) * this.marginRatio) >> 0;

        return subway;
    };

    /**
     * 解析单个城市XMLDocument数据；
     * @type {XMLDocument} XML文档对象；
     * @return {Station} 城市地铁对象；
     */
    XMLDocumentParser.prototype.parseSubway = function(xmlDoc) {
        var shortName = xmlDoc.getAttribute("c");
        var fullName = xmlDoc.getAttribute("cid");
        var lines_number = xmlDoc.getAttribute("n");
        return new Subway(shortName, fullName, lines_number);
    };

    /**
     * 解析单条线路XMLDocument数据；
     * @type {XMLDocument} XML文档对象；
     * @return {Station} 线路；
     */
    XMLDocumentParser.prototype.parseLine = function(xmlDoc) {
        var name = xmlDoc.getAttribute("lid");
        var label = xmlDoc.getAttribute("lb");
        var label_abbr = xmlDoc.getAttribute("slb");
        var uid = xmlDoc.getAttribute("uid");
        var station_number = parseInt(xmlDoc.getAttribute("n"), 10) ;
        var loop = (xmlDoc.getAttribute("loop") == "true");
        var label_px = parseFloat(xmlDoc.getAttribute("lbx")) * this.transformScale;
        var label_py = parseFloat(xmlDoc.getAttribute("lby")) * this.transformScale + 15 * this.transformScale;
        var label_rotate = parseFloat(xmlDoc.getAttribute("lbr"));
        var label_color = "#" + xmlDoc.getAttribute("lc").slice(2);

        return new Line(name, label, label_abbr, uid, station_number, loop, label_px, label_py, label_rotate, label_color);
    };

    /**
     * 解析单个站点XMLDocument数据；
     * @type {XMLDocument} XML文档对象；
     * @return {Station} 站点；
     */
    XMLDocumentParser.prototype.parseStation = function(xmlDoc) {
        var name = xmlDoc.getAttribute("sid");
        var label = xmlDoc.getAttribute("lb");
        var uid = xmlDoc.getAttribute("uid");
        var lon = parseFloat(xmlDoc.getAttribute("px"));
        var lat = parseFloat(xmlDoc.getAttribute("py"));
        var px = parseFloat(xmlDoc.getAttribute("x")) * this.transformScale;
        var py = parseFloat(xmlDoc.getAttribute("y")) * this.transformScale;
        var rx = parseFloat(xmlDoc.getAttribute("rx")) * this.transformScale + 2 * this.transformScale;
        var ry = parseFloat(xmlDoc.getAttribute("ry")) * this.transformScale + 12 * this.transformScale;
        var isStation = (xmlDoc.getAttribute("st") == "true");
        var isTransferStation = (xmlDoc.getAttribute("ex") == "true");
        var isVisible = (xmlDoc.getAttribute("iu") == "true");
        var isRoundCorner = (xmlDoc.getAttribute("rc") == "true"); // 同样用于判断是否绘制，或设置绘制参数；
        var slb = (xmlDoc.getAttribute("slb") == "true"); // 未知
        var lines_name = xmlDoc.getAttribute("ln"); // 同sid值一致；
        var label_icon = xmlDoc.getAttribute("icon") || "";
        var offset_px = parseFloat(xmlDoc.getAttribute("dx")) * this.transformScale; // 暂时无用，使用trsOffset_px代替；
        var offset_py = parseFloat(xmlDoc.getAttribute("dy")) * this.transformScale; // 暂时无用，使用trsOffset_py代替；
        var trsOffset_px = 0;
        var trsOffset_py = 0;
        try {
            trsOffset_px = parseFloat(xmlDoc.getAttribute("trs_x")) * this.transformScale || 0; // 并行线路之间的中转站点图标的绘制偏移量
            trsOffset_py = parseFloat(xmlDoc.getAttribute("trs_y")) * this.transformScale || 0;
        } catch (e) {}
        trsOffset_px -= 8 * this.transformScale;
        trsOffset_py -= 8 * this.transformScale;
        var label_color; // 未定义则使用线路颜色；
        return new Station(name, label, uid, lon, lat, px, py, rx, ry, isStation, isTransferStation, isVisible, isRoundCorner, slb, lines_name, label_color, label_icon, offset_px, offset_py, trsOffset_px, trsOffset_py);
    };

    module.exports = XMLDocumentParser;

});
;/**
 * @file 用来解析地铁专题图使用的json数据
 */
var Station = require('subway:static/js/base/station.js'),
    Line = require('subway:static/js/base/line.js'),
    Subway = require('subway:static/js/base/subway.js');

define('subway:static/js/parser/jsonparser.js', function (require, exports, module) {
    var JSONParser = function(data) {
        this.data = data;
    };

    JSONParser.prototype.parse = function() {
        if (!this.data) {
            return null;
        }

        var subway = new Subway();
        var ds = this.data;
        for (var x in ds) {
            if (x.toLowerCase() == "lines") {
                var ll = ds[x];
                for (var i = 0; i < ll.length; i++) {
                    var l = ll[i];
                    var line = new Line();
                    for (var y in l) {
                        if (y.toLowerCase() == "stations") {
                            var ss = l[y];
                            for (var j = 0; j < ss.length; j++) {
                                var s = ss[j];
                                var station = new Station();
                                for (var z in s) {
                                    station[z] = s[z];
                                }
                                line.stations.push(station);
                            }
                        } else {
                            line[y] = l[y];
                        }
                    }
                    subway.lines.push(line);
                }
            } else {
                subway[x] = ds[x];
            }
        }

        return subway;
    };

    module.exports = JSONParser;

});
;/*
 * @file 地铁专题图model
 * author: shengxuanwei
 * date: 2013-09-22
 */

var util = require('common:static/js/util.js'),
    storage = require('common:static/js/localstorage.js');

define('subway:static/js/model/subway.js', function (require, exports, module) {

    module.exports = {

        // 这里再静态化一遍是为了接入cdn服务
        // 所以，以后增加城市也需要修改两处
        xmlUri: {
            "beijing"   : '/mobile/simple' + '/static/xml/sw_beijing_3db40b5.xml',
            "shanghai"  : '/mobile/simple' + '/static/xml/sw_shanghai_abef9f3.xml',
            "guangzhou" : '/mobile/simple' + '/static/xml/sw_guangzhou_58fcf90.xml',
            "shenzhen"  : '/mobile/simple' + '/static/xml/sw_shenzhen_d6e0794.xml',
            "hongkong"  : '/mobile/simple' + '/static/xml/sw_hongkong_fc52034.xml',
            "chengdu"   : '/mobile/simple' + '/static/xml/sw_chengdu_9c08b66.xml',
            "changchun" : '/mobile/simple' + '/static/xml/sw_changchun_f1dbec8.xml',
            "chongqing" : '/mobile/simple' + '/static/xml/sw_chongqing_5aa9c12.xml',
            "dalian"    : '/mobile/simple' + '/static/xml/sw_dalian_16d8619.xml',
            "foshan"    : '/mobile/simple' + '/static/xml/sw_foshan_dfcce58.xml',
            "hangzhou"  : '/mobile/simple' + '/static/xml/sw_hangzhou_0d7c1c2.xml',
            "kunming"   : '/mobile/simple' + '/static/xml/sw_kunming_103c320.xml',
            "nanjing"   : '/mobile/simple' + '/static/xml/sw_nanjing_1b719c9.xml',
            "shenyang"  : '/mobile/simple' + '/static/xml/sw_shenyang_355b1d5.xml',
            "suzhou"    : '/mobile/simple' + '/static/xml/sw_suzhou_7243dc9.xml',
            "tianjin"   : '/mobile/simple' + '/static/xml/sw_tianjin_5f0563f.xml',
            "wuhan"     : '/mobile/simple' + '/static/xml/sw_wuhan_05d27fa.xml',
            "xian"      : '/mobile/simple' + '/static/xml/sw_xian_c73e136.xml',
            "haerbin"   : '/mobile/simple' + '/static/xml/sw_haerbin_91c1e15.xml'
        },

        imageDataEncoded: {
            // 换乘站icon
            "transfer": "data:image/png;base64,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",

            // 机场icon
            "airport": "data:image/png;base64,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"
        },

        imageDataLoadedLength: 2, // 目前只有transfer和airport

        cityCode: '',

        cityName: '',

        fileName: '',

        fetch: function(opts, successCallback, failureCallback) {
            var self = this;

            // 将之前init函数方法耦合在fetch方法
            this.imageData = [];
            this.imageDataLoaded = 0;
            for (var key in this.imageDataEncoded) {
                if (!this.imageData[key]) {
                    this.imageData[key] = new Image();
                    this.imageData[key].onload = function() {
                        self.imageData[key] = this;
                        self.imageDataLoaded ++;
                        if (self.imageDataLoaded === self.imageDataLoadedLength) {
                            self.onresourceload = true;
                            listener.trigger('subway', 'onresourceload');
                        }
                    };
                    this.imageData[key].src = this.imageDataEncoded[key];
                }
            }

            var city = opts.city || opts.c || opts.cc;
            var cityNode = this._checkIfSupportSubway(city);

            if (cityNode) {
                this.fileName = cityNode[0];
                this.cityName = cityNode[1];
                this.cityCode = cityNode[2];

                var fileName = this.fileName,
                    url = this.xmlUri[fileName],
                    fileNameRe = /.*\/(.*?)\.xml$/,
                    match,
                    key,
                    subway;

                // 如果能正确解析url，保存到localstorage
                if (fileNameRe.test(url)) {
                    match = url.match(fileNameRe);
                    if (match && match[1]) {
                        key = match[1];
                    }
                }

                self._getJSONOffline(key, function(data) {
                    subway = self._parseJSON(data);

                    subway.cityName = self.fileName;
                    subway.cityCode = self.cityCode;
                    subway.imageData = self.imageData;
                    subway.imageDataEncoded = self.imageDataEncoded;

                    self.subway = subway;

                    successCallback && successCallback(subway);
                }, function() {
                    // 如果线上获取数据，则先优先清空在localStorage保存的数据
                    try {
                        if (localStorage) {
                            var strKey,
                                strKeyRe = new RegExp('sw_' + fileName + '.*');
                            for (var i = 0, l = localStorage.length; i < l; i++) {
                                strKey = localStorage.key(i);
                                if (strKey != key && strKeyRe.test(strKey)) {
                                    localStorage.removeItem(strKey);
                                }
                            }
                        }
                    } catch(ex) {}

                    self._getXMLOnline(url, function(data) {
                        subway = self._parseXML(data);

                        // 数据保存到localstorage
                        storage.addData(key, subway);

                        // 以下属性不保存到localstorage
                        subway.cityName = self.fileName;
                        subway.cityCode = self.cityCode;
                        subway.imageData = self.imageData;
                        subway.imageDataEncoded = self.imageDataEncoded;

                        self.subway = subway;

                        successCallback && successCallback(subway);
                    }, function(error) {
                        failureCallback && failureCallback(cityNode);
                    });
                });

            } else {
                failureCallback && failureCallback(-1);
            }
        },

        _parseXML: function(data) {
            var XMLDocumentParser = require('subway:static/js/parser/xmldocumentparser.js');
            var parser = new XMLDocumentParser(data);
            return parser.parse();
        },

        _parseJSON: function(data) {
            var JSONParser = require('subway:static/js/parser/jsonparser.js');
            var subwayJSONParser = new JSONParser(data);
            return subwayJSONParser.parse();
        },

        getCityNode: function(city) {
            return this._checkIfSupportSubway(city);
        },

        /**
         * 判断所在城市是否支持地铁专题图，不支持则返回到首页；
         * @param {string} url中的城市code或者拼音: 133|beijing
         * @return {Boolean} 所在城市是否在支持列表
         */
        _checkIfSupportSubway: function(city) {
            var supportCityInfo = util.ifSupportSubway(city);
            var isBrowserNotSupport = this.isBrowserNotSupport = (supportCityInfo === false);
            if (!supportCityInfo || !supportCityInfo.split(",")[0]) {
                if (isBrowserNotSupport) {
                    return -3;
                }

                return -2;
            }

            return supportCityInfo.split(",");
        },

        /**
         * 在线获取xml数据
         */
        _getXMLOnline: function(url, successCallback, failureCallback) {
            if (!url) {
                failureCallback && failureCallback();
                return;
            }

            $.ajax({
                type: 'GET',
                url:  url,
                dataType: "xml",
                timeout: 5000,
                success: function (data) {
                    if (data) {
                        successCallback && successCallback(data);
                    } else {
                        failureCallback && failureCallback();
                    }
                },
                error: function (key) {
                    failureCallback && failureCallback();
                }
            });
        },

        /**
         * 替换为MapCache重写函数；
         * @param  {Object} cache 缓存对象；
         */
        _getJSONOffline: function(key, successCallback, failureCallback) {
            if (!key) {
                failureCallback && failureCallback();
                return;
            }

            storage.selectData(key, {
                success: function(data){
                    if (data) {
                        successCallback && successCallback(data);
                    } else {
                        failureCallback && failureCallback();
                    }
                },
                error: function(){
                    failureCallback && failureCallback();
                }
            });
        }

    };

});
;var Coords = require('subway:static/js/base/coords.js');

/**
 * $file Canvas渲染器
 */
define('subway:static/js/renderer/canvas.js', function (require, exports, module) {

    function CanvasRenderer() {}

    $.extend(CanvasRenderer.prototype, {

        /**
         * API Method
         * @public
         * 初始化Canvas渲染器
         */
        initialize: function($el, subway) {
            this.$el = $el;

            this.subway = subway;

            this.container = null;

            this.canvas = null;

            this.devicePixelRatio = this.getDevicePixelRatio();

            this.marginRatio = 0.0; // 单边溢出比例，提升用户体验，小幅移动时，边界外绘制

            this.deviceWidth = $("#subway-holder").offset().width;
            this.deviceHeight = $("#subway-holder").offset().height;

            this.canvasWidth = this.deviceWidth * this.devicePixelRatio * (1 + 2 * this.marginRatio);
            this.canvasHeight = this.deviceHeight * this.devicePixelRatio * (1 + 2 * this.marginRatio);

            this.mapWidth = subway.width;
            this.mapHeight = subway.height;

            this.scaleRatio = 1; // means px per canvas unit(px/unit);
            this.maxScaleRatio = 2.4;
            this.minScaleRatio = 0.2 * this.devicePixelRatio;

            this.scaleRate = 1.25;
            this.zoomInRate = this.scaleRate;
            this.zoomOutRate = 1 / this.scaleRate;

            this.orig_x = null; // canvas绘制中心Unit，非像素坐标，如果需要左上角Unit则加上this._toUnit(this.canvasWidth / 2)
            this.orig_y = null;

            this.tolerance = 20; // 为了解决canvas和svg在点击范围上的差异，单独设置

            this._createElement();
        },

        /**
         * 创建Canvas DOM元素
         * @private
         */
        _createElement: function() {
            this.$el.find('#sw_renderer').remove();

            var canvas = this.canvas = document.createElement('canvas');
            canvas.width = this.canvasWidth;
            canvas.height = this.canvasHeight;
            canvas.style.position = 'absolute';
            canvas.style.left = this._toInt(- this.deviceWidth * this.marginRatio) + 'px';
            canvas.style.top = this._toInt(- this.deviceHeight * this.marginRatio) + 'px';
            canvas.style.width = this._toInt(this.deviceWidth * (1 + this.marginRatio * 2)) + 'px';
            canvas.style.height = this._toInt(this.deviceHeight * (1 + this.marginRatio * 2)) + 'px';

            this.container = $('<div id="sw_renderer" style="position: relative; width: 100%; height: 100%" />');

            this.$el.append(this.container.append(canvas));
        },

        /**
         * API Method
         * @public
         * 清空Canvas画布
         */
        clear: function() {
            var canvas = this.canvas;
            if (canvas) {
                var ctx = canvas.getContext('2d');
                ctx.save();
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }
        },

        /**
         * API Method
         * @public
         * 绘制画布
         * @param  {int} dest_x    目标坐标X
         * @param  {int} dest_y    目标坐标Y
         * @param  {float} scale_ratio 缩放比例
         */
        plot: function(dest_x, dest_y, scale_ratio) {
            this._fitCanvas();
            this._plotCanvas();
        },

        /**
         * 绘制Canvas画布
         * 首先，按预设坐标平移绘制起始点
         * 然后，按预设比例Scale
         * 最后，调用具体绘制
         * @private
         * @param  {int} dest_x    目标坐标X
         * @param  {int} dest_y    目标坐标Y
         * @param  {float} scale_ratio 缩放比例
         */
        _plotCanvas: function(dest_x, dest_y, scale_ratio) {
            var canvas = this.canvas,
                ctx = canvas.getContext('2d'),
                subway = this.subway;

            // 参数可选
            this.orig_x = (dest_x == undefined ? - this.mapWidth / 2 : dest_x);
            this.orig_y = (dest_y == undefined ? - this.mapHeight / 2 : dest_y);
            scale_ratio = scale_ratio || this.scaleRatio;

            this._plotMap(ctx, subway);
        },

        /**
         * 绘制具体的地图，抽象出固定不变的内容
         * @private
         */
        _plotMap: function(ctx, subway) {
            this.clear();

            ctx.save();
            ctx.translate(0, 0); // unit, not px
            ctx.scale(this.scaleRatio, this.scaleRatio);
            ctx.translate(this.orig_x + this._toUnit(this.canvasWidth / 2), this.orig_y + this._toUnit(this.canvasHeight / 2)); // unit, not px

            var lines = subway.lines;

            for (var i = 0; i < lines.length; i++) {
                this._plotLine(ctx, lines[i]);
            }

            for (var j = 0; j < lines.length; j++) {
                this._plotLineStations(ctx, lines[j]);
            }

            ctx.restore();
        },

        _plotLine: function(ctx, line) {
            ctx.beginPath();
            ctx.fillStyle = line.lc;
            ctx.font = "bold 16px 微软雅黑";
            ctx.fillText(line.lb, line.lbx, line.lby);

            for (var j = 0; j < line.stations.length; j++) {
                var station = line.stations[j];

                var x = station.x,
                    y = station.y,
                    rc = station.rc;

                ctx.lineWidth = 8;
                ctx.strokeStyle = line.lc;

                if (rc) { // 圆角
                    var stP = line.stations[j - 1];
                    var stN = line.stations[j + 1];
                    var pxP = stP.x;
                    var pxN = stN.x;
                    var pyP = stP.y;
                    var pyN = stN.y;
                    var cx = 2 * x - (pxP + pxN) / 2;
                    var cy = 2 * y - (pyP + pyN) / 2;
                    ctx.quadraticCurveTo(cx, cy, pxN, pyN);
                } else { // 直线
                    ctx.lineTo(x, y);
                }

                if (line.loop) {
                    if (j == (line.stations.length - 1)) {
                        var pxS = line.stations[0].x;
                        var pyS = line.stations[0].y;
                        ctx.lineTo(pxS, pyS);
                    }
                }
            }

            ctx.stroke();
        },

        _plotLineStations: function(ctx, line) {
            for(var j = 0; j < line.stations.length; j++) {
                this._plotStation(ctx, line.stations[j]);
            }
        },

        _plotStation: function(ctx, station) {
            if (station.iu) { // 数据服务端就控制了iu站点的数量，避免了重复；
                if (station.icon) { // 绘制自定义图标站点，机场站点；
                    var icon_xy = station.icon.split(",");
                    ctx.drawImage(this.subway.imageData.airport, station.x + this._toInt(icon_xy[1]), station.y + this._toInt(icon_xy[2]), 32, 32);
                }

                if (station.ex) { // 绘制中转站；
                    ctx.drawImage(this.subway.imageData.transfer, station.x + station.trs_x, station.y + station.trs_y, 20, 20);
                } else { // 绘制站点符号；
                    ctx.beginPath();
                    ctx.arc(station.x, station.y, 6.5, 0, 2 * Math.PI, false);
                    ctx.strokeStyle = station.lc;
                    ctx.lineWidth = 2.5;
                    ctx.fillStyle = "white";
                    ctx.fill();
                    ctx.stroke();
                }

                // 绘制站点名称；
                ctx.fillStyle = "black";
                ctx.font = "normal 16px 微软雅黑";
                ctx.fillText(station.lb, station.x + station.rx, station.y + station.ry);
            }
        },

        /**
         * API Method
         * 放大地图
         * @public
         */
        zoomIn: function() {
            this.scaleRatio *= this.zoomInRate;
            this._plotCanvas(this.orig_x, this.orig_y);
        },

        /**
         * API Method
         * 缩小地图
         * @public
         */
        zoomOut: function() {
            this.scaleRatio *= this.zoomOutRate;
            this._plotCanvas(this.orig_x, this.orig_y);
        },


        /**
         * API Method
         * 放大或缩小地图
         * @param  {int} center_px 
         * @param  {int} center_py 
         * @param  {float} scale_ratio 缩放比例
         */
        zoom: function(center_px, center_py, scale_ratio) {
            scale_ratio = Math.max(Math.min(scale_ratio, this.maxScaleRatio), this.minScaleRatio);
            
            this.scaleRatio = scale_ratio;
            this._plotCanvas(this.orig_x, this.orig_y);
        },

        /**
         * API Method
         * 获取绘制起始点Canvas坐标
         * @public
         */
        getOriginPoint: function() {
            return new Coords(this.orig_x, this.orig_y);
        },

        /**
         * API Method
         * @return {int} 将devicePixelRatio转化成样式比例，取值1或者2
         */
        getDevicePixelRatio: function() {
            return window.devicePixelRatio && window.devicePixelRatio > 1.0 ? 2 : 1;
        },

        /**
         * API Method
         * 平移地图, origin:左上角坐标点
         * @public
         * @param  {int} delta_x X坐标偏移量
         * @param  {int} delta_y Y坐标偏移量
         */
        moveTo: function(dest_x, dest_y) {
            this._clearCSSTransform();
            this._plotCanvas(dest_x, dest_y, this.scaleRatio);
        },

        move: function(delta_x, delta_y) {
            this._setCSSTransform(delta_x, delta_y);
        },

        /**
         * API Method
         * 画布移回坐标原点
         * @public
         */
        _clearCSSTransform: function() {
            this._setCSSTransform(0, 0, 1.0);
        },

        /**
         * API Method
         * 平移画布, origin:左上角坐标点
         * @public
         * @param  {int} delta_x X坐标偏移量
         * @param  {int} delta_y Y坐标偏移量
         * @param  {float} scale transform缩放量，不同于scale_ratio
         */
        _setCSSTransform: function(dest_x, dest_y, scale) {
            if (dest_x == undefined || dest_y == undefined) {
                dest_x = this.orig_x || 0;
                dest_y = this.orig_y || 0;
            }

            if (scale == undefined) {
                scale = 1.0;
            }

            var matrix = this._getTransformMatrix(dest_x, dest_y, scale);
            this.container.css({
                'transform': matrix,
                '-webkit-transform': matrix
            });
        },

        /**
         * 检测是否已超出边界
         * @param  {int} orig_x  移动初始位置
         * @param  {int} orig_y  
         * @param  {int} delta_x 移动偏移值
         * @param  {int} delta_y 
         * @return {boolean|object} 如果超出边界返回重设位置，否则返回false
         */
        isOutOfBounds: function(orig_x, orig_y, delta_x, delta_y) {
            var dest_x = orig_x + this.getPointUnitFromPixelValue(delta_x),
                dest_y = orig_y + this.getPointUnitFromPixelValue(delta_y);

            if (dest_x > 0 || dest_x < -this.mapWidth || dest_y > 0 || dest_y < -this.mapHeight) {
                return {
                    delta_x: this.getPixelValueFromPointUnit((dest_x > 0 ? 0 : dest_x < - this.mapWidth ? - this.mapWidth : dest_x) - orig_x),
                    delta_y: this.getPixelValueFromPointUnit((dest_y > 0 ? 0 : dest_y < - this.mapHeight ? - this.mapHeight: dest_y) - orig_y)
                };
            }

            return false;
        },

        resize: function(width, height) {
            if (!height || height == this.deviceHeight) return;

            var center = this.getPointFromPixel(new Coords(this.deviceWidth / 2, this.deviceHeight / 2)),
                scale_ratio = this.scaleRatio;

            // 重设容器尺寸
            this.deviceWidth = $("#subway-holder").offset().width;
            this.deviceHeight = $("#subway-holder").offset().height;

            // 重设Canvas尺寸
            this.canvas.width = this.canvasWidth = this.deviceWidth * this.devicePixelRatio * (1 + 2 * this.marginRatio);
            this.canvas.height = this.canvasHeight = this.deviceHeight * this.devicePixelRatio * (1 + 2 * this.marginRatio);

            this.canvas.style.width = this._toInt(this.deviceWidth * (1 + this.marginRatio * 2)) + 'px';
            this.canvas.style.height = this._toInt(this.deviceHeight * (1 + this.marginRatio * 2)) + 'px';

            this.zoom(center.x, center.y, scale_ratio);
        },

        /**
         * 适配画布尺寸
         * 保证通过首页进入地铁图，未定位的情况下绘制全城范围
         */
        _fitCanvas: function() {
            var curSize, fitSize;
            var horizonal = this.deviceWidth > this.deviceHeight;

            // 匹配小的设备尺寸；
            if (horizonal) { // 横屏时匹配高度；
                curSize = this.mapHeight;
                fitSize = this.deviceHeight;
            } else { // 竖屏时匹配宽度；
                curSize = this.mapWidth;
                fitSize = this.deviceWidth;
            }

            var fitScale = 1.0,
                curScale = this.scaleRatio,
                tmpScale,
                tmpSize;

            while (curSize > fitSize) {
                tmpScale = curScale * this.zoomOutRate;
                tmpSize = curSize * this.zoomOutRate;

                if (tmpScale < this.minScaleRatio) {
                    break;
                } else {
                    curScale = tmpScale;
                    curSize = tmpSize;
                }
            }

            this.scaleRatio = curScale;
        },

        /**
         * 构建tranform2d样式字符串
         * @private
         * @param  {int} dest_x 平移坐标X
         * @param  {int} dest_y 平移坐标Y
         * @param  {float} scale  缩放比例
         * @return {string}        字符串
         */
        _getTransformMatrix: function(dest_x, dest_y, scale) {
            var matrix = [scale, 0, 0, scale, dest_x, dest_y];
            return 'matrix(' + matrix.join(',') + ')';
        },

        getPointUnitFromPixelValue: function(value) {
            return this._toUnit(value * this.devicePixelRatio);
        },

        getPixelValueFromPointUnit: function(value) {
            return this._toPixel(value) / this.devicePixelRatio;
        },

        /**
         * API Method
         * 将相对于Canvas的屏幕像素坐标转换成地图坐标
         * @puble
         * @param  {Coord} pixel 屏幕像素坐标
         * @return {Coord}       地图坐标
         */
        getPointFromPixel: function(pixel) {
            var pixel_x = pixel.x * this.devicePixelRatio,
                pixel_y = pixel.y * this.devicePixelRatio;

            if (pixel_x < 0 || pixel_y < 0 ||
                pixel_x > this.mapWidth || pixel_y > this.mapHeight) return;

            // 1，根据屏幕点击坐标，计算canvas左上角坐标
            // 2，根据canvas左上角坐标，计算左上角点所处的canvas单位unit（像素点到canvas单位的转换）
            // 3，根据左上角所处的canvas单位unit，计算相对于屏幕坐标系原点的坐标unit（还原canvas变换）
            var point_x = this._toInt(this._toUnit(pixel_x - this.canvasWidth / 2) - this.orig_x),
                point_y = this._toInt(this._toUnit(pixel_y - this.canvasHeight / 2) - this.orig_y);

            return new Coords(point_x, point_y);
        },

        getPixelFromPoint: function(point) {
            var point_x = point.x + this.orig_x,
                point_y = point.y + this.orig_y;

            var pixel_x = (this._toPixel(point_x) + this.canvasWidth / 2 / (1 + 2 * this.marginRatio)) / this.devicePixelRatio,
                pixel_y = (this._toPixel(point_y) + this.canvasHeight / 2 / (1 + 2 * this.marginRatio)) / this.devicePixelRatio;

             return new Coords(pixel_x, pixel_y);
        },

        isMaxScale: function() {
            return this.scaleRatio * this.zoomInRate > this.maxScaleRatio;
        },

        isMinScale: function() {
            return this.scaleRatio * this.zoomOutRate < this.minScaleRatio;
        },

        /**
         * 将浮点数转换成整数
         * @private
         * @param  {float} n 浮点数
         * @return {int}   整数
         */
        _toInt: function(n) {
            return n >> 0;
        },

        /**
         * 将像素值转换到Canvas单位
         * 用于Canvas变换或绘制
         * @private
         * @param  {int} pixel pixel
         * @return {int}      canvas unit
         */
        _toUnit: function(pixel) {
            return pixel / this.scaleRatio; // scaleRatio: px/unit
        },

        /**
         * 将Canvas单位转换到像素值
         * @private
         * @param  {int}      canvas unit
         * @return {int} pixel pixel
         */
        _toPixel: function(unit) {
            return unit * this.scaleRatio; // scaleRatio: px/unit
        }

    });

    module.exports = CanvasRenderer;
});
;var Coords = require('subway:static/js/base/coords.js'),
    SVG = require('subway:static/js/libs/svg.js');

/**
 * SVG渲染器
 */
define('subway:static/js/renderer/svg.js', function (require, exports, module) {
    function SVGRenderer() {}

    SVGRenderer.supported = SVG.supported;

    $.extend(SVGRenderer.prototype, {

        /**
         * API Method
         * @public
         * 初始化Canvas渲染器
         */
        initialize: function($el, subway) {
            this.$el = $el;

            this.subway = subway;

            this.container = null;

            this.svg = null;

            this.deviceWidth = $("#subway-holder").offset().width;
            this.deviceHeight = $("#subway-holder").offset().height;

            this.mapWidth = subway.width;
            this.mapHeight = subway.height;

            this.scaleRatio = 1; // means px per canvas unit(px/unit);
            this.maxScaleRatio = 2.0;
            this.minScaleRatio = 0.2;

            this.scaleRate = 1.25;
            this.zoomInRate = this.scaleRate;
            this.zoomOutRate = 1 / this.scaleRate;

            this.orig_x = null; // canvas绘制中心Unit，非像素坐标，如果需要左上角Unit则加上this._toUnit(this.canvasWidth / 2)
            this.orig_y = null;

            this.tolerance = 16;

            this._createElement();
        },

        /**
         * 创建Canvas DOM元素
         * @private
         */
        _createElement: function() {
            this.$el.find('#sw_renderer').remove();

            var svg = $('<svg id="sw_svg" stlye="position: absolute" />').get(0);

            this.container = $('<div id="sw_renderer" style="position: relative; width: 100%; height: 100%" />');

            this.$el.append(this.container.append(svg));

            this.svg = SVG('sw_svg').size(this.mapWidth, this.mapHeight);

            this.context = this.svg.group();

            window.svg2 = this;
            window.context = this.context;
        },


        /**
         * API Method
         * @public
         * 清空SVG画布
         */
        clear: function() {
            var ctx = this.context;
            ctx.clear();
        },

        /**
         * API Method
         * @public
         * 绘制SVG画布
         */
        plot: function() {
            this.clear();
            this._plotSVG();
            this._fitSVG();
        },

        _plotSVG: function(dest_x, dest_y, scale_ratio) {
            var ctx = this.context,
                subway = this.subway;

            this.orig_x = (dest_x == undefined ? 0 : dest_x);
            this.orig_y = (dest_y == undefined ? 0 : dest_y);
            scale_ratio = scale_ratio || this.scaleRatio;

            this._plotMap(ctx, subway);
        },

        _plotMap: function(ctx, subway) {
            var lines = subway.lines;

            // 撑起尺寸
            ctx.rect(this.mapWidth, this.mapHeight).attr({
                'fill': 'none'
            });

            for(var i = 0; i < lines.length; i++) {
                var line = lines[i];
                this._plotLine(ctx, subway, line);
            }

            for(var j = 0; j < lines.length; j++) {
                var line = lines[j];
                for(var k = 0; k < line.stations.length; k++) {
                    var station = line.stations[k];
                    this._plotStation(ctx, subway, station);
                }
            }
        },

        _plotLine: function(ctx, subway, line) {

            // 绘制线路名称；
            ctx.text(line.lb).font({
                size: 16,
                weight: 'bold'
            }).fill({
                color: line.lc
            }).move(line.lbx, line.lby - 16);

            // 绘制线路时不同于Canvas，需要一次成型绘制
            var path = ["M"];
            for (var j = 0; j < line.stations.length; j++) {
                var station = line.stations[j];

                var x = station.x,
                    y = station.y,
                    rc = station.rc;

                if (rc) { //圆角
                    var stP = line.stations[j - 1];
                    var stN = line.stations[j + 1];
                    var pxP = stP.x;
                    var pxN = stN.x;
                    var pyP = stP.y;
                    var pyN = stN.y;
                    var cx = 2 * x - (pxP + pxN) / 2;
                    var cy = 2 * y - (pyP + pyN) / 2;

                    if (j > 0) path.push("Q");
                    path.push([cx, cy, pxN, pyN].join(","));
                } else { //直线
                    if (j > 0) path.push("L");
                    path.push((x).toFixed(2) + "," + (y).toFixed(2));
                }
            }

            if (line.loop) path.push("Z");
            ctx.path(path.join(""), true).attr({
                'fill': 'none',
                'stroke': line.lc,
                'stroke-width': 8
            });
        },

        _plotStation: function(ctx, subway, station) {
            if (station.iu) { // 数据服务端就控制了iu站点的数量，避免了重复；
                if (station.icon) { // 绘制自定义图标站点，机场站点；
                    var icon_xy = station.icon.split(",");
                    ctx.image(subway.imageDataEncoded.airport, 32, 32).move(station.x + this._toInt(icon_xy[1]), station.y + this._toInt(icon_xy[2]));
                }

                if (station.ex) { // 绘制中转站；
                    ctx.image(subway.imageDataEncoded.transfer, 20, 20).move(station.x + station.trs_x, station.y + station.trs_y);
                } else { // 绘制站点符号；
                    ctx.circle(13).fill({
                        color: "white"
                    }).stroke({
                        color: station.lc,
                        width: 2.5
                    }).move(station.x - 6.5, station.y - 6.5);
                }

                // 绘制站点名称；
                ctx.text(station.lb).font({
                    size: 16,
                    weight: 'normal'
                }).fill({
                    color: "#000"
                }).move(station.x + station.rx, station.y + station.ry - 16);
            }
        },

        /**
         * API Method
         * 放大地图
         * @public
         */
        zoomIn: function(pixel_x, pixel_y) {
            pixel_x = pixel_x || this.deviceWidth / 2;
            pixel_y = pixel_y || this.deviceHeight / 2;

            var center = this.getPointFromPixel(new Coords(pixel_x, pixel_y));
            this.zoom(center.x, center.y, this.scaleRatio * this.zoomInRate);
        },

        /**
         * API Method
         * 缩小地图
         * @public
         */
        zoomOut: function(pixel_x, pixel_y) {
            pixel_x = pixel_x || this.deviceWidth / 2;
            pixel_y = pixel_y || this.deviceHeight / 2;

            var center = this.getPointFromPixel(new Coords(pixel_x, pixel_y));
            this.zoom(center.x, center.y, this.scaleRatio * this.zoomOutRate);
        },

        /**
         * API Method
         * 放大或缩小地图
         * @param  {int} center_px 
         * @param  {int} center_py 
         * @param  {float} scale_ratio 缩放比例
         */
        zoom: function(center_px, center_py, scale_ratio) {
            var ctx = this.context;

            scale_ratio = Math.max(Math.min(scale_ratio, this.maxScaleRatio), this.minScaleRatio);

            ctx.scale(scale_ratio, scale_ratio);
            this.scaleRatio = scale_ratio;

            this.center(center_px, center_py);
        },

        /**
         * 平移指定的数据中心点到屏幕中心点
         * @param  {int} point_x 
         * @param  {int} point_y 
         */
        center: function(point_x, point_y) {
            var ctx = this.context;

            ctx.move(this._toPixel(-point_x) + this.deviceWidth / 2, this._toPixel(-point_y) + this.deviceHeight / 2);

            this.orig_x = ctx.x();
            this.orig_y = ctx.y();
        },

        /**
         * API Method
         * 获取绘制起始点Canvas坐标
         * @public
         */
        getOriginPoint: function() {
            return new Coords(this._toUnit(this.orig_x - this.deviceWidth / 2), this._toUnit(this.orig_y - this.deviceHeight / 2));
        },

        /**
         * API Method
         * 平移地图，SVG采用原生move方法效率低下，故采用与Canvas类似的transform方式
         * @public
         * @param  {int} delta_x 移动像素值
         * @param  {int} delta_y 移动像素值
         */
        move: function(delta_x, delta_y) {
            var ctx = this.context;
            var dest_x = this.orig_x + delta_x,
                dest_y = this.orig_y + delta_y;

            this._setCSSTransform(delta_x, delta_y, 1.0);
        },

        /**
         * API Method
         * 平移地图, origin:左上角坐标点
         * @public
         * @param  {int} dest_x X坐标偏移量
         * @param  {int} dest_y Y坐标偏移量
         */
        moveTo: function(dest_x, dest_y) {
            var ctx = this.context;

            dest_x = this._toPixel(dest_x) + this.deviceWidth / 2;
            dest_y = this._toPixel(dest_y) + this.deviceHeight / 2;

            ctx.move(dest_x, dest_y);

            this.orig_x = dest_x;
            this.orig_y = dest_y;

            this._clearCSSTransform();
        },

        /**
         * 检测是否已超出边界
         * @param  {int} orig_x  移动初始位置
         * @param  {int} orig_y  
         * @param  {int} delta_x 移动偏移值
         * @param  {int} delta_y 
         * @return {boolean|object} 如果超出边界返回重设位置，否则返回false
         */
        isOutOfBounds: function(orig_x, orig_y, delta_x, delta_y) {
            var dest_x = orig_x + this.getPointUnitFromPixelValue(delta_x),
                dest_y = orig_y + this.getPointUnitFromPixelValue(delta_y);

            if (dest_x > 0 || dest_x < -this.mapWidth || dest_y > 0 || dest_y < -this.mapHeight) {
                return {
                    delta_x: this.getPixelValueFromPointUnit((dest_x > 0 ? 0 : dest_x < - this.mapWidth ? - this.mapWidth : dest_x) - orig_x),
                    delta_y: this.getPixelValueFromPointUnit((dest_y > 0 ? 0 : dest_y < - this.mapHeight ? - this.mapHeight: dest_y) - orig_y)
                };
            }

            return false;
        },

        resize: function(width, height) {
            if (!height || height == this.deviceHeight) return;

            var center = this.getPointFromPixel(new Coords(this.deviceWidth / 2, this.deviceHeight / 2)),
                scale_ratio = this.scaleRatio;

            // 重设容器尺寸
            this.deviceWidth = $("#subway-holder").offset().width;
            this.deviceHeight = $("#subway-holder").offset().height;

            // 重新绘制
            this.clear();
            this._plotSVG();

            this.zoom(center.x, center.y, scale_ratio);
        },

        /**
         * 适配画布尺寸
         * 保证通过首页进入地铁图，未定位的情况下绘制全城范围
         */
        _fitSVG: function() {
            var curSize, fitSize;
            var horizonal = this.deviceWidth > this.deviceHeight;

            // 匹配小的设备尺寸；
            if (horizonal) { // 横屏时匹配高度；
                curSize = this.mapHeight;
                fitSize = this.deviceHeight;
            } else { // 竖屏时匹配宽度；
                curSize = this.mapWidth;
                fitSize = this.deviceWidth;
            }

            var fitScale = 1.0,
                curScale = this.scaleRatio,
                tmpScale,
                tmpSize;

            while (curSize > fitSize) {
                tmpScale = curScale * this.zoomOutRate;
                tmpSize = curSize * this.zoomOutRate;

                if (tmpScale < this.minScaleRatio) {
                    break;
                } else {
                    curScale = tmpScale;
                    curSize = tmpSize;
                }
            }

            this.context.scale(curScale, curScale).center(this.deviceWidth / 2, this.deviceHeight / 2);
            this.orig_x = this.context.x();
            this.orig_y = this.context.y();
            this.scaleRatio = curScale;
        },

        /**
         * API Method
         * 平移画布, origin:左上角坐标点
         * @public
         * @param  {int} delta_x X坐标偏移量
         * @param  {int} delta_y Y坐标偏移量
         * @param  {float} scale transform缩放量，不同于scale_ratio
         */
        _setCSSTransform: function(dest_x, dest_y, scale) {
            if (dest_x == undefined || dest_y == undefined) {
                dest_x = this.orig_x || 0;
                dest_y = this.orig_y || 0;
            }

            if (scale == undefined) {
                scale = 1.0;
            }

            var matrix = this._getTransformMatrix(dest_x, dest_y, scale);
            this.container.css({
                'transform': matrix,
                '-webkit-transform': matrix
            });
        },

        /**
         * API Method
         * 画布移回坐标原点
         * @public
         */
        _clearCSSTransform: function() {
            this._setCSSTransform(0, 0, 1.0);
        },

        /**
         * 构建tranform2d样式字符串
         * @private
         * @param  {int} dest_x 平移坐标X
         * @param  {int} dest_y 平移坐标Y
         * @param  {float} scale  缩放比例
         * @return {string}        字符串
         */
        _getTransformMatrix: function(dest_x, dest_y, scale) {
            var matrix = [scale, 0, 0, scale, dest_x, dest_y];
            return 'matrix(' + matrix.join(',') + ')';
        },

        getPointUnitFromPixelValue: function(value) {
            return this._toUnit(value);
        },

        getPixelValueFromPointUnit: function(value) {
            return this._toPixel(value);
        },

        /**
         * API Method
         * 将相对于Canvas的屏幕像素坐标转换成地图坐标
         * @puble
         * @param  {Coord} pixel 屏幕像素坐标
         * @return {Coord}       地图坐标
         */
        getPointFromPixel: function(pixel) {
            var ctx = this.context;
            var pixel_x = pixel.x,
                pixel_y = pixel.y;

            // if (pixel_x < 0 || pixel_y < 0 ||
                // pixel_x > this.mapWidth || pixel_y > this.mapHeight) return;

            var point_x = this._toInt(this._toUnit(pixel_x - ctx.x())),
                point_y = this._toInt(this._toUnit(pixel_y - ctx.y()));

            return new Coords(point_x, point_y);
        },

        getPixelFromPoint: function(point) {
            var ctx = this.context;
            var point_x = point.x,
                point_y = point.y;

            var pixel_x = (this._toPixel(point_x) + ctx.x()),
                pixel_y = (this._toPixel(point_y) + ctx.y());

             return new Coords(pixel_x, pixel_y);
        },

        isMaxScale: function() {
            return this.scaleRatio * this.zoomInRate > this.maxScaleRatio;
        },

        isMinScale: function() {
            return this.scaleRatio * this.zoomOutRate < this.minScaleRatio;
        },

        /**
         * 将浮点数转换成整数
         * @private
         * @param  {float} n 浮点数
         * @return {int}   整数
         */
        _toInt: function(n) {
            return n >> 0;
        },

        /**
         * 将像素值转换到画布单位
         * 用于画布变换或绘制
         * @private
         * @param  {int} pixel pixel
         * @return {int}      canvas unit
         */
        _toUnit: function(pixel) {
            return pixel / this.scaleRatio; // scaleRatio: px/unit
        },

        /**
         * 将画布单位转换到像素值
         * @private
         * @param  {int}      canvas unit
         * @return {int} pixel pixel
         */
        _toPixel: function(unit) {
            return unit * this.scaleRatio; // scaleRatio: px/unit
        }
    });

    module.exports = SVGRenderer;
});
;define('subway:widget/popupwindow/popupwindow.js', function(require, exports, module){

var url = require("common:widget/url/url.js"),
    util = require('common:static/js/util.js'),
    Coords = require('subway:static/js/base/coords.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = $.extend({}, {

    offset: {
        left: 1,
        top: -5
    },

    init: function (data) {
        this.data = data;

        var tpl = this.tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div id="sw_pw">    ');if(data.notification){_template_fun_array.push('        <div class="sw-pw-notification">这是离您最近的地铁站</div>    ');}else{_template_fun_array.push('        <ul class="sw-pw-title">            <li class="sw-pw-tl"></li>            <li class="sw-pw-tc">',typeof(data.station.lb)==='undefined'?'':data.station.lb,'</li>            <li class="sw-pw-tr"></li>        </ul>        <div class="sw-pw-content">            ');for(var i=0; i<data.lines.length; i++){_template_fun_array.push('                <div class="sw-pw-line">                    <div class="sw-pw-line-title" style="border-color:',typeof(data.lines[i].color)==='undefined'?'':data.lines[i].color,'">                        <span class="line_title_content" style="background-color:',typeof(data.lines[i].color)==='undefined'?'':data.lines[i].color,'">',typeof(data.lines[i].name)==='undefined'?'':data.lines[i].name,'</span>                    </div>                    ');for(var j=0; j<data.lines[i].dirs.length; j++){_template_fun_array.push('                        ');if(data.lines[i].dirs[j].startTime && data.lines[i].dirs[j].endTime) {_template_fun_array.push('                        <ul class="sw-pw-line-list">                            <li class="sw-pw-line-dir">                                <span class="sw-pw-line-dir-name">',typeof(data.lines[i].dirs[j].name)==='undefined'?'':data.lines[i].dirs[j].name,'</span><span class="sw-pw-text-gray">方向</span>                            </li>                            <li class="sw-pw-line-time">                                <span class="sw-pw-text-gray-bkg">始</span><span class="sw-pw-text-inline-block">',typeof(data.lines[i].dirs[j].startTime || '00:00')==='undefined'?'':data.lines[i].dirs[j].startTime || '00:00','</span><span class="sw-pw-text-gray-bkg">末</span><span class="sw-pw-text-inline-block">',typeof(data.lines[i].dirs[j].endTime || '00:00')==='undefined'?'':data.lines[i].dirs[j].endTime || '00:00','</span>                            </li>                        </ul>                        ');}_template_fun_array.push('                    ');}_template_fun_array.push('                </div>            ');}_template_fun_array.push('        </div>    ');}_template_fun_array.push('</div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
        var $el = this.$el = $(tpl({
            'data': data
        }));
        $('#sw_renderer').append($el);
        this.bind();
    },

    bind: function () {
        var self = this;

        var tlCt = $('.sw-pw-tl');
        tlCt.on("touchstart", function (evt) {
            tlCt.start = {
                x: evt.touches[0].pageX,
                y: evt.touches[0].pageY
            };

            evt.target.handled = true; // 保证图区的tap事件不触发 
        });
        tlCt.on("click", function (evt) {
            if (tlCt.start) {
                var x = evt.pageX - tlCt.start.x,
                    y = evt.pageY - tlCt.start.y;
                var distance = (x * x) + (y * y);
                if (distance > 100) {
                    tlCt.start = null;
                    return;
                }
            }
            tlCt.start = null;

            self.nbSearch();
        });

        var trCt = $(".sw-pw-tr");
        trCt.on("touchstart", function (evt) {
            trCt.start = {
                x: evt.touches[0].pageX,
                y: evt.touches[0].pageY
            };

            evt.target.handled = true; // 保证图区的tap事件不触发 
        });
        trCt.on("click", function (evt) {
            if (trCt.start) {
                var x = evt.pageX - trCt.start.x,
                    y = evt.pageY - trCt.start.y;
                var distance = (x * x) + (y * y);
                if (distance > 100) {
                    trCt.start = null;
                    return;
                }
            }
            trCt.start = null;

            self.lineSearch();
        });

        var contentCt = $(".sw-pw-tc, .sw-pw-content");
        contentCt.on("touchstart", function (evt) {
            contentCt.start = {
                x: evt.touches[0].pageX,
                y: evt.touches[0].pageY
            };

            evt.target.handled = true; // 保证图区的tap事件不触发 
        });
        contentCt.on('click', function (evt) {
            if (contentCt.start) {
                var x = evt.pageX - contentCt.start.x,
                    y = evt.pageY - contentCt.start.y;
                var distance = (x * x) + (y * y);
                if (distance > 100) {
                    contentCt.start = null;
                    return;
                }
            }
            contentCt.start = null;

            self.poiSearch();
        });
    },

    destroy: function () {
        $(".sw-pw-tl, .sw-pw-tr, .sw-pw-tc, .sw-pw-content").off();
        this.$el.remove();
    },

    show: function (offset, callback) {
        var $el = this.$el;

        $el.css({
            'visibility': 'hidden'
        }).show();

        var width = this.width = parseFloat($el.width());
        var height = this.height = parseFloat($el.height());

        $el.css({
            "left": offset.x - width / 2 + this.offset.left,
            "top": offset.y - height / 2 + this.offset.top,
            'visibility': ''
        });

        callback && callback(width / 2, height / 2);
    },

    hide: function () {
        this.$el.hide();
    },

    move: function (offset_x, offset_y) {
        var $el = this.$el;

        var left = parseFloat($el.css("left")),
            top = parseFloat($el.css("top"));
        $el.css({
            "left": left + offset_x,
            "top": top + offset_y
        });
    },

    setPosition: function (dest_x, dest_y) {
        var $el = this.$el;
        $el.css({
            "left": dest_x - this.width / 2 + this.offset.left,
            "top": dest_y - this.height + this.offset.top
        });
    },

    getPosition: function () {
        var $el = this.$el;
        return {
            left: parseFloat($el.css("left")),
            top: parseFloat($el.css("top"))
        };
    },

    getPoint: function () {
        return new Coords(this.data.x, this.data.y);
    },

    /**
     * 周边检索
     * @param {Point} poi 中心点
     */
    nbSearch: function () {
        // util.TxtBox.show('正在加载中...');

        // 周边搜索点击量
        stat.addCookieStat(STAT_CODE.SUBWAY_IW_NB_SEARCH);

        var data = this.data;
        var urlQuery = {
            nb_x: data.lng,
            nb_y: data.lat,
            center_name: data.station.lb || "",
            from: 'searchnearby'
        };

        url.update({
            module: 'index',
            action: 'searchnearby',
            query: {
                'foo': 'bar'
            },
            pageState: urlQuery
        }, {
            trigger: true,
            queryReplace: true,
            pageStateReplace: true
        });
    },

    /**
     * 发起线路检索
     */
    lineSearch: function () {
        // util.TxtBox.show('正在加载中...');

        // 线路检索点击量
        stat.addCookieStat(STAT_CODE.SUBWAY_IW_LINE_SEARCH);

        var data = this.data;
        var urlQuery = {
            word: data.station.lb || "", // url.js里不能解析word和point的错乱排序
            point: data.lng + ',' + data.lat
        };

        var pagestate = {};
        pagestate['end'] = util.jsonToQuery(urlQuery);

        url.update({
            module: 'place',
            action: 'linesearch',
            query: {
                'foo': 'bar'
            },
            pageState: pagestate
        }, {
            trigger: true,
            pageStateReplace: true,
            queryReplace: true
        });
    },

    /**
     * 去该点的详情页
     */
    poiSearch: function () {
        if (this.data.uid) {
            // util.TxtBox.show('正在加载中...');

            // 详情页点击量
            stat.addCookieStat(STAT_CODE.SUBWAY_IW_DETAIL_SEARCH);

            url.update({
                module: 'place',
                action: 'detail',
                query: {
                    'qt': 'inf',
                    'uid': this.data.uid
                }
            }, {
                trigger: true,
                pageStateReplace: true,
                queryReplace: true
            });
        }
    }

});

});
;define('subway:widget/subway/subway.js', function(require, exports, module){

/**
 * @file 地铁专题图画布
 * @author <shengxuanwei@baidu.com>
 */

var url = require("common:widget/url/url.js"),
    appresize = require('common:widget/appresize/appresize.js'),
    Hammer = require('subway:static/js/libs/hammer.js'),
    model = require('subway:static/js/model/subway.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = $.extend({}, {

    subway: null, // 地铁专题数据

    renderer: null, // canvas或者svg渲染引擎

    init: function(data) {
        appresize.update();

        // 计算画布应占高度以占满整屏
        var $parent = this.$parent = $("#main");
        var maxHeight = $parent.height();
        $parent.children().each(function() {
            maxHeight -= $(this).height();
        });

        this.$el = $('#subway-holder');
        this.$el.css({
            'height': maxHeight,
            'visibility': 'hidden' // 提前显示DOM元素，否则fitSVG位置计算不正确
        }).show();

        this.params = url.get();

        // 相同城市重复进入，不重复渲染
        // if (data && this.subway && data.cityCode === this.subway.cityCode) {
            // this.initHammer();
            // this.initCenterLocation();
            // return;
        // }

        this.initHammer();
        this.render(data);
        this.bind();

        this.initCenterLocation();
    },

    render: function(data) {
        this.subway = data;

        var renderer = this.renderer = this._getRenderer();
        renderer.initialize(this.$el, data);

        if (model.onresourceload) {
            renderer.plot();
        } else {
            listener.once('subway', 'onresourceload', function (evt) {
                renderer.plot();
            });
        }
    },

    // 加载专题图渲染引擎
    _getRenderer: function() {
        var Renderer,
            params = this.params;

        // 增加url强制渲染器后门参数renderer
        if (params && params.pageState && params.pageState.force === 'canvas') {
            Renderer = require('subway:static/js/renderer/canvas.js');
            return new Renderer();
        }

        if (this._isSupportSVG()) {
            Renderer = require('subway:static/js/renderer/svg.js');
        } else {
            Renderer = require('subway:static/js/renderer/canvas.js');
        }
        return new Renderer();
    },

    // 特性检测浏览器是否支持SVG
    _isSupportSVG: function() {
        return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
    },

    // 利用hammer.js库绑定用户触屏事件
    initHammer: function() {
        var self = this,
            container = this.$el.get(0);

        if (this.hammer) {
            this.hammer.off("transformstart transform transformend dragstart drag dragend tap");
            this.renderer.locked = false;
            // this.hammer.enable(true);
            // return;
        }

        var hammer = this.hammer = new Hammer(container, {
            prevent_default: true,
            drag: true,
            drag_block_vertical: true,
            drag_block_horizontal: true,
            drag_min_distance: 10,

            transform: true,
            transform_always_block: true,
            tap: true
        });

        var transform_scale;
        hammer.on('transformstart', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            renderer.locked = true;
        });

        hammer.on('transform', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            evt.gesture && evt.gesture.preventDefault();
            transform_scale = renderer.scaleRatio * evt.gesture.scale;
            renderer._setCSSTransform(0, 0, evt.gesture.scale);
        });

        hammer.on('transformend', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            renderer.locked = false;
            evt.gesture && evt.gesture.preventDefault();
            evt.gesture.stopDetect();
            renderer._clearCSSTransform();
            var center = renderer.getPointFromPixel(new Coords(renderer.deviceWidth / 2, renderer.deviceHeight / 2));
            renderer.zoom(center.x, center.y, transform_scale);

            if (self.popupWindow) {
                var pixel = renderer.getPixelFromPoint(self.popupWindow.getPoint());
                self.popupWindow.setPosition(pixel.x, pixel.y);
            }

            self.trigger('transformend');
        });

        var orig_x, orig_y;
        hammer.on('dragstart', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            if (renderer.locked) return;
            evt.gesture && evt.gesture.preventDefault();

            origin = renderer.getOriginPoint(); // 获取Canvas绘制起始点Unit
            orig_x = origin.x;
            orig_y = origin.y;
        });

        hammer.on('drag', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            if (renderer.locked) return;
            evt.gesture && evt.gesture.preventDefault();

            renderer.move(evt.gesture.deltaX, evt.gesture.deltaY);
        });

        hammer.on('dragend', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            if (renderer.locked) return;
            evt.gesture && evt.gesture.preventDefault();

            if (orig_x == null || orig_y == null) {
                renderer._clearCSSTransform();
                return;
            }

            // 限制移动边界, 如果超出边界，重置delta值
            var position = renderer.isOutOfBounds(orig_x, orig_y, evt.gesture.deltaX, evt.gesture.deltaY);
            if (position) {
                evt.gesture.deltaX = position.delta_x;
                evt.gesture.deltaY = position.delta_y;
            }

            var dest_x = orig_x + renderer.getPointUnitFromPixelValue(evt.gesture.deltaX);
            var dest_y = orig_y + renderer.getPointUnitFromPixelValue(evt.gesture.deltaY);

            // 以下两步CSS操作渲染较快，延时较少
            self.popupWindow && self.popupWindow.move(evt.gesture.deltaX, evt.gesture.deltaY);

            // FIXME 中间存在视差，clearCSSTransform之后canvas将回到原位，但此时还没有重新绘制
            renderer.moveTo(dest_x, dest_y);

            orig_x = null;
            orig_y = null;
        });

        hammer.on('tap', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            evt.gesture && evt.gesture.preventDefault();

            // 如果view的click事件触发，不再触发tap事件
            if (evt.target && (evt.target.handled || $(evt.target).parents('#sw_pw').size() > 0)) return;

            if (evt.gesture && evt.gesture.touches.length === 1) {
                var clientRect = container.getBoundingClientRect(), // 百度浏览器bug，检测svg标签的getBoundingClientRect时，返回left不是0... 故选择container计算相对位移
                    touch = evt.gesture.touches[0],
                    pixel = new Coords(touch.clientX - clientRect.left, touch.clientY - clientRect.top); // 相对于renderer的屏幕像素偏移值

                self.hidePopupWindow();

                // 计算查找站点，返回坐标点Point
                var point = renderer.getPointFromPixel(pixel);
                var station = subway.findNearestStation(point, 'pixel', renderer.tolerance || 16);

                if (station && station.uid) {
                    // 地铁站点点击量
                    stat.addStat(STAT_CODE.SUBWAY_STATION_MARKER_CLICK);

                    // 注意需要replace:true，否则不支持pushState会后退空白页
                    url.update({
                        query: {station_uid: station.uid}
                    }, {
                        replace: true,
                        trigger: false
                    });

                    self.popupStationWindow(station, {
                        zoomToNormal: false,
                        isNotification: false
                    });
                }
            }
        });
    },

    bind: function() {
        listener.on('subway', 'swZoomIn', this.zoomIn, this);
        listener.on('subway', 'swZoomOut', this.zoomOut, this);

        listener.on('common', 'sizechange', this.onSizeChange, this);
    },

    // 放大图区，并同步处理弹框
    zoomIn: function() {
        var renderer = this.renderer,
            popupWindow = this.popupWindow,
            pixel;

        if (!renderer.isMaxScale()) {
            renderer.zoomIn();

            if (popupWindow) {
                pixel = renderer.getPixelFromPoint(popupWindow.getPoint());
                popupWindow.setPosition(pixel.x, pixel.y);
            }
        }

        listener.trigger('subway', 'swZoomEnd', {
            isMinScale: renderer.isMinScale(),
            isMaxScale: renderer.isMaxScale()
        });
    },

    // 缩小图区，并同步处理弹框
    zoomOut: function() {
        var renderer = this.renderer,
            popupWindow = this.popupWindow,
            pixel;

        if (!renderer.isMinScale()) {
            renderer.zoomOut();

            if (popupWindow) {
                pixel = renderer.getPixelFromPoint(popupWindow.getPoint());
                popupWindow.setPosition(pixel.x, pixel.y);
            }
        }

        listener.trigger('subway', 'swZoomEnd', {
            isMinScale: renderer.isMinScale(),
            isMaxScale: renderer.isMaxScale()
        });
    },

    isMaxScale: function() {
        if (this.renderer) {
            return this.renderer.isMaxScale();
        } else {
            return false;
        }
    },

    isMinScale: function() {
        if (this.renderer) {
            return this.renderer.isMinScale();
        } else {
            return false;
        }
    },

    // 根据query或定位信息设定初始化的位置
    initCenterLocation: function() {
        var self = this;
        var params = this.params;

        // 落地页加载时有可能没有定位，绑定定位事件
        if (params && params.query && params.query.station_uid) {
            this.popupStationWindow({
                uid: params.query.station_uid
            }, {
                zoomToNormal: true,
                isNotification: false,
                successCallback: function() {
                    self.$el.css({'visibility': ''});
                }
            });
        } else if (params && params.query && params.query.line_uid) {
            // 兼容线路详情进入地铁专题图
        } else {
            var loc = require('common:widget/geolocation/location.js');
            if (loc.hasExactPoi()) {
                // 判断定位点和地铁所在城市是否一致
                if (this.subway.cityCode == loc.getCityCode()) {
                    this.onGeoSuccess({
                        point: loc.getCenterPoi()
                    });
                }
            } else {
                // listener.once('geolocation.success', $.proxy(this.onGeoSuccess, this));
            }
        }

        self.$el.css({'visibility': ''});
    },

    onGeoSuccess: function(data) {
        var self = this;
        if (!data) return;

        var station = this.subway.findNearestStation(data.point, 'point', 1000000);
        this.popupStationWindow(station, {
            zoomToNormal: true,
            isNotification: true,
            successCallback: function() {
                self.$el.css({'visibility': ''});
            }
        });
    },

    onSizeChange: function(evt, args) {
        var renderer = this.renderer,
            popupWindow = this.popupWindow;

        var width = args ? args.width : window.innerWidth,
            height = args ? args.height : window.innerHeight,
            wrapperHeight = height - $('.common-widget-nav').height();

        // 设置地图区域的高度
        $('#subway-holder').css('height', wrapperHeight + 'px');

        if (renderer) {
            renderer.resize(width, height);
        }

        if (popupWindow) {
            var pixel = renderer.getPixelFromPoint(popupWindow.getPoint());
            popupWindow.setPosition(pixel.x, pixel.y);
        }
        
    },

    /**
     * 聚焦站点，取消了线路高亮功能
     * @param  {object}  station        站点数据
     * @param  {boolean}  zoomToNormal   是否放大到1.0
     * @param  {boolean} isNotification 是否为定位点通知
     */
    popupStationWindow: function(station, options) {
        var self = this;

        if (self.renderer.locked) {
            return;
        }

        if (station) {
            // 异步数据请求
            this.subway.getStationExt('inf', station.uid, $.proxy(function(ext) {
                self.renderer.locked = true;
                if (options.zoomToNormal) {
                    self.renderer.zoom(ext.station.x, ext.station.y, 1.0);
                }

                self.showPopupWindow({
                    notification: options.isNotification,
                    x: ext.station.x,
                    y: ext.station.y,
                    uid: ext.station.uid,
                    lng: ext.points.split(',')[0],
                    lat: ext.points.split(',')[1],
                    station: ext.station,
                    lines: ext.lines
                });

                self.renderer.locked = false;

                if (options.successCallback) {
                    options.successCallback();
                }

           }, self), $.proxy(function(error) {
                if (options.failureCallback) {
                    options.failureCallback();
                }
           }, self));
        }
    },

    // 弹框，平移图区
    showPopupWindow: function(data) {
        var renderer = this.renderer;
        this.popupWindow = this.popupWindow || (require('subway:widget/popupwindow/popupwindow.js'));
        this.popupWindow.init(data); // 加载数据
        this.popupWindow.show({
            x: renderer.deviceWidth / 2,
            y: renderer.deviceHeight / 2
        }, function(offset_x, offset_y) { // 回调函数
            renderer.moveTo(-data.x, -data.y + renderer.getPointUnitFromPixelValue(offset_y)); // 向下平移因pw过高下拉的距离
        });
    },

    // 隐藏弹框
    hidePopupWindow: function() {
        this.popupWindow && this.popupWindow.destroy(); // 每次隐藏时均会销毁DOM和注销事件
    }
});

});
;define('subway:widget/zoomcontrol/zoomcontrol.js', function(require, exports, module){

/**
 * @file 放大缩小按钮控件
 * @author <shengxuanwei@baidu.com>
 */
module.exports = {

    init: function() {
        'use strict';

        this.bind();
    },

    bind: function() {
        var self = this;

        $("#swZoomOut").on("touchstart", function(evt) {
            $("#swZoomOut").addClass("zoom_btn_tap");
            evt.target.handled = true; // 保证图区的tap事件不触发
        });
        $("#swZoomOut").on('click', function(evt) {
            $("#swZoomOut").removeClass("zoom_btn_tap");
            listener.trigger('subway', 'swZoomOut');
        });

        $("#swZoomIn").on("touchstart", function(evt) {
            $("#swZoomIn").addClass("zoom_btn_tap");
            evt.target.handled = true; // 保证图区的tap事件不触发
        });
        $("#swZoomIn").on('click', function(evt) {
            $("#swZoomIn").removeClass("zoom_btn_tap");
            listener.trigger('subway', 'swZoomIn');
        });

        listener.on('subway', 'swZoomEnd', this.reset, this);
    },

    reset: function(evt, opts) {
        opts = opts || {};

        $("#swZoomOut").removeClass("disable_zoom_btn");

        if (opts.isMinScale) {
            $("#swZoomOut").addClass("disable_zoom_btn");
        }

        $("#swZoomIn").removeClass("disable_zoom_btn");

        if (opts.isMaxScale) {
            $("#swZoomIn").addClass("disable_zoom_btn");
        }
    }

};

});