define('index:widget/nearbytip/nearbytip.js', function(require, exports, module){

'use strict';
    module.exports  = {
        /**
         * 加载CMS tip配置文件
         */
        loadCmsAdConfig: function (callback) {
            var t = new Date().getTime(),
                head = document.getElementsByTagName('HEAD').item(0),
                script = document.createElement('script');

            script.type = 'text/javascript';
            script.src = 'http://map.baidu.com/zt/cms/webapp-movie-tip.js?' + t;
            script.onload = $.proxy(callback, this);
            head.appendChild(script);
        },

        init: function () {
            this.loadCmsAdConfig(function () {
                var me = this;
                if (window.movie_tip) {
                    $(".tip-text").text(window.movie_tip);
                    $(".index-widget-nearbytip").show();
                }
            });
        }
    };


});