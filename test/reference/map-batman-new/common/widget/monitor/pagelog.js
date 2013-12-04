/**
 * @fileOverview 性能统计监控
 * @author jican@baidu.com
 * @date 2013/08/02
 */
var pagemgr = require('common:widget/pagemgr/pagemgr.js');

/**
 * 将HASH转换成性能监控的key
 * @return {string} key
 */
function hash2key () {
    var apphash = window._APP_HASH || {},
        module = apphash.module,
        action = apphash.action,
        page = apphash.page,
        key = '';

    if(/vt=map/.test(location.href)){
        key = (module+'_map').toLowerCase();
    } else {
        key = (module+'_'+action).toLowerCase();
        if(module==='index' && action==='index' && page!=='index') {
            return '';
        }
    }
    return key;
}

/**
 * 获取web监控pageid
 * @return {number} id
 */
function getPageId() {
    var key = hash2key();
    return PDC.DICT[key] ? PDC.DICT[key] : '';
}

/**
 * 获取无刷新监控appid
 * @return {number} id
 */
function getAppId() {
    var key = hash2key();
    return SDC.DICT[key] ? SDC.DICT[key] : '';
}

module.exports = {

    init : function () {

        // 监控落地页性能 通过web监控PDC完成
        var pageid = getPageId();
        if(pageid) {
            PDC && PDC.init({
                sample      : 1,
                product_id  : 16,
                page_id     : pageid
            });
        }

        // 监控切页性能 通过无刷新监控SDC完成
        var eventList = {};

        // 通过事件唯一ID匹配 记录起点时间
        listener.on('common.page', 'switchstart', function (eventName, opts) {
            eventList[opts.eid] = {
                'start': Date.now()
            };
        });

        // 通过事件唯一ID匹配 记录等待时间
        listener.on('common.page', 'pagearrived', function (eventName, opts) {
            if(eventList[opts.eid]) {
                eventList[opts.eid].wait =  Date.now();
            }
        });

        // 通过事件唯一ID匹配 记录结束时间
        listener.on('common.page', 'switchend', function (eventName, opts) {
            if(eventList[opts.eid]) {
                eventList[opts.eid].end =  Date.now();
            }
        });

        // 在页面全部加载完成后 上传性能数据
        listener.on('common.page', 'pageloaded', function (eventName, opts) {
            //落地页不需要统计
            if(pagemgr && pagemgr.isLandingPage()) {
                return;
            }
            var evt = eventList[opts.eid];
            if (evt && evt.start && evt.end && (evt.end - evt.start > 100)) {
                evt.loaded = Date.now();

                var appId = getAppId();
                if (appId) {
                    var app = SDC.createApp(getAppId());
                    app.start_event(evt.start);
                    app.view_time(evt.end);


                    //mark 等待时间
                    if (evt.wait) {
                        app.mark("c_wt", evt.wait);
                    }

                    //mark loaded 时间
                    if (evt.loaded) {
                        app.mark("c_ld", evt.loaded);
                    }

                    app.ready();
                }
            }
        });
    }
};
