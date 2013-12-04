<!-- @fileOverview 油价详情 -->
{%* 参数：$widget_date *%}
{%if ($data.widget.petroprice)%}
<div class="place-widget-petroprice">
    <ul class="petroprice-list">
    {%foreach from=$widget_data item=petro_obj%}
    <li class="petroprice-item">
        <span class="name">{%$petro_obj.oril_type|replace:"gasoline_":""|replace:"derv_negative":""|replace:"derv_":"-"%}#油</span>
        <span class="price">&yen;{%$petro_obj.oril_price%}</span>
    </li>
    {%/foreach%}
    </ul>
</div>
{%script%}
    //添加交通加油站详情页“价格”widget的展现量
    var stat = require('common:widget/stat/stat.js');
    var name = $('.place-widget-captain').find('.name').text();
    stat.addStat(STAT_CODE.PLACE_TRAFFIC_GASSTATION_DETAIL_PRICE_VIEW, {'name':name});
{%/script%}
{%/if%}
