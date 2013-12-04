/**
 * @fileoverview 附近搜索
 * @author jican@baidu.com
 * @date 2013/08/01
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    helper = require('index:widget/helper/helper.js'),
    stat = require('common:widget/stat/stat.js'),
    locator = require('common:widget/geolocation/location.js');

module.exports = {

    init: function(pagename) {
        this.bind();
        this.page = pagename;
    },

    bind: function() {
        var _this = this;
        $('.index-widget-nearby [jsaction]').on('click', function(evt) {
            var target = $(evt.currentTarget);

            if(target.find('.ui3-taxi').length > 0) {
                location.href = 'http://taxi.map.baidu.com';
            } else {
                _this.search(target);
            }
        });
    },

    search: function(target) {
        eval('var hash = ' + target.attr('userdata'));
        //九宫格点击量 by jican
        stat.addCookieStat(STAT_CODE.STAT_NEARBY_CLICK, {
            id: hash.id
        });

        if (hash.wd == '团购') {
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
        } else if (hash.wd == '地铁图') {
            //检查当前城市是否有地铁
            var supportCityInfo = util.ifSupportSubway(locator.getCityCode());
            if(!supportCityInfo) {
                //不支持地铁，跳转至地铁城市选择页面
                target.attr("href","/mobile/webapp/index/setsubwaycity/force=simple");
            } else {
                var sarr = supportCityInfo.split(',')
                target.attr("href","/mobile/webapp/subway/show/city="+sarr[0]+"/ref=index");
            }
        } else if (hash.wd == '全景') {
            target.attr("href","/mobile/webapp/index/sventry/force=simple");
        } else{
            url.update(helper.getHash(hash));
        }
    }
}