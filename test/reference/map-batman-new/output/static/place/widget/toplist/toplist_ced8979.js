define('place:widget/toplist/toplist.js', function(require, exports, module){

/**
 * @file toplist-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var stat = require('common:widget/stat/stat.js'),
    url = require("common:widget/url/url.js"),
    wd = $('.common-widget-nav .title span').text(),
    statData;

/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    $('.place-widget-toplist').on('click', showAll);
    $('.place-widget-toplist-others').on('click', gotoDetail);
}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    $('.place-widget-toplist').off('click', showAll);
    $('.place-widget-toplist-others').off('click', gotoDetail);
}

/**
 *处理点击排行榜显示所有排行的事件
 * @param {event} e 事件对象
 */
function showAll(e) {
    'use strict';

    $('.place-widget-toplist-arrow').toggleClass('place-widget-toplist-arrowup');
    $('.place-widget-toplist-others').toggleClass('place-widget-toplist-showall');

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
        href = location.href,
        uid = $item.attr('data-uid'),
        newurl,
        name_dest = $item.find('p').eq(0).text(),
        lastIndex = href.lastIndexOf("/"),
        leftp, rightp,
        wd = $('.common-widget-nav .title span').text(),
        statOpts = {
            'wd': wd,   //注意key必须有引号
            'name_src': statData.name, 
            'name_dest': name_dest,
            'srcname': statData.srcname
        };
    
    leftp = href.slice(0, lastIndex).replace(/qt=[A-Za-z]*/g, 'qt=inf');
    rightp = href.slice(lastIndex);   
    newurl = leftp + '&uid=' + uid + rightp;

    stat.addCookieStat(STAT_CODE.PLACE_DETAIL_RANK_CLICK, statOpts, function(){
        url.navigate( newurl );
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
        var wd = $('.common-widget-nav .title span').text();
        //添加详情页排行榜的展现量
        stat.addStat(STAT_CODE.PLACE_DETAIL_RANK_VIEW, {'wd': wd, 'name': statData.name, 'srcname': statData.srcname});

    }
};

});