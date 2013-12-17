define('place:widget/datepicker/datepicker.js', function(require, exports, module){

'use strict';
var today = new Date(),
    tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

module.exports = {
    init: function(options) {
        var $calendar = $( '.hotel-calendar'),
            $sInput = $calendar.find('.date-ipt-start .tit-text'),
            $eInput = $calendar.find('.date-ipt-end .tit-text');
        // 初始化时间
        this.date = {};
        this.options = options;

        $sInput.text(today.format('yyyy-MM-dd'));
        $eInput.text(tomorrow.format('yyyy-MM-dd'));
        this.$sContainer = $calendar.find('.hotel-container-start');
        this.$eContainer = $calendar.find('.hotel-container-end');
        this.$sWrapper = $calendar.find('.hotel-calwrap-start');
        this.$eWrapper = $calendar.find('.hotel-calwrap-end');
        this.$sInput = $sInput;
        this.$eInput = $eInput;
        this.$calendar = $calendar;

        this.isShow = false;
        this.bindEvent();
    },
    bindEvent: function() {
        var me = this;
        listener.on('place.datepicker' , 'showcalendar', function() {
            if (!me.isShow) {
                me._initCalendar();
                me.isShow = true;
            }
        } );
    },
    _initCalendar: function() {
        var me = this,
            datepicker = require('common:widget/datepicker/datepicker.js'),
            staticDatepicker = $.datepicker,
            sIptDate = staticDatepicker.parseDate(me.$sInput.text()),
            eIptDate = staticDatepicker.parseDate(me.$eInput.text()),
            uid = me.options.uid;

        //初始化入住时间datepicker
        me.$sContainer.datepicker({
            date: sIptDate,
            minDate: sIptDate,
            valuecommit: function (e, date, dateStr) {
                var endDate = staticDatepicker.parseDate(me.$eInput.text()),
                    tomorrowDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

                // dateStr赋值给文本框
                me.$sInput.text(dateStr);

                //如果选择的入住日期大于退房日期，则退房日期变更为新的入住日期的下一天
                if (me._compareDate(date, endDate) >= 0) {
                    me.$eInput.text(tomorrowDate.format('yyyy-MM-dd'));
                    me.$eContainer.datepicker('date', tomorrowDate);
                }

                // 将结束日历的最小日期设成所选日期的下一天，最大日期为所选日期的28天之后
                me.$eContainer.datepicker( 'minDate', tomorrowDate )
                           .datepicker( 'maxDate', new Date( date.getFullYear(), date.getMonth(), date.getDate() + 28) )
                           .datepicker( 'refresh' );
                //移除样式
                me._removeActiveCss('start');

                (me.$sInput.text() !== me.date.st) &&
                    listener.trigger('place.datepicker' , 'datechange', {
                        st: me.$sInput.text(),
                        et: me.$eInput.text(),
                        uid: uid
                    } );

                me.date.st = me.$sInput.text();
            }
        });

        //初始化退房时间datepicker
        me.$eContainer.datepicker({
            date: eIptDate,
            minDate: eIptDate,
            maxDate: new Date( sIptDate.getFullYear(), sIptDate.getMonth(), sIptDate.getDate() + 28),
            valuecommit: function (e, date, dateStr) {

                // dateStr赋值给文本框
                me.$eInput.text(dateStr);

                //移除样式
                me._removeActiveCss('end');

                (me.$eInput.text() !== me.date.et) &&
                    listener.trigger('place.datepicker', 'datechange', {
                        st: me.$sInput.text(),
                        et: me.$eInput.text(),
                        uid: uid
                    } );
                me.date.et = me.$eInput.text();
            }
        });

        me.$calendar.find('.hotel-date-ipt').on('click', $.proxy(me._onDateClick, me));
        me.$calendar.show();
    },
    _removeActiveCss: function (type) {
        switch (type) {
            case 'start':
                this.$sWrapper.hide();
                this.$sInput.parents('.hotel-date-ipt').removeClass('active');
                break;
            case 'end':
                this.$eWrapper.hide();
                this.$eInput.parents('.hotel-date-ipt').removeClass('active');
                break;
            default :
        }
    },
    _compareDate: function(date1, date2) {
        return date1.getTime() - date2.getTime();
    },
    _onDateClick: function(e) {
        var me = this,
            $target = $(e.currentTarget);

        if ($target.hasClass('date-ipt-start')) {
            me._removeActiveCss('end');
            this.$sWrapper.toggle();
            $target.toggleClass('active');
        } else if($target.hasClass('date-ipt-end')) {
            me._removeActiveCss('start');
            this.$eWrapper.toggle();
            $target.toggleClass('active');
        }

        e.stopPropagation();
        e.stopImmediatePropagation();
    }
};

});