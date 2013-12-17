define('taxi:widget/vip/orderlist/orderlist.js', function(require, exports, module){

/**
 * @file 订单列表
 */
require('taxi:static/js/template.js');
// 这句变量定义写到逗号运算符中会导致变异出错！！
/* jshint ignore: start */
var listItemTemplate = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="captain">代叫车订单：<span class="count">',typeof(info.length) === 'undefined'?'':baidu.template._encodeHTML(info.length),'</span></div><ul class="list">    ');for(var i = 0, len = info.length; i < len; i++) {_template_fun_array.push('        <li class="list-item">            ');if(info[i].status > 1) {_template_fun_array.push('                <div class="driver-info">                    <span class="name">',typeof(info[i].driver_name) === 'undefined'?'':baidu.template._encodeHTML(info[i].driver_name),'</span>                    <span class="carno">',typeof(info[i].taxi_no) === 'undefined'?'':baidu.template._encodeHTML(info[i].taxi_no),'</span>                    <div class="reply-time">                        ');                            var date = new Date(info[i].reply_time * 1000),                                month = date.getMonth() + 1,                                day = date.getDate(),                                hours = date.getHours(),                                minutes = date.getMinutes(),                                seconds = date.getSeconds(),                                doubleReg = /\d{2}/,                                formatTime;                            month = doubleReg.test(month) ? month : '0' + month;                            day = doubleReg.test(day) ? day : '0' + day;                            minutes = doubleReg.test(minutes) ? minutes : '0' + minutes;                            seconds = doubleReg.test(seconds) ? seconds : '0' + seconds;                            formatTime = date.getFullYear() + '-'                                + month + '-' + day                                + ' ' + hours + ':' + minutes + ':' + seconds;_template_fun_array.push('                        ',typeof(formatTime) === 'undefined'?'':baidu.template._encodeHTML(formatTime),'                    </div>                </div>                <div class="status">                    已接单                </div>                <div class="phone-bar">                    <a class="client-phone" href="tel:',typeof(info[i].phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].phone),'">                        ');if(info[i].phone === info[i].third_phone) {_template_fun_array.push('                            <span class="title">本人：</span>                        ');} else {_template_fun_array.push('                            <span class="title">客人：</span>                        ');}_template_fun_array.push('                        <span class="phone">',typeof(info[i].phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].phone),'</span>                    </a>                    <a class="driver-phone" href="tel:',typeof(info[i].phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].phone),'">                        <span class="title">司机：</span>                        <span class="phone">',typeof(info[i].driver_phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].driver_phone),'</span>                    </a>                </div>            ');} else {_template_fun_array.push('                <a class="client-phone" href="tel:',typeof(info[i].phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].phone),'">                    ');if(info[i].phone === info[i].third_phone) {_template_fun_array.push('                        <span class="title">本人：</span>                    ');} else {_template_fun_array.push('                        <span class="title">客人：</span>                    ');}_template_fun_array.push('                    <span class="phone">',typeof(info[i].phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].phone),'</span>                </a>                ');if(info[i].status === 1){_template_fun_array.push('                    ');if(info[i].can_retry === 1) {_template_fun_array.push('                        <button class="btn-retry" data-order-id="',typeof(info[i].order_id) === 'undefined'?'':baidu.template._encodeHTML(info[i].order_id),'">重发</button>                    ');} else {_template_fun_array.push('                        <div class="status">                            推送中                        </div>                    ');}_template_fun_array.push('                ');} else {_template_fun_array.push('                    <div class="status">                        已过期                    </div>                ');}_template_fun_array.push('            ');}_template_fun_array.push('        </li>    ');}_template_fun_array.push('</ul>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
/* jshint ignore: end*/
var storage = require('taxi:static/js/storage.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    exports = {
        create: function () {
            var $el = $('.taxi-widget-vip-orderlist'),
                $listContainer = $el.find('.list-container');

            // 设置$listContainer高度
            $listContainer.height(window.innerHeight - 50);

            this.$listContainer = $listContainer;
            $listContainer.on('click', $.proxy(this.onListContainerClick, this));
        },
        onListContainerClick: function(e) {
            if(e.target.className === 'btn-retry') {
                this.resubmit(e.target);
            }
        },
        resubmit: function(target) {
            var $target;
            popup.open({
                text: '正在重新发送打车请求...',
                layer: true
            });
            LoadManager.request({
                data: {
                    qt: 'addpricereq',
                    city_code: storage.get('cityCode'),
                    add_price: '0',
                    order_id: target.getAttribute('data-order-id')
                },
                success: function() {
                    popup.open({
                        text: '发送成功！',
                        layer: true
                    });
                    $target = $(target);
                    $target.parent().append('<div class="status">推送中</div>');
                    $target.remove();
                },
                error: function(data) {
                    var text = '';
                    switch (data.errno) {
                        case -101:
                            text = '参数错误！';
                            break;
                        case -304:
                            text = '订单已失效，请建立新单发送！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        },
        loadList: function() {
            var $listContainer = this.$listContainer;

            LoadManager.request({
                data: {
                    qt: 'myorder',
                    third_phone: storage.get('thirdPhone')
                },
                success: function (data) {
                    $listContainer && $listContainer.html('').append(listItemTemplate(data));
                }
            });
        },
        destroy: function() {
            clearInterval(this.interval);
        },
        init: function () {
            this.create();
            this.loadList();
            this.interval = setInterval($.proxy(this.loadList, this), 30000);
        }
    };

module.exports = exports;

});