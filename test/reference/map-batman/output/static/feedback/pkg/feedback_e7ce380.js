define('feedback:widget/show/show.js', function(require, exports, module){

/*
@despction 暴露接口~
@author yuanzhijia 2013-07-25
@param onSubmit 验证
@param submit 提交
@param canTouch阻止click事件
@param bind 处理placeholder不兼容
@param syncWordCount 处理当前文字剩余个数
@param noticeTips 信息提示
*/

var feedbackinfo =feedbackinfo || {},
    popup = require('common:widget/popup/popup.js');
feedbackinfo.api ={
    data: {
        product_id: 'lbs-webapp',
        page_id: 'unknown',
        hash: 'unknown',
        user_agent: navigator.userAgent,
        os: "unknown",
        os_type: "unknown",
        os_version: "unknown",
        browser: "unknown",
        browser_version: "unknown"
    },
    // TODO 上线前改成线上地址
    //domain: "",
    //domain: "http://jx-apptest-webgis00.jx.baidu.com:8968",
    domain: "http://map.baidu.com",

    url: "/maps/interfaces/feedback/save",

    submitData:"", //记录上次提交的内容  以防止多次提交！

    addPlaceHolder: function(e) {
        $(e.target).attr("placeholder", $(e.target).data("placeholder") || "");
    },

    removePlaceHolder: function(e) {
        $(e.target).data("placeholder", $(e.target).data("placeholder") || $(e.target).attr("placeholder"));
        $(e.target).attr("placeholder", "");
    },
    filterxss:function(cont){
         cont = cont.replace(/&/g, '&amp;');
         cont = cont.replace(/</g, '&lt;').replace(/>/g, '&gt;');
         cont = cont.replace(/\'/g, '&#39;').replace(/\"/g, '&quot;');
         return cont;
    }
};
module.exports = $.extend({},{
    onSubmit:function (els) {
        var $elContent = els['elContent'],
            $elContact = els['elContact'];

        $(".feedback-tips").remove();

        if (!$elContent.val().trim()) {
            this.noticeTips($elContent, "* 请填写反馈意见！");
            return;
        }

        var isTelOrEmail;
        if ($elContact.val().trim()) {
            if ((/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/i.test($elContact.val().trim()) === true)) {
                isTelOrEmail = "email";
            }

            if (/^0?1[3568]\d{9}$/.test($elContact.val().trim()) === true) {
                isTelOrEmail = "tel";
            }

        } else {
            isTelOrEmail = "none";
        }

        if (!isTelOrEmail) {
            this.noticeTips($elContact, "* 请正确填写手机号或邮箱！");
            return;
        }
        this.submit($elContent, isTelOrEmail, $elContact);
    },
    canTouch: function(e) {
        //阻止默认行为
        e.stopPropagation();
    },
    bind : function(els){
        var $elContent = els['elContent'],
            me = feedbackinfo.api,
            $elContact = els['elContact'];
        $elContent.add($elContact).on('focus', $.proxy(me.removePlaceHolder, this));
        $elContent.add($elContact).on('blur', $.proxy(me.addPlaceHolder, this));
    },
    syncWordCount: function(e) {
        //动态更改剩余可输入字数
        var val = $(e.target).val(),
            len = 0;

        if (val) {
            len = val.length;
        }

        var $ele = $(e.target).prev().children("span").last();
        $ele.text($ele.text().replace(/\d+/, len));
    },
    noticeTips: function($ele, text) {
        $ele.after($("<p />").addClass("feedback-tips").text(text));
        return $ele.next("p");
    },
    submit : function($elContent, isTelOrEmail, $elContact){
        var me = feedbackinfo.api,self = this;
        var submitData = $.param($.extend({
            content: me.filterxss($elContent.val().trim()),
            tel: isTelOrEmail == "tel" ? $elContact.val().trim() : "",
            email: isTelOrEmail == "email" ? $elContact.val().trim() : ""
        }, me.data));
        if (me.submitData == submitData) {
            popup.open({text:'请勿重复提交！'});
            return;
        }

        me.submitData = submitData;
        popup.open({
                text:'意见提交中，请稍后！',
                autoCloseTime:false
        });
        $.ajax({
            url: me.domain + me.url,
            dataType: "jsonp", // 存在跨域问题，必须使用JSONP方式； 要求后端支持callback；
            timeout: 8000,
            data: submitData,
            success: function(data, status, xhr) {
                popup.close();
                if (parseInt(data, 10) === 0) { // 严格判断返回值
                    me.submitData = submitData;
                    self.onSuccess();
                } else {
                    me.submitData = null;
                    self.onFailure();
                }
            },
            error: function(xhr, errorType, error) {
                me.submitData = null;
                self.onFailure();
            }
        });
    },
    reset: function() {
        var $elContent = $("#feedback-content"),
            $elContact = $("#feedback-contact");
        $(".feedback-tips").remove();
        $elContent.val("");
        $elContact.val("");
        this.syncWordCount({
            target: $elContent
        });
        this.syncWordCount({
            target: $elContact
        });
    },
    onSuccess: function() {
        popup.open({
            text:'提交成功，谢谢您的反馈！'
        });
        var me = this;
        setTimeout(function() {
            me.submitData = null;
            me.reset();
            location.href = "/mobile/webapp/index/index";
        }, 3000);
    },

    onFailure: function() {
        popup.open({text:'意见提交失败，请重试！'});
    }
});

});