'use strict';

var util = require('common:static/js/util.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    appHash = window._APP_HASH,

    bottomBanner = {
        /**
         * 加载CMS广告配置文件
         */
        loadCmsAdConfig: function (callback) {
            var t = new Date().getTime(),
                head = document.getElementsByTagName('HEAD').item(0),
                script = document.createElement('script');

            script.type = 'text/javascript';
            script.src = 'http://map.baidu.com/zt/cms/ws.js?' + t;
            script.onload = $.proxy(callback, this);
            head.appendChild(script);
        },
        /**
         * 获取当前哈希
         * @returns {Object}
         */
        getCurrentHash: function () {
            var curHashStr = window.location.pathname.replace('/mobile/webapp/', ''),
                hashArrs = curHashStr.split('/'),
                query = hashArrs[2],
                pageState = hashArrs[3];

            return {
                'module': appHash.module,
                'action': appHash.action,
                'query': util.urlToJSON(query || ''),
                'pageState': util.urlToJSON(pageState || '')
            };
        },
        checkDisplayBanner: function (hashObj) {
            var status = [], subStatus, op, v, qm, pn,
                bottomBannerDisplayRule = window.bottomBannerDisplayRule,
                module = hashObj.module,
                action = hashObj.action,
                query = hashObj.query,
                pagestate = hashObj.pageState;

            if (!bottomBannerDisplayRule) {
                return false;
            }

            $.each(bottomBannerDisplayRule, function (i, rl) {
                subStatus = [];

                if (rl['module']) {
                    op = rl['module'].substring(0, 1);
                    v = rl['module'].substring(1);

                    subStatus.push(op === '!' ? v.indexOf(module) === -1 : v.indexOf(module) > -1);
                }

                if (rl['action']) {
                    op = rl['action'].substring(0, 1);
                    v = rl['action'].substring(1);
                    subStatus.push(op === '!' ? v.indexOf(action) === -1 : v.indexOf(action) > -1);
                }

                if (rl['query']) {
                    $.each(rl['query'], function (m, qp) {
                        op = qp.substring(0, 1);
                        v = qp.substring(1);
                        qm = query[m] || undefined;
                        subStatus.push(op === '!' ? v.indexOf(qm) === -1 : v.indexOf(qm) > -1);
                    });
                }

                if (rl['pagestate']) {
                    $.each(rl['pagestate'], function (n, pp) {
                        op = pp.substring(0, 1);
                        v = pp.substring(1);
                        pn = pagestate[n] || undefined;
                        subStatus.push(op === '!' ? v.indexOf(pn) === -1 : v.indexOf(pn) > -1);
                    });
                }
                status.push(subStatus.indexOf(false) === -1);
            });

            if (status.indexOf(true) !== -1) {
                return true;
            }
            return false;
        },
        getPageConfig: function () {
            var cmsConfig = window.webapp_cms_bottom_download_img,
                opts = this.getCurrentHash(),
                module = opts.module,
                action = opts.action,
                query = opts.query,
                pageState = opts.pageState,
                config = {},
                cmsList, transiWds, driveWds;

            this.cmsDisplayRule = window.bottomBannerDisplayRule;

            if (!cmsConfig || !this.checkDisplayBanner(opts)) {
                return null;
            }

            //try 是保证该模块都没有配置的情况，如果该模块没有配置就置null
            try {
                cmsList = cmsConfig[module][action];
            } catch (e) {
                cmsList = null;
            }

            if (!cmsList) {
                if (cmsConfig['other']) {
                    cmsList = cmsConfig['other'];
                } else {
                    return null;
                }
            }

            if (!cmsList) {
                return null;
            }

            config.bgUrl = this.hasInstalled ? cmsList.openUrl : cmsList.downloadImgUrl;
            config.needOpen = cmsList.needOpen == 'no' ? false : true;

            if (util.isIPhone()) {
                config.srcUrl = cmsList.iponeSrc;
            } else if (util.isAndroid()) {
                config.srcUrl = cmsList.androidSrc;
            } else if (util.isIPad()) {
                config.srcUrl = cmsList.ipadSrc;
            } else {
                config.srcUrl = cmsList.androidSrc;
            }
            return config;
        },
        renderAfterLoaded: function () {
            var me = this;
            var config = this.getPageConfig();
            me.needOpen = config.needOpen;

            if (config) {
                this.$el
                    .css('background-image', 'url(' + config.bgUrl + ')')
                    .attr('data-href', config.srcUrl)
                    .show();

                broadcaster.broadcast('sizechange');
            } else {
                this.$el.hide();
            }
        },
        init: function () {
            this.loadCmsAdConfig(function () {
                var me = this;
                this.$el = $('.common-widget-bottom-banner');
                this.$el.on('click', function() {
                    if(me.hasInstalled && me.needOpen) {
                        location.href = 'bdapp://map/';
                    } else {
                        open($(this).attr('data-href'), '_blank');
                    }
                });

                if (window.webapp_cms_bottom_download_img) {
                    if (this.hasInstalled === undefined) {
                        util.getNativeInfo('com.baidu.BaiduMap', function (data) {
                            me.hasInstalled = (data.error === 0);
                            me.renderAfterLoaded();
                        }, function () {
                            me.hasInstalled = false;
                            me.renderAfterLoaded();
                        });
                    } else {
                        me.renderAfterLoaded();
                    }
                }
            });
        }
    };

module.exports = bottomBanner;