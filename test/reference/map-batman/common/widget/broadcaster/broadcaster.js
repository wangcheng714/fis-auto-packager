/**
 * @file 广播收发器，实现模块间的无耦合通信，本文件不依赖任何库文件
 * @author liushuai02@baidu.com
 */
'use strict';

// 判断参数是否是函数，为使本文件不依赖其它库文件而设计
function isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
}

/**
 * 广播名称->订阅者 映射表
 * @private
 * @type {object}
 */
var sMap = {};
/**
 * @module common:widget/broadcaster/broadcaster
 */
module.exports = {
    // 调试时使用
    __subscriberMap__: sMap,
    /**
     * 订阅广播
     * @param {string} name 广播的名称
     * @param {function} handler 收听到广播的处理函数，函数的参数分别为data - 广播数据，options - 广播配置
     * @param {object} [context] 要退订的广播处理函数的执行对象(函数中执行时this所指的对象)
     * @example
     * // 某widget模块js文件代码
     * var broadcaster = require('common:widget/broadcaster/broadcaster.js');
     *
     * // 订阅广播SOME_BROADCAST，当有任意模块(*包括本模块*)发布广播时，都会触发此处传入的handler
     * broadcaster.subscribe('SOME_BROADCAST', function(data, options) {
     *     // Bla, bla
     * }, context);
     */
    subscribe: function (name, handler, context) {
        var subscribers = (sMap[name] = sMap[name] || []),
            i, len, s;

        for (i = 0, len = subscribers.length; i < len; i++) {
            s = subscribers[i];
            if (s.handler === handler && s.context === context) {
                return false;
            }
        }
        if (isFunction(handler)) {
            subscribers.push({handler: handler, context: context });
        }
    },
    /**
     * 退订广播
     * @param {string} name 广播名称
     * @param {function} handler 要退订的广播处理函数
     * @param {object} [context] 要退订的广播处理函数的执行对象(函数中执行时this所指的对象)
     */
    unsubscribe: function (name, handler, context) {
        var subscribers = sMap[name] || [], s;
        for (var i = 0, len = subscribers.length; i < len; i++) {
            s = subscribers[i];
            if (s.handler === handler && s.context === context) {
                subscribers.splice(i, 1);
                if(subscribers.length === 0) {
                    delete sMap[name];
                }
            }
        }
    },
    /**
     * 发出广播
     * @param {string} name 广播名称
     * @param {object} [data] 广播数据
     * @param {object} [options] 广播参数，用以使收听者根据不同参数做不同处理
     */
    broadcast: function (name, data, options) {
        var subscribers = sMap[name] || [],
            i, len, s;

        for (i = 0, len = subscribers.length; i < len; i++) {
            s = subscribers[i];

            if (isFunction(s.handler)) {
                s.handler.call(s.context, data, options);
            }
        }
    }
};


