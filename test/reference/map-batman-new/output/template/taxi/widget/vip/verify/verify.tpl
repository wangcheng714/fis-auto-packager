{%style id="/widget/vip/verify/verify.inline.less"%}.taxi-widget-vip-verify .inner{box-sizing:border-box;margin:10px 8px;padding:7px 6px;border:1px solid #ccc;border-radius:3px;background:#fff}.taxi-widget-vip-verify input[type=text]{box-sizing:border-box;padding:0 5px;margin:0 0 10px;height:35px;line-height:35px;border:1px solid #ccc;border-radius:3px;width:100%}.taxi-widget-vip-verify .input-code-wrapper{position:relative;width:100%;box-sizing:border-box;padding-right:127px}.taxi-widget-vip-verify .btn-get-code{position:absolute;right:0;top:0;width:118px}.taxi-widget-vip-verify .btn-verify-phone{width:100%}.taxi-widget-vip-verify .taxi-widget-banner{border:1px solid #ccc;border-radius:3px;margin:10px 8px}.taxi-widget-vip-verify .taxi-widget-banner .btn-close{display:none}.taxi-widget-vip-verify .btn-back{display:none}{%/style%}<div class="taxi-widget-vip-verify">
{%widget name="taxi:widget/common/nav/nav.tpl" title="验证手机号" btnBack=true%}
<div class="inner">
<input class="input-phone" type="text" placeholder="输入手机号，方便司机联系你"/>
<div class="input-code-wrapper">
<input class="input-code" type="text" placeholder="输入验证码"/>
<button class="btn-get-code btn-h35" disabled="disabled">获取验证码</button>
</div>
<button class="btn-verify-phone btn-h35" disabled="disabled">验证手机号</button>
</div>
{%widget name="taxi:widget/common/banner/banner.tpl"%}
</div>
{%script%}
require('taxi:widget/vip/verify/verify.js').init();
{%/script%}