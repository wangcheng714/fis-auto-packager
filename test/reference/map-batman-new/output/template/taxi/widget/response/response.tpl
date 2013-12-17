{%style id="/widget/response/response.inline.less"%}.taxi-widget-response{position:relative;height:100%;box-sizing:border-box;padding:50px 0 100px;background:url(/static/taxi/widget/response/images/bg_0570317.png) no-repeat center top;background-size:cover;background-origin:content-box}.taxi-widget-response .taxi-widget-nav{position:absolute;width:100%;height:50px;top:0;left:0}.taxi-widget-response .responder{position:relative;box-sizing:border-box;height:75px;line-height:20px;padding:10px 0 10px 75px;background:rgba(0,0,0,.55)}.taxi-widget-response .responder::after{content:'';position:absolute;top:100%;right:100px;width:17px;height:10px;background:url(/static/taxi/widget/response/images/bg-arrow_1913fcc.png) no-repeat 0 0;background-size:17px 10px}.taxi-widget-response .responder::before{content:'';position:absolute;top:90px;right:80px;width:55px;height:36px;background:url(/static/taxi/widget/response/images/icon-car_64d429e.png) no-repeat center center;background-size:55px 36px}.taxi-widget-response .head{position:absolute;width:55px;height:55px;top:10px;left:10px}.taxi-widget-response .head img{width:55px;height:55px}.taxi-widget-response .driver{font-size:18px;color:#fff}.taxi-widget-response .car{font-size:16px;color:#fff}.taxi-widget-response .feedback{font-size:14px;color:#ccc}.taxi-widget-response .btn-phone{display:block;position:absolute;top:10px;right:10px;width:58px;height:58px;background:url(/static/taxi/widget/response/images/bg-btn-phone_ecb3d79.png) no-repeat 0 0;background-size:58px 58px}.taxi-widget-response .bottom-bar{position:absolute;box-sizing:border-box;width:100%;height:100px;background:#fafafa;box-shadow:0 1px 9px 0 rgba(0,0,0,.22);bottom:0}.taxi-widget-response .car-position{height:50px;font-size:16px;color:#666;box-sizing:border-box;padding:12px 0;overflow:hidden;text-align:center;white-space:nowrap}.taxi-widget-response .distance,.taxi-widget-response .rest-time{height:25px;line-height:25px;padding:0 15px}.taxi-widget-response .distance{border-right:1px solid #666}.taxi-widget-response .car-position .count{font-size:21px;color:#3399fe;margin:0 5px}.taxi-widget-response .btn-end{display:block;border:0;padding:0;margin:0 auto;width:150px;height:40px;line-height:40px;background:url(/static/taxi/widget/response/images/bg-btn-end_dcde195.png) no-repeat center center;background-size:150px 40px;font-size:16px;color:#fff;text-align:center}.taxi-widget-response-feedbackdialog-layer{position:fixed;width:100%;height:100%;top:0;left:0;background:rgba(0,0,0,.6)}.taxi-widget-response-feedbackdialog-layer .feedbackdialog{position:absolute;background:#fff;border:1px solid transparent;border-radius:3px;box-sizing:border-box;padding:0 15px}.taxi-widget-response-feedbackdialog-layer .title{height:45px;line-height:45px;font-size:16px;color:#333;text-align:center;border-bottom:1px solid #ccc}.taxi-widget-response-feedbackdialog-layer .buttons{padding:4px 0}.taxi-widget-response-feedbackdialog-layer button{display:block;box-sizing:content-box;border:1px solid #ccc;border-radius:3px;width:100%;height:35px;line-height:35px;padding:0;margin:12px 0;font-size:14px;color:#333;background:url(/static/taxi/widget/response/images/bg-btn-dialog_58f27fb.png) repeat-y 0 0;background-size:100% 35px;text-align:center}{%/style%}<div class="taxi-widget-response">
{%widget name="taxi:widget/common/nav/nav.tpl" title="等待上车"%}
<div class="responder" style="display: none;">
<div class="head">
<img src="/static/taxi/widget/response/images/head_69fabcf.png"/>
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
距您<span class="count">1</span>公里</span>
<span class="rest-time">
约<span class="count">10</span>分钟后到达</span>
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
require('taxi:widget/response/response.js').init();
{%/script%}