/**
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