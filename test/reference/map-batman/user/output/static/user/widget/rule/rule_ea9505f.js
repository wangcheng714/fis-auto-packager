define("user:widget/rule/rule.js",function(t,i,o){var n=t("common:widget/stat/stat.js"),e=(t("common:static/js/util.js"),t("common:widget/login/login.js")),n=t("common:widget/stat/stat.js");o.exports={init:function(){this.initData(),this.checkState(),n.addCookieStat(STAT_CODE.STAT_USER_RULE_SHOW)},checkState:function(){e.checkLogin(function(t){t.status||e.loginAction()})},initData:function(){$(".user").remove(),$(".common-widget-footer a").css("width","48%")}}});