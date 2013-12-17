/**
 * @file 界面加载管理器
 * @author liushuai02@baidu.com
 */

(function (global, BigPipe, undefined) {
    'use strict';

    var popup = require('taxi:widget/common/popup/popup.js'),
        util = require('common:static/js/util.js'),
        storage = require('taxi:static/js/storage.js'),
        LoadManager = {
            pageControllerMap: {
                home: require('taxi:widget/home/home.js'),
                waiting: require('taxi:widget/waiting/waiting.js'),
                resubmit: require('taxi:widget/resubmit/resubmit.js'),
                response: require('taxi:widget/response/response.js'),
                verify: require('taxi:widget/verify/verify.js'),
                settings: require('taxi:widget/settings/settings.js'),
                about: require('taxi:widget/about/about.js'),
                channel: require('taxi:widget/channel/channel.js'),
                'vip/home': require('taxi:widget/vip/home/home.js'),
                'vip/verify': require('taxi:widget/vip/verify/verify.js'),
                'vip/orderlist': require('taxi:widget/vip/orderlist/orderlist.js'),
                'vip/finish': require('taxi:widget/vip/finish/finish.js')
            },
            /**
             * 获取pageOptions值，指定key时获取指定值，否则获取全部
             * @param {string} [key] 需要获取的pageOptions键名
             * @returns {Object}
             */
            getPageOptions: function (key) {
                var options = util.urlToJSON(storage.get('pageOptions'));
                return key ? options[key] : options;
            },
            /**
             * 设置pageOptions值，可以是指定key，value，也可以直接传入options对象，将覆盖原pageOptions
             * @param {string|object} key 类型为string时作为需设置值的pageOptions键名，类型是对象时覆盖原pageOptions
             * @param {string} [value] key参数类型为string，该值作为设置的pageOptions值
             */
            setPageOptions: function (key, value) {
                var options;
                if (typeof(key) === 'string') {
                    options = this.getPageOptions();
                    options[key] = value;
                    this.setPageOptions(options);
                } else if (typeof(key) === 'object') {
                    storage.set('pageOptions', util.jsonToQuery(key));
                }
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
                                if (data) {
                                    options.error(data);
                                } else {
                                    popup.open({
                                        text: '网络数据异常！'
                                    });
                                }
                            }
                        }
                    },
                    error: function (xhr) {
                        if ($.isFunction(options.error) && xhr && (xhr.errno > 0)) {
                            options.error();
                        }
                    },
                    complete: options.complete
                });
            },
            loadPage: function (page, options, config) {
                var id, that = this, lastPage, pageController, $wrapper = $('#wrapper');
                page = page || that.getPageState('lastPage') || 'home';
                if (options) {
                    if (typeof(options) === 'object') {
                        options = util.jsonToQuery(options);
                    }
                    storage.set('pageOptions', options);
                }

                id = 'taxi-pagelet-' + this.slash2dash(page);

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

                        if (!(config && config.privacy)) {
                            that.setPageState('lastPage', page);
                        }
                    }
                });
            },
            routeVip: function () {
                var id;
                if (id = util.urlToJSON(location.search.split('?')[1]).id) {
                    this.loadPage('vip/finish', {
                        order_id: id
                    }, {
                        privacy: true
                    });
                } else if (storage.get('thirdPhone')) {
                    this.loadPage(this.getPageState('lastPage') || 'vip/home');
                } else {
                    this.loadPage('vip/verify');
                }
            },
            routeIndex: function () {
                var that = this, orderId, channel;

                if (channel = util.urlToJSON(location.search.split('?')[1]).channel) {
                    this.loadPage('channel', null, {
                       privacy: true
                    });
                } else if (orderId = storage.get('orderId')) {
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
                                    storage.remove('pageState');
                                    that.loadPage('home');
                                    break;
                                default:
                                    storage.remove('pageState');
                                    that.loadPage('home');
                                    break;

                            }
                            // 保存订单状态
                            that.setPageState('status', status);
                            // 保存订单存在时间
                            that.setPageState('existTime', data.info.exist_time);
                        },
                        error: function () {
                            storage.remove('pageState');
                            that.loadPage('home');
                        }
                    });
                } else {
                    this.loadPage(this.getPageState('lastPage'));
                }
            },
            route: function () {
                switch (window._APP_HASH.page) {
                    case 'vip':
                        this.routeVip();
                        break;
                    default:
                        this.routeIndex();
                        break;
                }
            },
            getPageState: function (key) {
                var pageState = util.urlToJSON(storage.get('pageState'));

                return pageState && pageState[key];
            },
            setPageState: function (key, value) {
                var pageState = util.urlToJSON(storage.get('pageState'));

                pageState[key] = value;
                storage.set('pageState', util.jsonToQuery(pageState));
            },
            removePageState: function (key) {
                this.setPageState(key, undefined);
            },
            slash2dash: function (string) {
                return string.replace('/', '-');
            },
            init: function () {
                // 判断localStorage是否可用
                if (storage.set('baiduTaxiLocalStorageTest', 1) !== 0) {
                    popup.open({
                        text: '检测到您的浏览器不支持缓存，您可能开启了无痕浏览模式，将无法使用本产品功能，请关闭后再试。',
                        layer: true,
                        autoCloseTime: 0
                    });
                    return false;
                } else {
                    popup.open({
                        text: '正在加载...',
                        layer: true,
                        autoCloseTime: 0
                    });
                    storage.remove('baiduTaxiLocalStorageTest');
                }

                this.route();
            }
        };
    global.LoadManager = LoadManager;
}(window, TaxiBigPipe));