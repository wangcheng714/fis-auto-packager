define('place:widget/premium/premium.js', function(require, exports, module){

var $uls = $('.premium-list > li'), //优惠信息层元素集合
    $prev = $('.place-widget-premium-pagenum-prev'), //上一页元素
    $next = $('.place-widget-premium-pagenum-next'), //上一页元素
    $curpage = $('.place-widget-premium-curpage'), //当前页面元素
    $totalpage = $('.place-widget-premium-totalpage'), //总页数
    stat = require('common:widget/stat/stat.js'),
    util = require('common:static/js/util.js'),
    cookie = require("common:widget/cookie/cookie.js"),
    statData;

var MsgManager = function(){
    var saleId, saleName, $container, $tip;

    function sendMsg(){
        var tel = $('#msg-tel').val();

        if(isNaN(tel) || tel.length !== 11 || !tel.match(/^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}|15[89]\d{8}|18\d{9}/g)){
            $tip.addClass('tip-active');
            setTimeout(function(){
                $tip.removeClass('tip-active');
             },1000);
            return;
        }
        
        Msg.send(
            {
                en_name: saleName,
                poi_id: poiID,
                promo_id: saleId,
                mobile: tel
            }, 
            sendMsgSuccess
        );
        //hide the message
        showMessage({'type':'sendIng'});

        //stat.addStat(STAT_CODE.STAT_PREMIUM_DETAIL_CLICK_BTN, {uid: poiID, source: poiID === sourceUid ? 'qr' : ''});
    }
    function cancelSend(){
        Popup.hidePopup();
    }
    function showMessage(opts) {
        opts = opts || {};

        var ms = {       
                'noNetWork' : '请检查网络，稍后重试',
                'sendIng' : '正在发送...',
                'success' : '发送成功',
                'fail' : '发送失败'
            },
            message = opts.message || ms[opts.type] || ms['fail'],
            $msgForm = $container.find('.msg-form');
            $msgNotice = $container.find('.msg-notice');
         
         $msgForm.hide();
         $msgNotice.show().html(message);
    }
    function sendMsgSuccess(json){
        var errno = json.errorNo,
            baidu_id,
            promo_id;
         
        if(errno === 0){
            //baidu_id =  cookie.get("BAIDUID");
            // = this.get("saleId");

            //for lba
            //placeUtil.addStatForMec(1, {'stat_type':'lbc_promo', 'origin':6, 'promo_id':promo_id, 'baidu_id':baidu_id, 'action':2});
//            stat.addStat(STAT_CODE.STAT_PLACE_PREMIUM_SEND_SUCCESS,{
//              uid : poiID,
//              source: poiID === sourceUid ? 'qr' : ''
//            });
            showMessage({'type':'success'});
        }
        else{
            showMessage({'message':json.errMsg});
        }       

        //close the prompt after 2seconds
        setTimeout(function(){
            Popup.hidePopup();            
        },2000);
    }

    function init(){
        if(!$popup){
            Popup.creatPopup();

            $container = $('div.msg-container');
            $tip = $container.find('.tip');
            
            $("#msg-send-btn").on("click",sendMsg);
            $("#msg-cancel-btn").on("click",cancelSend);
        }
    }

    return {
        show : function(id, name){
            saleId = id || '';
            saleName = name || '';

            init();            

            $popup.show().find('input').focus();
        }
    };
}(),
Popup = {
    creatPopup : function(){
        var popupHtml = '<div class="place-msg-mask">\
            <div class="msg-container">\
                <div class="msg-form">\
                    <p>请输入手机号</p>\
                    <p>\
                        <input type="tel" id="msg-tel"/>\
                        <span class="tip">请输入正确手机号</span>\
                    </p>\
                    <p class="opt">\
                        <a href="javascript:void(0);" id="msg-send-btn" class="msg-send-btn">发送</a>\
                        <a href="javascript:void(0);" id="msg-cancel-btn" class="msg-cancel-btn">取消</a>\
                    </p>\
                </div>\
                <div class="msg-notice"></div>\
            </div>\
        </div>';

        $popup = $(popupHtml).appendTo("#wrapper");
    },
    hidePopup : function(){
        $popup && $popup.hide();
    },
},
Msg = {
    send: function(opt, callback){
        opt = $.extend({
            qt: 'sms',
            en_name: '',
            poi_id: '',
            promo_id: '',
            mobile: '',
            src: 'map',
            terminal: 'webapp',
            imei: 200000000000000
        }, opt);

        $.ajax({
            'url' : 'http://client.map.baidu.com/detail',
            'data': opt,
            'success' : callback,
            'dataType' : 'jsonp'
        });
    }
},
sourceUid = util.urlToJSON(location.href).uid,
poiID,
$popup;

$('#place-premium-msg-btn').click(function(){
    var $target = $(this),
        saleId = $target.data("saleid"),
        enName = $target.data("enname");
    
    window.scrollTo(0, $('#product-nav').height());

    MsgManager.show(saleId, enName);

    // 详情页短信下载点击量
    stat.addStat(STAT_CODE.PLACE_PREMIUM_SMSG_DL_CLICK, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});
});

/**
 * 显示上一页
 * @param {event} e 事件对象
 */
function goPrev(e) {
    var cp = $curpage.html()-0; //当前页面索引

    if($next.hasClass('place-widget-premium-disable')){
        $next.removeClass('place-widget-premium-disable');
    }

    if(!$prev.hasClass('place-widget-premium-disable')){
        $next.on('click', goNext);

        $uls.hide();
        $uls.eq(cp-2).show();
        $curpage.html(cp-1);
        if(cp-2==0){
            $prev.addClass('place-widget-premium-disable');
            $prev.off('click', goPrev);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function goNext(e) {
    var cp = $curpage.html() - 0, //当前页面索引
        total = $totalpage.html() - 0; //总页数

    if($prev.hasClass('place-widget-premium-disable')){
        $prev.removeClass('place-widget-premium-disable');
    }


    if(!$next.hasClass('place-widget-premium-disable')){
        $prev.on('click', goPrev);

        $uls.hide();
        $uls.eq(cp).show();
        $curpage.html(cp+1);
        if(cp+1==total){
            $next.addClass('place-widget-premium-disable');
            $next.off('click', goNext);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

module.exports = {
    init: function(arg, data){
        poiID = arg;

        statData = data || {};

        var total = $totalpage.html()-0; //总页数
        if(total>1){
            $prev.on('click', goPrev);
            $next.on('click', goNext);
        }

        //添加团购页展现量
        stat.addStat(STAT_CODE.PLACE_PREMIUM_VIEW, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});
    }
};


});