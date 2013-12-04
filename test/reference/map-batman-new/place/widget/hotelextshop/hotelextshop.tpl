{%* 商户概况 *%}
{%if ($data.widget.overview)%}
    <ul class="detail-shoplist">
        {%foreach $widget_data.overview as $item%}
            {%if (!empty($item.desc) && !empty($item.name))%}
                <li>
                    <span class="shop-tit">{%$item.name%}</span>
                    <span class="shop-des">{%$item.desc%}</span>
                </li>
            {%/if%}
        {%/foreach%}
        {%foreach $widget_data.more_overview as $item%}
            {%if (!empty($item.desc) && !empty($item.name))%}
                <li>
                    <span class="shop-tit">{%$item.name%}</span>
                    <span class="shop-des">{%$item.desc%}</span>
                </li>
            {%/if%}
        {%/foreach%}
    </ul>
{%else%}
    {%widget name="place:widget/loadfailed/loadfailed.tpl" widget_data="暂时没有该酒店的详情信息..."%}
{%/if%}