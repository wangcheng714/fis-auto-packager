require("place:static/lib/template.js");
var url = require("common:widget/url/url.js");
var util = require('common:static/js/util.js');
var popup = require('common:widget/popup/popup.js');

var DEFAULT_ERROR_MSG = '网络连接失败';

var DATA_TYPE = 'json';

var HOST = '';
// var HOST = 'http://cq01-rdqa-pool211.cq01.baidu.com:8282';

var ORDER_LIST_URL = '/mobile/webapp/place/cater/qt=orderlist{{kehuduan}}?mobile=';
var ORDER_SEARCH_URL = '/mobile/webapp/place/cater/qt=searchorder{{kehuduan}}';

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
    this.template = __inline('caterorderdetail.tmpl');
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