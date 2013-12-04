<div class="taxi-widget-settings">
    {%widget name="taxi:widget/common/nav/nav.tpl" title="设置" btnBack=true%}
    <div class="input-phone-wrapper">
        <span class="text">手机号</span>
        <input class="input-phone" type="text" placeholder="输入手机号" />
        <button class="btn-modify btn-h35">修改</button>
    </div>
    <div class="extra-info">
        <button class="btn-help">叫车攻略</button>
        <button class="btn-terms">条款与声明</button>
    </div>
    <div class="partner">
        <div class="captain">打车服务合作方</div>
        <ul>
            <li>
                <img class="logo" src="/widget/settings/images/logo-didi.png" />
                <span class="name">嘀嘀打车</span>
            </li>
            <li>
                <img class="logo" src="/widget/settings/images/logo-kuaidi.png" />
                <span class="name">快的打车</span>
            </li>
            <li>
                <img class="logo" src="/widget/settings/images/logo-dahuangfeng.png" />
                <span class="name">大黄蜂打车</span>
            </li>
        </ul>
    </div>
</div>
{%script%}
require('settings.js').init();
{%/script%}