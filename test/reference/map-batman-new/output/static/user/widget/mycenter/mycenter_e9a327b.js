define('user:widget/mycenter/mycenter.js', function(require, exports, module){

var stat = require('common:widget/stat/stat.js'),
	util = require('common:static/js/util.js'),
	login = require('common:widget/login/login.js'),
    cookie = require("common:widget/cookie/cookie.js"),
    stat = require('common:widget/stat/stat.js');
	

module.exports = {
	init: function(data){
        this.initData(data);
        this.checkState();
		this.bindEvent();
        stat.addCookieStat(STAT_CODE.STAT_USER_MYCENTER_SHOW);
	},
	bindEvent: function(){
		$('#logout').on('click', $.proxy(this._logout, this));
		$('.mycenter_loadmore').on('click', $.proxy(this._loadMoreComment, this));
	},
	_logout: function(e){
		login.logoutAction();
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
    	var loadMore = $('.mycenter_loadmore')[0],
           value = loadMore.innerText;
        if (value == "足迹加载中...") return;
        loadMore.innerText = "足迹加载中...";
        this.clickMore = this.clickMore + 1 ; 
        this.displayMore(this.cacheData);
        loadMore.innerText = "加载更多足迹信息";
    },
    displayMore :function(data){

    	ul = $(".mycenter-mytrace-ul ul");
        var start = this.clickMore * 10;
        var end = start + 10;
        if(start >= data.list.length){
            $(".mycenter_loadmore").remove();
            return;
        }
        if(end >= data.list.length){
            end = data.list.length;
            $(".mycenter_loadmore").remove();
        }
        for (var i = this.clickMore * 2;i < end; i++){
            for(var j = 0;j < data.list[i].list.length;j++){
                var str = "";
                var li = $("<li class='mycenter-mytrace-list'></li>");
                str += '<div class="mycenter-mytrace-point"></div>';
                str += '<div class="mycenter-mytrace-data mycenter-mytrace-height">' + data.list[i].visitTime+'</div>';
                str += '<div class="mycenter-mytrace-shop mycenter-mytrace-height">' +data.list[i].name+'</div>';
                str += '<div class="mycenter-mytrace-address mycenter-mytrace-height">';
                str += '<div class="mycenter-mytrace-address-logo"></div>';
                str += '<div class="mycenter-mytrace-address-con">'+data.list[i].address+'</div></div>';
                str += '<div class="mycenter-mytrace-comment  mycenter-mytrace-height">';
                str += '<div class="mycenter-mytrace-comment-logo"></div>';
                str += '<div class="mycenter-mytrace-comment-con">'+(data.list[i].list[j].content?data.list[i].list[j].content:"&nbsp;")+'</div></div>';
                li.html(str);
                ul.append(li);
            }
        } 
    }

}

});