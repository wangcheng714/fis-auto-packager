/**
 * 验证码服务
 * 坦然
 * 2013-10-23
 */
define('place:static/js/vcode.js', function (require, exports, module) {

var VCode, _option;

_option = {};

/**
 * @param {object} option
 * @param {dom}    option.el 验证码放到哪个dom节点中
 */
VCode = function(option) {
    var self = this;

    self.option = $.extend({}, _option, option);

    self.el = $(self.option.el);
    self.render();
    self.refreshVcode();
}

VCode.Const = {};
//VCode.Const.U_GET_VCODE = 'http://map.baidu.com/maps/services/captcha?cb=getVcodeCallback&t='+new Date().getTime();
VCode.Const.U_GET_VCODE = "http://map.baidu.com/maps/services/captcha?cb=?";

VCode.Const.U_GET_IMAGE = 'http://map.baidu.com/maps/services/captcha/image';
VCode.Const.T_VCODE = '' +
    '<input type="hidden" name="vcode" value="" />'+
    '<img title="点击更换验证码" width="100" height="30"  id="VerifyCodeImg" class="codeimg"  src="http://map.baidu.com/img/transparent.gif" />'+
    '<a id="changeVerifyCode" href="javascript:void(0);" class="changecode">换一张</a>';


$.extend(VCode.prototype, {
    /**
     * 渲染模板
     * @private
     */
    render: function() {
        var self = this;

        self.el.prepend($(VCode.Const.T_VCODE));
        self.el.find('#changeVerifyCode').click(function () {
            self.refreshVcode();
        });
    },
    /**
     * 设置vcode
     * @private
     */
    setVcode: function(vcode) {
        var self = this;

        self.el.find("input[name=vcode]").val(vcode);
        self.vcode = vcode;
    },
    /**
     * 刷新验证码
     * @public
     */
    refreshVcode: function() {
        var self = this;

        self.el.find(".vcode-img").prop("src", "http://map.baidu.com/img/transparent.gif");

        $.ajax({
            url: VCode.Const.U_GET_VCODE + "&t=" + (+new Date()),
            dataType: "jsonp",
            jsonp: "cb",
            success: function(data) {
                var vcode;

                if (vcode = data.content.vcode) {
                    self.setVcode(vcode);
                    self.getImage(vcode);
                }
            }
        });
    },
    getImage: function(vcode) {
        var self = this;

        this.el.find(".codeimg").prop("src", VCode.Const.U_GET_IMAGE + '?vcode=' + vcode);
    },
    /**
     * 获取验证码
     * @public
     */
    getData: function () {
        var self = this;

        return {
            vcode: self.vcode,
            code: self.el.find("input[name=code]").val()
        }
    }
});

module.exports = VCode;
});