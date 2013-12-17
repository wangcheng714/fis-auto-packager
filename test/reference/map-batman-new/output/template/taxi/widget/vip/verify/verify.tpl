{%style id="/widget/vip/verify/verify.inline.less"%}.taxi-widget-vip-verify .inner{box-sizing:border-box;margin:10px 8px;padding:7px 6px;border:1px solid #ccc;border-radius:3px;background:#fff}.taxi-widget-vip-verify input[type=text]{box-sizing:border-box;padding:0 5px;margin:0 0 10px;height:35px;line-height:35px;border:1px solid #ccc;border-radius:3px;width:100%}.taxi-widget-vip-verify .input-code-wrapper{position:relative;width:100%;box-sizing:border-box;padding-right:127px}.taxi-widget-vip-verify .btn-get-code{position:absolute;right:0;top:0;width:118px}.taxi-widget-vip-verify .btn-verify-phone{width:100%}.taxi-widget-vip-verify .taxi-widget-banner{border:1px solid #ccc;border-radius:3px;margin:10px 8px}.taxi-widget-vip-verify .taxi-widget-banner .btn-close{display:none}.taxi-widget-vip-verify .btn-back{display:none}.taxi-widget-vip-verify .logo{position:relative;margin:10px auto;width:120px;height:40px;box-sizing:border-box;padding-left:45px}.taxi-widget-vip-verify .baidu-taxi{font-size:18px;color:#666}.taxi-widget-vip-verify .slogan{font-size:14px;color:#999}.taxi-widget-vip-verify .icon{position:absolute;width:40px;height:40px;left:0;top:0;background:url(/static/taxi/widget/home/images/bg-logo_35d71f6.png) no-repeat 0 0;background-size:40px 40px}{%/style%}<div class="taxi-widget-vip-verify">
{%widget name="taxi:widget/common/nav/nav.tpl" title="验证手机号" btnBack=true%}
<div class="inner">
<div class="logo">
<span class="icon"></span>
<div class="baidu-taxi">百度打车</div>
<div class="slogan">专业代叫版</div>
</div>
<input class="input-phone" type="text" placeholder="输入手机号"/>
<div class="input-code-wrapper">
<input class="input-code" type="text" placeholder="输入验证码"/>
<button class="btn-get-code btn-h35" disabled="disabled">获取验证码</button>
</div>
<button class="btn-verify-phone btn-h35" disabled="disabled">验证手机号</button>
</div>
</div>
{%script%}
require('taxi:widget/vip/verify/verify.js').init();
{%/script%}