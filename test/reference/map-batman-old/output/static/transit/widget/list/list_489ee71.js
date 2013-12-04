define('transit:widget/list/list.js', function(require, exports, module){

/**
 * @fileOverview 换乘详情页
 * @author yuanzhijia@baidu.com
 * @date 2013-10-29
 */
 var DateScrollPicker = require('common:widget/datescrollpick/datescrollpicker.js'),
     url = require('common:widget/url/url.js'),
     broadcaster = require('common:widget/broadcaster/broadcaster.js'),
     popup = require('common:widget/popup/popup.js'),
     stat = require('common:widget/stat/stat.js'),
     locator = require('common:widget/geolocation/location.js'),
     util = require('common:static/js/util.js');
 module.exports = {
    init : function (data) {
        this.render(data);
        this.bind(data);
    },
    render : function (data) {
        var me  = this,
            parseurl = url.get();
        me.selectedTool = $('#takesubwayselect');
        me.start = $('.start-time .text')[0];
        me.action = parseurl.action;
        me.module = parseurl.module;
        me.pageState = parseurl.pageState;
        me.query = parseurl.query;
        me.initDateSelector(data.result);
        me._initPage(data);  
    },
    /*初始化页面的一些容器让页面*/
    _initPage:function(data){
        var me  = this;
        //检查当前城市是否有地铁
        var supportCityInfo = util.ifSupportSubway(locator.getCityCode());
        if (!supportCityInfo) {
            (me.selectedTool).attr("disabled","disabled");
        };
        if(decodeURIComponent(me.query.f) == "[0,2,4,7,5,8,9,10,11]"){
            $("#takesubwayselect option[value='1']")[0].selected = true;
        }
    },
    bind : function(data){
        var me = this,
            start = me.start;
        $(start).text(this.displayDateTimeText);
        if(!this.pk){
            this.pk = new DateScrollPicker(start, {
                onselect: function(date){
                    me._selectStartTime(date.datetime);
                }
            });
        }
        this.pk.applyTo(start);
        broadcaster.subscribe('sizechange', $.proxy(function(){
            this.pk && this.pk.hide();
        }, this));
        me.selectedTool.on("change",$.proxy(me._onselectchange,this));
    },
    _onselectchange:function(e){
        var type = $("#takesubwayselect").val(),
            me = this;
        me.query.f = (type == '1'? '[0,2,4,7,5,8,9,10,11]':null);
        if (type==1) {
            //添加不坐地铁统计
            stat.addCookieStat({code:STAT_CODE.BUS_STRATEGY_CLICK, type:4});
        };
        url.update({
            module: me.module,
            action: me.action,
            query : me.query,
            pageState : me.pageState
        });
    },
    initDateSelector: function(result){
        /*展示前先提示*/
        var tip = '',
            rplt = result.rplt;
            switch(rplt){
                case 1:  
                    tip = '已经为您屏蔽当前停运的方案!';
                    break;
                case 2:
                case 3:
                    tip = '此时没有可用公交方案，已显示全部方案!';
                    break;
                default:break;
        }
        if (tip!="") {
            popup.open({text:tip});
        };
        var me = this,
            date = new Date();
            //query = parseurl.query;
        if(result && result.exptime){
            //iphone uc下不支持 Date.parse静态方法， 所以做特殊处理
            var resultDate = result.exptime.split('T');
            var resYMD = resultDate[0].split('-');
            var resMM = resultDate[1].split(':');
            date.setYear(resYMD[0]);
            date.setMonth(resYMD[1]-1);
            date.setDate(resYMD[2]);
            date.setHours(parseInt(resMM[0]));
            date.setMinutes(parseInt(resMM[1]));
            //不足10分钟的向上加到十分钟
            date = new Date(date.getTime() + ((10-(resMM[1]%10)))%10*60000);

        }
        this.startDateTime = date.format('yyyy-MM-dd hh:mm');
        this.displayDateTimeText = this.formatDisplayText(this.startDateTime);
        
        //初始化默认工具为0， 全部
        //this.selectedTool = quezry.f == '[0,2,4,7,5,8,9,10,11]' ? '1' : '0';
    },
    formatDisplayText: function(datetime){
        var curDate = new Date();
        var curMonth = curDate.getMonth() + 1;
        
        var dt = datetime.split(' ');
        var ymd = dt[0].split('-');
        var hms = dt[1].split(':');
        
        var days = DateScrollPicker.getMday(curMonth);
        
        var date = curDate.getDate();
        var searchMonth = ymd[1] + '';
        var searchDay = ymd[2] + '';
        
        ymd[1] = parseInt(searchMonth.indexOf('0') == 0 ? searchMonth.substring(1) : searchMonth);
        ymd[2] = parseInt(searchDay.indexOf('0') == 0 ? searchDay.substring(1) : searchDay);
        
        if(curMonth  == ymd[1]){
            var dd = ymd[2];
            if(date == dd){
                return '今天 ' + dt[1] + ' 出发';
            }else if((dd - date) == 1){
                return '明天 ' + dt[1] + ' 出发';
            }else{
                return datetime;
            }
        }else if(ymd[1] - curMonth == 1){
            if(date == days){
                 if(ymd[2] == 1){
                     return '明天 ' + dt[1] + ' 出发';
                 }
            }
        }
        return datetime;
    },
    _selectStartTime:function(datetime){
        var me  = this;
        $(me.start).html(me.formatDisplayText(datetime));
        //日期选择完成更新跳转
        me.query.version = '5';
        me.query.exptype = 'dep';
        me.query.exptime = datetime;
        url.update({
            module: me.module,
            action: me.action,
            query : me.query,
            pageState : me.pageState
        });
    }
 }

});