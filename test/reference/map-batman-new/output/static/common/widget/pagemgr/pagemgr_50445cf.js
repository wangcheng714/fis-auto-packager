define('common:widget/pagemgr/pagemgr.js', function(require, exports, module){

/**
 * @fileOverview page管理组件
 * @author caodongqing@baidu.com
 */

var isPushState = window._isPushState,
	stepLength = 0,
	eid = 0,
    loadStatus = 1,
    statusType = {
        'switchstart' : 1,
        'pagearrived' : 2,
        'switchend' : 3,
        'pageloaded' : 4
    },
    // 页面到达类型，类型有  landing: 落地页， fromcache: 通过缓存，quickling: 通过quickling
    initiatorType = ["landing","quickling","fromcache"],
    pageInitiator = "landing",
    destoryCallback = [];


/**
 * 获取refer页面的host
 * @return {string} refer的host
 */
var getReferHost = function () {
    var refer = document.referrer,
        hostReg = /^.*?\/\/(.*?)(\/|\?|\#|$)/i,
        match = refer.match(hostReg),
        referHost;
    if(match) {
        referHost = match[1];
    }

    return referHost;
};

/**
 * 判断是否落地页
 * @return {Boolean}
 */
var isLandingPage = function () {
    if(_isPushState) {
        return stepLength === 0;
    } else {
        return window.location.host !== getReferHost();
    }
};

var isSinglePageApp = function(){
    return _isPushState;
};

var getInitiator = function(){
    return pageInitiator;
};

// 设置页面发起者
var setInitiator = function(type) {
    if(initiatorType[type]) {
        pageInitiator = initiatorType[type];
    }
};


/**
 * 判断是否是站内跳转
 * @return {Boolean}
 */
var isAppNavigate = function () {
    if(_isPushState) {
        return true;
    } else {
        return window.location.host === getReferHost();
    }
};

/**
 * 记录状态，并返回当前状态的eid
 * @param  {[type]} status [description]
 * @return {[type]}        [description]
 */
var recordAndGetEid = function(status) {

    if(!statusType[status]) {
        return;
    }

    // 页面开始加载前自增eid
    // 或者目前加载状态已经是完成态了，自增eid，这种情况是因为目前asyncload也会派发 pageloaded事件
    if( status === "switchstart" || loadStatus === statusType['pageloaded'] ) {
        eid++;
    }

    // 加载状态记录状态
    loadStatus = statusType[status];
    return eid;
};
var bindEvent = function(){
    appPage.on('onpagerenderstart', function(e) {
    	var options = e || {};
    	options.eid = recordAndGetEid('switchstart');

        listener.trigger('common.page', 'switchstart',options);

    });

    // 页面刚刚到达时间
    appPage.on('onpagearrived', function(e) {
        var options = e || {};
        options.eid = recordAndGetEid('pagearrived');

        // 设置发起者
        setInitiator(e.initiator);

        listener.trigger('common.page', 'pagearrived', options);
    });

    // 页面渲染完成时间
    appPage.on('onpagerendercomplete', function(e) {
        var options = e || {};

        options.eid = recordAndGetEid('switchend');
        stepLength++;

        // 执行销毁
        destory();

        listener.trigger('common.page', 'switchend',options);

    });

    // 所有页面脚本样式资源加载完成时间
    appPage.on('onpageloaded', function(e) {
        var options = e || {};
        options.eid = recordAndGetEid('pageloaded');

        listener.trigger('common.page', 'pageloaded', options);
    });

}

var destory = function() {
    $.each(destoryCallback,function(index,item){
        item();
    });
    destoryCallback = [];
}

var registerDestory = function(callback){
    if($.isFunction(callback)) {
        destoryCallback.push(callback);
    }
}

var init = function() {
	bindEvent();
}

module.exports = {
	init : init,
    getInitiator : getInitiator,
    registerDestory : registerDestory,
    isLandingPage : isLandingPage,
    isSinglePageApp : isSinglePageApp,
    isAppNavigate : isAppNavigate
};


});