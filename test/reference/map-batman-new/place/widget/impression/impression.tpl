{%* 餐饮大家印象widget *%}
{%if ($data.widget.impression)%}
<div class="place-widget-cater">
    <h2>大家印象</h2>
    <ul>
        {%foreach from=$widget_data item=data%}
        <li>{%$data.keyword%}<em>{%$data.keyword_num%}</em></li>
        {%/foreach%}
    </ul>
</div>
{%/if%}