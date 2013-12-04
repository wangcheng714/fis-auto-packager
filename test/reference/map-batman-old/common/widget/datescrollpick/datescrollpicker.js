/**
 * @fileoverview 实现trasit 模块首末班车时间选择器。
 * @author yuanzhijia
 */
var iscroll = require('common:static/js/iscroll.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js');
var isLeapYear = function(year){
    return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 );
}
//获取某月的天数
var getMday = function(year, month){
    var mday = [31, 28, 31, 30, 31, 30, 31,31, 30, 31, 30, 31];
    if(isLeapYear(year)){
        mday[1] = 29;
    }
    return mday[month - 1];
}

function DateScrollPick(el, option){
    this.el = $(el);
    this.option = option || {};
    this._dateBox = null;
    this.init();
}

DateScrollPick.getMday = getMday;

$.extend(DateScrollPick.prototype, {
    lineHeight: 48,
    _createDateBox: function(){
        this._bg = $('<div class="date-box-bg"></div>');
        this._dateBox = $('<div class="date-box"/>');
        this._dateBox.html('<div ><div class="hd">设置出发时间</div><div class="bd"></div><div class="ft"></div></div>');
        this._bd = this._dateBox.find('.bd');
        this._bd.html('<div class="ymd"></div><div class="h"></div><div class="m"></div><div name="hmsp">:</div>'+
            '<div class="l1"></div><div class="l2"></div><div class="l3"></div><div class="l4"></div><div class="l5"></div><div class="l6"></div>');
        
        this._ymd = this._bd.find('.ymd');
        this._h = this._bd.find('.h');
        this._m = this._bd.find('.m');
        
        this._fd = this._dateBox.find('.ft');
        this._fd.html('<span>完成</span>');
        
        this._bg.appendTo(document.body);
        this._bg.hide();
    },
    
    _insertDateContent: function(){
        this.buildYmd();
    },
    
    buildYmd: function(){
        var curDate = new Date();
        var year = curDate.getFullYear();
        var curm = curDate.getMonth() + 1;
        var curd = curDate.getDate();
        var hours = curDate.getHours();
        var min = curDate.getMinutes();
        
        var days = [];
        
        var curmDays = getMday(curDate.getFullYear(), curm);
        
        for(var i=curd; i <= curmDays; i++){
            days.push({
                y : year,
                m : curm,
                d : i
            }); 
        }
        
        
        var nextMt = curm + 1 ; 
        var nextYr = curDate.getFullYear();
        //如果当前月份为12月， 那取下一年的第一月
        if(curm == 12){
            nextMt = 1;
            nextYr = nextYr + 1;
        }
        
        
        var nextDays = getMday(nextYr, nextMt);
        for(var ni= 1; ni <= nextDays; ni++){
            days.push({
                y : nextYr,
                m : nextMt,
                d : ni
            }); 
        }
        
        var content = '<ul><li>&nbsp;</li>';
        days.forEach(function(item){
            var md = item.m + '月' + item.d + '日';
            var date = new Date();
            date.setFullYear(item.y);
            date.setMonth(item.m - 1);
            date.setDate(item.d);
            var dstr = date.format('yyyy-MM-dd');
            
            content = content + '<li id="date-' + dstr + '" data-date="' + dstr + '">' + md + '</li>';
        });
        
        content += '<li>&nbsp;</li></ul>';
        this._ymd.html(content);
        
        //小时
        var hourCt = '<ul><li>&nbsp;</li>';
        for(var h=0;  h < 24; h++){
            var cur = h == hours ? 'class="cur"' : '';
            h = h >= 10 ? h : ('0'+h);
            hourCt=hourCt + '<li id="hours-' +h+ '" ' + cur + ' data-h="' + h + '">' + h + '</li>';
        }
        hourCt = hourCt + '<li>&nbsp;</li></ul>';
        this._h.html(hourCt);
        
        //分钟
        var minuCt = '<ul><li>&nbsp;</li>';
        for(var m=0;  m < 60; m+=10){
            var cur = '';
            if(min >= m && min < m + 10){
                cur = 'class="cur"';
            }
            var mstr = (m == 0 ? '00' : m)
            minuCt = minuCt + '<li id="minute-'+ mstr +'" ' + cur + ' data-m="'+mstr+'">' + mstr + '</li>';
        }
        minuCt = minuCt + '<li>&nbsp;</li></ul>';
        this._m.html(minuCt);
        
        this._curHrEl = this._h.find('.cur');
        this._curMtEl = this._m.find('.cur');
    },
    
    _complete: function(){
        if(this.option.onselect){
            this.option.onselect.apply(this, [this.getSelectedDate()]);
        }
        this.hide();
    },
    init: function(){
        
        this._createDateBox();
        this._insertDateContent();
        this.render();
        
        if(!$.isFunction(iscroll)){
            app.loader.load(["common_iscroll"], $.proxy(this.initDateIscroll, this));
        }else{
            this.initDateIscroll();
        }
        this.bind();
    },
    /*
     * 初始化日历iscroll内容
     */
    initDateIscroll: function(){
        var ymdEl = this._ymd[0];
        var hEl = this._h[0];
        var mEl = this._m[0];
        var me = this;
        
        me.scrollerYmd = new iscroll(ymdEl, {
            hScroll:false,
            hScrollbar: false, 
            vScrollbar: false,
            onScrollEnd: function(){
                me.scrollToElByY(this, ymdEl, this.y);
            }
        });
        me.scrollerHr = new iscroll(hEl, {
            hScroll:false,
            hScrollbar: false, 
            vScrollbar: false,
            onScrollEnd: function(){
                me.scrollToElByY(this, hEl, this.y);
            }
        });
        me.scrollerMt = new iscroll(mEl, {
            hScroll:false,
            hScrollbar: false, 
            vScrollbar: false,
            onScrollEnd: function(){
                me.scrollToElByY(this, mEl, this.y);
            }
        });
        me.scrollToCurDate();
    },
    /*
     * 获取当前的选择的日期
     */
    getSelectedDate: function(){
        var ymdY = Math.abs(this.scrollerYmd.y);
        var hrY = Math.abs(this.scrollerHr.y);
        var mtY = Math.abs(this.scrollerMt.y);
        
        var yindex = Math.round(ymdY / this.lineHeight);
        var hindex = Math.round(hrY / this.lineHeight);
        var mindex = Math.round(mtY / this.lineHeight);
        
        var $dates = this._ymd.find('li');
        var curDateEl = $($dates.get(yindex + 1));
        
        var $hour = this._h.find('li');
        var curHrEl = $($hour.get(hindex + 1));
        
        var $mt = this._m.find('li');
        var curMtEl = $($mt.get(mindex + 1));
        
        var rt = {
            datetime: curDateEl.attr('data-date') + ' ' + curHrEl.attr('data-h') + ':' + curMtEl.attr('data-m')
        }
        return rt;
    },
    
    scrollToElByY: function(scroller, ymdEl, y){
        y = Math.abs(y);
        var index = Math.round(y / this.lineHeight);
        
        if(index == this.last && scroller == this.lastUseScroller){
            return;
        }
        this.last = index;
        this.lastUseScroller = scroller;
        
        var el = $(ymdEl).find('li').get(index);
        scroller.scrollToElement(el, 100);
    },
    
    bind: function(){
        //防止在覆盖物上的滑动， 带动整个页面拖动。
        var hdr = function(e){
            e.preventDefault();
        }
        this._fd.on('click', $.proxy(this._complete, this));
        this._dateBox.on('touchstart', hdr);
        this._bg.on('touchstart', hdr);
        this._bg.on('click', $.proxy(this.hide, this));
        broadcaster.subscribe('sizechange', this._onglobalSizeChange, this);
        //app.eventCenter.on('sizechange', $.proxy(this._onglobalSizeChange, this));
    },
    _onglobalSizeChange: function(){
        this.setPos();
        this.refresh();
        this.scrollToCurDate();
    },
    setPos: function(){
        var posY = (window.innerHeight - 248) / 2 + window.scrollY;
        this._bg.css({
            height: window.innerHeight + window.scrollY
        });
        this._dateBox.css({top: posY});
    },
    applyTo: function(el){
        $(el).on('click', $.proxy(this.toggleHandler, this));
    },
    
    refresh: function(){
        this.scrollerYmd && this.scrollerYmd.refresh();
        this.scrollerHr && this.scrollerHr.refresh();
        this.scrollerMt && this.scrollerMt.refresh();
    },
    
    scrollToCurDate: function(){
        var date = new Date();
        var curDate = date.getDate();
        var hours = date.getHours();
        var mt = date.getMinutes();
        
        
        if(mt % 10 != 0){
            mt = Math.floor(mt / 10) * 10 + 10;
            if(mt >= 60){
                mt = '00';
                hours = hours + 1;
                date.setHours(hours);
                if(hours >= 24){
                    hours = '00';
                    curDate += 1;
                    date.setDate(curDate);
                }
            }
        }else{
            mt = mt == 0 ? '00' : mt;
        }
        
        var dateid = 'date-' + date.format('yyyy-MM-dd');
        var hoursid = 'hours-' + date.format('hh'); 
        var minuteid = 'minute-' + mt;
        
        this.scrollerYmd && this.scrollerYmd.scrollToElement($('#'+dateid).prev().get(0) , 0);
        this.scrollerHr && this.scrollerHr.scrollToElement($('#'+hoursid).prev().get(0) , 0);
        this.scrollerMt && this.scrollerMt.scrollToElement($('#'+minuteid).prev().get(0) , 0);
    },
    
    toggleHandler: function(e){
        this.show();
        this.setPos();
        this.refresh();
        this.scrollToCurDate();
    },
    render: function(){
        this._dateBox.appendTo(document.body);
    },
    show: function(){
        this._dateBox.css({
            left: '50%'
        });
        this._bg.show();
    },
    hide: function(){
        this._dateBox.css({
            left: -1000
        });
        this._bg.hide();
    }
});

module.exports = DateScrollPick;
