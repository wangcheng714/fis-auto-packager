/**
 * @file tosearch-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

/**
 * @module place/widget/tosearch
 */
module.exports = {

    init: function() {
        'use strict';

        var $name = $('.place-widget-tosearch .name');
		$name.css('max-width', $('body').offset().width - 200 + 'px');
		$(window).on('resize', function(){
		    $name.css('max-width', $('body').offset().width - 200 + 'px');
		});

    }
};

