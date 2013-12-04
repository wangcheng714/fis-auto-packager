{%* 如果src_name值在规定范围内且 content.ext.detail_info不为空则显示 *%}
<div class="place-widget-basic-info">
    <div class="dtl-img">
        {%if (!empty($widget_data.detail_info.image))%}
        <img src="{%$widget_data.detail_info.image%}" alt="正在加载..."/>
        {%else%}
        <img src="/static/images/no_img.png"/>
        {%/if%}
    </div>
    <div class="dtl-plinfo-con">
        <div class="dtl-plinfo-item dtl-score">
            <span class="star-box-l">
                <span class="star-score"
                      style="width:{%intval($widget_data.detail_info.overall_rating, 10)/5 * 75%}px"></span>
            </span>
            
            {%if $widget_data.src_name!="cater" && $widget_data.src_name!="shopping"%}
                &nbsp;{%$widget_data.detail_info.overall_rating%}
            {%/if%}

            {%if $widget_data.src_name=="cater" || $widget_data.src_name=="shopping"%}
                {%if !empty($widget_data.detail_info.rating)%}
                    {%if !empty($widget_data.detail_info.rating.url_mobile)%}
                        <a target="_blank" href="{%$widget_data.detail_info.rating.url_mobile%}" class="place_rating_source">
                    {%else%}
                        <a target="_blank" href="javascript:void(0);" class="place_rating_source">
                    {%/if%}
                    {%if !empty($widget_data.detail_info.rating.cn_name)%}
                        来自{%$widget_data.detail_info.rating.cn_name%}
                    {%/if%}
                    </a>
                {%/if%}
            {%/if%}
            
        </div>

        {%* 餐饮 *%}
        {%if ($widget_data.src_name == 'cater')%}
            <div class="dtl-plinfo-item"><span>
                <span class="sm"> 人均消费:
                    <span class="dtl-price">￥{%$widget_data.detail_info.price%}</span>
                </span>
            </div>
            <div class="dtl-plinfo-item place-plinfo-itemnew">
                <span>服务:&nbsp;{%$widget_data.detail_info.service_rating%}</span>&nbsp;
                <span>环境:&nbsp;{%$widget_data.detail_info.environment_rating%}</span>&nbsp;
                <span>口味:&nbsp;{%$widget_data.detail_info.taste_rating%}</span>&nbsp;
            </div>

        {%* 酒店 *%}
        {%elseif ($widget_data.src_name == 'hotel')%}
            <div class="dtl-plinfo-item"><span>
                {%if ($widget_data.detail_info.tonight_sale_flag == '1')%}
                    <span class="sm">
                    <span class="dtl-price"><span class="special">￥{%$widget_data.detail_info.tonight_price%}</span>起</span>
                </span>
                    {%elseif ($widget_data.detail_info.wise_realtime_price_flag == '1')%}
                    <span class="sm">
                    <span class="dtl-price"><span class="realtime">￥{%$widget_data.detail_info.wise_realtime_price%}</span>起</span>
                </span>
                    {%else%}
                    <span class="sm"> 参考价:
                    <span class="dtl-price">￥{%$widget_data.detail_info.price%}</span>
                </span>
                    {%/if%}
            </div>
            <div class="dtl-plinfo-item place-plinfo-itemnew">
                <span>设施:&nbsp; {%$widget_data.detail_info.facility_rating%}</span>&nbsp;
                <span>服务:&nbsp; {%$widget_data.detail_info.service_rating%}</span>&nbsp;
                <span>卫生:&nbsp; {%$widget_data.detail_info.hygiene_rating%}</span>&nbsp;
            </div>

        {%* 医院 *%}
        {%elseif ($widget_data.src_name == 'hospital')%}
            <div class="dtl-plinfo-item">
                <span>技术评分:&nbsp; {%$widget_data.detail_info.technology_rating%}</span>&nbsp;
                <span>服务评分:&nbsp; {%$widget_data.detail_info.service_rating%}</span>&nbsp;
                <span>价格评分:&nbsp; {%$widget_data.detail_info.price_rating%}</span>&nbsp;
            </div>
        {%* 生活(src_name == life) *%}
        {%elseif ($widget_data.src_name === 'life')%}
            {%if ($widget_data.detail_info.price)%}
                <div class="dtl-plinfo-item"><span>
                    <span class="sm"> 参考价:
                        <span class="dtl-price">￥{%$widget_data.detail_info.price%}</span>
                    </span>
                </div>
            {%/if%}
        {%/if%}
    </div>
</div>
