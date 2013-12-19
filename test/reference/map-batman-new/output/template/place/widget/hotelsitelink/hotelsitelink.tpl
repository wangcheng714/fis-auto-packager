{%style id="/widget/hotelsitelink/hotelsitelink.inline.less"%}.hotel-sitetit{font:700 16px '微软雅黑','宋体';margin-bottom:10px}.hotel-sitelist .hotel-siteitem{float:left;margin-right:9px;margin-top:5px}.hotel-sitelist .hotel-siteitem a{display:inline-block}.hotel-sitelist .hotel-siteitem img{width:25px;height:25px}{%/style%}{%* 第三方链接 *%}
{%if ($widget_data.widget.sitelink)%}
<div class="hotel-card">
<h2 class="hotel-sitetit">查看更多</h2>
<ul class="hotel-sitelist clearfix">
{%foreach $data.content.ext.detail_info.link as $obj%}
{%if $obj.url_mobilephone || $obj.url %}
<li class="hotel-siteitem">
<a href="{%if empty($obj.url_mobilephone)%}{%($obj.url)%}{%else%}{%($obj.url_mobilephone)%}{%/if%}" target="_blank"
                            data-log="{code:{%$STAT_CODE.PLACE_DETAIL_SITELINK_CLICK|f_escape_xml%}, wd:'{%$wd|f_escape_xml%}', name:'{%$widget_data.name|f_escape_xml%}', ota:'{%$obj.cn_name|f_escape_xml%}'}">
<img src="http://map.baidu.com/fwmap/upload/place/icon/{%$obj.name|f_escape_path%}/50.png" alt="{%$obj.cn_name|f_escape_xml%}" />
</a>
</li>
{%/if%}
{%/foreach%}
</ul>
</div>
{%/if%}