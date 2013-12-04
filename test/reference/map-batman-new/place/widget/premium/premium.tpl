<!-- @fileOverview 优惠模板 -->
{%if ereg("wd=([A-Z0-9%]+)", $smarty.server.REQUEST_URI, $regs)%}
    {%$wd = urldecode($regs[1])%}
{%/if%}
{%if ($data.widget.premium)%}
{%widget name="common:widget/nav/nav.tpl" title="优惠详情"%}
<div class="widget-place-premium-wrapper">
<div class="widget-place-premium">
    <i class="premuim-icon"></i>
    <ul class="premium-list">
        {%foreach from=$widget_data.premium item=obj name=premium%}
        {%if $smarty.foreach.premium.index == 0 %}
        	<li class="premium-item">
        {%else%}
        	<li class="premium-item place-widget-premium-hide">
        {%/if%}
            <div class="premium-container">
                <div class="premium-hd">{%$obj.discount_title%}</div>
                <div class="premium-bd">
                    <p class="summary">{%$obj.discount_content%}</p>
                    <p class="note">
                        {%if $obj.discount_dl%}
                        <i class="icon-down"></i><em>{%$obj.discount_dl%}</em>人下载<br>
                        {%elseif $obj.discount_lf%}
                        剩余<em>{%$obj.discount_lf%}</em>张
                        {%/if%}
                        <i class="icon-time"></i>有效期:&nbsp;{%$obj.discount_effective_start%}至{%$obj.discount_effective_end%}
                    </p>
                    <p class="opt">
                        <a href="javascript:void(0);" class="msg-btn" id="place-premium-msg-btn" data-saleid="{%$obj.discount_id%}" data-enname="{%$obj.discount_src.en_name%}" title="短信下载"></a>
                    </p>
                </div>
                {%if !empty($obj.cn_name) && $obj.en_name!="lbc-claim"%}
                <div class="premium-ft">
                    优惠来源:&nbsp;<img src="http://map.baidu.com/fwmap/upload/place/icon/{%$obj.discount_src.en_name%}/50.png" width="25" height="25"/>{%$obj.discount_src.cn_name%}
                </div>
                {%/if%}
            </div>
        </li>
        {%/foreach%}
    </ul>

</div>
{%if $smarty.foreach.premium.total>1 %}
	<div class="place-widget-premium-pagenum">
		<button class="place-widget-premium-pagenum-prev place-widget-premium-disable">上一条</button>
		<span class="place-widget-premium-curpage">1</span>/<span class="place-widget-premium-totalpage">{%$smarty.foreach.premium.total%}</span>
		<button class="place-widget-premium-pagenum-next">下一条</button>
	</div>
{%/if%}
    {%* 用于优惠详情页点击去第三方的点击量统计 *%}
    <span class="place-widget-premium-poi-src-name">{%$widget_data.src_name%}</span>
    <span class="place-widget-premium-poi-name">{%$widget_data.name%}</span>
</div>
{%script%}
    var statData = {
        wd: '{%$wd%}',
        name: '{%$widget_data.name%}',
        srcname: '{%$widget_data.src_name%}'
    };
    require("premium.js").init('{%$widget_data.uid%}', statData);

{%/script%}
{%/if%}
