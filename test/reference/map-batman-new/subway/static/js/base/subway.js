var util = require('common:static/js/util.js'),
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