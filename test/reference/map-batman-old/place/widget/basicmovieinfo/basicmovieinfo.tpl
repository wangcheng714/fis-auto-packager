{%* 如果src_name值在规定范围内且 content.ext.detail_info不为空则显示 *%}
<div class="place-widget-basic-movieinfo">
    <div class="dtl-img">
        {%if (!empty($widget_data.data.detail_info.image))%}
        <img src="{%$widget_data.data.detail_info.image%}" alt="正在加载..."/>
        {%else%}
        <img src="/static/images/no_img.png"/>
        {%/if%}
    </div>
    <div class="dtl-plinfo-con">
        <div class="dtl-plinfo-item dtl-score">
            <div class="dtl_plinfo_item dtl_score">
                 &nbsp;<span class="dtl_rat">{%$widget_data.data.detail_info.overall_rating%}</span>/5.0分&nbsp;&nbsp;
            </div>
            <div class="dtl_plinfo_item dtl_score">
                 &nbsp;<span>{%$widget_data.data.detail_info.tag%}</span>&nbsp;&nbsp;
            </div>
            <div class="dtl_plinfo_item dtl_score">
                 &nbsp;<span>营业时间：{%$widget_data.data.rich_info.shop_hours%}</span>&nbsp;&nbsp;
            </div>        
        </div>
    </div>
</div>
