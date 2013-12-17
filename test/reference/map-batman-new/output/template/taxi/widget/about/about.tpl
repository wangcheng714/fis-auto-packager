{%style id="/widget/about/about.inline.less"%}.taxi-widget-about{position:relative;box-sizing:border-box;padding:60px 0 10px;background:url(/static/taxi/images/bg_f11b4e8.png) no-repeat center bottom;background-size:contain}.taxi-widget-about .inner{padding:0 10px;height:100%;overflow-y:auto}.taxi-widget-about .content-wrapper{border:1px solid #ccc;background:#fff;border-radius:3px;font-size:14px;line-height:23px;color:#333;padding:12px 18px;display:none}.taxi-widget-about .taxi-widget-nav{position:absolute;top:0;left:0}.taxi-widget-about .title{font-size:16px}{%/style%}<div class="taxi-widget-about">
{%widget name="taxi:widget/common/nav/nav.tpl" title="" btnBack=true back=settings%}
<div class="inner">
<div class="content-wrapper terms">
<p class="title">免责声明</p>
<p class="summary">
百度提醒您：在使用百度地图（以下简称百度）及“打车”功能及相关服务前，请您务必仔细阅读并透彻理解本声明。您可以选择不使用百度或“打车”功能及相关服务，但如果您使用百度或“打车”功能及相关服务，您的使用行为将被视为对本声明全部内容的认可。</p>
<p class="content">
1、百度平台上的“打车”功能及相关服务由第三方提供，百度平台仅提供技术接口服务。因使用“打车”功能及服务而引起的任何投诉或纠纷，您应与以下第三方直接沟通并协商解决，与百度无关。<p class="info">“打车”功能及相关服务第三方提供方：</p>
<ul class="list">
<li>快的打车（杭州快智科技有限公司http://www.kuaidadi.com）</li>
<li>嘀嘀打车（北京小桔科技有限公司http://www.xiaojukeji.com）</li>
<li>大黄蜂打车（上海大黄蜂网络信息技术有限公司http://www.dhf100.com）</li>
</ul>
</p>
<p class="content">
2、您应审慎决定是否选择使用第三方提供的“打车”功能和服务，并对使用第三方提供的功能和服务的结果自行承担风险。百度对第三方提供的功能及服务不做任何形式的保证：不保证功能和服务满足您的要求，不保证功能和服务不中断，不保证功能和服务的安全性、正确性、及时性、合法性。因网络状况、通讯线路、第三方网站或服务商等任何原因而导致您不能正常使用“打车”功能和服务的，百度不承担任何法律责任。</p>
<p class="content">
3、您在使用“打车”功能和服务的过程中，需要您同意并主动提供您当前的位置信息、电话号码等，百度会采取合理的措施保护该信息，除非经您亲自许可（如：您要共享信息给您的好友），或根据相关法律、法规的强制性规定须披露外，百度不会将您的信息提供给除提供“打车”功能和服务的任意第三方。</p>
<p class="content">
4、“打车”功能的部分服务您可能需要支付给第三方相应费用，该费用由第三方收取，与百度无关，百度对此亦不承担任何法律责任。</p>
<p class="content">
5、鉴于第三方所提供的“打车”功能的服务性质，对可能出现的包括但不限于出租车逃单、拒载等中止交易的情况以及因此而导致的任何人身损害和财产损害，与百度无关，百度不承担任何法律责任。</p>
<p class="content">
6、百度拥有对上述条款的最终解释权。</p>
</div>
<div class="content-wrapper help">
<div class="tip">
<p class="t-title">1、清晰描述起终点，更容易成功</p>
<p class=" t-cont">清楚描述您的起终点，更方便师傅判断是否接单，打车成功率提升50%！填写周边标志性建筑（如某某路交叉口、某某大厦），效果更佳！</p>
</div>
<div class="tip">
<p class="t-title">2、出门前先叫车，预留足够的等车时间</p>
<p class=" t-cont">提前15分钟叫车，车到再出门；告别路边风吹日晒，尽享专车待遇！</p>
</div>
<div class="tip">
<p class="t-title">3、加价叫车，节省宝贵时间（部分城市不可用）</p>
<p class=" t-cont">清高峰时期、极端天气、远郊地区，师傅空驶驾车成本较高，加价叫车，节省宝贵时间。由于相关法律法规和政策，部分城市可能不支持。</p>
</div>
<div class="tip">
<p class="t-title">4、诚信叫车</p>
<p class=" t-cont">逃单、迟到会让师傅很痛苦，我们会记录每一次打车行为，爽约将会被严厉处罚。当然，如果师傅爽约，你也可以通过结束订单选择“司机没来”反馈给我们。</p>
</div>
</div>
</div>
</div>
{%script%}
require('taxi:widget/about/about.js').init();
{%/script%}