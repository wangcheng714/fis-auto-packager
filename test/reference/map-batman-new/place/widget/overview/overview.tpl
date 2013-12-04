{%* 商户概况 *%}
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
                <span>{%$item.name%}</span>
            </strong>&nbsp;:&nbsp;
            
            {%if $widget_data.src_name=="cater" || $widget_data.src_name=="shopping"%}
                {%if !empty($widget_data.data.description_name)%}
                    {%if $item.name=="商户描述" && $widget_data.data.description_name=="dianping"%}
                        {%if !empty($widget_data.data.description_url_mobile)%}
                            <a target="_blank" href="{%$widget_data.data.description_url_mobile%}">
                        {%else%}
                            <a target="_blank" href="javascript:void(0);">
                        {%/if%}
                        {%$item.desc|truncate:50:"...":true%}
                        {%if !empty($widget_data.data.description_cn_name)%}
                            <p>来自{%$widget_data.data.description_cn_name%}</p>
                        {%/if%}
                        </a>
                    {%else%}
                        {%$item.desc%}
                    {%/if%}
                {%else%}
                    {%$item.desc%}
                {%/if%}
            {%else%}
                {%$item.desc%}
            {%/if%}
            
        </li>
        {%/if%}
        {%/foreach%}
    </ul>
    {%if (!empty($widget_data.data.more_overview))%}
    <a href="{%$widget_data.data.more_overview_href%}" class="more-btn" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_MORE_OVERVIEW_CLICK%}, wd: '{%$wd%}', srcname:'{%$widget_data.src_name%}', name:'{%$widget_data.name%}'}">查看更多信息</a>
    {%/if%}
</div>
{%/if%}