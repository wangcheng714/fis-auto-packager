define('place:widget/hotelthirdsrc/hotelthirdsrc.js', function(require, exports, module){

var util = require('common:static/js/util.js'),
    url = require("common:widget/url/url.js"),
    stat = require('common:widget/stat/stat.js'),
    action = _APP_HASH.action,
    uid,
    st, et;

function fetchThirdsrc (data) {
    var param;

    if (!data.uid) {
        return;
    }

    param = {
        st: data.st,
        et: data.et,
        uid: data.uid
    }

    st = data.st;
    et = data.et;
    uid = data.uid;

    $('#place-pagelet-hotelthirdsrc').html(
        '<div class="hotel-loading">' +
            '<span></span>' +
            '<span>正在获取实时精准报价数据...</span>' +
        '</div>'
    );

    BigPipe.asyncLoad({id: 'place-pagelet-hotelthirdsrc'}, util.jsonToUrl(param) + '&pageletGroup=third');
}
// 绑定日历value改变事件，只能绑一次，故在闭包中绑
listener.on('place.datepicker','datechange', function(e, data) {
    fetchThirdsrc(data);
});

module.exports = {
    init: function(options) {
        this.firstShowNum = 4;
        this.options = options || {};
        this.is_gwj = $('.head-act').length
        this.$el = $('#place-pagelet-hotelthirdsrc');

        // 第三方连锁酒店预订区展现量
        stat.addStat(STAT_CODE.PLACE_HOTEL_BOOKABLE_DETAIL_VIEW, {'type': options.hotelType, 'from_page': action});

        this.bind();
    },
    fetchThirdsrc: fetchThirdsrc,
    bind: function() {
        // 派生日历显示事件，当预订区渲染完成时初始化日历
        listener.trigger('place.datepicker','showcalendar');

        this.$el.find('.room-more').on('click', $.proxy(this._showAllRooms, this));
        this.$el.find('.hotel-head').on('click', $.proxy(this._hideAllRooms, this));
        this.$el.find('.bookbtn-normal').on('click', $.proxy(this._addParams, this));
    },
    _showAllRooms: function() {
        var $icon = this.$el.find('.room-more-icon');
        this.$el.find('.room-item').slice(this.firstShowNum).toggle();
        $icon.toggleClass('arrow-down');
        this.$el.find('.room-more-text').html($icon.hasClass('arrow-down') ? '收起全部房型' : '展开全部房型');
    },
    _hideAllRooms: function() {
        $('.hotel-roomlist-thirdsrc').toggle();
    },
    _addParams: function(e) {
        var $target = $(e.target),
            today = new Date().format('yyyy-MM-dd'),
            tomorrow = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd'),
            options = this.options,
            href = $target.data('url'),
            href = href + (this.is_gwj ? '&is_gwj=1' : ''),
            price = parseInt($target.data('price'), 10),
            bonus = parseInt($target.data('bonus'), 10) || 0,
            extraParams,
            pagestate = options.kehuduan ? '/kehuduan=1' : ''

        extraParams = {
            from_page: action,
            checkin_date: (st || today),
            checkout_date: (et || tomorrow),
            price: price,
            book_price: price - bonus,
            simple: 1,
            type: options.hotelType,
            uid: uid || '',
            kehuduan: options.kehuduan || 0
        };

        // 第三方连锁酒店预订点击量统计
        stat.addCookieStat(STAT_CODE.PLACE_HOTEL_THIRDSRC_BOOK_CLICK, extraParams);

        url.navigate('/mobile/webapp/place/order/'+ href + pagestate);
    }
}

});