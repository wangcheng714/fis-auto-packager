/**
 * @description 兑换码影院列表页面
 * @author zhangyong 
 */
var HTTP = "http://"+window.location.host,
    msg  ={},
    flag = true;

//自动设置影院宽度
function autoWidth() {
    //var nameWidth = $("body").width() - 115;
    var nameWidth = $("body").width() - 85;
    $(".movie_name").css("width", nameWidth);
    $("#back").click(function(){
        window.history.go(-1);
    });
}

$(window).resize(function() {
    autoWidth();
});

//影院链接
function listHref(__listData){
    $(".list").click(function() {
        var uid = this.id;
        location.href = HTTP + "/mobile/webapp/place/detail/force=simple&qt=inf&uid=" + uid +
        "&c=" + __listData.city_id + "/&code=" + __listData.code + "&sign=" + __listData.sign;

    });
}

//城市异步请求
function selectCity(){
    var city = document.getElementById("city");
    city.onchange=function(e){
        var t = this.options[this.selectedIndex].value;
        msg.city_id = t;
        request(msg);
    };
}

//更改城市地址
function changeSelect(__city_id) {

    var city = document.getElementById("city");

    for (var i = 0; i < city.length; i++){
        if (city.options[i].value == __city_id) {
            city.options[i].selected = true;
        }
    }
}


function CodesHTML(__listData) {
    var str = "";
    $.each(__listData.list, function(index, item) {
        str += '<dl class="list list_boder" id="' + item.uid + '">';
        str += '<dt><span class="sn">' + (index + 1) + '</span><span class="movie_name">' + item.name + '</span></dt>';
        str += '<dd><span class="addr">' + item.address + '</span></dd><dd class="trad"></dd></dl>';
    });

    $("#list_info").html(str);

    if (flag === true) {
        changeSelect(__listData.city_id);
        flag = false;
    }
    listHref(__listData);
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
//获取定位信息
function locator() {
    var bound = {};

    bound.point_x = GetQueryString("point_x");
    bound.point_y = GetQueryString("point_y");
    bound.city_id = GetQueryString("city_id");

    if (bound.city_id) {
        return $.param(bound);
    } else {
        return "";
    }
}


//异步请求城市信息

function request(__msg) {
    var curReqUrl;
    if (__msg.city_id) {
        curReqUrl = HTTP + "/mobile/webapp/place/codes/force=simple&qt=cinemas&code=" + __msg.code + "&sign=" + __msg.sign + "&city_id=" + __msg.city_id;
    } else {
        curReqUrl = HTTP + "/mobile/webapp/place/codes/force=simple&qt=cinemas&code=" + __msg.code + "&sign=" + __msg.sign + "&" + __msg.bound;
    }
    $.ajax({
        url: curReqUrl, //请求地址
        type: "get", //请求方式
        dataType: "json", //请求数据类型
        crossDomain: false, //是否跨域
        data: null,
        async: true, //是否异步请求，默认为异步
        error: function() {},

        success: function(__listData) {

            if(__listData.errorNo === 0){

                CodesHTML(__listData);
                $("#codes_box").removeClass("hide");
                $("#over").addClass("hide");
            }else{
                $("#codes_box").addClass("hide");
                $("#over").removeClass("hide");
            }
        }
    });
}

function initialize(__code,__sign) {
    autoWidth();
    msg.code = __code;
    msg.sign = __sign;
    msg.bound = locator();
    selectCity();
    request(msg);
}

module.exports = {
    initialize: initialize
};