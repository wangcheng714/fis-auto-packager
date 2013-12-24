{%style id="/widget/hotelextimg/hotelextimg.inline.less"%}.hotel-content{-webkit-box-sizing:border-box;display:-webkit-box}.hotel-content .hotel-img{width:7.15em;height:5.36em;border:1px solid #A3A3A3;position:relative}.hotel-content .hotel-img img{width:7.15em;height:5.36em}.hotel-content .hotel-noimg{background:url(/static/place/widget/hotelextimg/images/no_img_039c24b.png) no-repeat 0 0;-webkit-background-size:7.15em 5.36em;position:relative}.hotel-content .hotel-noimg img{display:none}.hotel-content .photodetail-count{position:absolute;right:0;bottom:0}.hotel-content .photodetail-count-num{width:18px;height:18px;line-height:18px;text-align:center;background:#757575;color:#fefefe;display:block}.hotel-content .hotel-des{margin-left:8px;-webkit-box-flex:1}.hotel-content .hotel-des .hotel-price{margin-bottom:8px}.hotel-content .hotel-des .hotel-price .price-normal{color:#474747;font-size:13px}.hotel-content .hotel-des .hotel-price .price-del{text-decoration:line-through;color:#a6a6a6}.hotel-content .hotel-des .hotel-no-price{padding-top:13px}.hotel-content .hotel-des .hotel-rank{color:#7d7d7d;font-size:13px}.hotel-content .hotel-des .hotel-rank .rank-percent{color:#565656;font-size:14px;font-weight:700}.hotel-content .hotel-des .hotel-facilities{display:-webkit-box;-webkit-box-align:center;margin-bottom:5px}.hotel-content .hotel-des .hotel-facilities .hotel-level{font-weight:700}.hotel-content .hotel-des .hotel-facilities .hotel-service{display:-webkit-box;-webkit-box-flex:1;-webkit-box-pack:end}.hotel-content .hotel-des .hotel-facilities .hotel-service div{display:-webkit-box;-webkit-box-orient:vertical;-webkit-box-align:center;margin-left:5px}.hotel-content .hotel-des .hotel-facilities .hotel-service div .ser-icon{background:url(/static/place/widget/hotelextimg/images/place_hotel_service_0cfbaa4.png) no-repeat 0 0;display:block;width:16px;height:16px;-webkit-background-size:16px 128px}.hotel-content .hotel-des .hotel-facilities .hotel-service div .ser-text{display:block;color:#888;font-size:12px}.hotel-content .hotel-des .hotel-facilities .hotel-service div.service-wifi .ser-icon{background-position:0 0}.hotel-content .hotel-des .hotel-facilities .hotel-service div.service-broad .ser-icon{background-position:0 -16px}.hotel-content .hotel-des .hotel-facilities .hotel-service div.service-stop .ser-icon{background-position:0 -32px}.hotel-content .hotel-des .hotel-facilities .hotel-service div.service-dining .ser-icon{background-position:0 -48px}.hotel-content .hotel-des .hotel-facilities .hotel-service div.service-gym .ser-icon{background-position:0 -64px}.hotel-content .hotel-des .hotel-facilities .hotel-service div.service-pool .ser-icon{background-position:0 -80px}.hotel-content .hotel-des .hotel-facilities .hotel-service div.service-room .ser-icon{background-position:0 -96px}.hotel-content .hotel-des .hotel-facilities .hotel-service div.service-business .ser-icon{background-position:0 -112px}{%/style%}{%* 酒店详情图片扩展详情卡片 *%}
{%$detail_info = $widget_data.detail_info%}
{%$rich_info = $widget_data.rich_info%}
<div class="hotel-content">
<div class="hotel-img"
        {%if isset($widget_data.phototile_href)%}
            data-href={%$widget_data.phototile_href|f_escape_xml%}
        {%/if%}>
{%if $detail_info._imgSrc %}
<img id="detail-img" src="{%$detail_info._imgSrc|f_escape_xml%}">
{%else%}
<img src="/static/place/images/no_img_039c24b.png"/>
{%/if%}
{%*图片详情-提示可看的图片数量*%}
{%if !empty($widget_data.photos)%}
<div class="photodetail-count">
<span class="photodetail-count-num">{%count($widget_data.photos)%}</span>
</div>
{%/if%}
</div>
<div class="hotel-des">
{%if $detail_info.wap_bookable === "0" %}
<div class="hotel-price">
{%if $detail_info.wise_hotel_type === "2" %}
<span class="price-normal">团购价&nbsp;&yen;{%$detail_info.wise_low_price|f_escape_xml%}</span>
<span class="price-del">原价&nbsp;&yen;{%$detail_info.wise_price|f_escape_xml%}</span>
{%elseif $detail_info.wise_price %}
参考价&nbsp;&yen;{%$detail_info.wise_price|f_escape_xml%}
{%/if%}
</div>
{%else%}
<div class="hotel-no-price"></div>
{%/if%}
{%if $detail_info.overall_rating %}
<div class="hotel-rank">
<span class="rank-percent">{%$detail_info.overall_rating|f_escape_xml%}</span>/5.0分</div>
{%else%}
<div class="no-overall_rating"></div>
{%/if%}
{%if $detail_info.special_service || ($rich_info && $rich_info.level) %}
<div class="hotel-facilities">
{%if $rich_info.level %}
<span class="hotel-level detail-tit">{%$rich_info.level|f_escape_xml%}</span>
{%/if%}
{%$service_arr = explode(" ", $detail_info.special_service)%}
{%if count($service_arr)%}
{%$service_config = array(
                        array('WIFI', 'service-wifi'),
                        array('宽带', 'service-broad'),
                        array('停车', 'service-stop'),
                        array('餐厅', 'service-dining'),
                        array('健身房', 'service-gym'),
                        array('游泳池', 'service-pool'),
                        array('会议室', 'service-room'),
                        array('商务', 'service-business')
                    )%}
<div class="hotel-service">
{%foreach $service_arr as $i => $service_no%}
{%if $i < 3%}
{%if is_array($service_config[$service_no - 1]) %}
<div class="{%$service_config[$service_no - 1][1]%}">
<em class="ser-icon"></em>
<span class="ser-text">{%$service_config[$service_no - 1][0]%}</span>
</div>
{%/if%}
{%/if%}
{%/foreach%}
</div>
{%/if%}
</div>
{%/if%}
</div>
{%script%}
        (require('place:widget/hotelextimg/hotelextimg.js')).init();
    {%/script%}
</div>