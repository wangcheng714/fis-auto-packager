define('place:widget/caterorderdetail/caterorderdetail.js', function(require, exports, module){

require("place:static/lib/template.js");
var url = require("common:widget/url/url.js");
var util = require('common:static/js/util.js');
var popup = require('common:widget/popup/popup.js');

var DEFAULT_ERROR_MSG = '网络连接失败';

var DATA_TYPE = 'json';

var HOST = '';
// var HOST = 'http://cq01-rdqa-pool211.cq01.baidu.com:8282';

var ORDER_LIST_URL = '/mobile/webapp/place/cater/force=superman&qt=orderlist{{kehuduan}}?mobile=';
var ORDER_SEARCH_URL = '/mobile/webapp/place/cater/force=superman&qt=searchorder{{kehuduan}}';

var CANCEL_AJAX_URL = HOST + '/detail?qt=cater_ordercancel';
var DETAIL_AJAX_URL = HOST + '/detail?qt=cater_orderdetail';

var STATUS_MSG = {
    '1': '等待确认',
    '2': '下单成功',
    '3': '订单已取消',
    '4': '预订失败'
};

var getStatusDesc = function(statusCode) {
    var key = Math.floor(statusCode / 100);
    return STATUS_MSG[key] || '';
};

var getRoomLabel = function(needRoom, size) {
    var label = '大厅';
    if (needRoom === '1') {
        size = parseInt(size, 10) || 0;
        label = '包间' + (size ? '（' + size + '人间）' : '');
    }
    return label;
};

var defError = function(rs) {
    rs = rs || {};
    popup.open(rs.errorMsg || DEFAULT_ERROR_MSG);
};

var CaterOrderDetail = function() {
    var urlData = util.urlToJSON(window.location.search.replace('?', ''));
    this.template = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');if (typeof order_id !== 'undefined') {_template_fun_array.push('    <div class="orderinfo">        <p>订单状态：<span data-node="statusDesc">',typeof(status_desc) === 'undefined'?'':baidu.template._encodeHTML(status_desc),'</span></p>        <p>订单号：',typeof(order_id) === 'undefined'?'':baidu.template._encodeHTML(order_id),'</p>    </div>    <div class="item shopinfo">        <h4>',typeof(shop_name) === 'undefined'?'':baidu.template._encodeHTML(shop_name),'</h4>        <p>            ',typeof(room) === 'undefined'?'':baidu.template._encodeHTML(room),'        ');if(typeof min_cost !== 'undefined' && min_cost) {_template_fun_array.push('            最低消费：',typeof(min_cost) === 'undefined'?'':baidu.template._encodeHTML(min_cost),'元        ');}_template_fun_array.push('        </p>        <p>入店时间：',typeof(order_time) === 'undefined'?'':baidu.template._encodeHTML(order_time),'</p>        <p>最晚到店时间：',typeof(keep_time) === 'undefined'?'':baidu.template._encodeHTML(keep_time),'</p>        <p>地址：',typeof(address) === 'undefined'?'':baidu.template._encodeHTML(address),'</p>    </div>    <div class="item">        <p class="userinfo">            <span class="username">联系人信息：                ');if(typeof gender !== 'undefined' && gender == '0') {_template_fun_array.push('                    ',typeof(user_name) === 'undefined'?'':baidu.template._encodeHTML(user_name),'先生                ');} else {_template_fun_array.push('                    ',typeof(user_name) === 'undefined'?'':baidu.template._encodeHTML(user_name),'女士                ');}_template_fun_array.push('            </span>            <span class="tel">电话：',typeof(mobile) === 'undefined'?'':baidu.template._encodeHTML(mobile),'</span>        </p>        ');if(Math.floor(status/100) > 2) {_template_fun_array.push('            <div class="help">                <p class="label">其他帮助</p>                <div class="info">                    <p class="help-tel">                        <span>百度客服电话：</span>                        <a href="tel:(400-0998-998)">                            <b class="tel-icon-b"></b>                            400-0998-998                        </a>                    </p>                </div>            </div>        ');}_template_fun_array.push('    </div>    ');if(can_cancel == '1') {_template_fun_array.push('        <div class="cancel">            <div class="btn" data-action="cancelOrder">取消订单</div>        </div>    ');}_template_fun_array.push('');} else {_template_fun_array.push('    <div class="error">订单错误</div>');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
    this.mobile = urlData.mobile;
    this.orderId = urlData.orderid;
    this.$el = $('#place-widget-caterorderdetail');
    this.init();
};
CaterOrderDetail.prototype = {
    init: function() {
        this.bindEvent();
        this.getOrderDetail();
    },
    formatRS: function(data) {
        data = data || {};
        var otime = parseInt(data.order_time || 0, 10) * 1000;
        var ktime = parseInt(data.keep_time || 0, 10);
        data.status_desc = getStatusDesc(data.status);
        data.room = getRoomLabel(data.need_room, data.room_size);
        data.order_time = (new Date(otime)).format('yyyy-MM-dd hh:mm');
        data.keep_time = (new Date(otime + ktime * 60 * 1000)).format('hh:mm');
        return data;
    },
    render: function(rs) {
        var data = rs.data || [];
        this.$el.html(this.template(this.formatRS(data[0])));
        this.$statusDesc = this.$el.find('[data-node="statusDesc"]');
    },
    getOrderDetail: function() {
        $.ajax({
            url: DETAIL_AJAX_URL,
            type: 'GET',
            dataType: DATA_TYPE,
            context: this,
            data: {
                'orderId': this.orderId,
                'mobile': this.mobile
            },
            cache: false,
            success: function(rs) {
                if (!rs || rs.errorNo !== 0) {
                    if (rs.errorNo === 8000) {
                        url.navigate(ORDER_SEARCH_URL);
                    } else {
                        url.navigate(ORDER_LIST_URL + this.mobile);
                    }
                }
                this.render(rs);
            },
            error: defError
        });
    },
    onCancelOrderClick: function(evt) {
        var $target = $(evt.currentTarget);
        $.ajax({
            url: CANCEL_AJAX_URL,
            type: 'POST',
            dataType: DATA_TYPE,
            data: {
                'orderId': this.orderId,
                'mobile': this.mobile
            },
            context: this,
            success: function(rs) {
                if (rs.errorNo !== 0) {
                    return defError(rs);
                }
                $target.remove();
                this.$statusDesc.html(STATUS_MSG['3']);

            },
            error: defError
        });
    },
    bindEvent: function() {
        this.onCancelOrderClickHandle = $.proxy(this.onCancelOrderClick, this);
        this.$el.delegate('[data-action=cancelOrder]', 'click', this.onCancelOrderClickHandle);
    },
    unbindEvent: function() {
        this.$el.undelegate('[data-action=cancelOrder]', 'click', this.onCancelOrderClickHandle);
    },
    destroy: function() {
        this.unbindEvent();
    }
};
exports.init = function(opt) {
    opt = opt || {};
    ORDER_LIST_URL = ORDER_LIST_URL.replace('{{kehuduan}}', opt.kehuduan ? '&kehuduan=1' : '');
    ORDER_SEARCH_URL = ORDER_SEARCH_URL.replace('{{kehuduan}}', opt.kehuduan ? '&kehuduan=1' : '');
    return new CaterOrderDetail();
};

});