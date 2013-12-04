/**
 * @fileOverview 性能统计监控
 * @author jican@baidu.com
 * @date 2013/08/02
 */
var util = require('common:static/js/util.js'),
    pagemgr = require('common:widget/pagemgr/pagemgr.js'),
    url = require('common:widget/url/url.js');

/**
 * 底图性能统计记录起点时间变量
 */
var vct_start_time,
    ras_start_time,
    traffic_start_time;

/**
 * 底图性能统计参数
 */
var netspeed = window.netspeed,
    netMarkName = netspeed < 300 ? 'high' : 'low',
    landMarkName = pagemgr.isLandingPage()? 'ild' : 'uld',
    pltMarkName = util.isAndroid() ? 'and' : 
                  util.isIPad() ? 'ipd' : 
                  util.isIPhone() ? 'iph' : 'oth';

/**
 * 底图性能统计对象
 */
var map,
    map_page_app = SDC.createApp(SDC.DICT.MAP_OTHER_PAGE),
    map_avg_app = SDC.createApp(SDC.DICT.MAP_AVG),
    vector_app = SDC.createApp(SDC.DICT.MAP_VCT),
    raster_app = SDC.createApp(SDC.DICT.MAP_TIL),
    traffic_app = SDC.createApp(SDC.DICT.TRAFFIC_LAD);

/**
 * 根据HASH获取区分底图页面的性能统计APP
 */
function getMapPageApp () {
    var apphash = window._APP_HASH || {},
        module = apphash.module,
        action = apphash.action,
        key = ('MAP_' + module + '_' + action).toUpperCase();

    if(SDC.DICT[key]) {
        return SDC.createApp(SDC.DICT[key]);
    } else {
        return map_page_app;
    }
}


/**
 * 矢量渲染开始回调函数
 */
function mapload() {
    map_avg_app.mark('c_map_load');
    map.removeEventListener("load", mapload);
}

/**
 * 矢量路况开始回调函数
 */
function trafficvectorbegin() {
    traffic_start_time = Date.now();
    map.removeEventListener("onTrafficvectorbegin", trafficvectorbegin);
}

/**
 * 矢量路况渲染结束回调函数
 */
function trafficvectorloaded() {
    if (traffic_start_time) {
        traffic_app.start_event(traffic_start_time);
        traffic_app.view_time();
        traffic_app.ready(1);
    }
    map.removeEventListener("onTrafficvectorloaded",  trafficvectorloaded);
}

/**
 * 矢量渲染开始回调函数
 */
function vectorbegin() {
    vct_start_time = Date.now();
    map.removeEventListener("onvectorbegin", vectorbegin);
}

/**
 * 栅格渲染开始回调函数
 */
function rasterbegin() {
    ras_start_time = Date.now();
    map.removeEventListener("ontilesbegin", rasterbegin);
}

/**
 * 矢量渲染结束回调函数
 */
function vectorloaded() {

    // 为了防止事件派发导致的错误记录需要在loaded事件里记录begin时间 by jican
    if(vct_start_time){
        map_avg_app.mark('c_vector_begin', vct_start_time);
        map_page_app.mark('c_vct_st', vct_start_time);
        vector_app.mark('c_vct_st', vct_start_time);
    }

    // 平均矢量出图时间
    map_avg_app.mark('c_vector_load');
    map_avg_app.view_time();
    map_avg_app.ready(1);

    // 分页面统计矢量出图时间
    map_page_app.mark('c_vct_lt_' + landMarkName);
    map_page_app.view_time();
    map_page_app.ready(1);

    // 单独统计矢量出图时间
    vector_app.view_time();
    vector_app.ready(1);

    map.removeEventListener("onvectorloaded", vectorloaded);
    map.removeEventListener("ontilesloaded", rasterloaded);
}
/**
 * 栅格渲染结束回调函数
 */
function rasterloaded() {

    // 为了防止事件派发导致的错误记录需要在loaded事件里记录begin时间 by jican
    if(ras_start_time) {
        map_avg_app.mark('c_tiles_begin', ras_start_time);
        map_page_app.mark('c_rst_st', ras_start_time);
        raster_app.mark('c_rst_st', ras_start_time);
    }

    // 平均栅格出图时间
    map_avg_app.mark('c_tiles_load');
    map_avg_app.view_time();
    map_avg_app.ready(1);

    // 分页面统计栅格出图时间
    map_page_app.mark('c_rst_lt_' + landMarkName);
    map_page_app.view_time();
    map_page_app.ready(1);

    // 单独统计栅格出图时间
    raster_app.view_time();
    raster_app.ready(1);

    map.removeEventListener("onvectorloaded", vectorloaded);
    map.removeEventListener("ontilesloaded", rasterloaded);
}

module.exports = {
    init : function () {

        var _this = this;

        // 记录性能统计起点时间
        var _mapStart = function () {
            map_page_app = getMapPageApp();
            map_avg_app.start_event();
            map_page_app.start_event();
            vector_app.start_event();
            raster_app.start_event();
        }

        // 记录JS加载完成时间
        var _jsLoad = function () {
            map_avg_app.mark('c_js_load');
            map_avg_app.mark('c_js_lt_' + landMarkName);
        }

        var _mapInit = function (event, mapObj) {
            map = mapObj;
            map.addEventListener("load", mapload);
            map.addEventListener("onvectorbegin", vectorbegin);
            map.addEventListener("ontilesbegin", rasterbegin);
            map.addEventListener("onvectorloaded", vectorloaded);
            map.addEventListener("ontilesloaded", rasterloaded);
            map.addEventListener("onTrafficvectorbegin", trafficvectorbegin);
            map.addEventListener("onTrafficvectorloaded", trafficvectorloaded);
        }

        listener.once('common.map', 'start', _mapStart);
        listener.once('common.map', 'jsloaded', _jsLoad);
        listener.once('common.map', 'init', _mapInit);
    }
};