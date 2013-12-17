
/*
 * @fileoverview 搜索框View
 * @author jican@baidu.com
 * @date 2013/01/22
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    geolocator = require('common:widget/geolocation/geolocation.js'),
    preloader = require('common:widget/map/preloader/preloader.js'),
    locator = require('common:widget/geolocation/location.js');

module.exports = {

    init : function () {
        this.bind();
    },
    
    bind : function () {
        $('.index-widget-tabgroup [jsaction]').on('click', $.proxy(this.go, this));
    },

    go : function (e) {
        var target = $(e.currentTarget);
        switch(target.attr('jsaction')) {
            case 'toNavSearch' : {
                var query = {
                    'qt'        : 'cur',
                    'wd'        : locator.getCity() || '全国',
                    'from'      : 'maponline',
                    'tn'        : 'm01',
                    'ie=utf-8'  : 'utf-8'
                }
                if(window.localStorage) {
                   localStorage.input = $("#se-input-poi").val();
                } 
                url.update({
                    query : query,
                    pageState: {tab:'line'}
                }, {
                    queryReplace : true,
                    pageStateReplace : true
                });
                break;
            }
            case 'toNearBySearch' : {
                url.update({
                    module: 'index',
                    action: 'index',
                    query: {
                        'foo': 'bar'
                    },
                    pageState: {tab:'place'}
                }, {
                    queryReplace : true,
                    pageStateReplace : true
                });
                break;
            }
            case 'tomap' : {
                //并行加载底图数据 需要在url.update之前执行 by jican 
                preloader.loadTiles('mapclick');

                url.update({
                    pageState: {vt: 'map'}
                }, {
                    pageStateReplace : true
                });
                break;
            }
        }
        return false;
    }
}