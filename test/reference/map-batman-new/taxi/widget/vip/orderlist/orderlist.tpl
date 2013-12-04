<div class="taxi-widget-vip-orderlist">
    {%widget name="taxi:widget/common/nav/nav.tpl" title="代叫订单" btnBack=true back="vip/home"%}
    <div class="list-container"></div>
</div>
{%script%}
require('orderlist.js').init();
{%/script%}