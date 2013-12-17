{%style id="/widget/guarantee/guarantee.inline.less"%}.place-widget-detailact,.place-widget-orderact{padding:10px 12px;font-size:14px}.place-widget-detailact h4,.place-widget-orderact h4{font-size:15px;font-weight:700;padding:10px 0}.place-widget-detailact p,.place-widget-orderact p{line-height:26px}.place-widget-detailact p.act-author,.place-widget-orderact p.act-author{margin-top:10px}.place-widget-guarantee{font-size:1.07em;line-height:150%;box-sizing:border-box;padding:20px 25px}.place-widget-guarantee p,.place-widget-guarantee li{margin-bottom:25px}.place-widget-guarantee li .place-widget-guarantee-num,.place-widget-guarantee .place-widget-guarantee-remark .place-widget-guarantee-remark-head{float:left}.place-widget-guarantee li .place-widget-guarantee-item-content{margin-left:17px}.place-widget-guarantee .place-widget-guarantee-remark .place-widget-guarantee-remark-content{margin-left:30px}.place-widget-guarantee li .place-widget-guarantee-num{display:block;width:17px}.place-widget-guarantee .place-widget-guarantee-remark{color:gray}.place-widget-guarantee .place-widget-guarantee-remark .place-widget-guarantee-remark-head{white-space:nowrap;width:30px;display:block}{%/style%}{%* 担保通widget *%}
{%if $page_type === "detailact"%}
<div class="place-widget-detailact">
<h4>代金券获取说明：</h4>
<p class="act-des">在2013.12.20-2014.1.1期间预订且成功入住，结账后5个工作日内，您将获得每间房每晚价值30元的百度团购代金券。
            代金券编码将以短信形式发送至您手机，可登录百度团购网站（http://tuan.baidu.com）使用。
        </p>
<h4>代金券使用说明：</h4>
<p>1.使用范围：百度团购PC端、无线端。</p>
<p>2.使用规则：全场无限制通用，不找零；每笔订单仅限使用1张；退单时不退还代金券金额。</p>
<p>3.使用方式：在百度团单支付页面输入代金券编码，验证后立享优惠。</p>
<p>4.使用时间：2013.12.20-2014.2.28。</p>
<p class="act-author">本次活动最终解释权归百度地图所有。</p>
</div>
{%elseif $page_type === "orderact"%}
<div class="place-widget-orderact">
<h4>代金券获取说明：</h4>
<p class="act-des">在2013.12.20-2014.1.1期间预订且成功入住，结账后5个工作日内，您将获得每间房每晚价值30元的百度团购代金券。
            代金券编码将以短信形式发送至您手机，可登录百度团购网站（http://tuan.baidu.com）使用。
        </p>
<h4>代金券使用说明：</h4>
<p>1.使用范围：百度团购PC端、无线端。</p>
<p>2.使用规则：全场无限制通用，不找零；每笔订单仅限使用1张；退单时不退还代金券金额。</p>
<p>3.使用方式：在百度团单支付页面输入代金券编码，验证后立享优惠。</p>
<p>4.使用时间：2013.12.20-2014.2.28。</p>
<p class="act-author">本次活动最终解释权归百度地图所有。</p>
</div>
{%else%}
<div class="place-widget-guarantee">
<p>预订订单由酒店（代理商）确认成功后或预付订单支付成功后，如遇到店无房：</p>
<ol>
<li>
<span class="place-widget-guarantee-num">1.</span>
<p class="place-widget-guarantee-item-content">请立即联系去哪儿网，去哪儿网将与酒店（代理商）协调</p>
</li>
<li>
<span class="place-widget-guarantee-num">2.</span>
<p class="iplace-widget-guarantee-item-content">如仍然无房间且无补偿方案，去哪儿网会帮您预订相同档次酒店</p>
</li>
<li>
<span class="place-widget-guarantee-num">3.</span>
<p class="place-widget-guarantee-item-content">您结账离店后，去哪儿网将赔付入住差价（最高为：订单的首晚房费）</p>
</li>
</ol>
<div class="place-widget-guarantee-remark">
<span class="place-widget-guarantee-remark-head">*注：</span>
<p class="place-widget-guarantee-remark-content">赔计划仅限中国境内（含港澳台）带有去哪儿网担保通标识的报价（以订单填写信息为准）</p>
</div>
</div>
{%/if%}