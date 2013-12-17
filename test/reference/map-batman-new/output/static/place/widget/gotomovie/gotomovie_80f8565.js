define('place:widget/gotomovie/gotomovie.js', function(require, exports, module){

/**
 */
'use strict';



var util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js');  //商户电话

stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_SHOW);
/**
 * 绑定事件
 */
function bindEvents() {
    var $telephone = $('#detail-phone');
    $telephone.on('click', showTelBox);

}

/**
 * 解绑事件
 */
function unbindEvents() {
    var $telephone = $('#detail-phone');
    $telephone.off('click', showTelBox);
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function showTelBox(e) {
    var wd = $('.common-widget-nav .title span').text(),
        name = $('.place-widget-captain').find('.name').text();

    stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_CLICK, {'wd': wd, 'name':name});

    var  $target = $(e.target).closest('a');
    if(util.isAndroid()){
        $target.attr('href','javascript:void(0)');
        util.TelBox.showTb($target.attr('data-tel'));
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/telephone
 */
module.exports = {
    init: function() {
        bindEvents();

    }
};

});