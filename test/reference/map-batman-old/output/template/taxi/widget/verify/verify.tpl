{%style id="/widget/verify/verify.inline.less"%}.taxi-widget-verify .inner {
  box-sizing: border-box;
  margin: 10px 8px;
  padding: 7px 6px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: white;
}
.taxi-widget-verify input[type=text] {
  box-sizing: border-box;
  padding: 0px 5px;
  margin: 0px 0px 10px;
  height: 35px;
  line-height: 35px;
  border: 1px solid #ccc;
  border-radius: 3px;
  width: 100%;
}
.taxi-widget-verify .input-code-wrapper {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding-right: 127px;
}
.taxi-widget-verify .btn-get-code {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 118px;
}
.taxi-widget-verify .btn-verify-phone {
  width: 100%;
}
{%/style%}<div class="taxi-widget-verify">
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
require('taxi:widget/verify/verify.js').init();
{%/script%}