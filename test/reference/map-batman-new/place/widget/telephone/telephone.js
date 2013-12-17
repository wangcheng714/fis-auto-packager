/**
 * @file telephone-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */
'use strict';

var util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js'),
    statData;

/**
 * 绑定事件
 */
function bindEvents() {
    var $telephone = $('.place-widget-telephone');
    $telephone.on('click', showTelBox);

}

/**
 * 解绑事件
 */
function unbindEvents() {
    var $telephone = $('.place-widget-telephone');
    $telephone.off('click', showTelBox);
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function showTelBox(e) {
    var $target = $(e.target).closest('a'),
        reg = /searchFlag=([A-Za-z]+)/g,
        matches,
        searchFlag,
        statOpts;

    (matches = reg.exec(location.href)) && (searchFlag = matches[1])

    statOpts = {
        'wd': statData.wd, 
        'name': statData.name, 
        'srcname': statData.srcname, 
        'entry': searchFlag
    };
    stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_CLICK, statOpts);

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/telephone
 */
module.exports = {
    init: function( data ) {
        bindEvents();

        statData = data || {};

        stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_SHOW, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});
    }
};