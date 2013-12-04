define('place:widget/movienews/movienews.js', function(require, exports, module){

require("place:static/lib/template.js");
var util = require('common:static/js/util.js');
var stat = require('common:widget/stat/stat.js');
var iScroll = require('common:static/js/iscroll.js');

var DETAILTPL = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="cover">    <div id="cover-wrapper" class="cover-wrapper">        <div id="cover-scroller" class="cover-scroller">            ');for(var j = 0, len = imgs.length; j < len ; j++){_template_fun_array.push('            <img class="cover-pic needsclick" width="69" height="84" data-id="',typeof(imgs[j].id) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].id),'" data-date="',typeof(imgs[j].day) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].day),'" src="http://map.baidu.com/maps/services/thumbnails?width=96&height=128&quality=100&src=',typeof(imgs[j].url) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].url),'" style="display:',typeof(imgs[j].visible) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].visible),'" alt="',typeof(imgs[j].title) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].title),'">            ');if(imgs[j].newm){_template_fun_array.push('            <span class="new_icon" style="display:',typeof(imgs[j].labelvis) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].labelvis),'"></span>            ');}_template_fun_array.push('            ');}_template_fun_array.push('        </div>    </div></div><p class="info-tip"><img src="data:image/jpeg;base64,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" /><br>暂无当日排期...</p><div class="info ');if(!book){_template_fun_array.push('info-unbook');}_template_fun_array.push('">    ');if(book){_template_fun_array.push('    <div class="list_opt">        <button id="btnMovieBookMore" class="btn-more">查看更多影讯&nbsp;></button>        <button id="btnMovieBookClose" class="btn-close">收起</button>    </div>    ');}_template_fun_array.push('</div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var TABSTPL = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="tab"><div id="tab_wrapper" class="tab_wrapper"><ul class="calendar_tab">    ');for(var i = 0, len = days.length; i < len ; i++){_template_fun_array.push('    <li data-date="',typeof(days[i].date) === 'undefined'?'':baidu.template._encodeHTML(days[i].date),'" data-text="',typeof(days[i].text) === 'undefined'?'':baidu.template._encodeHTML(days[i].text),'" ');if(i == 0){_template_fun_array.push('class="current"');}_template_fun_array.push('>',typeof(days[i].text) === 'undefined'?'':baidu.template._encodeHTML(days[i].text),'</li>    ');}_template_fun_array.push('</ul></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var INFOTPL = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<dl>    <dt><em class="tit">',typeof(name) === 'undefined'?'':baidu.template._encodeHTML(name),'</em> ');if(parseInt(score)>0){_template_fun_array.push('<em class="sco"> ',typeof(score) === 'undefined'?'':baidu.template._encodeHTML(score),'</em>');}_template_fun_array.push('<em data-id="',typeof(id) === 'undefined'?'':baidu.template._encodeHTML(id),'" class="movieDes des">影片简介&gt;&gt;</em></dt>    <dd>        ',typeof(times) === 'undefined'?'':baidu.template._encodeHTML(times),'    </dd></dl>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var TIMETPL =  [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<ul>');for(var j = 0, len = schedules.length; j < len ; j++){_template_fun_array.push('<li><span class="meta"><em class="time">',typeof(schedules[j].time) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].time),'</em>',typeof(schedules[j].type) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].type),'</span><span class="meta-extend">');if(schedules[j].url){_template_fun_array.push('<a class="btn-exchange" href="',typeof(schedules[j].url) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].url),'">兑换码</a>');}_template_fun_array.push('');if(schedules[j].seatL){_template_fun_array.push('<a class="btn-book ',typeof(schedules[j].style) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].style),'" data-day="',typeof(schedules[j].day) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].day),'" data-num="',typeof(schedules[j].num) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].num),'" data-cinema="',typeof(schedules[j].cinema) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].cinema),'" data-movie="',typeof(schedules[j].movie) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].movie),'" data-info="',typeof(schedules[j].info) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].info),'" data-orign="',typeof(schedules[j].orign) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].orign),'">选座订票</a>');}_template_fun_array.push('',typeof(schedules[j].price) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].price),'</span></li>');}_template_fun_array.push('</ul>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var POPUPTPL =  [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="moviebook-popup-wrapper"><div class="moviebook-popup"><div class="header">',typeof(title) === 'undefined'?'':baidu.template._encodeHTML(title),'院线购票手机验证<a href="javascript:void(0);" id="valid-btn-close" class="btn-close"></a></div><div class="content"><p><label>手机号:&nbsp;</label><input id="valid-phone" autocomplete="false" type="tel"><span class="tip"></span></p><p><label>验证码:&nbsp;</label><input id="valid-number" autocomplete="false" type="text"><img src=""><span class="tip"></span></p><p><button id="valid-btn-submit" class="submit-btn" type="button">提交</button></p></div></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var DESPOPUPTPL =  [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="moviebook-popup-wrapper"><div class="moviedes_popup"><div class="header">',typeof(name) === 'undefined'?'':baidu.template._encodeHTML(name),'');if(parseInt(score)>0){_template_fun_array.push('<span class="sco"> ',typeof(score) === 'undefined'?'':baidu.template._encodeHTML(score),'</span>');}_template_fun_array.push('<a href="javascript:void(0);" id="des-btn-close" class="btn_close"> X </a></div><div class="content" style="text-align:left;"><style>table.des td{vertical-align: top;}</style><table class="des"><tr><td width="45"><span class="name">版本</span>:</td><td><span>',typeof(type || "暂无") === 'undefined'?'':baidu.template._encodeHTML(type || "暂无"),'</span></td></tr><tr><td><span class="name">片长</span>:</td><td><span>',typeof(duration || "暂无") === 'undefined'?'':baidu.template._encodeHTML(duration || "暂无"),'</span></td></tr><tr><td><span class="name">上映</span>:</td><td><span>',typeof(release || "暂无") === 'undefined'?'':baidu.template._encodeHTML(release || "暂无"),'</span></td></tr> <tr><td><span class="name">地区</span>:</td><td><span>',typeof(nation || "暂无") === 'undefined'?'':baidu.template._encodeHTML(nation || "暂无"),'</span></td></tr><tr><td><span class="name">导演</span>:</td><td><span>',typeof(director || "暂无") === 'undefined'?'':baidu.template._encodeHTML(director || "暂无"),'</span></td></tr><tr><td><span class="name">主演</span>: </td><td><span>',typeof(players || "暂无") === 'undefined'?'':baidu.template._encodeHTML(players || "暂无"),'</span></td></tr><tr><td colspan="2"><span class="name">简介</span>: <p style="padding:6px 0 0;">',typeof(des || "暂无") === 'undefined'?'':baidu.template._encodeHTML(des || "暂无"),'</p></td></tr></table></div></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

function getOrientation() {
    var ornttn = window.outerWidth > 0 ?
        (window.outerWidth > window.outerHeight ? 90 : 0) :
        (document.body.offsetWidth > document.body.offsetHeight ? 90 : 0);

    return ornttn;
}
function formatDate(objDate){
    return objDate.getFullYear() + '-' + (objDate.getMonth() < 9 ? '0' + (objDate.getMonth() + 1) : objDate.getMonth() + 1) + '-' + (objDate.getDate() < 10 ? '0' + objDate.getDate() : objDate.getDate());
}
function formateDateText(objDate, objDateNow){
    var arrDaysText = ['周日','周一','周二','周三','周四','周五','周六'];

    if(!objDate || !(objDate instanceof Date)){
        return '';
    }

    if( (objDate - objDateNow) == 0){
        return '今天';
    }
    else if( (objDate - objDateNow) == 86400000){
        return '明天';
    }
    else{
        return arrDaysText[objDate.getDay()];
    }
}
function Schedules(now, uid){
    /*var date = new Date(now.split('-')[0], parseInt(now.split('-')[1], 10) - 1, now.split('-')[2], '00', '00', '00');        */
    var eventHandler = {
        ".btn-more": this.showMore,
        ".btn-close": this.showSpecific,
        ".btn-book": this.bookMovie,
        ".calendar_tab li": this.switchTab,
        ".cover-pic": this.showMovieInfo,
        ".movieDes": this.showDesPopup
    };

    this.elePlaceMovie = $('div.place-widget-movienews');         

    this.now = now;
    this.uid = uid;
    /*this.days = {};
    
    this.days[ formatDate(date) ] = 0;
    this.days[ date.setDate(date.getDate()+1) && formatDate(date) ] = 1;
    this.days[ date.setDate(date.getDate()+1) && formatDate(date) ] = 2;*/

    //初始化事件处理
    for(var selector in eventHandler){
        this.elePlaceMovie.delegate(selector, "click", $.proxy(eventHandler[selector], this));
    }
}

Schedules.prototype.renderFailInfo = function(){
    this.elePlaceMovie.find('.movienews-loading').text('暂无影讯数据！');
};
Schedules.prototype.renderMovieNews = function(obj){
    var me = this,
         arrMovies = ( $.isArray(obj.base) && obj.base.length > 0 ) ? obj.base :  [],
        arrMovieTimes = ( $.isArray(obj.time_table) && obj.base.length > 0 ) ? obj.time_table :  [],
        data = {
            date: {},
            imgs: [],
            book: obj.webview_style == 2 ? false : true,
            days: []
        };                        
        wrapperWidth = 0,
        date = new Date(),
        now = obj.now_time || date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()),
        contentTpl = '',tabsTpl = '',days={}; 

    this.orign = arrMovieTimes[0][0].src_info[0].src;
    me.arrMovies = arrMovies;
    me.lastOrientation = lastOrientation = -1;
    //组装电影票来源
    /*var orignArr = [];
    for(var i = 0,len = arrMovieTimes.length; i < len; i++){
        for(var j = 0,len2 = arrMovieTimes[i].length; j< len2;j++){

            var item = arrMovieTimes[i][j].src_info[0].src;
            if (orignArr.indexOf(item) === -1) {
                orignArr.push(item);
            }
        }
    }
    this.orign = orignArr.join("_");*/
    //天数
    $.each(arrMovieTimes, function(index, item){
        var objDate = new Date(item[0].date.split('-')[0], parseInt(item[0].date.split('-')[1], 10) - 1, item[0].date.split('-')[2], '00', '00', '00'),
            objText = item[0].date.replace(/-/g, '.').replace(/^[0-9]*./g, '');

        days[ formatDate(objDate) ] = index;
        data.days[index] = {
            text: objText + ' ' + formateDateText(objDate, new Date(now.split('-')[0], parseInt(now.split('-')[1], 10) - 1, now.split('-')[2], '00', '00', '00')),
            date: item[0].date,
            obj: objDate
        };
    });
    this.days = days;
    //创建封面基础信息
    function generatorCover(objs){            
        var arr = [], obj = {};

        $.each(objs, function(index, item){
            var data = {
                    'url': item.movie_picture || '', 
                    'id': item.movie_id || '',
                    'title': item.movie_name || '',
                    'day': '',
                    'newm': false
                }, 
                properties = [];

            $.each(arrMovieTimes, function(_index, _item){
                var i = 0;

                while(i < _item.length){
                    if(item.movie_id == _item[i].movie_id){
                        data['day'] += ('d' + _index);
                        data['newm'] = ((new Date().getTime() - new Date(item.movie_release_date).getTime())<3*24*3600*1000)
                        break;
                    }

                    i++;
                }
            });                 
            data['visible'] = data['day'].match(/0/) ? 'block' : 'none';
            data['labelvis'] = data['visible'] =='block'? 'inline-block' : 'none';
            arr.push(data);
        });

        return arr;
    }
    //创建影片基础信息
    function generatorInfo(id, day){
        var data = {},
            times = [],
            scheduleList = [];
            //myDate = new Date(me.now.split('-')[0], parseInt(me.now.split('-')[1], 10) - 1, me.now.split('-')[2], '00', '00', '00'),
            //day = myDate.setDate(myDate.getDate()+day) && myDate.getFullYear() + '-' + (myDate.getMonth() < 9 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1) + '-' + (myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate());

        //查找指定ID影片
        $.each(arrMovies, function(index, item){
            if(item.movie_id == id)
                data = item;
        });
        data && (data = {
            'name': data.movie_name || '', 
            'id': data.movie_id || '',
            'duration': (data.movie_length && data.movie_length.toString().replace('分钟', '') + '分钟') || '',
            'category': (data.movie_nation ? data.movie_nation + '&nbsp;&nbsp;' : '') +  (data.movie_type || ''),
            'director': data.movie_director || '',
            'players': data.movie_starring || '',
            'score': data.movie_score || "",
            'des': data.movie_description || "",
            'pic': data.movie_picture || "",
            'release': data.movie_release_date || ""
        });
        //查找某天影讯
        $.each(arrMovieTimes, function(index, item){
            if(item[0].date == day)
                times = item;
        });

        if(!$.isArray(times))return;
        $.each(times, function (index, item) {                
            if(data.id != item.movie_id)
                return;

            var subData = {
                day: item.date,
                seatL: true,
                time: item.time || '', 
                type: ( item.lan || item.src_info[0].lan || '') + '/' + ( item.type || item.src_info[0].type || ''), 
                price: item.src_info[0].price || item.origin_price || '&nbsp;&nbsp;-',
                style: item.src_info[0].seq_no ? '' : 'unbook',
                num: item.src_info[0].seq_no,
                orign: item.src_info[0].src,
                cinema: item.src_info[0].cinema_id,
                theater: item.src_info[0].theater,
                movie: item.src_info[0].movie_id,
                name: item.src_info[0].movie_name || data.name,
                info: '{\'lan\':\'' + item.src_info[0].lan + '\',\'time\': \'' + item.time + '\',\'price\': \'' + item.src_info[0].price + '\',\'name\': \'' + data.name + '\'}'
            };
            if(item.src_info[0].aid){
                subData.url = me.createCodeUrl(subData,data);
                subData.seatL = false;
            }
            if(subData.price.toString().indexOf('-') == -1){     
                subData.price = [' ',' ',' '].slice(0, 3 - subData.price.toString().length).join('') + '￥' + subData.price;
            }

            scheduleList.push(subData);
        });
        
        data['times'] = TIMETPL({schedules: scheduleList});
        data['date'] = day;
        data['from'] = times[0].src_info[0].src;
        
        return INFOTPL(data)
            .replace(/&amp;/g,'&')
            .replace(/&lt;/g,'<')
            .replace(/&gt;/g,'>')
            .replace(/&#92;/g,'\\')
            .replace(/&quot;/g,'"')
            .replace(/&#39;/g,'\'');
    }
    function switchMovieInfo(id, index){
        var infoEle = me.eleInfo.length ? me.eleInfo : me.elePlaceMovie.find('.info'),
            closeBtn = $('#btnMovieBookClose');
        var day = me.elePlaceMovie.find('.calendar_tab li.current').attr("data-date"), domId = '#info_' + id + '_' + day, tpl;

        closeBtn.length && closeBtn[0].click();

        if($(domId).css('display') == 'block')
            return;
        if($(domId).length == 0){
            tpl = generatorInfo(id, day);
            $(tpl).prependTo(infoEle).attr('id', domId.substr(1));                
        }

        infoEle.children()
            .hide()
            .filter(domId)
            .attr('style', function(){  
                if(data['book'] && $(this).find('li').length > 7){
                    infoEle.find('.list-opt').data('id', domId).show();
                    $('#btnMovieBookMore').show();      
                    $('#btnMovieBookClose').hide();                  
                }
                    
                return 'display: block';
            });            
    }

    //构造影讯内容
    data['imgs'] = generatorCover(arrMovies);

    contentTpl = DETAILTPL(data);
    tbsTpl = TABSTPL(data);
    me.elePlaceMovie
        .find('.movienews-content')
        .append(tbsTpl)
        .append(contentTpl)
        .show()
        .removeClass('movienews-empty')
        .next()
        .remove();           

    me.eleCover = this.elePlaceMovie.find('.cover'); 
    me.eleInfo = me.elePlaceMovie.find('.info');
    me.eleInfotip = me.elePlaceMovie.find('.info-tip');    

    if(arrMovieTimes.length > 3 && $('.tab_wrapper').width() < 75*arrMovieTimes.length + 8){
         $('.tab_wrapper')
            .addClass('slide')
            .find('.calendar_tab')
            .width(75*arrMovieTimes.length + 8);

        me.tabScroll = new iScroll('tab_wrapper', {
            momentum: false,
            hScroll: true,
            hScrollbar: false,
            vScrollbar: false,
            vScroll: false,
            lockDirection: true,
            handleClick: false
        });
    }

    me.elePlaceMovie.find('.cover-scroller').css({'display':"block"});
    me.coverScroll = new iScroll('cover-wrapper', {
        snap: true,
        momentum: false,
        hScrollbar: false,
        vScrollbar: false,
        vScroll: false,
        lockDirection: true,
        onScrollEnd: function (e) {
            var eleImgs = me.eleCover.find("img[style='display:block']"),
                ele = eleImgs.eq(me.coverScroll.currPageX);
            var id = ele.data('id');

            if(eleImgs.length == 0){
                me.elePlaceMovie.addClass('movienews-empty');
                return false;
            }
                
            switchMovieInfo(id, me.coverScroll.currPageX);
        }
    });

    //当今天TAB选项下无影讯时的处理
    if($('div.cover').find("img[style='display:block']").length)          
        this.updateLayout(0);
    else{
        this.elePlaceMovie.toggleClass('movienews-empty', true);
    }
}          

Schedules.prototype.updateLayout = function(currentIndex) {            
    var wrapperWidth = $('div.cover').width(),me=this,
        eleTab = $('.tab_wrapper'),
        days = eleTab.find('li').length,
        count = $('div.cover').find("img[style='display:block']").length,
        itemWidth = 69,lastOrientation = me.lastOrientation;
                 
    window.orientation = getOrientation();
    //if(window.orientation != lastOrientation) {
        $('#cover-wrapper').css({
            'overflow': 'visible',
            'width': itemWidth + 10,
            'right': (wrapperWidth*3/4 - itemWidth/2 - 10)
        });
        $('#cover-scroller').css('width', (itemWidth + 10) * count);
        
        this.coverScroll.refresh();

        if(typeof currentIndex != 'undefined' && currentIndex > -1){
            this.coverScroll.scrollToPage(currentIndex, 0, 0);        
        }
    //}
    //ios6获取方向属性有延迟
    window.setTimeout(function(){
        window.orientation = getOrientation();
        
        //重置TAB滚动
        if(eleTab.width() < 75*days + 8){
            if(me.tabScroll){
                //me.tabScroll.refresh();
            }else{
                eleTab
                    .addClass('slide')
                    .find('.calendar_tab')
                    .width(75*days + 8);

                me.tabScroll = new iScroll('tab_wrapper', {
                    momentum: false,
                    hScroll: true,
                    hScrollbar: false,
                    vScrollbar: false,
                    vScroll: false,
                    lockDirection: true,
                    handleClick: false
                });
            }

            (window.orientation != lastOrientation) && me.tabScroll.scrollToPage(eleTab.find('.current').index(), 0, 0);
        }
        else{
            if(me.tabScroll){
                eleTab.removeClass('slide').find('.calendar_tab').width('auto');
                me.tabScroll.destroy();
                delete me.tabScroll;
            }
        }

        if(window.orientation != lastOrientation){
          me.lastOrientation = window.orientation;
        }
    }, 100);
}
Schedules.prototype.switchTab = function(event){
    var ele = $(event.target),
            elesImg = [],
            index = ele.index(),
            indexState = index === 0 ? true : false,
            infoState;

    if(ele.hasClass('current'))
        return false;

    stat.addStat(STAT_CODE.PLACE_MOVIE_TAB_CLICK, {day: index});
    
    ele.addClass('current')
        .siblings()
        .removeClass('current');

    if(!this.eleCover || !this.eleCover.length){
        return;
    }

    this.eleCover.find("img").each(function(i, item){                                                
        var ele = $(item);
        var day = ele.data('date'),
            isShow = true;
        
        if(day.indexOf('d' + index) != -1){
            ele.attr('style', 'display:block');
            if(ele.next().hasClass("new_icon")){ele.next().show();}
        }else{
            ele.attr('style', 'display:none');
            if(ele.next().hasClass("new_icon")){ele.next().hide();}
            isShow = false;
        }

        isShow && elesImg.push(ele);
    });
    
    infoState = elesImg.length == 0 ? true : false;
    this.elePlaceMovie.toggleClass('movienews-empty', infoState);
    if(!infoState){
        this.updateLayout(0);
    }
}
Schedules.prototype.showDesPopup = function(event) {
    var id =$(event.target).attr("data-id"),
            arrMovies = this.arrMovies,star,data,desStr,
            elePopup = $('.moviebook-popup-wrapper');
        $.each(arrMovies, function(index, item){
            if(item.movie_id == id)
                data = item;
        });
        if(data.movie_starring){
            star = data.movie_starring.split("/").slice(0,4).join("、");
        }
        if(data.movie_description.length>180){
            desStr = data.movie_description.slice(0,180)+"...";
        }else{
            desStr = data.movie_description;
        }
        data = {
            'name': data.movie_name || '', 
            'id': data.movie_id || '',
            'duration': (data.movie_length && data.movie_length.toString().replace('分钟', '') + '分钟') || '',
            'nation': data.movie_nation,
            'type' : data.movie_type,
            'director': data.movie_director || '',
            'players': star,
            'score' : data.movie_score,
            'des' : desStr,
            'release' : data.movie_release_date
        };
        popupHtml = DESPOPUPTPL(data);
        $(popupHtml)
            .prependTo("#wrapper")
            .show()
            .children()
            .first()
            .css('top', window.scrollY + $(window).height()/3 );
        
    if($('body').height() < window.screen.height)
        elePopup.height(window.screen.height)
    $('#des-btn-close').click($.proxy(this.closePopup,this));
}
Schedules.prototype.showMovieInfo = function(event) {
    var me = this,
        ele = $(event.target), 
        eleCover = me.elePlaceMovie.find('.cover');
    var index = -1;

    eleCover.find("img[style='display:block']").each(function(i, item){                
        if(ele.data('id') == $(item).data('id'))
            index = i;
    });
    
    if(index > -1 && index != me.coverScroll.currPageX){
        stat.addStat(STAT_CODE.PLACE_MOVIE_PIC_CLICK);

        window.setTimeout(function(){
            me.coverScroll.scrollToPage(index, 0);
        }, 0);
    }
}
Schedules.prototype.showMore = function(event) {
    var relID = $(event.target).parent().data('id'), 
        relEle = $(relID),
        relListEle = relEle.find('ul'),
        count = relListEle.children().length,
        listHeight = relListEle.height();

    if(count > 7 && count < 15){
        relListEle.css('max-height', 'none');
        $('#btnMovieBookMore').hide();
        $('#btnMovieBookClose').show();
    }
    else{
        listHeight = listHeight + 386;
        if(listHeight > count*56){
            relListEle.css('max-height', count*56 + 'px');
            $('#btnMovieBookMore').hide();
            $('#btnMovieBookClose').show();
        }
        else
            relListEle.css('max-height', listHeight - 3 + 'px');
    }
}
Schedules.prototype.showSpecific = function(event){
    var relID = $(event.target).parent().attr('data-id'), 
        relEle = $(relID),
        relListEle = relEle.find('ul');

    relListEle.css('max-height', '386px');
    $('#btnMovieBookMore').show();
    $('#btnMovieBookClose').hide();
}
Schedules.prototype.bookMovie = function(event) {
    if(event.target.tagName != 'A')
        return false;
    event.preventDefault();

    stat.addStat(STAT_CODE.PLACE_MOVIE_BOOK_CLICK, {from: this.orign});

    var ele = $(event.target);
    if(ele.hasClass('unbook')){            
        return false;
    }

    var actionUrl = '/detail?',
        query = {
            uid: this.uid,
            date: ele.attr('data-day'),
            seq_no: ele.attr('data-num'),
            cinema_id: ele.attr('data-cinema'), 
            movie_id: ele.attr('data-movie'),
            third_from: ele.data('orign'),
            movie_info: ele.attr('data-info').replace(/\'/g, '"')
        },
        url = actionUrl + 'qt=movie&act=select&from=webapp&' + $.param(query);          
    
    if(query.third_from == 'gewala' || query.third_from == 'wanda'){
        this.renderValidPopup(url); 
        return false;
    }        

    window.location.href = url;
}        
Schedules.prototype.renderValidPopup = function(url){
    var elePopup = $('.moviebook-popup-wrapper');        
    var titles = {'wanda': '万达', 'gewala': '格瓦拉'},
        data = {title: titles[this.orign]},
        popupHtml = POPUPTPL(data),
        number = localStorage.getItem('movie_book_user_mobile');

    if(elePopup.length)return;

    elePopup = $(popupHtml);
    elePopup.prependTo("#wrapper")
        .show()
        .data('url', url)
        .children()
        .first()
        .css('top', window.scrollY + $(window).height()/2 );
    if($('body').height() < window.screen.height)
        elePopup.height(window.screen.height)

    number && $('#valid-phone').val(number);

    $('#valid-btn-close').click($.proxy(this.closePopup,this));
    $('#valid-btn-submit').click($.proxy(this.validPhone,this));
}
Schedules.prototype.closePopup = function(){
    var elePopup = $('.moviebook-popup-wrapper');

    elePopup.length && elePopup.remove();
}
Schedules.prototype.validPhone = function() {
    var eleBtn = $(event.target),
        eleNumber = $('#valid-phone'),
        eleCode = $('#valid-number'),
        eleNumberTip = eleNumber.next(),
        elePopup = $('.moviebook-popup-wrapper');
    var number = eleNumber.val(),
        oldNumber = localStorage.getItem('movie_book_user_mobile');
    
    //创建验证码图片
    function makeValidImg(){
        var callbackName = 'mkcode',
            script = document.createElement('script'),
            cleanup = function () {
                $(script).remove()
                delete window[callbackName]
            };
       
        window[callbackName] = function(data){
            cleanup();

            if(data.content && data.content.vcode)
                elePopup.data('vcode', data.content.vcode)
                    .find('p')
                    .eq(1)
                    .show()
                    .find('img')
                    .attr('src', 'http://map.baidu.com/maps/services/captcha/image?vcode=' + data.content.vcode);
        }
                    
        script.src = 'http://map.baidu.com/maps/services/captcha?setno=1&cb=' + callbackName + '&t=' + (Math.random() * 100000000).toFixed(0);
        $('head').append(script);            
    }
    //检查输入验证码
    function validCode(args, fn){
        var callbackName = 'vdcode',
            script = document.createElement('script'),
            cleanup = function () {
                $(script).remove()
                delete window[callbackName]
            };

        args['t'] = (Math.random() * 100000000).toFixed(0);
        
        window[callbackName] = function(data){                
            cleanup();
            
            if(data.result && data.result.error != 0){
                eleCode.val('');
                elePopup.find('.tip').eq(1).show().text('验证出错，请重新输入验证码！');

                makeValidImg();
                return;
            }

            $.isFunction(fn) && fn();
        };

        script.src = 'http://map.baidu.com/maps/services/captcha/verify?cb=' + callbackName + '&' + $.param(args);
        script.setAttribute('async', 'false');
        $('head').append(script);
    }

    if(!number || number.length != 11 || !number.match(/^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}|15[0-9]\d{8}|18\d{9}/g)){
        eleNumberTip.html('请确保输入号码正确！').show();
        return false;
    }

    if(elePopup.data('valid')){
        eleNumberTip.hide();

        validCode({code: eleCode.val(), vcode: elePopup.data('vcode')}, function(){
            number = eleNumber.val();
            //验证localStorage在IOS隐私模式下是否可用
            try{
                localStorage.setItem('movie_book_user_mobile', number);
            }
            catch(err){}

            window.setTimeout(function(){
                window.location.href = elePopup.data('url') + '&user_mobile=' + number;
            }, 200);
        });
        return false;
    }
    if(!oldNumber || (oldNumber && number != oldNumber) ){
        eleNumberTip.hide();
        elePopup.data('valid', true);

        makeValidImg();
        return false;
    }        

    //验证localStorage在IOS隐私模式下是否可用
    try{
        localStorage.setItem('movie_book_user_mobile', number);
    }
    catch(err){}
    
    window.location.href = elePopup.data('url') + '&user_mobile=' + number;
}       
Schedules.prototype.createCodeUrl = function(json,data){
    var urlParam=util.urlToJSON(window.location.href),url="";

    var urlJson = {
        qt : "mcdkey",
        act : "verify",
        uid : this.uid,
        code : urlParam.code,
        sign : urlParam.sign,
        //影片名称
        name : data.name,
        //影片id
        mid : json.movie,
        //时长
        duration : data.duration,
        //评分
        score : data.score,
        //订票info
        info : json.info.replace(/\'/g, '"'),
        //场次日期
        day : json.day,
        //场次日期
        seq_no : json.num,
        //场次id
        cinemaid : json.cinema,
        //场次时间
        time : json.time,
        //屏幕分类
        type : json.type,
        pname : $("#place-widget-captain-name").html()||"",
        //上映时间
        release : data.release,
        //电影分类
        category : data.category,
        //导演
        director : data.director,
        //主演
        player : data.player,
        //封面
        pic : data.pic
    };
    if(urlParam.code && urlParam.sign){
        url = "/detail?"+util.jsonToUrl(urlJson);
    }
    return url;
}
module.exports = {
    init: function(uid, bookState, now){
        stat.addStat(STAT_CODE.PLACE_MOVIE_PV, {'state': bookState });
        var urlParam=util.urlToJSON(window.location.href);
        var dataQ = {
            qt: 'timetable', 
            act: 'timetable', 
            uid: uid, 
            style: bookState,
            code:urlParam['code']||"",
            sign:urlParam['sign']||"",
        };
        $.ajax({
            url: '/detail?',
            data: dataQ,
            dataType: 'json',
            success: function(data){
                var schedulesObj = new Schedules(data.now_time || now, uid);
                //浏览器翻转事件
                window.addEventListener("resize", function(){schedulesObj.updateLayout();}, false); 
                if(bookState == 2){
                    data = data.other_info;
                }
                if(data.time_table && data.time_table.length){
                    schedulesObj.renderMovieNews(data);    
                }
                else{
                    schedulesObj.renderFailInfo();
                }
            }
        })
    }
}


});