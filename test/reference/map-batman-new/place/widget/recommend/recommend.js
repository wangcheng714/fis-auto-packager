/**
 * @file recommend-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var url = require("common:widget/url/url.js"),
    stat = require('common:widget/stat/stat.js');

/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';
    var $rs = $('.place-widget-recommend ul li');
    $rs.on('click', gotoDetail);
}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';
    var $rs = $('.place-widget-recommend ul li');
    $rs.off('click', gotoDetail);
}

/**
 * 跳转到详情页
 * @param {event} e 事件对象
 */
function gotoDetail(e) {
    'use strict';

    var $item = $(e.target).closest('li'),
        cur_url = location.href,
        uid = $item.attr('data-uid'),
        newurl,
        name_src = $('.place-widget-captain .name').text(),
        name_dest = $item.find('p').eq(0).text().substr(2),
        lastIndex = cur_url.lastIndexOf("/"),
        leftp,
        rightp;

    leftp = cur_url.slice(0, lastIndex).replace(/qt=[A-Za-z]*/g, 'qt=inf');
    rightp = cur_url.slice(lastIndex);   
    newurl = leftp + '&uid=' + uid + rightp;

    stat.addCookieStat(STAT_CODE.PLACE_CATER_DETAIL_RECOMMEND_CLICK, {'name': name_src}, function(){
        url.navigate(newurl);
    });

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/recommend
 */
module.exports = {

    init: function() {
        'use strict';

        bindEvents();

    }
};