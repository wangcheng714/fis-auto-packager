var stat = require('common:widget/stat/stat.js'),
	util = require('common:static/js/util.js'),
    login = require('common:widget/login/login.js'),
    stat = require('common:widget/stat/stat.js');
	
module.exports = {

	init: function(){
        this.initData();
		this.checkState();
        stat.addCookieStat(STAT_CODE.STAT_USER_RULE_SHOW);
	},
	checkState : function(){
        login.checkLogin(function(data){
                if(!data.status){
                    login.loginAction();
                }
        });
    },
    initData :function(){
        $(".user").remove();
        $(".common-widget-footer a").css('width','48%');
    }
}