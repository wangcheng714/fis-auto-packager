define('user:widget/exchange/exchange.js', function(require, exports, module){

var stat = require('common:widget/stat/stat.js'),
	util = require('common:static/js/util.js'),
    login = require('common:widget/login/login.js'),
    stat = require('common:widget/stat/stat.js');
	

module.exports = {
	init: function(data){
        this.initData(data);
		this.bindEvent();
		this.checkState();
        stat.addCookieStat(STAT_CODE.STAT_USER_EXCHANGE_SHOW);

	},
	bindEvent: function(){
		$('.exchange-gogift').on('click', $.proxy(this._exchangeGift, this));
        $('.gift_loadmore').on('click', $.proxy(this._loadMoreComment, this));
	},
	_exchangeGift: function(e){
        var me = this;
        if (util.isAndroid()) {
            me.getNativeInfo("com.baidu.BaiduMap", function(data) {  
                if (data.error == 0) {
                    location.href = 'bdapp://map/';
                }else{
                    location.href = 'http://mo.baidu.com/d/map/1321/bmap_andr_1321.apk';
                }
            }, function() {
                location.href = 'http://mo.baidu.com/d/map/1321/bmap_andr_1321.apk';
            });
        }else if(util.isIPhone()){
            location.href = 'http://itunes.apple.com/cn/app/id452186370'; 
        }else if(util.isIPad()){
            location.href = 'https://itunes.apple.com/cn/app/bai-du-de-tuhd/id553771681'; 
        }else{
            location.href = 'http://mo.baidu.com/map'; 
        }
	},
	checkState : function(){
        login.checkLogin(function(data){
                if(!data.status){
                    login.loginAction();
                }
        });
    },
    initData :function(data){
        $(".user").remove();
        $(".common-widget-footer a").css('width','48%');
        this.cacheData = data;
        this.clickMore = 0;
    },
    _loadMoreComment :function(){
        var loadMore = $('.gift_loadmore')[0],
           value = loadMore.innerText;
        this.clickMore = this.clickMore + 1 ; 
        this.displayMore(this.cacheData);
    },
    displayMore :function(data){

        var start = this.clickMore * 10;
        var end = start + 10;
        var dataLength = data.list.length;
        if(start >= dataLength){
            $(".gift_loadmore").remove();
            return;
        }
        if(end >= dataLength){
            end = dataLength;
            $(".gift_loadmore").remove();
        }
        div = $(".exchange-gift");
        var data = data.list;
        for (var i=start;i<end;i++){
            ul = $("<ul></ul>");
            
            var str1 = "";
            var str2 = "";
            var li1 = $("<li class='exchange-gift-list1'></li>");
            str1 += '<div class="exchange-gift-img"><img src="' + data[i].pic_url + '"></div>';
            str1 += '<div class="exchange-gift-contain">';
            str1 += '<div class="exchange-gift-title">'+data[i].title+'</div>';
            str1 += '<div class="exchange-gift-des">'+data[i].description+'</div>';
            str1 += '<div class="exchange-gift-all">总量'+data[i].total_num+'件 剩余'+(data[i].total_num-data[i].exchange_num)+'</data>';
            str1 += '<div class="exchange-gift-buy">兑换（-'+data[i].need_integral+'积分)</div></div>';
            li1.html(str1);
            i=i+1;
            if(i != dataLength){
                var li2 = $("<li class='exchange-gift-list2'></li>");
                str2 += '<div class="exchange-gift-img"><img src="' + data[i].pic_url + '"></div>';
                str2 += '<div class="exchange-gift-contain">';
                str2 += '<div class="exchange-gift-title">'+data[i].title+'</div>';
                str2 += '<div class="exchange-gift-des">'+data[i].description+'</div>';
                str2 += '<div class="exchange-gift-all">总量'+data[i].total_num+'件 剩余' + (data[i].total_num-data[i].exchange_num) + '</data>';
                str2 += '<div class="exchange-gift-buy">兑换（-'+data[i].need_integral+'积分)</div></div>';
            }else{
                var li2 = $("<li class='exchange-gift-list2' style='visibility:hidden;'></li>");
                str2 += '<div class="exchange-gift-img"><img src=""></div>';
                str2 += '<div class="exchange-gift-contain">';
                str2 += '<div class="exchange-gift-title">索尼数码相机</div>';
                str2 += '<div class="exchange-gift-des">索尼数码相机（颜色随机）</div>';
                str2 += '<div class="exchange-gift-all">总量5件 剩余5';
                str2 += '<div class="exchange-gift-buy">兑换（-10600积分)</div>';
                str2 += '</div></div>';
            }
            
            li2.html(str2);
            ul.append(li1).append(li2);
            div.append(ul);
        } 
    },
    getNativeInfo: function(packageName, successCallback, errorCallback) {
        var url = "http://127.0.0.1:6259/getpackageinfo?packagename=" + packageName;
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success : successCallback,
            error : errorCallback
        });
    }
}

});