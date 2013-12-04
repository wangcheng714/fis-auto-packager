/**
 * @fileoverview 附近搜索
 * @author jican@baidu.com
 * @date 2013/08/01
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    helper = require('index:widget/helper/helper.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = {

    init : function (pagename) {
        this.bind();
        this.page = pagename;
    },

    bind : function () {
        var _this = this;
        $('.index-widget-nearby [jsaction]').on('click', function (evt) {
            var target = $(evt.currentTarget);
            _this.search(target.attr('userdata'));
        });
    },

    search : function (userdata) {
        eval('var hash = ' + userdata);

        //九宫格点击量 by jican
        stat.addCookieStat(STAT_CODE.STAT_NEARBY_CLICK, {
            id: hash.id
        });

        if(hash.wd=='团购') {
            var host = 'http://mtuan.baidu.com/view?z=2&from=map_webapp&to_url=';
            window.location = host + encodeURIComponent(location.href);
        } else {
            url.update(helper.getHash(hash));
        }
    }
}