{%style id="/widget/petroprice/petroprice.inline.less"%}.place-widget-petroprice{overflow:hidden;border:#B0B0B0 solid 1px;border-radius:.25em}.petroprice-list{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center}.petroprice-list .petroprice-item{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:block-axis;-webkit-flex-flow:column;flex-flow:column;-webkit-box-pack:end;-webkit-justify-content:flex-end;justify-content:flex-end;-webkit-box-flex:1;-webkit-flex:1;flex:1;height:64px;line-height:32px;border-right:1px solid #d9d9d9;text-align:center;font-size:14px}.petroprice-list .petroprice-item:last-child{border-right:0}.petroprice-list .petroprice-item .name{display:block;background:#f6f6f6}.petroprice-list .petroprice-item .price{display:block;background:#fff}{%/style%}
{%* 参数：$widget_date *%}
{%if ($data.widget.petroprice)%}
<div class="place-widget-petroprice">
<ul class="petroprice-list">
{%foreach from=$widget_data item=petro_obj%}
<li class="petroprice-item">
<span class="name">{%$petro_obj.oril_type|replace:"gasoline_":""|replace:"derv_negative":""|replace:"derv_":"-"%}#油</span>
<span class="price">&yen;{%$petro_obj.oril_price|f_escape_xml%}</span>
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
