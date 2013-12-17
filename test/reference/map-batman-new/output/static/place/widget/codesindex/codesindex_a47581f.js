define('place:widget/codesindex/codesindex.js', function(require, exports, module){

/**
 * @description 兑换码抢购首页
 * @author zhangyong 
 */
var HTTP = "http://"+window.location.host,
    locator = require('common:widget/geolocation/location.js'),
    stat    = require('common:widget/stat/stat.js'),
    num = 1,
    msg  ={};
    

//获取城市定位信息
function codesLocate() {
    var cityCode = locator.getCityCode() || 1,
        bound   = {};
    if (locator.hasExactPoi()) {
        bound.point_x = locator.getPointX();
        bound.point_y = locator.getPointY();
        bound.city_id = cityCode;
    }
    return bound;
}
//动态设置banner的宽高
function bannerWidth(){
    var bannerimg = $("#bannerimg");
    var mwidth = bannerimg.width()/2 + "px",
        mheight = bannerimg.height()/2 + "px";

    bannerimg.css({
        width: mwidth,
        height:mheight
    });
}

//动态设置购买数量
function buyCodeCount(){
    var bannerimg = $("#buyCodeCount span");

    bannerimg.click(function() {
        $(this).addClass("selected").siblings("span").removeClass("selected");
        num = parseInt($(this).text());
    });
}

//获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.href.substr(1).match(reg);
    if (r !== null) {
        return decodeURIComponent(r[2]);
    } else {
        return null;
    }
}
//--------------------------------------------
//description  ajax封装
//@param {msg} [obj]
//--------------------------------------------

function ajax(msg) {
    $.ajax({
        url: msg.url || "", //请求地址
        type: msg.type || "GET", //请求方式
        dataType: msg.dataType || "text", //请求数据类型
        crossDomain: msg.crossDomain || false, //是否跨域
        data: msg.data || "",
        contentType: msg.type == "POST" ? "application/x-www-form-urlencoded; charset=utf-8" : null,
        async: true, //是否异步请求，默认为异步

        success: function(result) {
            msg.callback(result);

        },
        error: function() {

        }
    });
}
//--------------------------------------------
//description  异步获取城市列表
//--------------------------------------------
function city(__bound){

    if(__bound.city_id){
        var locatr = "&"+$.param(__bound);
    }else{
        var locatr = "";
    }
    var url  = HTTP + "/mobile/webapp/place/codes/force=simple&qt=webappcitys"+locatr+"&act_id=" + GetQueryString("act_id");

    var msg = {
        url: url,
        type: "GET",
        dataType: "json",
        crossDomain: true,
        data: null,
        callback: cityHTML
    };
    function cityHTML(__data) {
        var citylist = $("#citylist"),
            str = "";
        if (__data.errorNo == 0) {
            $.each(__data.list, function(index, item) {
                str += '<option class="city_opt" value="' + item.city_id + '">' + item.city + '</option>'
            });
        }
        citylist.html(str);

        // if(__bound.city_id){
        //     var locatr = __bound.city_id;
        // }else{
        //     var locatr = "";
        // }
        cinema(locatr,"",1);
    }
    ajax(msg);
}

//城市异步请求
function selectCity(){
    var city = document.getElementById("citylist");
    city.onchange=function(e){
        var t = this.options[this.selectedIndex].value;
        cinema("",t,0);
    };
}

//更改城市地址
function changeSelect(__city_id) {

    var city = document.getElementById("citylist");

    for (var i = 0; i < city.length; i++){
        if (city.options[i].value == __city_id) {
            city.options[i].selected = true;
        }
    }
}
//--------------------------------------------
//description  异步获取影院列表
//@param {__city_id} [string]
//--------------------------------------------

function cinema(__locatr, __city_id, __sn) {
    if (__sn == 0) {
        var locatr = "&city_id=" + __city_id;
    } else {
        var locatr = __locatr;
    }
    //var url = HTTP + "/mobile/webapp/place/codes/force=simple&qt=webappcinemas&city_id="+__city_id+"&act_id=" + GetQueryString("act_id"),
    var url = HTTP + "/detail?qt=mcdkey&from=webapp&act=cinemas"+locatr+"&act_id=" + GetQueryString("act_id"),
        //var url = "http://cq01-rdqa-dev051.cq01.baidu.com:8081/detail?qt=mcdkey&from=webapp&act=cinemas&act_id=" + GetQueryString("act_id")+locatr,
        CITYNAME = $("#cityname");
    var msg = {
        url: url,
        type: "GET",
        dataType: "json",
        crossDomain: false,
        data: null,
        callback: HTMLTMP
    };

    function HTMLTMP(__data) {

        if(__data.errorNo == 0){
            changeSelect(__data.city_id);

            var cinemas = $("#cinemas"),
                str = "",
                indexs = 1;

            $.each(__data.list,function(index,item){
                $.each(item.list,function(i,value){
                    str += '<li class="cinemaslist" id="'+value.uid+'"><p class="shop"><span class="order">'+indexs +'.</span>'+value.name+'</p>';
                    str += '<p class="addr">'+value.address+'</p></li>';
                    indexs++;
                });
            });
            cinemas.html(str);
            listHref(__data);
        }
    };

    ajax(msg);
}
//影院链接
function listHref(__listData){
    $(".cinemaslist").click(function() {
        var uid = this.id;
        location.href = HTTP + "/mobile/webapp/place/detail/force=simple&qt=inf&uid=" + uid +"&c=" + __listData.city_id + "&wd=电影院";
        stat.addStat(STAT_CODE.PLACE_BUYCODES_CINDEMAS_PV, {'state': __listData.city_id});
    });
}

function modaction(){
    var RULE = $("#rule"),
        RULELIST =  $("#rule_list"),
        MOVIEINFO =  $("#movieinfo"),
        MOVIEINFOLIST =  $("#movieinfolist");

    RULE.click(function(){
        RULELIST.toggle();
        $(this).toggleClass("mod_tit");
    });

    MOVIEINFO.click(function(){
        MOVIEINFOLIST.toggle();
        $(this).toggleClass("mod_tit");
    });

}


function BuyCodesfun(__buyData) {
    var GETParam = __buyData,
        phoneMsg = $("#phoneMsg"),
        numMsg = $("#numMsg");

    $("#submitBtn").click(function() {

        var phone = $("#phone").val(),
            url = HTTP + "/detail?qt=mcdkey&from=webapp&act=corder&act_id=" + GETParam.act_id + "&sign=" + GETParam.sign + "&phone=" + phone + "&num=" + num,
            
            msg = {
                url: url,
                type: "GET",
                dataType: "json",
                crossDomain: true,
                data: null,
                callback: callback
            };

            if(!num){
                return;
            }
            if(!phone){
                phoneMsg.html('手机号有误！');
                phoneMsg.removeClass("vhide");
                OBJHide(phoneMsg);
                return;
            }
        stat.addStat(STAT_CODE.PLACE_BUYCODES_PV, {'state': 'buyCodes' });
        ajax(msg);
    });
//--------------------------------------------
//description  购买回调
//@param {__data} [json]
//--------------------------------------------
    function callback(__data) {
        if (__data.errorNo == 200002) {
            phoneMsg.html('手机号有误！');
            phoneMsg.removeClass("vhide");
            OBJHide(phoneMsg);
        } else if (__data.errorNo == 300002) {
            numMsg.html('您的限额已经用完！');
            numMsg.removeClass("vhide");
            OBJHide(numMsg);
        } else if (__data.errorNo == 300003) {
            numMsg.html('您只能购买'+__data.res_num+'张票了哦！');
            numMsg.removeClass("vhide");
            OBJHide(numMsg);
        } else if (__data.errorNo == 0) {
            window.location.href = __data.topayURL;
        }
    }
}
//--------------------------------------------
//description  对象隐藏
//@param {obj，par} [object]
//--------------------------------------------
function OBJHide(obj, par) {
    var timer = window.setTimeout(function() {
        obj.addClass("vhide");
        window.clearTimeout(timer);
    }, 5000);
}

function initialize(__buyData) {
    //bannerWidth();//动态设置banner宽高
    buyCodeCount();//动态设置购买数量的状态
    var boundmsg = codesLocate();//获取城市定位
    city(boundmsg);//获取城市列表
    selectCity();
    modaction();
    BuyCodesfun(__buyData);
}



module.exports = {
    initialize: initialize
};

});