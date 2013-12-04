<div class="taxi-widget-response">
    {%widget name="taxi:widget/common/nav/nav.tpl" title="等待上车"%}
    <div class="responder" style="display: none;">
        <div class="head">
            <img src="/widget/response/images/head.png"/>
        </div>
        <div class="profile">
            <div class="driver">${driver_name}</div>
            <div class="car">
                <span class="number">${taxi_no}</span>
                <span class="company">${taxi_company}</span>
            </div>
            <div class="feedback">
                <span class="total">接单<span class="count">${order_num}</span></span>
                <span class="good">好评<span class="count">${praise_num}</span></span>
            </div>
        </div>
        <a class="btn-phone" href="tel:${phone}"></a>
    </div>
    <div class="bottom-bar">
        <div class="car-position">
            <span class="distance">
                距您<span class="count">1</span>公里
            </span>
            <span class="rest-time">
                约<span class="count">10</span>分钟后到达
            </span>
        </div>
        <button class="btn-end">结束订单</button>
    </div>
    <div class="feedbackdialog" style="display: none;">
        <div class="title">请选择订单状态</div>
        <div class="buttons">
            <button class="btn-on-car">我已上车</button>
            <button class="btn-not-come">司机没来</button>
            <button class="btn-agreement">没上车，已和司机沟通达成一致</button>
        </div>
    </div>
</div>
{%script%}
require('response.js').init();
{%/script%}