define('common:widget/stat/metrics-stat.js', function(require, exports, module){

/**
 * @file metrics-stat.js 
 *
 * @description 为定位统计重构设计的功能指标统计程序, 将可以把定位统计的各个功能指标统计项合并成一条统计请求再提交
 *              使用示例:
 *              var metricStat = require('metrics-stat.js');
 *              metricStat.start('geo');
 *              metricStat.addStat('geo', 'geo_success');
 *              metricStat.submit('geo');
 * 
 * @author lilin09@
 * 
 */

var workingTargets = {};
var callbacks = {};
var expiringTargets = {};

var statType = "ms0";
var status = 
    {
        success : 0,
        expire  : 1,
        suspend : 2
    };

var statUrl = "/mobile/img/transparent.gif?newmap=1";

    /**
     * @descriiption 开始对统计目标进行统计，如果该统计目标还有未完成的统计，将先停止未完成的统计并提交结果，再重新开始
     *
     * @param <String> target 统计目标
     * @param <Object> options 可选参数列表
     *        expire 超时时间，单位秒。如果指明，将在到达时间时直接提交。
     *        callback 回调函数， 将在统计请求发送50ms延时后执行回调，其回调参数为统计信息
     * 
     * @return <Boolean> 是否执行成功
     */
    function start(target, options) {
        if (!target) {
            return false;
        }

        stopTarget(target, status.suspend, 1);

        var newStat = {};
        newStat.type = "ms0";
        newStat.target = target;
        newStat.ts = Date.now();
        workingTargets[target] = newStat;

        if (options) {
            var expireSec = options.expire;
            if (expireSec > 0) {
                setExpireTimeout(target, expireSec);
            }
            var callback = options.callback;
            if (callback && callback instanceof Function) {
                callbacks[target] = callback;
            }
        }
        return true;
    }

    function setExpireTimeout(target, expireSec) {
        expiringTargets[target] = setTimeout(function() {expire(target);}, expireSec * 1000);
    }

    /**
     *
     * @descriiption 为统计目标添加统计项，若已存在统计项，将重写已有的统计值。在发出统计请求不保证统计项的顺序
     *
     * @param <String> target 统计目标
     * @param <String> name 统计项名
     * @param 统计项值 其类型可以为数字，字符串或一维Hash结构
     *
     * @return <Boolean> 若start()未调用或统计请求已发送，返回false
     *
     * 
     *
     */

    function addStat(target, name, value, isAdd) {
        if (!target || !name) {
            return false;
        }

        if (!value) {
            value = 1;
        }

        var targetStat = workingTargets[target];
        if (!targetStat) {
            return false;
        }
        /*
         * 当统计值为一维Hash，将把统计项展开成多个统计项
         */
        if ($.isPlainObject(value)) {
            for (var key in value) {
                var sub_name = name + "_" + key;
                targetStat[sub_name] = value[key];
            }
            targetStat[name] = setValue(targetStat[name], 1, isAdd);
        } else {
            targetStat[name] = setValue(targetStat[name], value, isAdd); 
        }
        return true;
    }

    function setValue(old, value, isAdd) {
        if (!isAdd) {
            return value;
        }
        if (isNaN(old)) {
            return value;
        }
        if (isNaN(value)) {
            return value;
        } else {
            return old + value;
        }
    }

    /**
     *
     * @descriiption 统计结束时提交统计请求
     *
     * @param <String> target 统计目标
     *
     * @return <Boolean> 若start()未调用或统计请求已发送，返回false
     */

    function submit(target) {
        return stopTarget(target, status.success, 1);
    }

    /**
     *
     * @descriiption 若设定了超时时间，在超时后将调用expire停止统计并发送未完成的统计请求
     * 
     * @param <String> target 统计目标 
     *
     */
    function expire(target) {
        return stopTarget(target, status.expire, 1);
    }

    /**
     *
     * @descriiption 在用户将关闭页面时，将停止所有统计，并将未完成的统计请求发出
     *
     */

    function terminate() {
        if (isEmpty(workingTargets)) {
            return;
        }
        for (var target in workingTargets) {
            stopTarget(target, status.suspend, 1);
        }
    }

    function stopTarget(target, status, now) {
        if (!target) {
            return false;
        }

        var targetStat = workingTargets[target];
        if (!targetStat) {
            return false;
        }
        targetStat.status = status;
        var url = buildUrl(statUrl, targetStat);
        send(url, now);
        targetStat.url = url;
        delete workingTargets[target];

        var expireHandler = expiringTargets[target];
        if (expireHandler) {
            delete expiringTargets[target];
            clearTimeout(expireHandler);
        }

        //为不影响主流程执行，回调函数执行延时50ms
        var callback = callbacks[target];
        if (callback && callback instanceof Function) {
            setCallbackTimer(callback, targetStat, 50);
            delete callbacks[target];
        }

        return true;
    }

    function setCallbackTimer(callback, target, millSec) {
        setTimeout(function() {
            callback(target);
        }, millSec);
    }

    function buildUrl(baseUrl, stat) {
        var urlToken = baseUrl.split('?');
        var uri = urlToken[0] , query = urlToken[1];
        if (query) {
            query += '&';
        } else {
            query = '';
        }
        query += $.param(stat);

        var url = uri + '?' + query; 
        return url;
    }

    function send(url, now) {
        new Image().src = url;
    }

    function isEmpty(o) {
        for ( var p in o ) { 
            if ( o.hasOwnProperty( p ) ) {
                return false; 
            }
        }
        return true;
    }

    //单元测试接口，非公开
    function getTarget(target) {
        if (!target) {
            return undefined;
        }
        return workingTargets[target];
    }

    //测试接口，非公开
    function sendOldStat(code, option) {
        var stat = {
                    't' : Date.now(),
                    'code' : code
                    };
        $.extend(stat, option);
        var url = buildUrl(statUrl, stat);
        send(url, 1);
    }

    //监听用户离开或关闭窗口事件
    $.each(['blur', 'pagehide', 'beforeunload', 'unload'], 
                function(i, event){
                    var eventHandler = 'on' + event;
                    if (window[eventHandler] !== undefined) {
                        $(window).bind(event, terminate);
                    }
                });
     
/**
 * @module common:widget/stat
 */
module.exports = {
        start : start,
        addStat : addStat,
        submit : submit,
        getTarget : getTarget,
        sendOldStat : sendOldStat
};



});