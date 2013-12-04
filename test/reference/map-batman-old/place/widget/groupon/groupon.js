/**
 * @file groupon-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var $uls = $('.place-widget-groupon-main'), //团购信息层元素集合
    $prev = $('.place-widget-groupon-pagenum-prev'), //上一页元素
    $next = $('.place-widget-groupon-pagenum-next'), //上一页元素
    $curpage = $('.place-widget-groupon-curpage'), //当前页面元素
    $totalpage = $('.place-widget-groupon-totalpage'), //总页数
    stat = require('common:widget/stat/stat.js'),
    statData;

/**
 * 跳转到团购详情页
 * @param {event} e 事件对象
 */
function gotoSee(e) {
    'use strict';

    var url = $(e.target).closest('ul').attr('url'),
        dest = $('.place-widget-groupon-site').text();

    stat.addStat(STAT_CODE.PLACE_GROUPON_CLICK, {'wd': statData.wd, 'name': statData.name, 'dest':dest, 'srcname': statData.srcname});

    window.open(url);

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 显示上一页
 * @param {event} e 事件对象
 */
function goPrev(e) {
    var cp = $curpage.html()-0; //当前页面索引

    if($next.hasClass('place-widget-groupon-disable')){
        $next.removeClass('place-widget-groupon-disable');
    }

    if(!$prev.hasClass('place-widget-groupon-disable')){
        $next.on('click', goNext);

        $uls.hide();
        $uls.eq(cp-2).show();
        $curpage.html(cp-1);
        if(cp-2==0){
            $prev.addClass('place-widget-groupon-disable');
            $prev.off('click', goPrev);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function goNext(e) {
    var cp = $curpage.html() - 0, //当前页面索引
        total = $totalpage.html() - 0; //总页数

    if($prev.hasClass('place-widget-groupon-disable')){
        $prev.removeClass('place-widget-groupon-disable');
    }


    if(!$next.hasClass('place-widget-groupon-disable')){
        $prev.on('click', goPrev);

        $uls.hide();
        $uls.eq(cp).show();
        $curpage.html(cp+1);
        if(cp+1==total){
            $next.addClass('place-widget-groupon-disable');
            $next.off('click', goNext);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/groupon
 */
module.exports = {

    init: function( data ) {
        'use strict';

        var total = $totalpage.html()-0; //总页数
        
        statData = data || {};

        $uls.on('click', gotoSee);
        if(total>1){
            $prev.on('click', goPrev);
            $next.on('click', goNext);
        }


        stat.addStat(STAT_CODE.PLACE_GROUPON_VIEW, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});

    }
};