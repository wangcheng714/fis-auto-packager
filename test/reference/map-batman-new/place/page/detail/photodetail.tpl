{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%widget name="common:widget/nav/nav.tpl" title="图片信息"%}
    <div id="photos-detail" class="loading">
    {%if $data.content.detail_part eq 'phototile'%}
        {%widget
            name="place:widget/photodetailtile/photodetailtile.tpl"
            widget_data=$data.content
            mode="quickling"
            pagelet_id="photos-detail-tile"
        %}
        {%script%}
            BigPipe.asyncLoad({id: 'photos-detail-tile'});
        {%/script%}
    {%elseif $data.content.detail_part eq 'photoslider'%}
        {%widget
            name="place:widget/photodetailslider/photodetailslider.tpl"
            widget_data = $data.content
            mode="quickling"
            pagelet_id="photos-detail-slider"
        %}
        {%script%}
            BigPipe.asyncLoad({id: 'photos-detail-slider'});
        {%/script%}
    {%/if%}
    {%widget name="place:widget/loading/loading.tpl"%}
    </div>
{%/block%}