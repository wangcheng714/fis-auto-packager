<div class="taxi-widget-resubmit">
    {%widget name="taxi:widget/common/nav/nav.tpl" title="重发订单" btnBack=true back=home%}
    <p class="info">没有司机应答，重新发送？</p>
    {%widget name="taxi:widget/common/radar/radar.tpl"%}
    <form>
        <div class="addprice-wrapper">
            {%widget name="taxi:widget/common/addprice/addprice.tpl"%}
        </div>
        <input type="hidden" name="city_code"/>
        <input type="hidden" name="order_id"/>
        <input type="hidden" name="add_price" value="0"/>

        <div class="bottom-bar">
            <input type="button" class="btn-resubmit" value="重新发送"/>
        </div>
    </form>
</div>
{%script%}
require('resubmit.js').init();
{%/script%}