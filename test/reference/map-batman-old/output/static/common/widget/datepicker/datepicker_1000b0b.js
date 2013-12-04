define('common:widget/datepicker/datepicker.js', function(require, exports, module){

/**
 *  @file 实现了通用highlight方法。
 *  @name Highlight
 *  @desc 点击高亮效果
 *  @import core/zepto.js
 */
var Zepto = $;

(function($) {
    var actElem, inited = false, timer, cls, removeCls = function(){
        clearTimeout(timer);
        if(actElem && (cls = actElem.attr('highlight-cls'))){
            actElem.removeClass(cls).attr('highlight-cls', '');
            actElem = null;
        }
    };
    $.extend($.fn, {
        /**
         * @name highlight
         * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class
         * @grammar  highlight(className)   ⇒ self
         * @example var div = $('div');
         * div.highlight('div-hover');
         *
         * $('a').highlight();// 把所有a的自带的高亮效果去掉。
         */
        highlight: function(className) {
            inited = inited || !!$(document).on('touchend.highlight touchmove.highlight touchcancel.highlight', removeCls);
            removeCls();
            return this.each(function() {
                var $el = $(this);
                $el.css('-webkit-tap-highlight-color', 'rgba(255,255,255,0)').off('touchstart.highlight');
                className && $el.on('touchstart.highlight', function() {
                    timer = setTimeout(function(){
                        actElem = $el.attr('highlight-cls', className).addClass(className);
                    }, 100);
                });
            });
        }
    });
})(Zepto);


(function($, undefined){
    var record = (function(){// getter|setter
            var rid = 0,
                records = {},
                key = 'dp' + (+new Date());
            return function(node, val){
                var id = node[key] || (node[key] = rid++);
                val!==undefined && (val ? records[id] = val: delete records[id]);
                return records[id];
            }
        })(),
        slice = Array.prototype.slice,
        monthNames = ["01月", "02月", "03月", "04月", "05月", "06月",
            "07月", "08月", "09月", "10月", "11月", "12月"],
        dayNames = ["日", "一", "二", "三", "四", "五", "六"],
        offsetRE = /^(\+|\-)?(\d+)(M|Y)$/i,
    //获取月份的天数
        _getDaysInMonth = function (year, month) {
            return 32 - new Date(year, month, 32).getDate();
        },
    //获取月份中的第一天是所在星期的第几天
        _getFirstDayOfMonth = function (year, month) {
            return new Date(year, month, 1).getDay();
        };

    //@todo 支持各种格式
    $.datepicker = {
        parseDate:function (obj) {
            var dateRE = /^(\d{4})\-(\d{1,2})\-(\d{1,2})$/;//yyyy-mm-dd
            return typeof obj == 'object' ? obj: dateRE.test(obj)? new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10)-1, parseInt(RegExp.$3, 10)):null;
        },
        formatDate:function (date) {
            var formatNumber = $.datepicker.formatNumber;
            return date.getFullYear() + '-' + formatNumber(date.getMonth() + 1, 2) + '-' + formatNumber(date.getDate(), 2);
        },
        formatNumber:function (val, len) {
            var num = "" + val;
            while (num.length < len) {
                num = "0" + num;
            }
            return num;
        }
    }

    function datepicker(el, options){
        this._el = $(el);
        this._data = $.extend({
            date:null, //默认日期
            firstDay:1, //星期天用0表示, 星期一用1表示, 以此类推.
            maxDate:null, //可以选择的日期范围
            minDate:null,
            container:null, //如果为非inline模式，且不想再input的下面直接生成结构那就指定container.
            gap:true//是否显示间隙，星期列表与天数列表之间
        }, options);
        record(el, this);
        this._init();
    }

    $.extend(datepicker.prototype, {

        /**
         * @name root
         * @grammar root() ⇒ value
         * @grammar root(el) ⇒ value
         * @desc 设置或者获取根节点
         * @example
         * $('a#btn').button({label: '按钮'});
         * 
         */
        root: function(el) {
            return this._el = el || this._el;
        },
        /**
         * @name on
         * @grammar on(type, handler) ⇒ instance
         * @desc 绑定事件，此事件绑定不同于zepto上绑定事件，此On的this只想组件实例，而非zepto实例
         */
        on: function(ev, callback) {
            this.root().on(ev, $.proxy(callback, this));
            return this;
        },

        /**
         * @name off
         * @grammar off(type) ⇒ instance
         * @grammar off(type, handler) ⇒ instance
         * @desc 解绑事件
         */
        off: function(ev, callback) {
            this.root().off(ev, callback);
            return this;
        },

        /**
         * @name trigger
         * @grammar trigger(type[, data]) ⇒ instance
         * @desc 触发事件, 此trigger会优先把options上的事件回调函数先执行，然后给根DOM派送事件。
         * options上回调函数可以通过e.preventDefaualt()来组织事件派发。
         */
        trigger: function(event, data) {
            event = typeof event == 'string' ? $.Event(event) : event;
            var _data = this._data, onEvent = _data[event.type],result;
            if( onEvent && typeof onEvent == 'function' ){
                event.data = data;
                result = onEvent.apply(this, [event].concat(data));
                if(result === false || event.defaultPrevented){
                    return this;
                }
            }
            this.root().trigger(event, data);
            return this;
        },

        _init: function(){
            var data = this._data, eventHandler = $.proxy(this._eventHandler, this);
            data._container = this._el;
            this.date(data.date || new Date())
                .minDate(data.minDate)
                .maxDate(data.maxDate)
                .refresh();
            data._container.addClass('ui-datepicker').on('click', eventHandler).highlight();
            data._isShow = data._inited =true;
        },

        _eventHandler: function(e){
            var match, me = this, data = me._data, root = data._container, target,
                cell;
            target = e.target;
            if ((match = $(target).closest('.ui-datepicker-calendar tbody a', root.get(0))) && match.length) {
                e.preventDefault();
                cell = match.parent();
                this.selectedDate(new Date(cell.attr('data-year'), cell.attr('data-month'), match.text()));
                this._commit();
                this.refresh();
            } else if ((match = $(target).closest('.ui-datepicker-prev, .ui-datepicker-next', root.get(0))) && match.length) {
                e.preventDefault();
                setTimeout(function(){
                    me.goTo((match.is('.ui-datepicker-prev') ? '-' : '+') + '1M');
                }, 0);
            }
        },
        _generateHTML:function () {
            var data = this._data, html = '', thead, tbody, i, j, firstDay, day, leadDays, daysInMonth, rows,
                printDate, drawYear = data._drawYear, drawMonth = data._drawMonth, otherMonth, unselectable,
                tempDate = new Date(), today = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()),
                minDate = this.minDate(), maxDate = this.maxDate(), selectedDate = this.selectedDate();

            firstDay = parseInt(data.firstDay, 10);
            firstDay = (isNaN(firstDay) ? 0 : firstDay);

            html += '<div class="ui-datepicker-header">' +
                '<a class="ui-datepicker-prev" href="#">&lt;&lt;</a>' +
                '<div class="ui-datepicker-title">'+data._drawYear+'年'+monthNames[data._drawMonth]+'</div>' +
                '<a class="ui-datepicker-next" href="#">&gt;&gt;</a>' +
                '</div>';

            thead = '<thead><tr>';
            for (i = 0; i < 7; i++) {
                day = (i + firstDay) % 7;
                thead += '<th' + ((i + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : '') + '>' +
                    '<span>' + dayNames[day] + '</span></th>';
            }
            thead += '</thead></tr>';

            tbody = '<tbody>';
            tbody += data.gap ? '<tr class="ui-datepicker-gap"><td colspan="7">&#xa0;</td></tr>' : '';
            daysInMonth = _getDaysInMonth(drawYear, drawMonth);
            leadDays = (_getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
            rows = Math.ceil((leadDays + daysInMonth) / 7);
            printDate = new Date(drawYear, drawMonth, 1 - leadDays);
            for (i = 0; i < rows; i++) {
                tbody += '<tr>';
                for (j = 0; j < 7; j++) {
                    otherMonth = (printDate.getMonth() !== drawMonth);
                    unselectable = otherMonth || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                    tbody += "<td class='" +
                        ((j + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
                        (otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
                        (unselectable ? " ui-datepicker-unselectable ui-state-disabled" : "") + // highlight unselectable days
                        (otherMonth || unselectable ? '' :
                            (printDate.getTime() === selectedDate.getTime() ? " ui-datepicker-current-day" : "") + // highlight selected day
                                (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")
                            ) + "'" + // highlight today (if different)
                        (unselectable ? "" : " data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
                        (otherMonth ? "&#xa0;" : // display for other months
                            (unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
                                (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
                                (printDate.getTime() === selectedDate.getTime() ? " ui-state-active" : "") + // highlight selected day
                                "' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
                    printDate.setDate(printDate.getDate() + 1);
                }
                tbody += '</tr>';
            }
            tbody += '</tbody>';
            html += '<table  class="ui-datepicker-calendar">' + thead + tbody + '</table>';
            return html;
        },

        _commit: function(){
            var data = this._data, 
                date, 
                dateStr = $.datepicker.formatDate(date = this.selectedDate());
                
            data.date = date;
            data._inited && this.trigger('valuecommit', [date, dateStr, this]);
            return this;
        },

        /**
         * @name option
         * @grammar option(key[, value]) ⇒ instance
         * @desc 设置或获取Option，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        option:function (key, val) {
            var data = this._data, date;
            if (val !== undefined) {
                switch (key) {
                    case 'minDate':
                    case 'maxDate':
                        data[key] = val ? $.datepicker.parseDate(val) : null;
                        break;
                    case 'selectedDate':
                        val = $.datepicker.parseDate(val);
                        data._selectedYear = data._drawYear = val.getFullYear();
                        data._selectedMonth = data._drawMonth = val.getMonth();
                        data._selectedDay = val.getDate();
                        data._inited && this.trigger('select', [this.selectedDate(), this]);
                        break;
                    case 'date':
                        this.option('selectedDate', val);
                        //this._commit();
                        break;
                    case 'gap':
                        data[key] = val;
                        break;
                }
                data._invalid = true;
                return this;
            }
            return key == 'selectedDate' ? new Date(data._selectedYear, data._selectedMonth, data._selectedDay) : data[key];
        },

        /**
         * @name maxDate
         * @grammar maxDate([value]) ⇒ instance
         * @desc 设置或获取maxDate，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        maxDate:function (val) {
            return this.option('maxDate', val);
        },

        /**
         * @name minDate
         * @grammar minDate([value]) ⇒ instance
         * @desc 设置或获取minDate，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        minDate:function (val) {
            return this.option('minDate', val);
        },

        /**
         * @name date
         * @grammar date([value]) ⇒ instance
         * @desc 设置或获取当前date，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        date:function (val) {
            return this.option('date', val);
        },

        /**
         * @name date
         * @grammar date([value]) ⇒ instance
         * @desc 设置或获取当前选中的日期，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        selectedDate:function (val) {
            return this.option('selectedDate', val);
        },

        /**
         * @name goTo
         * @grammar goTo(month, year) ⇒ instance
         * @grammar goTo(str) ⇒ instance
         * @desc 使组件显示某月，当第一参数为str可以+1M, +4M, -5Y, +1Y等等。+1M表示在显示的月的基础上显示下一个月，+4m表示下4个月，-5Y表示5年前
         */
        goTo:function (month, year) {
            var data = this._data, offset, period, tmpDate, minDate = this.minDate(), maxDate = this.maxDate();
            if (typeof month == 'string' && offsetRE.test(month)) {
                offset = RegExp.$1 == '-' ? -parseInt(RegExp.$2, 10) : parseInt(RegExp.$2, 10);
                period = RegExp.$3.toLowerCase();
                month = data._drawMonth + (period == 'm' ? offset : 0);
                year = data._drawYear + (period == 'y' ? offset : 0);
            } else {
                month = parseInt(month, 10);
                year = parseInt(year, 10);
            }
            tmpDate = new Date(year, month, 1);
            tmpDate = minDate && minDate>tmpDate ? minDate : maxDate && maxDate < tmpDate ? maxDate: tmpDate;//不能跳到不可选的月份
            month = tmpDate.getMonth();
            year = tmpDate.getFullYear();
            if(month!=data._drawMonth || year!=data._drawYear){
                this.trigger('changemonthyear', [data._drawMonth = month, data._drawYear = year]);
                data._invalid = true;
                this.refresh();
            }
            return this;
        },

        /**
         * @name refresh
         * @grammar refresh() ⇒ instance
         * @desc 当修改option后需要调用此方法。
         */
        refresh:function () {
            var data = this._data;
            if (!data._invalid) {
                return;
            }
            $('.ui-datepicker-calendar td:not(.ui-state-disabled), .ui-datepicker-header a', data._container).highlight();
            data._container.empty().append(this._generateHTML());
            $('.ui-datepicker-calendar td:not(.ui-state-disabled), .ui-datepicker-header a', data._container).highlight('ui-state-hover');
            data._invalid = false;
            return this;
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
         */
        destroy:function () {
            var data = this._data, eventHandler = this._eventHandler;
            $('.ui-datepicker-calendar td:not(.ui-state-disabled)', data._container).highlight();
            data._container.off('click', eventHandler).remove();
        }
    });


    /**
     * 暴露接口
     * 简单说明使用
     * $('div').datepicker(options);初始化
     *  $('div').datepicker('date', new Date());调用组件内部方法
     *  var dp = $('div').datepicker('this');获得组件实例
     *  dp.goTo(12, 2012)//显示2012年12月
     *
     *  dp.minDate('2012-12-01');设置最小日期
     *  dp.maxDate('2012-12-01');设置最小日期
     *
     *  dp.refresh()每次改变option后要手动调用refresh方法来生效
     *
     *
     * @param options
     * @return {*}
     */
    $.fn.datepicker = function(options){
        //set all get first.
        var ret, args = slice.call(arguments, 1), _instance;
        $.each(this, function(){
            _instance = record(this) || new datepicker(this, $.isPlainObject(options)?options:null);
            if(typeof options =='string' && options in _instance){
                ret = _instance[options].apply(_instance, args);
                if(ret!==_instance && ret!==undefined){
                    return false;
                }
                ret = undefined;
            }else if(options=='this'){
                ret = _instance;
                return false;
            }
        });
        return ret!==undefined?ret:this;
    }
})(Zepto);

exports = Zepto;


});