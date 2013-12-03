require("place:static/lib/template.js");
var util = require('common:static/js/util.js');
var stat = require('common:widget/stat/stat.js');
var iScroll = require('common:static/js/iscroll.js');

var DETAILTPL = __inline("detail.tmpl");
var TABSTPL = __inline("tabs.tmpl");
var INFOTPL = __inline("info.tmpl");
var TIMETPL =  __inline("time.tmpl");
var POPUPTPL =  __inline("popup.tmpl");
var DESPOPUPTPL =  __inline("despopup.tmpl");

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
