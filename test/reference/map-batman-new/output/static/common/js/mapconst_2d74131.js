
// 定义全站使用的常量
define('common:static/js/mapconst.js', function (require, exports, module) {
    var util = require('common:static/js/util.js');
    module.exports = {
        TILE_FOMAT: "jpeg", //底图的格式
        //TILE_COLORS = "64",//底图图片颜色
        //TILE_COLOR_DEP = "8.jpg",//底图参数
        TILE_QUALITY: "40", //底图质量
        TILE_URL: ["http://online0.map.bdimg.com/it/",
            "http://online1.map.bdimg.com/it/",
            "http://online2.map.bdimg.com/it/",
            "http://online3.map.bdimg.com/it/"
        ],
        FORMAT: '.jpg',

        /**
         * geo类型常量
         */
        GEO_TYPE_AREA: 0,
        GEO_TYPE_LINE: 1,
        GEO_TYPE_POINT: 2,
        /**
         * POI点类型常量
         */
        POI_TYPE_NORMAL: 0,
        POI_TYPE_BUSSTOP: 1,
        POI_TYPE_BUSLINE: 2,
        POI_TYPE_SUBSTOP: 3,
        POI_TYPE_SUBLINE: 4,
        /**
         * 路线类型常量
         */
        ROUTE_TYPE_DEFAULT: 0,
        ROUTE_TYPE_BUS: 1,
        ROUTE_TYPE_WALK: 2,
        ROUTE_TYPE_DRIVE: 3,
        ROUTE_TYPE_UNSURE: 6,

        TRANS_TYPE_BUS: 0,
        TRANS_TYPE_SUB: 1,
        /**
         * 起始点和终止点常量
         */
        DEST_START: 0,
        DEST_END: 1,
        DEST_MIDDLE: 2,
        DEST_SEC: 3,

        INPUT_SUG: "输入一个位置，如：西单",
        MY_GEO: "我的位置",
        ViewMargins: util.isAndroid() ? [60, 50, 50, 50] : [60, 50, 50, 0],
        ROUTE_MARGINS: util.isAndroid() ? [85, 50, 50, 50] : [85, 50, 50, 20],
        GRViewMargins: [60, 50, 60, 50],
        SvpOpts: {
            enableAnimation: false,
            margins: this.ViewMargins
        },

        PAGE_ID : {
            traffic : 3            // 交通流量
        },

        SEARCH_FOR_LOC_TIMEOUT: 8000, // 检索时，等待定位返回的超时值
        GLCON_TIMEOUT: 30000, // HTML5定位接口，超时参数值

        BUSINESS_SPLIT: "     ",

        APP_ROOT: "mobile/webapp/",
        CITY_BY_BOUNDS_URI: 'http://s0.map.baidu.com/',
        TRAFIIC_URI: 'http://its.map.baidu.com:8001/showevents.php',

        MARKERS_PATH   : '/static/common/images/markers_d2cfab5.png',
        DEST_MKR_PATH  : '/static/common/images/dest_mkr_4dfb043.png',

        ROUTE_DICT :  [
            {
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
                opacity: 0.65
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
            }
        ],

        IW_POI: 0, // 普通检索
        IW_GRT: 1, // 泛需求
        IW_BSL: 2, // 公交线路
        IW_CNT: 3, // 周边查询中心点
        IW_BUS: 4, // 公交
        IW_NAV: 5, // 驾车
        IW_WLK: 6, // 步行
        IW_SHR: 7, // 共享位置点
        IW_TFC: 10, // 交通路况
        IW_VCT: 11, // 底图可点
    };
});