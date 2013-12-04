define('place:widget/toplist/toplist.js', function(require, exports, module){

/**
 * @file toplist-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var $toplist = $('.place-widget-toplist'), //餐饮酒店排行榜根元素
    $arrow = $('.place-widget-toplist-arrow'), //箭头元素
    $others = $('.place-widget-toplist-others'), //其他排行
    stat = require('common:widget/stat/stat.js'),
    wd = $('.common-widget-nav .title span').text(),
    statData;

/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    $toplist.on('click', showAll);
    $others.on('click', gotoDetail);
}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    $toplist.off('click', showAll);
    $others.off('click', gotoDetail);
}

/**
 *处理点击排行榜显示所有排行的事件
 * @param {event} e 事件对象
 */
function showAll(e) {
    'use strict';

    $arrow.toggleClass('place-widget-toplist-arrowup');
    $others.toggleClass('place-widget-toplist-showall');

    e.stopPropagation();
    e.stopImmediatePropagation();
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
        name_dest = $item.find('p').eq(0).text(),
        lastIndex = url.lastIndexOf("/"),
        leftp, rightp,
        statOpts = {
            'wd': wd,   //注意key必须有引号
            'name_src': statData.name, 
            'name_dest': name_dest,
            'srcname': statData.srcname
        };
    
    leftp = url.slice(0, lastIndex).replace(/qt=[A-Za-z]*/g, 'qt=inf');
    rightp = url.slice(lastIndex);   
    newurl = leftp + '&uid=' + uid + rightp;

    stat.addCookieStat(STAT_CODE.PLACE_DETAIL_RANK_CLICK, statOpts, function(){
        location.href = newurl;
    });

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/toplist
 */
module.exports = {

    init: function( data ) {
        'use strict';

        bindEvents();
        statData = data || {};
        
        //添加详情页排行榜的展现量
        stat.addStat(STAT_CODE.PLACE_DETAIL_RANK_VIEW, {'wd': wd, 'name': statData.name, 'srcname': statData.srcname});

    }
};

});