{%* 第三方链接 *%}

{%* 参数：$widget_data.data *%}
{%if ($data.widget.sitelink)%}
<div class="place-widget-sitelink">
	<h2 class="title">查看更多</h2>
	<ul class="sitelink-list">
		{%foreach from=$widget_data.data item=obj%}
		<li class="sitelink-item">
			<span class="logo" style="background-image:url(http://map.baidu.com/fwmap/upload/place/icon/{%$obj.name%}/50.png)"></span>
			<a href="{%if empty($obj.url_mobilephone)%}{%urldecode($obj.url)%}{%else%}{%urldecode($obj.url_mobilephone)%}{%/if%}" target="_blank" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_SITELINK_CLICK%}, wd:'{%$wd%}', srcname:'{%$widget_data.src_name%}', name:'{%$widget_data.name%}', ota:'{%$obj.cn_name%}'}">{%$obj.cn_name%}</a>
        	</li>
		{%/foreach%}
	</ul>
</div>
{%/if%}