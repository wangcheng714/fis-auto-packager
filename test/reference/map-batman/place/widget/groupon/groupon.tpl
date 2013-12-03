{%* 团购 *%}
{%if ereg("wd=([A-Z0-9%]+)", $smarty.server.REQUEST_URI, $regs)%}
    {%$wd = urldecode($regs[1])%}
{%/if%}
{%if ($data.widget.groupon)%}
{%widget name="common:widget/nav/nav.tpl" title="团购详情"%}
<div class="place-widget-groupon">
    {%section name=groupon loop=$widget_data.groupon%}
        {%if $smarty.section.groupon.index == 0 %}
            <ul class="place-widget-groupon-main" url="{%urldecode($widget_data.groupon[groupon].groupon_url_mobile)%}">
        {%else%}
            <ul class="place-widget-groupon-main place-widget-groupon-hide" url="{%urldecode($widget_data.groupon[groupon].groupon_url_mobile)%}">
        {%/if%}
            <li class="place-widget-groupon-title">
                <span class="place-widget-groupon-site">{%$widget_data.groupon[groupon].cn_name%}</span>
                <span>{%$widget_data.groupon[groupon].groupon_title|truncate:45:"...":false%}</span>
                <span>
                    {%if $widget_data.groupon[groupon].groupon_url_mobile|strip:""!=""%}
                        <b class="place-widget-groupon-phone-icon">可手机支付</b>
                    {%/if%}
                </span>
            </li>
            <li>
                <span class="place-widget-groupon-img-box">
                    <img class="place-widget-groupon-img" src="{%urldecode($widget_data.groupon[groupon].groupon_image)%}">
                </span>
            </li>
            <li class="place-widget-groupon-price">
                <b>￥{%$widget_data.groupon[groupon].groupon_price%}</b>
                <del>原价￥{%$widget_data.groupon[groupon].regular_price%}</del>
                <span class="place-widget-groupon-gosee">
                    <b class="place-widget-groupon-gosee-text">去看看</b>
                </span>
            </li>
            <li class="place-widget-groupon-person-total">
                <span>{%$widget_data.groupon[groupon].groupon_num%}人</span>
                <span class="place-widget-groupon-date">截止日期：{%$widget_data.groupon[groupon].groupon_end%}</span>
            </li>
        </ul>
    {%/section%}
	{%if $smarty.section.groupon.total>1 %}
		<div class="place-widget-groupon-pagenum">
			<button class="place-widget-groupon-pagenum-prev place-widget-groupon-disable">上一条</button>
			<span class="place-widget-groupon-curpage">1</span>/<span class="place-widget-groupon-totalpage">{%$smarty.section.groupon.total%}</span>
			<button class="place-widget-groupon-pagenum-next">下一条</button>
		</div>
	{%/if%}
	{%* 用于团购详情页点击去第三方的点击量统计 *%}
	<span class="place-widget-groupon-poi-src-name">{%$widget_data.src_name%}</span>
    <span class="place-widget-groupon-poi-name">{%$widget_data.name%}</span>
</div>
{%script%}
    var groupon = require("place:widget/groupon/groupon.js"),
        statData = {
            wd: '{%$wd%}',
            name: '{%$widget_data.name%}',
            srcname: '{%$widget_data.src_name%}'
        };
    groupon.init(statData);
    
{%/script%}
{%/if%}