{%style id="/widget/vip/finish/finish.inline.less"%}.taxi-widget-vip-finish .logo{position:relative;margin:20px auto;width:120px;height:40px;box-sizing:border-box;padding-left:45px}.taxi-widget-vip-finish .baidu-taxi{font-size:18px;color:#666}.taxi-widget-vip-finish .slogan{font-size:14px;color:#999}.taxi-widget-vip-finish .icon{position:absolute;width:40px;height:40px;left:0;top:0;background:url(/static/taxi/widget/home/images/bg-logo_35d71f6.png) no-repeat 0 0;background-size:40px 40px}.taxi-widget-vip-finish .content{border:1px solid #ccc;background:#fff;border-radius:3px;font-size:14px;line-height:23px;color:#333;padding:12px 18px;margin:10px}.taxi-widget-vip-finish .count-down{margin-top:10px;word-wrap:break-word;font-size:12px;line-height:21px}.taxi-widget-vip-finish .count-down a{word-wrap:break-word}{%/style%}<div class="taxi-widget-vip-finish">
{%widget name="taxi:widget/common/nav/nav.tpl" title="确认已上车" btnBack=true back="http://taxi.map.baidu.com"%}
<div class="logo">
<span class="icon"></span>
<div class="baidu-taxi">百度打车</div>
<div class="slogan">出行更方便</div>
</div>
<div class="content">
<div class="loading">
正在加载...</div>
<div class="text" style="display: none;">
您已确认上车，感谢使用百度打车！<div class="count-down">
<span class="seconds"></span>秒后自动跳转到百度打车首页，                如未自动跳转，请点击<a href="http://taxi.map.baidu.com">http://taxi.map.baidu.com</a>
</div>
</div>
</div>
</div>
{%script%}
require('taxi:widget/vip/finish/finish.js').init();
{%/script%}