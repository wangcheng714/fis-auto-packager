define('common:widget/search/poisearch.js', function(require, exports, module){

/**
 * @file 地点类检索
 */

var locator = require('common:widget/geolocation/location.js');
var url = require('common:widget/url/url.js');


/**
 * 发起地点类检索
 * @param {String} word 检索关键词
 * @param {Object} opts 可选参数
 * @author jican
 * @date 2013/01/21
 */
module.exports.search = function  (word, opts) {

    if(!word) {
        return;
    }

    opts = opts || {};
    var param = {
        'qt'            : 's',
        'wd'            : word || '',
        'c'             : locator.getCityCode() || 1,
        'searchFlag'    : opts.from || 'bigBox',
        'version'       : '5',
        'exptype'       : 'dep'
    };

    if(locator.hasExactPoi()) {
        param['nb_x'] = locator.getPointX();
        param['nb_y'] = locator.getPointY();
        param['center_rank'] = 1;
    }

    //手动记录搜索开始时间 by jican
    PDC && PDC._setWtCookie();

    url.update({
        module : 'search',
        action : 'search',
        query : param
    }, {
        queryReplace : true
    });
};

});