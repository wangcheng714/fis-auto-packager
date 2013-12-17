{%style id="/widget/channel/channel.inline.less"%}#taxi-pagelet-channel{background:#e1210b url(/static/taxi/widget/channel/images/bg-top_384d02e.png) no-repeat 0 0;background-size:100%}.taxi-widget-channel{width:320px;padding-top:20px;box-sizing:border-box;margin:0 auto}.taxi-widget-channel>.title{text-align:center;color:#fff;margin-bottom:15px}.taxi-widget-channel>.title .main{font-size:29px;font-weight:700}.taxi-widget-channel>.title .sub{font-size:22px;font-weight:700}.taxi-widget-channel .ticket-wrapper{display:-webkit-box;-webkit-box-pack:start;padding:0 10px}.taxi-widget-channel .ticket-wrapper .phone-input{box-sizing:border-box;width:190px;height:32px;border:1px solid #ae180e;font-size:14px;line-height:22px;padding:5px 20px;margin:0;border-radius:0;box-shadow:none}.taxi-widget-channel .ticket-wrapper .btn-get-ticket{position:relative;width:100px;height:31px;border-radius:3px;background:rgba(0,0,0,.5);color:#e1210b;font-size:14px;text-indent:-10px;padding-bottom:3px}.taxi-widget-channel .ticket-wrapper .btn-get-ticket::after{content:'';position:absolute;width:10px;height:10px;right:10px;top:9px;box-sizing:border-box;border-width:5px;border-style:solid;border-color:transparent transparent transparent #e1210b}.taxi-widget-channel .ticket-wrapper .btn-get-ticket::before{content:'点击领取';position:absolute;width:100%;height:28px;line-height:28px;left:0;top:0;border-radius:3px;background:#fdce4e;z-index:0}.taxi-widget-channel .intro-wrapper{padding:15px 5px 10px 28px;width:300px;height:143px;margin:22px 10px 0;background:url(/static/taxi/widget/channel/images/bg-text_ada98c6.png) no-repeat 0 0;background-size:300px 139px;box-sizing:border-box}.taxi-widget-channel .intro-wrapper .intro-list{font-size:10px;line-height:20px;margin-top:10px}.taxi-widget-channel .dialog{position:fixed;display:none;-webkit-box-align:center;-webkit-box-pack:center;width:100%;height:100%;left:0;top:0}.taxi-widget-channel .dialog .layer{position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.6)}.taxi-widget-channel .dialog .box{position:relative;width:280px;background:#fff;box-sizing:border-box;padding:25px 15px;font-size:14px;line-height:20px}.taxi-widget-channel .dialog .box .buttons{display:-webkit-box;-webkit-box-align:center;-webkit-box-pack:center;margin-top:20px}.taxi-widget-channel .dialog .box a{position:relative;display:inline-block;width:100px;height:30px;background:#e1210b;color:#fff;border-radius:3px;text-indent:-10px;text-align:center;font-size:12px;line-height:30px}.taxi-widget-channel .dialog .box a:first-child{margin-right:25px}.taxi-widget-channel .dialog .box a::after{content:'';position:absolute;box-sizing:border-box;width:10px;height:10px;right:10px;top:10px;border-width:5px;border-style:solid;border-color:transparent transparent transparent #fff}.taxi-widget-channel .dialog.one,.taxi-widget-channel .dialog.invalid{text-align:center}.taxi-widget-channel .dialog.one .box{padding:25px 5px}.taxi-widget-channel .taxi-widget-common-vcode{margin-top:10px;padding:0 10px}.taxi-widget-channel .taxi-widget-common-vcode .title{color:#fff}.taxi-widget-channel .taxi-widget-common-vcode .image-code{width:67px;height:30px}{%/style%}<div class="taxi-widget-channel">
<div class="title">
<div class="main">恭喜您获得</div>
<div class="sub">百度地图10元打车券!!</div>
</div>
<div class="ticket-wrapper">
<input type="text" class="phone-input" placeholder="请输入手机号领取"/>
<button class="btn-get-ticket">点击领取</button>
</div>
{%widget name="taxi:widget/common/vcode/vcode.tpl"%}
<div class="intro-wrapper">
<div class="intro-title">
百度地图10元打车券使用说明</div>
<ul class="intro-list">
<li class="intro-item">1个链接可给1个手机号领取1次。</li>
<li class="intro-item">在2014年1月15日前打车有效。</li>
<li class="intro-item">利用百度地图打车成功(点击"我已上车")后，10元打车券将通过返话费的形式充值到您的手机上。</li>
</ul>
</div>
<div class="dialog one">
<div class="layer"></div>
<div class="box">
1个链接1个手机号只能领取1次，感谢参与~<div class="buttons">
<a href="http://taxi.map.baidu.com">现在去打车</a>
</div>
</div>
</div>
<div class="dialog success">
<div class="layer"></div>
<div class="box">
恭喜您成功获得百度地图10元打车券！2014年1月15日前成功打车，将以话费的形式返到您的手机上！<div class="buttons">
<a class="btn-later" href="javascript: void(0);">以后再用</a>
<a href="http://taxi.map.baidu.com">现在去打车</a>
</div>
</div>
</div>
<div class="dialog invalid">
<div class="layer"></div>
<div class="box">
链接已失效！<div class="buttons">
<a href="http://taxi.map.baidu.com">现在去打车</a>
</div>
</div>
</div>
</div>
{%script%}
require('taxi:widget/channel/channel.js').init();
{%/script%}