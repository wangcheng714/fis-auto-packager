{%style id="/widget/sitelink/sitelink.inline.less"%}.place-widget-sitelink{position:relative;border-bottom:1px solid #e1e1e1}.place-widget-sitelink .title{margin:0 5px 15px;font-size:16px;color:#303235;line-height:1.2}.place-widget-sitelink .sitelink-list{margin:0 22px 16px;color:#6e6e6e;overflow:hidden}.place-widget-sitelink .sitelink-list .sitelink-item{display:inline-block;width:49%;height:30px;line-height:30px;margin-bottom:11px}.sitelink-list .sitelink-item .logo{background-position:center center;background-repeat:no-repeat;background-size:25px 25px;display:inline-block;width:30px;height:30px;margin:0 8px 0 0;vertical-align:middle}.sitelink-list .sitelink-item a{color:#3c6aa7}{%/style%}{%* 第三方链接 *%}
{%* 参数：$widget_data.data *%}
{%if ($data.widget.sitelink)%}
<div class="place-widget-sitelink">
<h2 class="title">查看更多</h2>
<ul class="sitelink-list">
{%foreach from=$widget_data.data item=obj%}
<li class="sitelink-item">
<span class="logo" style="background-image:url(http://map.baidu.com/fwmap/upload/place/icon/{%$obj.name|f_escape_xml%}/50.png)"></span>
<a href="{%if empty($obj.url_mobilephone)%}{%urldecode($obj.url)%}{%else%}{%urldecode($obj.url_mobilephone)%}{%/if%}" target="_blank" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_SITELINK_CLICK|f_escape_xml%}, wd:'{%$wd|f_escape_xml%}', srcname:'{%$widget_data.src_name|f_escape_xml%}', name:'{%$widget_data.name|f_escape_xml%}', ota:'{%$obj.cn_name|f_escape_xml%}'}">{%$obj.cn_name|f_escape_xml%}</a>
</li>
{%/foreach%}
</ul>
</div>
{%/if%}