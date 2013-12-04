'use strict';
var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    placeBroadcastName = require('place:static/js/broadcastname.js'),
    $el = $('.place-widget-datepicker'),
    $sd, $ed, $sdWrapper, $edWrapper, $sdPicker, $edPicker;

broadcaster.subscribe(placeBroadcastName.HOTELBOOK_OR_THIRDSRCOTA_SHOW, function() {
    if($el.css('display') === 'none') {
        create();
    }
});

function create() {
    var datepicker = require('common:widget/datepicker/datepicker.js'),
        today = new Date(),
        tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    $sd = $el.find('.sd');
    $ed = $el.find('.ed');
    $sdWrapper = $el.find('.sd-wrapper');
    $edWrapper = $el.find('.ed-wrapper');
    $sdPicker = $el.find('.sd-picker');
    $edPicker = $el.find('.ed-picker');

    // 初始化时间
    $sd.text(today.format('yyyy-MM-dd'));
    $ed.text(tomorrow.format('yyyy-MM-dd'));

    //初始化入住时间datepicker
    $sdPicker.datepicker({
        date: today,
        minDate: today,
        valuecommit: function (e, date, dateStr) {
            //unbindEvents();
            var enddate, newed;

            $sd.text(dateStr);
            enddate = $.datepicker.parseDate($ed.text());

            //如果选择的入住日期大于退房日期，则退房日期变更为新的入住日期的下一天
            if (compareDate(date, enddate) >= 0) {
                newed = new Date(date.getTime() + 24 * 60 * 60 * 1000);
                $ed.text(newed.format('yyyy-MM-dd'));
                $edPicker.datepicker('date', newed)
            }
            $edPicker.datepicker('minDate', new Date(date.getTime() + 24 * 60 * 60 * 1000)).datepicker('refresh');
            //移除样式
            removeActiveCss('start');
            broadcaster.broadcast(placeBroadcastName.DATEPICKER_DATE_CHANGE, {
                sd: $sd.text(),
                ed: $ed.text()
            });
        }

    });

    //初始化退房时间datepicker
    $edPicker.datepicker({
        date: tomorrow,
        minDate: tomorrow,
        valuecommit: function (e, date, dateStr) {
            //unbindEvents();
            var startdate, newsd;

            $ed.text(dateStr);
            startdate = $.datepicker.parseDate($sd.text());

            //如果选择的退房日期大于入住日期，则入住日期变更为新的退房日期的前一天
            if (compareDate(date, startdate) <= 0) {
                newsd = new Date(date.getTime() - 24 * 60 * 60 * 1000);
                $sd.text(newsd.format('yyyy-MM-dd'));
                $sdPicker.datepicker('date', newsd).datepicker('refresh');
            }
            //移除样式
            removeActiveCss('end');
            broadcaster.broadcast(placeBroadcastName.DATEPICKER_DATE_CHANGE, {
                sd: $sd.text(),
                ed: $ed.text()
            });
        }

    });

    $sd.on('click', onDateClick);
    $ed.on('click', onDateClick);
    $el.show();
}

function onDateClick(e) {
    var type = e.currentTarget.className;

    if (type === 'sd') {
        removeActiveCss('end');

        $sdWrapper.toggle();
        $sd.parents('.date').toggleClass('active');
    } else {
        removeActiveCss('start');

        $edWrapper.toggle();
        $ed.parents('.date').toggleClass('active');
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 移除日期控件的样式
 * @param {string} type 'start':移除入住样式, 'end':移除退房样式
 */
function removeActiveCss(type) {
    switch (type) {
        case 'start':
            $sdWrapper.hide();
            $sd.parents('.date').removeClass('active');
            break;
        case 'end':
            $edWrapper.hide();
            $ed.parents('.date').removeClass('active');
            break;
        default :
    }

}

/**
 * 比较两个日期的大小
 * @param {date} [date1] 日期对象
 * @param {date} [date2] 日期对象
 * @returns {number} 0：相等, >0：date1大于date2, <0：date1小于date2
 */
function compareDate(date1, date2) {
    return date1.getTime() - date2.getTime();
}