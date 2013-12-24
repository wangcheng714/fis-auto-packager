{%style id="/widget/overview/overview.inline.less"%}.place-widget-overview{border-bottom:1px solid #e1e1e1;overflow:hidden}.place-widget-overview .title{margin:0 5px 15px;font-size:16px;color:#303235;line-height:1.2}.place-widget-overview .place-detailinfo-list{line-height:20px;margin:0 22px;color:#6e6e6e}.place-widget-overview li{margin-bottom:25px;overflow:hidden}.place-widget-overview li a{line-height:20px;color:#6E6E6E}.place-widget-overview li a p{color:#9D9D9D;margin-top:10px;float:right}.place-widget-overview .field{color:#c46221}.place-widget-overview .more-btn{background-color:#f2f2f2;float:right;width:103px;height:27px;line-height:27px;margin-bottom:10px;border:#adadad solid 1px;border-radius:.25em;font-size:13px;text-align:center;color:#444d62}.place-page-detail-moreoverview .place-widget-overview{border-bottom:0}.place-page-detail-moreoverview .place-widget-overview .place-detailinfo-list{margin:0}.place-page-detail-moreoverview .place-widget-overview .title,.place-page-detail-moreoverview .place-widget-overview .more-btn{display:none}{%/style%}{%* 商户概况 *%}
{%if ($data.widget.overview)%}
{%if (isset($widget_data.more))%}
{%$bdata = $widget_data.data.more_overview%}
{%else%}
{%$bdata = $widget_data.data.overview%}
{%/if%}
<div class="place-widget-overview">
<h2 class="title">商户概况</h2>
<ul class="place-detailinfo-list">
{%foreach $bdata as $item%}
{%if (!empty($item.desc) && !empty($item.name))%}
<li>
<strong class="field">
<span>{%$item.name|f_escape_xml%}</span>
</strong>&nbsp;:&nbsp;{%if $widget_data.src_name=="cater" || $widget_data.src_name=="shopping"%}
{%if !empty($widget_data.data.description_name)%}
{%if $item.name=="商户描述" && $widget_data.data.description_name=="dianping"%}
{%if !empty($widget_data.data.description_url_mobile)%}
<a target="_blank" href="{%$widget_data.data.description_url_mobile|f_escape_xml%}">
{%else%}
<a target="_blank" href="javascript:void(0);">
{%/if%}
{%$item.desc|truncate:50:"...":true|f_escape_xml%}
{%if !empty($widget_data.data.description_cn_name)%}
<p>来自{%$widget_data.data.description_cn_name|f_escape_xml%}</p>
{%/if%}
</a>
{%else%}
{%$item.desc|f_escape_xml%}
{%/if%}
{%else%}
{%$item.desc|f_escape_xml%}
{%/if%}
{%else%}
{%$item.desc|f_escape_xml%}
{%/if%}
</li>
{%/if%}
{%/foreach%}
</ul>
{%if (!empty($widget_data.data.more_overview))%}
<a href="{%$widget_data.data.more_overview_href|f_escape_xml%}" class="more-btn" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_MORE_OVERVIEW_CLICK|f_escape_xml%}, wd: '{%$wd|f_escape_xml%}', srcname:'{%$widget_data.src_name|f_escape_xml%}', name:'{%$widget_data.name|f_escape_xml%}'}">查看更多信息</a>
{%/if%}
</div>
{%/if%}