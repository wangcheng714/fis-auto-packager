/**
 * @fileoverview footer
 */
var pagemgr = require('common:widget/pagemgr/pagemgr.js');

module.exports = {

    init: function(opts) {
        this.bind();
    },


    bind: function() {
        var me = this;
        //$("#main,#wrapper").css("background-color","#fff");
        //解决ios6横屏以后页面的右侧有多余宽度的问题
        $("#wrapper").css("overflow","hidden").addClass('bg-white');
        pagemgr.registerDestory($.proxy(me.destory, this));
    },

    unbind: function() {
        //$("#main,#wrapper").css("background-color","#f2f2f2");
        $("#wrapper").css("overflow","auto").removeClass('bg-white');
    },

    destory: function() {
        this.unbind();
    },
};
