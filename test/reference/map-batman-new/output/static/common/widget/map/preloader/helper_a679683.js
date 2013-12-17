define('common:widget/map/preloader/helper.js', function(require, exports, module){

/**
 * @fileoverview 预加载辅助函数 精简了一部分API的获取中心和层级的接口
 * @author jican@baidu.com
 */

var util = require('common:static/js/util.js'),
    mapConst = require('common:static/js/mapconst.js'),
    locator = require('common:widget/geolocation/location.js'),
    CBounds = require('common:widget/map/preloader/CBounds.js');

module.exports = {
    /**
     * 获取检索结果页预加载需要的中心点和层级
     * @param ViewportOptions
     * @return Object {center, zoom} 表示地图的中心点和级别.
     */
    getViewport: function (options) {
        var apphash = window._APP_HASH || {},
            module = apphash.module,
            action = apphash.action,
            center, zoom;

        options = options || {};

        if(window._MAP_BOUNDS) {
            // 路线类需要增加margins
            if(['transit','drive','walk'].indexOf(module)>=0){
                options.margins = mapConst.ROUTE_MARGINS;
            }
            var points = util.getBPoints([window._MAP_BOUNDS]),
                viewport = this._getViewport(points, options);
            if(viewport && viewport.center && viewport.zoom) {
                center = viewport.center;
                zoom = viewport.zoom;
            }
        }

        return {
            center: center,
            zoom: zoom
        }
    },
    /**
     * 根据地理区域或坐标获取地图最佳视野,该方法是API的简化版.
     * @param Array<Point> 点数组.
     * @param ViewportOptions
     * @return Object {center, zoom} 表示地图的中心点和级别.
     */
    _getViewport: function (view, opts) {

        if(!view || view.length==0) {
            return;
        }

        opts = opts || {};

        var points = view.slice(0),
            bounds = new CBounds(points[0], points[1]);
        
        var center = bounds.getCenter(),
            zoom = this.getBestLevel(bounds, opts);

        // 坐标偏移计算
        if (opts.margins) {
            var margins = opts.margins,
                wBias = (margins[1] - margins[3]) / 2,
                hBias = (margins[0] - margins[2]) / 2,
                zoomUnit = this.getZoomUnits(zoom);
            center.lng = center.lng + zoomUnit * wBias;
            center.lat = center.lat + zoomUnit * hBias;
        }
        
        return {
            'center': center,
            'zoom': zoom
        };
    },
    /**
     * 根据级别获取放大比例
     */
    getZoomUnits: function(zoom) {      
        var c = 1;
        /*
        暂时不用适配高分栅格图
        if(map.highResolutionEnabled() && map.getZoom() < map.config.vectorMapLevel){
            c = 2;       
        }
        */
        return Math.pow(2, (18 - zoom)) * c;
    },
    /**
     * 获取地图容器大小
     */
    getMapSize: function () {
        var apphash = window._APP_HASH || {},
            module = apphash.module,
            action = apphash.action;

        var mapHeight = window.innerHeight,
            mapWidth = window.innerWidth,
            searchboxHeight = $('.index-widget-searchbox').height() || 58,
            tabHeight = $('.index-widget-tabgroup').height() || 50,
            navHeight = $('.common-widget-nav').height() || 51;

        if(module==='index' && action==='index') {
            mapHeight = mapHeight - tabHeight - searchboxHeight;
        } else {
            mapHeight = mapHeight - navHeight;
        }

        return {
            width: mapWidth,
            height: mapHeight
        };
    },
    /**
     * 获取最小层级
     */
    getMinZoom: function () {
        return 3;
    },
    /**
     * 获取最大层级
     */
    getMaxZoom: function () {
        return 18;
    },
    /**
     * 获取最佳层级
     */
    getBestLevel: function (bounds, opts) {
        var margins = opts.margins || [10, 10, 10, 10],
            zoomFactor = opts.zoomFactor || 0,
            ew = margins[1] + margins[3],
            eh = margins[0] + margins[2],
            minLevel = this.getMinZoom(),
            maxLevel = this.getMaxZoom(),
            mapSize = this.getMapSize();
        for (var level = maxLevel; level >= minLevel; level--) {
            var zoomUnits = this.getZoomUnits(level);
            if (
                bounds.toSpan().lng / zoomUnits < mapSize.width - ew && 
                bounds.toSpan().lat / zoomUnits < mapSize.height - eh
            ) {
                break;
            }
        }
        level += zoomFactor;
        if (level < minLevel) {
            level = minLevel;
        }
        if (level > maxLevel) {
            level = maxLevel;
        }
        return level;
    }
};

});