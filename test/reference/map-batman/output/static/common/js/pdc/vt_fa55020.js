/**
 * @fileoverview 页面可见可操作的时候需要处理的逻辑
 * @author jican@baidu.com
 */

(function() {
    // 性能监控可见可操作时间
    PDC && PDC.mark("drt");

    try{
        // 前端统计页面PV
        var module = _APP_HASH.module,
            action = _APP_HASH.action,
            page = _APP_HASH.page;

        document.getElementById('statImg').src = '/mobile/img/t.gif?newmap=1&t=' + Date.now() + '&code=common_43&module=' + module + '&action=' + action + '&page=' + page;
    } catch(e){

    }
})();