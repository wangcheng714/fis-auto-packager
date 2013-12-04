/**
 * @file 第三方报价资源（携程）
 * @author liushuai02@baidu.com
 */
'use strict';

var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    placeBroadcastName = require('place:static/js/broadcastname.js'),
    geolocation = require('common:widget/geolocation/location.js'),
    util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js'),
    $el,
    $response, $moreItems, $roomMoreIcon, $roomMoreText, $bookBtns, uid,
    action = _APP_HASH.action,
    sd, ed;

function init() {
    $el = $('.place-widget-thirdsrcota');
    $bookBtns = $el.find('.bookbtn-xiecheng-normal');
    uid = $el.find('.uid').val();

    if ($bookBtns.length > 0) {
        $el.removeClass('hidelist');
    }

    broadcaster.subscribe(placeBroadcastName.DATEPICKER_DATE_CHANGE, onDatepickerDateChange);
    broadcaster.broadcast(placeBroadcastName.HOTELBOOK_OR_THIRDSRCOTA_SHOW);

    $el.delegate('.room-more', 'click', function () {
        $moreItems = $el.find('.more-items');
        $roomMoreIcon = $el.find('.room-more-icon');
        $roomMoreText = $el.find('.room-more-text');
        if ($roomMoreIcon.hasClass('arrow-down')) {
            $roomMoreIcon.removeClass('arrow-down');
            $roomMoreText.text('查看全部房型');
            $moreItems.hide();
        } else {
            $roomMoreIcon.addClass('arrow-down');
            $roomMoreText.text('收起其它房型');
            $moreItems.show();
        }
    });

    $el.delegate('.hb-hd', 'click', function (e) {
        if (!$(e.target).hasClass('xiecheng-sales')) {
            $el.toggleClass('hidelist');
        }
    });

    $el.delegate('.bookbtn-item', 'click', function (e) {
        var $target = $(e.target),
            today = new Date().format('yyyy-MM-dd'),
            tomorrow = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd'),
            url = $target.data('url'),
            price = parseInt($target.data('price'), 10),
            bonus = parseInt($target.data('bonus'), 10) || 0,
            extraParams;

        extraParams = {
            from_page: action,
            checkin_date: (sd || today),
            checkout_date: (ed || tomorrow),
            c: geolocation.getCityCode(),
            price: price,
            book_price: price - bonus,
            simple: 1
        };
        window.location.href = '/mobile/webapp/place/order/'+url + '&' + util.jsonToQuery(extraParams);
    });
}

function onDatepickerDateChange(data) {
    if (data.sd !== sd || data.ed !== ed) {
        sd = data.sd;
        ed = data.ed;
        BigPipe.asyncLoad({id: 'place-pagelet-thirdsrcota'}, util.jsonToUrl({
            st: data.sd,
            et: data.ed,
            uid: uid
        }));
    }
}

module.exports = {
    init: function () {
        init();
        stat.addStat(STAT_CODE.PLACE_XIECHENG_PV, {'from_page': action});
    }
};

