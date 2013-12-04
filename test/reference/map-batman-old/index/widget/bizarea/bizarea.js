/**
 * @fileoverview 热门商圈
 * @author jican@baidu.com
 * @date 2013/08/01
 */

var util = require('common:static/js/util.js'),
    searchData = require('common:static/js/searchdata.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator = require('common:widget/geolocation/location.js'),
    helper = require('index:widget/helper/helper.js');

module.exports = {

    hasGetData : false,

    curRenderCity : '', //当前渲染过热门商圈的城市名称

    init : function (isrendered) {

        this.wrap = $('.index-widget-bizarea');

        if(!!isrendered) {
            this.curRenderCity = locator.getCityCode();
            this.wrap.show();
        } else {
            if(locator.getCityCode()!=1) {
                this._render();
            }
        }

        this._bindGeoEvent();
    },

    _render: function () {
        helper.visible(this.wrap, function(){
            this.render();
        }, this);
    },

    _bindGeoEvent : function () {
        broadcaster.subscribe('geolocation.success', this.render, this);
    },

    render : function () {

        if(
            !this.hasGetData ||
            (this.curRenderCity!=locator.getCityCode() && locator.getCityCode()!=1)
        ) {

            this.hasGetData = true;
            this.curRenderCity = locator.getCityCode();

            var tpl = __inline('bizarea.tmpl');

            var _this = this,
                host = '/mobile/webapp/index/index/?',
                param = {
                    'async'     : '1',
                    'fn'        : 'gethotarea',
                    'mmaptype'  : 'simple',
                    'cityname'  : locator.getCity()
                },
                requestUrl = host + util.jsonToUrl(param);

            $.ajax({
                'url': requestUrl,
                'dataType': 'jsonp',
                'success' : function(response){
                    try {
                        var json = response;
                        if(json && json.data && json.data.area) {
                            _this.wrap.show();
                            _this.wrap.html(tpl({
                                'data'  : json.data
                            }));
                        } else {
                            _this.error();
                        }
                    } catch (e){
                        _this.error();
                    }
                },
                'error': function(xhr, errorType){
                    _this.error();
                }
            });
        }
    },

    error : function () {
        this.wrap.hide();
    }
}