define('third:widget/searchsite/searchsite.js', function(require, exports, module){

/*
 * @fileoverview 搜索框View
 * @author jican@baidu.com
 * @date 2013/01/22
 */

var util       = require('common:static/js/util.js'),
    url        = require('common:widget/url/url.js'),
    stat       = require('common:widget/stat/stat.js'),
    poisearch  = require('common:widget/search/poisearch.js');

module.exports = {

    init : function () {
        this.render();
        this.bind();
    },

    render : function () {
        var _this = this;
        _this.bind();
    },

    bind : function () {
        $('.search').on('click', $.proxy(this.submit, this));
    },

    submit : function (evt) {
        var poiInput = $('.se-input-poi');
        if(!this._checkInput(poiInput)){
            return false;
        }
        
        poiInput.blur();
        //路线，站点的检索量
        stat.addCookieStat(STAT_CODE.STAT_TRANSIT_SITE_CLICK);
        poisearch.search(poiInput.val());

        return false;
    },

    /**
     * 检查表单元素内容是否为空 自动聚焦
     * @param {Element} element
     * @return {Boolean} 是否检查通过
     * @author jican
     * @date 2013/01/21
     */
    _checkInput : function (element) {
        if(!element) {
            return false;
        } else if (!/\S+/.test(element.val())) {
            element.focus();
            return false;
        }
        return true;
    }
}

});