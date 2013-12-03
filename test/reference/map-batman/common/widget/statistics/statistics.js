/**
 * @fileOverview 异步统计模块 
 * @author yuanzhijia@baidu.com
 * @date 2013-11-05
 */
var stat = require('common:widget/stat/stat.js');
module.exports = {
    init : function () {
    	var me = this;
    	me.addestop();
    },
    addestop:function(){
	    //从桌面打开统计
        if(window.navigator.standalone){
            stat.addCookieStat(COM_STAT_CODE.STAT_FROMDESTOP_OPEN);
        }
    }
}