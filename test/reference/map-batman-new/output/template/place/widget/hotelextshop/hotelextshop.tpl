{%style id="/widget/hotelextshop/hotelextshop.inline.less"%}#detail-shop .detail-shoplist{padding:15px 10px;background-color:#fff;font-size:14px}.detail-shoplist li{padding:5px}.detail-shoplist li .shop-tit{color:#c46221;font-weight:700}.detail-shoplist li .shop-des{color:#6e6e6e}{%/style%}{%* 商户概况 *%}
{%if ($data.widget.overview)%}
<ul class="detail-shoplist">
{%foreach $widget_data.overview as $item%}
{%if (!empty($item.desc) && !empty($item.name))%}
<li>
<span class="shop-tit">{%$item.name|f_escape_xml%}</span>
<span class="shop-des">{%$item.desc|f_escape_xml%}</span>
</li>
{%/if%}
{%/foreach%}
{%foreach $widget_data.more_overview as $item%}
{%if (!empty($item.desc) && !empty($item.name))%}
<li>
<span class="shop-tit">{%$item.name|f_escape_xml%}</span>
<span class="shop-des">{%$item.desc|f_escape_xml%}</span>
</li>
{%/if%}
{%/foreach%}
</ul>
{%else%}
{%widget name="place:widget/loadfailed/loadfailed.tpl" widget_data="暂时没有该酒店的详情信息..."%}
{%/if%}