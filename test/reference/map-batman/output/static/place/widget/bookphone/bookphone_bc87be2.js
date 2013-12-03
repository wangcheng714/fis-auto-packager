define('place:widget/bookphone/bookphone.js', function(require, exports, module){

/**
 * @file bookphone-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */
var util = require('common:static/js/util.js'),
    $bookphone = $('.place-widget-bookphone');  //商户电话
/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    $bookphone.on('click', showTelBox);

}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    $bookphone.off('click', showTelBox);
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function showTelBox(e) {
    var  $target = $(e.target).closest('a');
    if(util.isAndroid()){
        $target.attr("href","javascript:void(0)");
        util.TelBox.showTb($target.attr("data-tel"));
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/bookphone
 */
module.exports = {

    init: function() {
        'use strict';

        bindEvents();

    }
};

});