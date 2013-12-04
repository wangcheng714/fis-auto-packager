<div class="taxi-widget-waiting">
    {%widget name="taxi:widget/common/nav/nav.tpl" title="等待抢单"%}
    <div class="taxi-info">
        <span class="text">附近有</span>
        <span class="count"></span>
        <span class="text">辆车</span>
    </div>
    {%widget name="taxi:widget/common/radar/radar.tpl"%}
    <div class="pushing">
        正在推送...
    </div>
    <div class="push-progress">
        <span class="pushed-car">
            已推送<span class="count">0</span>辆车
        </span>
        <span class="rest-time">
            请等待<span class="second">120</span>秒
        </span>
    </div>
</div>
{%script%}
require('waiting.js').init();
{%/script%}