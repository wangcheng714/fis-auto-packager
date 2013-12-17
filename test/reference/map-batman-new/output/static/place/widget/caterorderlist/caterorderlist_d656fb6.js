define('place:widget/caterorderlist/caterorderlist.js', function(require, exports, module){

require("place:static/lib/template.js");
var url = require('common:widget/url/url.js');
var util = require('common:static/js/util.js');
var popup = require('common:widget/popup/popup.js');

var DEF_NUM = 10;
var DISABLED = 'disabled';
var DEF_HREF = 'javascript:;';

var DEFAULT_ERROR_MSG = '网络连接失败';
var DEF_SEARCH_URL = '/mobile/webapp/place/cater/force=superman&qt=searchorder{{kehuduan}}';
var DEF_ORDER_LIST_URL = '/mobile/webapp/place/cater/force=superman&qt=orderlist{{kehuduan}}?';
var DEF_ORDER_DELTAIL_URL = '/mobile/webapp/place/cater/force=superman&qt=orderdetail{{kehuduan}}?';

var HOST = '';
// var HOST = 'http://cq01-rdqa-pool211.cq01.baidu.com:8282';

var DATA_TYPE = 'json';

var LIST_AJAX_URL = HOST + '/detail?qt=cater_orderlist';

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
    if (rs.errorNo === 8000) {
        url.navigate(DEF_SEARCH_URL, {
            replace: true
        });
    }
};

var CaterOrderList = function() {
    var urlData = util.urlToJSON(window.location.search.replace('?', ''));
    this.itemTemp = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<li data-oid="',typeof(order_id) === 'undefined'?'':baidu.template._encodeHTML(order_id),'" data-href="',typeof(order_url) === 'undefined'?'':baidu.template._encodeHTML(order_url),'">    <div class="item">        <h4> ',typeof(shop_name) === 'undefined'?'':baidu.template._encodeHTML(shop_name),' </h4>        <span class="room right">',typeof(room) === 'undefined'?'':baidu.template._encodeHTML(room),'</span>    </div>    <div class="person">        就餐人数：',typeof(person_num) === 'undefined'?'':baidu.template._encodeHTML(person_num),'位    </div>    <div class="item">        <span>预约入店时间：',typeof(order_time) === 'undefined'?'':baidu.template._encodeHTML(order_time),'</span>        <span class="right">',typeof(status_desc) === 'undefined'?'':baidu.template._encodeHTML(status_desc),'</span>    </div>    <em class="list-arrow"></em></li>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
    this.curPage = parseInt(urlData.page, 10) || 1;
    this.mobile = urlData.mobile;
    this.$el = $('#place-widget-caterorderlist');
    this.$mobile = this.$el.find('[data-node="mobile"]');
    this.$list = this.$el.find('[data-node="list"]');
    this.$pageNav = this.$el.find('[data-node="pageNav"]');
    this.$preBtn = this.$el.find('[data-node="pre"]');
    this.$nextBtn = this.$el.find('[data-node="next"]');
    this.init();
};
CaterOrderList.prototype = {
    init: function() {
        this.getOrderList();
        this.bindEvent();
    },
    bindEvent: function() {
        this.onListClickHandle = $.proxy(this.onListClick, this);
        this.$el.on('click', 'li', this.onListClickHandle);
    },
    unbindEvent: function() {
        this.$el.off('click', 'li', this.onListClickHandle);
    },
    onListClick: function(evt) {
        var $item = $(evt.currentTarget),
            href = $item.data("href");
        url.navigate(href);
        evt.stopPropagation();
        evt.stopImmediatePropagation();
    },
    getOrderList: function(cb) {
        $.ajax({
            url: LIST_AJAX_URL,
            type: 'GET',
            dataType: DATA_TYPE,
            context: this,
            cache: false,
            data: {
                'mobile': this.mobile,
                'page': this.curPage,
                'num': DEF_NUM
            },
            success: function(rs) {
                if (!rs || rs.errorNo !== 0) {
                    return defError(rs);
                }
                this.render(rs);
            },
            error: defError
        });
    },
    formatRs: function(data) {
        var rs = data || {};
        var otime = parseInt(rs.order_time, 10);
        rs.order_time = (new Date(otime * 1000)).format('yyyy-MM-dd hh:mm');
        rs.status_desc = getStatusDesc(rs.status);
        rs.room = getRoomLabel(rs.need_room, rs.room_size);
        return rs;
    },
    formatPage: function(page, countPage) {
        var action = countPage <= 1 ? 'hide' : 'show';
        var nextOk = page < countPage;
        var preOK = page > 1;
        this.$pageNav[action]();
        this.$preBtn[preOK ? 'removeClass' : 'addClass'](DISABLED);
        this.$nextBtn[nextOk ? 'removeClass' : 'addClass'](DISABLED);
        this.$preBtn.attr('href', preOK ? DEF_ORDER_LIST_URL + util.jsonToUrl({
            'mobile': this.mobile,
            'page': page - 1,
            'num': DEF_NUM
        }) : DEF_HREF);
        this.$nextBtn.attr('href', nextOk ? DEF_ORDER_LIST_URL + util.jsonToUrl({
            'mobile': this.mobile,
            'page': page + 1,
            'num': DEF_NUM
        }) : DEF_HREF);
    },
    render: function(rs) {
        this.$mobile.html(this.mobile);
        this.formatPage(this.curPage, Math.ceil(rs.total / DEF_NUM));
        var listHtml = '';
        var list = rs.data || [];
        var item;
        for (var i = 0; i < list.length; i++) {
            item = this.formatRs(list[i]);
            item.order_url = DEF_ORDER_DELTAIL_URL + util.jsonToUrl({
                'mobile': this.mobile,
                'orderid': item.order_id
            });
            listHtml += this.itemTemp(list[i]);
        }
        this.$list.html(listHtml);
    },
    destroy: function() {
        this.unbindEvent();
    }
};
exports.init = function(opt) {
    opt = opt || {};
    DEF_SEARCH_URL = DEF_SEARCH_URL.replace('{{kehuduan}}', opt.kehuduan ? '&kehuduan=1' : '');
    DEF_ORDER_LIST_URL = DEF_ORDER_LIST_URL.replace('{{kehuduan}}', opt.kehuduan ? '&kehuduan=1' : '');
    DEF_ORDER_DELTAIL_URL = DEF_ORDER_DELTAIL_URL.replace('{{kehuduan}}', opt.kehuduan ? '&kehuduan=1' : '');
    return new CaterOrderList();
};

});