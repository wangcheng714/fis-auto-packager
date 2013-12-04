/**
 * @fileOverview 性能统计监控
 * @author jican@baidu.com
 * @date 2013/08/02
 */


//性能监控参数
var _product_id     = 16,   // 产品线ID webapp为16
    _sample         = 1,    // 采样率，范围0-1。计算方法：100万/页面pv。
    _page_id        = 0,    // 监控页面ID
    _page_dict      = {     // 监控页面列表字典
        'index_index'           : 10,   //首页
        'place_list'            : 11,   //place列表
        'place_detail'          : 12,   //place详情
        'transit_list'          : 13,   //公交列表
        'transit_detail'        : 14,   //公交详情
        'drive_list'            : 15,   //驾车列表
        'walk_list'             : 16,   //步行列表
        'transit_crosslist'     : 17,   //跨城公交列表
        'transit_crossdetail'   : 18    //跨城公交详情
    }

//小流量控制的时候采样率为1
if(PDC.Cookie.get('MAPMOBILE_TYPE')=='simple') {
    _sample = 1;
    _page_dict = {
        'index_index'           : 50,   //首页
        'place_list'            : 51,   //place列表
        'place_detail'          : 52,   //place详情
        'transit_list'          : 53,   //公交列表
        'transit_detail'        : 54,   //公交详情
        'drive_list'            : 55,   //驾车列表
        'walk_list'             : 56,   //步行列表
        'transit_crosslist'     : 57,   //跨城公交列表
        'transit_crossdetail'   : 58    //跨城公交详情
    }
}

module.exports = {

    init : function () {
        this.jt();
        this.bind();
    },

    bind : function () {

        //读取当前页面信息
        var apphash = window._APP_HASH || {},
            module = apphash.module,
            action = apphash.action,
            page = apphash.page;

        //监听页面DomContentReady事件，给监控元素设置自定义属性
        /*
        $(document).ready(function(){
            $('.se-input-poi').val(Date.now() - window._drt);
            var el = $('#monitor');
            el && el.attr('user-data', JSON.stringify(apphash));
        });
        */

        //通过当前的module,action,page 确定一个监控页面的id
        if(module && action && page) {
            var key = (module+'_'+action).toLowerCase();
            _page_id = _page_dict[key];
        }
        
        //页面监控初始化
        PDC && PDC.init({
            sample      : _sample,
            product_id  : _product_id,
            page_id     : _page_id
        });
    },

    jt : function () {
        $(document).on('click', '[jsaction]', function(evt) {
            PDC && PDC._setWtCookie();
        });
    }
};