/**
 * @fileOverview 性能统计监控
 * @author jican@baidu.com
 * @date 2013/08/02
 */


/**
 * 无刷新统计ID字典
 */
SDC.DICT = {

    // 底图不同页面性能 
    'MAP_INDEX_INDEX'       : 77,
    'MAP_PLACE_LIST'        : 78,
    'MAP_PLACE_DETAIL'      : 79,
    'MAP_TRANSIT_DETAIL'    : 80,
    'MAP_DRIVE_LIST'        : 81,
    'MAP_SEARCH_SEARCH'     : 82,
    'MAP_OTHER_PAGE'        : 83,

    // 底图综合性能
    'MAP_AVG'               : 205,   // 底图平均性能
    'MAP_VCT'               : 206,   // 底图矢量性能
    'MAP_TIL'               : 207,   // 底图栅格性能

    // 矢量路况性能
    'TRAFFIC_LAD'           : 220,

    //非落地页性能统计
    'index_index'           : 180,  //首页
    'place_list'            : 181,  //place列表
    'place_detail'          : 182,  //place详情
    'transit_list'          : 183,  //公交列表
    'transit_detail'        : 184,  //公交详情
    'drive_list'            : 185,  //驾车列表
    'walk_list'             : 186,   //步行列表
};

/**
 * web监控统计ID字典
 */
PDC.DICT = {
    'index_index'           : 10,   //首页
    'place_list'            : 11,   //place列表
    'place_detail'          : 12,   //place详情
    'transit_list'          : 13,   //公交列表
    'transit_detail'        : 14,   //公交详情
    'drive_list'            : 15,   //驾车列表
    'walk_list'             : 16,   //步行列表
    'transit_crosslist'     : 17,   //跨城公交列表
    'transit_crossdetail'   : 18,   //跨城公交详情
    'index_map'             : 19,
    'place_map'             : 20,
    'transit_map'           : 21,
    'drive_map'             : 22
};

module.exports = {
    /**
     * 性能监控初始化
     */
    init : function () {
        // 无刷新监控初始化(切页和底图)
        SDC && SDC.init({
            sample      : 1,    // 采样率，范围0-1。计算方法：100万/页面pv。
            product_id  : 16,   // 产品线ID webapp为16
            max         : 5     // 刷新一次最大上传个数
        });
        // 页面监控直接初始化
        (require('common:widget/monitor/pagelog.js')).init();
    }
};