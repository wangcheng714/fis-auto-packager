/**
 * @file 界面加载管理器
 * @author liushuai02@baidu.com
 */

(function (global, BigPipe, undefined) {
    'use strict';

    var popup = require('common:widget/popup/popup.js'),
        cookie = require('common:widget/cookie/cookie.js'),
        util = require('common:static/js/util.js'),
        LoadManager = {
            pageControllerMap: {
                home: require('taxi:widget/home/home.js'),
                waiting: require('taxi:widget/waiting/waiting.js'),
                resubmit: require('taxi:widget/resubmit/resubmit.js'),
                response: require('taxi:widget/response/response.js'),
                verify: require('taxi:widget/verify/verify.js'),
                settings: require('taxi:widget/settings/settings.js'),
                about: require('taxi:widget/about/about.js')
            },
            getPageOptions: function () {
                return util.urlToJSON(cookie.get('BAIDU_TAXI_PAGE_OPTIONS')) || {};
            },
            /**
             * 发起打车相关请求
             * @param {object} options 请求的参数
             * @param {object} options.data 请求的url参数
             * @param {function} options.success 请求成功回调函数
             * @param {function} options.error 请求失败回调函数
             */
            request: function (options) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/mobile/webapp/taxi/api/' + util.jsonToQuery($.extend({}, options.data, {
                        api: 2,
                        os: 'webapp'
                    })),
                    success: function (data) {
                        if (data && data.errno === 0) {
                            if (options.success && $.isFunction(options.success)) {
                                options.success(data);
                            }
                        } else {
                            if (options.error && $.isFunction(options.error)) {
                                options.error(data);
                            }
                        }
                    },
                    error: function(xhr, type, error) {
                        popup.open({
                            text: '当前网络无法使用，请稍后重试！',
                            layer: true
                        });
                        if($.isFunction(options.error) && xhr && (xhr.errno > 0)) {
                            options.error();
                        }
                    },
                    complete: options.complete
                });
            },
            loadPage: function (page, options) {
                var id, that = this, lastPage, pageController, $wrapper = $('#wrapper');

                page = page || that.getPageState('lastPage') || 'home';
                if (options) {
                    if (typeof(options) === 'object') {
                        options = util.jsonToQuery(options);
                    }
                    cookie.set('BAIDU_TAXI_PAGE_OPTIONS', options);
                }

                id = 'taxi-pagelet-' + page;

                BigPipe.asyncLoad({id: id}, options, function () {
                    popup.close();
                    $('<div/>').attr({
                        id: id
                    }).appendTo($wrapper.html(''));

                    // 当前页与上一页不一样时，认为是页面间跳转，否则视为页面初始刷新，不做销毁处理
                    if (that.getPageState('lastPage') !== page) {
                        // 销毁上一个页面
                        lastPage = that.getPageState('lastPage');
                        pageController = that.pageControllerMap[lastPage];
                        if (pageController && pageController.destroy && $.isFunction(pageController.destroy)) {
                            pageController.destroy();
                        }

                        that.setPageState('lastPage', page);
                    }
                });
            },
            route: function () {
                var that = this, orderId;

                orderId = cookie.get('BAIDU_TAXI_ORDER_ID');
                if (orderId) {
                    this.request({
                        data: {
                            qt: 'orderstatus',
                            order_id: orderId
                        },
                        success: function (data) {
                            var status = data.info && data.info.status;

                            switch (status) {
                                // 第三方数据返回，但已过期120s，进入重发页面
                                case -1:
                                    that.loadPage('resubmit');
                                    break;
                                // 第三方抢单数据已返回，进入司机应答页
                                case 2:
                                    that.loadPage('response');
                                    break;
                                // 订单创建成功，进入推送页
                                case 1:
                                    that.loadPage('waiting');
                                    break;
                                // 订单过期、无效、成单、结束清除状态cookie回到首页
                                case 3:
                                case -2:
                                case 3:
                                case 4:
                                    cookie.remove('BAIDU_TAXI_PAGE_STATE');
                                    that.loadPage('home');
                                    break;
                                default:
                                    cookie.remove('BAIDU_TAXI_PAGE_STATE');
                                    that.loadPage('home');
                                    break;

                            }

                            // 保存订单状态
                            that.setPageState('status', status);
                            // 保存订单存在时间
                            that.setPageState('existTime', data.info.exist_time);
                        },
                        error: function (xhr, type, error) {
                            cookie.remove('BAIDU_TAXI_PAGE_STATE');
                            that.loadPage('home');
                        }
                    });
                } else {
                    this.loadPage(this.getPageState('lastPage'));
                }
            },
            getPageState: function (key) {
                var pageState = util.urlToJSON(cookie.get('BAIDU_TAXI_PAGE_STATE'));

                return pageState && pageState[key];
            },
            setPageState: function (key, value) {
                var pageState = util.urlToJSON(cookie.get('BAIDU_TAXI_PAGE_STATE'));

                pageState[key] = value;
                cookie.set('BAIDU_TAXI_PAGE_STATE', util.jsonToQuery(pageState));
            },
            removePageState: function (key) {
                this.setPageState(key, undefined);
            },
            init: function () {
                popup.open({
                    text: '正在加载...',
                    layer: true,
                    autoCloseTime: 0
                });
                this.route();
            }
        };

    LoadManager.init();
    global.LoadManager = LoadManager;
}(window, BigPipe));

