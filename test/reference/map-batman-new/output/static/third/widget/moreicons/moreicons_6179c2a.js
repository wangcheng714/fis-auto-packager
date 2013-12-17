define('third:widget/moreicons/moreicons.js', function(require, exports, module){

/**
 * @fileoverview 附近搜索
 * @author jican@baidu.com
 * @date 2013/08/01
 */
'use strict';

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    stat = require('common:widget/stat/stat.js'),
    locator = require('common:widget/geolocation/location.js');

module.exports = {

    init: function() {
        this.bind();
    },

    bind: function() {
        var _this = this;
        $('.more-icons a').on('click', function(){
           _this.search(this, _this); 
        });
    },

    search: function(obj, context) {
        var target = $(obj),
            wd = target.data('wd'),
            $curCity = $('#current-city'),
            city = $curCity.data('city'),
            code = $curCity.data('code'),
            opts = {wd : wd, code : code},
            _opts = {};

        //统计列表的分类点击（团购除外）
        if(wd && wd !== '团购'){
            stat.addCookieStat(STAT_CODE.STAT_MORE_ICONS_CLICK,{wd: wd});
        }
        
        if(wd === '团购'){
            //团购的点击统计
             stat.addStat(STAT_CODE.STAT_MORE_ICONS_CLICK,{wd: wd});
             setTimeout(function(){
                var url;      
                try{
                    if(locator.hasExactPoi()){
                        var poi = locator.getCenterPoi();
                        url = 'http://mtuan.baidu.com/t/locat?from=map_webapp&x=' + poi.x + '&y=' + poi.y + '&to_url=' + encodeURIComponent(location.href);
                    }else{
                        url = 'http://mtuan.baidu.com/t/locat?from=map_webapp&to_url=' + encodeURIComponent(location.href);
                    }                    
                }catch(e){
                    url = 'http://mtuan.baidu.com/t/locat?from=map_webapp&to_url=' + encodeURIComponent(location.href);
                }
                window.location = url;
           }, 500);
        
           return;
        }

        switch(wd){
            case '更多' : {
                _opts.module = 'index';
                _opts.action = 'more';
                break;
            }
            case '地铁图':{
                //检查当前城市是否有地铁
                var supportCityInfo = util.ifSupportSubway(code);
                if(!supportCityInfo) {
                    //不支持地铁，跳转至地铁城市选择页面
                    _opts.module = 'index';
                    _opts.action = 'setsubwaycity';
                } else {
                    var sarr = supportCityInfo.split(',')
                    _opts.module = 'subway';
                    _opts.action = 'show';
                    _opts.query  = {
                        city : sarr[0]
                    };
                }
                break;
            }
            case '全景' : {
                _opts.module = 'index';
                _opts.action = 'sventry';
                break;
            }
            case '天气' : {
                _opts.module = 'third';
                _opts.action = 'weather';
                _opts.query  = {
                    city : city,
                    code : code
                }
                break;
            }
            case '公交' : {
                _opts.module = 'third';
                _opts.action = 'transit';
                _opts.query  = {
                    city : city,
                    code : code
                }
                break;
            }
            default : {
                _opts = context.getHash(opts);
            }
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


});