/**
 * @fileOverview 周边推荐-银行
 * @author jican@baidu.com
 * @data 2013/08/02
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    searchData = require('common:static/js/searchdata.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator = require('common:widget/geolocation/location.js'),
    helper = require('index:widget/helper/helper.js');

var id = 'bank',
    tpl = __inline('bank.tmpl');

module.exports = {

    init : function  (pagename) {
        this.pagename = pagename;
        this.render();
        this.bind();
    },

    render : function () {
        $('.index-widget-bank').html(tpl(helper.cates[id]));
    },

    bind : function () {
        $('.index-widget-bank [jsaction]').on('click', this._go);
    },

    _go : function (evt) {
        helper.go(evt, 'bank');
    }
}