define('third:widget/cateinfo/cateinfo.js', function(require, exports, module){

/**
 * @fileoverview 行业细分
 * @author jican@baidu.com
 * @date 2013/08/01
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    helper = require('index:widget/helper/helper.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = {

    init : function () {
        this.bind();
    },

    bind : function () {
        var _this = this;
        $('.index-widget-cateinfo [jsaction]').on('click', function (evt) {
            var target = $(evt.currentTarget);
            _this.search(target.attr('userdata'));
        });
    },

    search : function (userdata) {
        eval('var hash = ' + userdata);

        //九宫格点击量 by jican
        stat.addCookieStat(STAT_CODE.STAT_CATEINFO_CLICK, {
            cate: hash.cate,
            name: hash.wd
        });

        url.update(helper.getHash(hash));
    }
}

});