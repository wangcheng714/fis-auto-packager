define('place:widget/recommend/recommend.js', function(require, exports, module){

/**
 * @file recommend-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var $rs = $('.place-widget-recommend ul li'), //附近美食元素集合
    stat = require('common:widget/stat/stat.js');

/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    $rs.on('click', gotoDetail);
}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    $rs.off('click', gotoDetail);
}

/**
 * 跳转到详情页
 * @param {event} e 事件对象
 */
function gotoDetail(e) {
    'use strict';

    var $item = $(e.target).closest('li'),
        url = location.href,
        uid = $item.attr('data-uid'),
        newurl,
        name_src = $('.place-widget-captain .name').text(),
        name_dest = $item.find('p').eq(0).text().substr(2),
        lastIndex = url.lastIndexOf("/"),
        leftp,
        rightp;

    leftp = url.slice(0, lastIndex).replace(/qt=[A-Za-z]*/g, 'qt=inf');
    rightp = url.slice(lastIndex);   
    newurl = leftp + '&uid=' + uid + rightp;

    stat.addCookieStat(STAT_CODE.PLACE_CATER_DETAIL_RECOMMEND_CLICK, {'name': name_src}, function(){
        location.href = newurl;
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

});