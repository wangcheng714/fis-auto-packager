{%style id="/widget/basicmovieinfo/basicmovieinfo.inline.less"%}.place-widget-basic-movieinfo{border:1px #e4e4e4 solid;background-color:#fff;border-radius:.25em;padding:.535em .535em .535em 10em;position:relative;min-height:6.679em;color:#555}.place-widget-basic-movieinfo .dtl-img{border:1px solid #A3A3A3;position:absolute;width:8.857em;height:6.607em;left:.535em;top:7px;float:left;margin-right:9px}.place-widget-basic-movieinfo .dtl-img img{width:8.857em;height:6.607em}.place-widget-basic-movieinfo .dtl-plinfo-con{font-size:13px;margin-top:.571em}.place-widget-basic-movieinfo .dtl_score .dtl_rat{color:#dc3c3c}.place-widget-basic-movieinfo .star-box-l{background:url(/static/place/images/star_a9ede79.png) repeat-x 0 0;background-size:15px 33px;vertical-align:middle;margin-top:-.179em;display:inline-block;height:16px;width:75px}.place-widget-basic-movieinfo .star-score{background:url(/static/place/images/star_a9ede79.png) repeat-x 0 -19px;background-size:15px 33px;height:15px;vertical-align:top;display:inline-block;height:16px}.place-widget-basic-movieinfo .dtl-plinfo-item{line-height:1.714em}.place-widget-basic-movieinfo .special,.place-widget-basic-movieinfo .realtime{color:#f43f00;margin-right:3px;font-weight:700}.place-widget-basic-movieinfo .place_rating_source{position:absolute;word-break:break-all;font-family:"微软雅黑";color:#000;font-size:12px;margin-left:2px}{%/style%}{%* 如果src_name值在规定范围内且 content.ext.detail_info不为空则显示 *%}
<div class="place-widget-basic-movieinfo">
<div class="dtl-img">
{%if (!empty($widget_data.data.detail_info.image))%}
<img src="{%$widget_data.data.detail_info.image|f_escape_xml%}" alt="正在加载..."/>
{%else%}
<img src="/static/place/images/no_img_039c24b.png"/>
{%/if%}
</div>
<div class="dtl-plinfo-con">
<div class="dtl-plinfo-item dtl-score">
<div class="dtl_plinfo_item dtl_score">
&nbsp;<span class="dtl_rat">{%$widget_data.data.detail_info.overall_rating|f_escape_xml%}</span>/5.0分&nbsp;&nbsp;</div>
<div class="dtl_plinfo_item dtl_score">
&nbsp;<span>{%$widget_data.data.detail_info.tag|f_escape_xml%}</span>&nbsp;&nbsp;</div>
<div class="dtl_plinfo_item dtl_score">
&nbsp;<span>营业时间：{%$widget_data.data.rich_info.shop_hours|f_escape_xml%}</span>&nbsp;&nbsp;</div></div>
</div>
</div>
