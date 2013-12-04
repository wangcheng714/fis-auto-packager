{%* 酒店详情图片扩展详情卡片 *%}
{%$detail_info = $widget_data.detail_info%}
{%$rich_info = $widget_data.rich_info%}
<div class="hotel-content">
    <div class="hotel-img"
        {%if isset($widget_data.phototile_href)%}
            data-href={%$widget_data.phototile_href%}
        {%/if%}>
        {%if $detail_info._imgSrc %}
            <img id="detail-img" src="{%$detail_info._imgSrc%}">
        {%else%}
            <img src="/static/images/no_img.png"/>
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
                <!--2表示团购价-->
                {%if $detail_info.wise_hotel_type === "2" %}
                    <span class="price-normal">团购价&nbsp;&yen;{%$detail_info.wise_low_price%}</span>
                    <span class="price-del">原价&nbsp;&yen;{%$detail_info.wise_price%}</span>
                <!--其他表示参考价-->
                {%elseif $detail_info.wise_price %}
                    参考价&nbsp;&yen;{%$detail_info.wise_price%}
                {%/if%}
            </div>
        {%else%}
            <div class="hotel-no-price"></div>
        {%/if%}
        {%if $detail_info.overall_rating %}
            <div class="hotel-rank">
                <span class="rank-percent">{%$detail_info.overall_rating%}</span>/5.0分
            </div>
        {%else%}
            <div class="no-overall_rating"></div>
        {%/if%}
        {%if $detail_info.special_service || ($rich_info && $rich_info.level) %}
            <div class="hotel-facilities">
                {%if $rich_info.level %}
                    <span class="hotel-level detail-tit">{%$rich_info.level%}</span>
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
        (require('hotelextimg.js')).init();
    {%/script%}
</div>