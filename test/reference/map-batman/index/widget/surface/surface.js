/*
 * @fileoverview 浮层隐藏
 * @author xiaole@baidu.com
 * @date 2013/10/30
 */

var util        = require('common:static/js/util.js'),
    url         = require('common:widget/url/url.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    geolocator  = require('common:widget/geolocation/geolocation.js'),
    locator     = require('common:widget/geolocation/location.js'),
    quickdelete = require('common:widget/quickdelete/quickdelete.js'),
    suggestion  = require('common:widget/suggestion/suggestion.js'),
    poisearch   = require('common:widget/search/poisearch.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = {

    init : function () {
        this.bind();
    },

    bind : function () {
        $('.close').on('click', function() {
            $('.return-wap').hide();
            $('.common-widget-back-top').css('bottom', '0');
        });
    }
}