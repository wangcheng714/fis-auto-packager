{%style id="/widget/basicinfo/basicinfo.inline.less"%}.place-widget-basic-info{border:1px #B0B0B0 solid;background-color:#fff;border-radius:.25em;padding:.535em .535em .535em 10em;position:relative;min-height:6.679em;color:#555}.place-widget-basic-info .dtl-img{border:1px solid #A3A3A3;position:absolute;width:8.857em;height:6.607em;left:.535em;top:7px;float:left;margin-right:9px}.place-widget-basic-info .dtl-img img{width:8.857em;height:6.607em}.place-widget-basic-info .dtl-plinfo-con{font-size:13px;margin-top:.571em}.place-widget-basic-info .star-box-l{background:url(/static/place/images/star_a9ede79.png) repeat-x 0 0;background-size:15px 33px;vertical-align:middle;margin-top:-.179em;display:inline-block;height:16px;width:75px}.place-widget-basic-info .star-score{background:url(/static/place/images/star_a9ede79.png) repeat-x 0 -19px;background-size:15px 33px;height:15px;vertical-align:top;display:inline-block;height:16px}.place-widget-basic-info .dtl-plinfo-item{line-height:1.714em}.place-widget-basic-info .special,.place-widget-basic-info .realtime{color:#f43f00;margin-right:3px;font-weight:700}.place-widget-basic-info .place_rating_source{position:absolute;word-break:break-all;font-family:"微软雅黑";color:#000;font-size:12px;margin-left:2px}{%/style%}{%* 如果src_name值在规定范围内且 content.ext.detail_info不为空则显示 *%}
<div class="place-widget-basic-info">
<div class="dtl-img">
{%if (!empty($widget_data.detail_info.image))%}
<img src="{%$widget_data.detail_info.image|f_escape_xml%}" alt="正在加载..."/>
{%else%}
<img src="/static/place/images/no_img_039c24b.png"/>
{%/if%}
</div>
<div class="dtl-plinfo-con">
<div class="dtl-plinfo-item dtl-score">
<span class="star-box-l">
<span class="star-score"
                      style="width:{%intval($widget_data.detail_info.overall_rating, 10)/5 * 75%}px"></span>
</span>
{%if $widget_data.src_name!="cater" && $widget_data.src_name!="shopping"%}
&nbsp;{%$widget_data.detail_info.overall_rating|f_escape_xml%}
{%/if%}
{%if $widget_data.src_name=="cater" || $widget_data.src_name=="shopping"%}
{%if !empty($widget_data.detail_info.rating)%}
{%if !empty($widget_data.detail_info.rating.url_mobile)%}
<a target="_blank" href="{%$widget_data.detail_info.rating.url_mobile|f_escape_xml%}" class="place_rating_source">
{%else%}
<a target="_blank" href="javascript:void(0);" class="place_rating_source">
{%/if%}
{%if !empty($widget_data.detail_info.rating.cn_name)%}
来自{%$widget_data.detail_info.rating.cn_name|f_escape_xml%}
{%/if%}
</a>
{%/if%}
{%/if%}
</div>
{%* 餐饮 *%}
{%if ($widget_data.src_name == 'cater')%}
<div class="dtl-plinfo-item"><span>
<span class="sm">人均消费:<span class="dtl-price">￥{%$widget_data.detail_info.price|f_escape_xml%}</span>
</span>
</div>
<div class="dtl-plinfo-item place-plinfo-itemnew">
<span>服务:&nbsp;{%$widget_data.detail_info.service_rating|f_escape_xml%}</span>&nbsp;<span>环境:&nbsp;{%$widget_data.detail_info.environment_rating|f_escape_xml%}</span>&nbsp;<span>口味:&nbsp;{%$widget_data.detail_info.taste_rating|f_escape_xml%}</span>&nbsp;</div>
{%* 酒店 *%}
{%elseif ($widget_data.src_name == 'hotel')%}
<div class="dtl-plinfo-item"><span>
{%if ($widget_data.detail_info.tonight_sale_flag == '1')%}
<span class="sm">
<span class="dtl-price"><span class="special">￥{%$widget_data.detail_info.tonight_price|f_escape_xml%}</span>起</span>
</span>
{%elseif ($widget_data.detail_info.wise_realtime_price_flag == '1')%}
<span class="sm">
<span class="dtl-price"><span class="realtime">￥{%$widget_data.detail_info.wise_realtime_price|f_escape_xml%}</span>起</span>
</span>
{%else%}
<span class="sm">参考价:<span class="dtl-price">￥{%$widget_data.detail_info.price|f_escape_xml%}</span>
</span>
{%/if%}
</div>
<div class="dtl-plinfo-item place-plinfo-itemnew">
<span>设施:&nbsp;{%$widget_data.detail_info.facility_rating|f_escape_xml%}</span>&nbsp;<span>服务:&nbsp;{%$widget_data.detail_info.service_rating|f_escape_xml%}</span>&nbsp;<span>卫生:&nbsp;{%$widget_data.detail_info.hygiene_rating|f_escape_xml%}</span>&nbsp;</div>
{%* 医院 *%}
{%elseif ($widget_data.src_name == 'hospital')%}
<div class="dtl-plinfo-item">
<span>技术评分:&nbsp;{%$widget_data.detail_info.technology_rating|f_escape_xml%}</span>&nbsp;<span>服务评分:&nbsp;{%$widget_data.detail_info.service_rating|f_escape_xml%}</span>&nbsp;<span>价格评分:&nbsp;{%$widget_data.detail_info.price_rating|f_escape_xml%}</span>&nbsp;</div>
{%* 生活(src_name == life) *%}
{%elseif ($widget_data.src_name === 'life')%}
{%if ($widget_data.detail_info.price)%}
<div class="dtl-plinfo-item"><span>
<span class="sm">参考价:<span class="dtl-price">￥{%$widget_data.detail_info.price|f_escape_xml%}</span>
</span>
</div>
{%/if%}
{%/if%}
</div>
</div>
