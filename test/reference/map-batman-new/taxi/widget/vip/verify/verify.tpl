<div class="taxi-widget-vip-verify">
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
require('verify.js').init();
{%/script%}