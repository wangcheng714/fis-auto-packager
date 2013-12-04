/**
 * @file scopebook-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var $rs = $('.scope-ticket-name').parent(),
    $widget = $('.place-widget-scope-book'),
    stat = require('common:widget/stat/stat.js');

/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    $rs.on('click', toggleOta);
}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    $rs.off('click', toggleOta);
}

/**
 * 切换ota是否展现的状态
 */
function toggleOta(e) {
    var $item = $(e.target).closest('div'),
        $arrow = $item.find('span').eq(0),
        $ul = $item.next();

    if(!$arrow.hasClass('scope-arrow-icon-down')) {
        $rs.next().addClass('scope-book-hide');
        $rs.find('.scope-arrow-icon').removeClass('scope-arrow-icon-down');

        if($item.attr('last')) {
            $item.addClass('scope-border-bottom');
        }else{
            $rs.last().addClass('scope-border-bottom-radius');
            $rs.last().attr('style', 'border-bottom: none');
        }
    }

    $arrow.toggleClass('scope-arrow-icon-down');
    $ul.length == 0 ? null : $ul.toggleClass('scope-book-hide');

    if($item.attr('last')) {
        $item.attr('style', '');
        $item.toggleClass('scope-border-bottom-radius');
        if($item.attr('class')!='scope-border-bottom') {
            $item.attr('style', 'border-bottom: none');
        }
    }

    scrollWindow($widget);

    e.stopPropagation();
    e.stopImmediatePropagation();

 }

/**
* 滚动窗口
* @param  {Object} target 滚动到的对象
*/
function scrollWindow($target) {
    var offset = $target.offset();
    window.scrollTo(0, offset.top);
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