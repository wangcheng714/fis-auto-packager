/**
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