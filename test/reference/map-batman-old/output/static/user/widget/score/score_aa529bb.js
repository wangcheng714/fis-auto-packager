define('user:widget/score/score.js', function(require, exports, module){

var stat = require('common:widget/stat/stat.js'),
	util = require('common:static/js/util.js'),
	login = require('common:widget/login/login.js'),
    stat = require('common:widget/stat/stat.js');
	

module.exports = {
	init: function(data){
		this.initData(data);
		this.bindEvent();
		this.checkState();
        stat.addCookieStat(STAT_CODE.STAT_USER_SCORE_SHOW);
	},
	bindEvent: function(){
		$('.myscore_loadmore').on('click', $.proxy(this._loadMoreComment, this));
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
    	var loadMore = $('.myscore_loadmore')[0],
           value = loadMore.innerText;
        this.clickMore = this.clickMore + 1 ; 
        this.displayMore(this.cacheData);
    },
    displayMore :function(data){

        var start = this.clickMore * 10;
        var end = start + 10;
        if(start >= data.list.length){
            $(".myscore_loadmore").remove();
            return;
        }
        if(end >= data.list.length){
            end = data.list.length;
            $(".myscore_loadmore").remove();
        }
        var list = data.list;
        ul = $(".myscore-all");
        for(var i = start; i < end;i++){ 
            var str = "";
            var li = $("<div class='score-contain'></div>");
            str += '<div class="score-contain-left">'+ list[i].integral_type_desc +'</div>';
            str += '<div class="score-add">+'+ list[i].integral +'积分</div>';
            str += '<div class="score-time">'+ list[i].operation_time +'</div>';
            li.html(str);
            ul.append(li);
            
        }  
    }

}

});