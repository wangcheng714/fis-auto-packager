/**
 * @fileoverview 附近搜索
 * @author jican@baidu.com
 * @date 2013/08/01
 */
'use strict';

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    helper = require('third:widget/helper/helper.js'),
    stat = require('common:widget/stat/stat.js'),
    locator = require('common:widget/geolocation/location.js');

module.exports = {

    init: function() {
        this._ifSupportSubway();
        this.bind();
    },

    bind: function() {
        var _this = this;
        $('.search-button').on('click', $.proxy(_this.search, _this));
    },
    //检查当前城市是否支持
    _ifSupportSubway: function(){
        var cityCode = $('#current-city').data('code') || locator.getCityCode();
        var supportCityInfo = util.ifSupportSubway(cityCode);
        if(supportCityInfo) {
            //支持地铁，显示地铁的按钮
            $('.subway-button').show();
        }
    },

    search: function(e) {
        var cityCode = $('#current-city').data('code') || locator.getCityCode(),
            target = $(e.target),
            wd = target.data('wd'),
            _opts;

        if (wd == '地铁图') {
            //检查当前城市是否有地铁
            var supportCityInfo = util.ifSupportSubway(cityCode);
            var sarr = supportCityInfo.split(',');
            _opts = {
                'module': 'subway',
                'action': 'show',
                'query' : {
                    'city': sarr[0] 
                }
            };
       } else{
            _opts = this.getHash({wd: wd, code: cityCode});    
       }
       url.update(_opts);
    },

    getHash : function (hash, opts) {
        var module = hash.module || 'search',
            action = hash.action || 'search',
            code   = parseInt(hash.code)   || 131, 
            query  = {
                'qt' : 's',
                'wd' : '',
                'c'  : code
            },
            pageState = {};

        // 对query做兼容处理
        if(hash.query) {
            query = $.extend(query, hash.query);
        } else {
            query.wd = (hash.wd || hash.word || hash.name);
            query.searchFlag = 'sort';
        }

        var curUrl = url.get(),
            curQuery = curUrl.query,
            curPageState = curUrl.pageState || {};

        var from = curPageState['from'] || '',
            centername = decodeURIComponent(
                curPageState['center_name'] || locator.getCity()
            );


       if(locator._mylocation 
               && locator._mylocation.isExactPoi
               && parseInt(locator.getMyCityCode()) === code) {
            centername = '我的位置';
            query["center_rank"] = 1; //以位置为中心点进行周边检索 
            query["nb_x"] = locator.getMyPointX();
            query["nb_y"] = locator.getMyPointY();
        }


        pageState["center_name"] = centername;
       
        return {
            'module'    : module,
            'action'    : action,
            'query'     : query,
            'pageState' : pageState
        };
    }
}
