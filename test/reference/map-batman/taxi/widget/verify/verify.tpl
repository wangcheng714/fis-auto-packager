<div class="taxi-widget-verify">
    {%widget name="taxi:widget/common/nav/nav.tpl" title="验证手机号" btnBack=true back="settings"%}
    <div class="inner">
        <input class="input-phone" type="text" placeholder="输入手机号，方便司机联系你"/>

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