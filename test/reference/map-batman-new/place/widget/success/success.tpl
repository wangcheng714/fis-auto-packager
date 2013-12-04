<div id="orderSuccess" class="ordersuccess">
    <div class="success-notice">
        <p>
            <span class="success-img"></span>
            <strong class="book-success">预订成功！</strong>
            <span>稍后您会收到确认短信。</span>
        </p>
    </div>
    <div class="hotel-info">
        <table>
            <tbody>
                <tr>
                    <td class="left">酒店名称：</td>
                    <td>{%$data.order_info.hotel_name%}</td>
                </tr>
                <tr>
                    <td class="left">酒店地址：</td>
                    <td>{%$data.order_info.hotel_address%}</td>
                </tr>
                <tr>
                    <td class="left">入离时间：</td>
                    <td>{%$data.order_info.checkin_time%}到店；{%$data.order_info.checkout_time%}离店</td>
                </tr>
                <tr>
                    <td class="left">房型：</td>
                    <td>{%$data.order_info.room_name%}；{%$data.order_info.room_num%}间</td>
                </tr>
                <tr>
                    <td class="left">早餐：</td>
                    <td>
                        {%foreach from=$data.order_info.breakfast_info item=item name=breakfast%}
                        	{%if $item.has_breakfast == 1%}
                        		{%$item.date%}含早{%if !($smarty.foreach.breakfast.last)%}，{%/if%}
                        	{%else%}
                        		{%$item.date%}无早{%if !($smarty.foreach.breakfast.last)%}，{%/if%}
                        	{%/if%}
                        {%/foreach%}
                    </td>
                </tr>
                <tr class="last">
                    <td class="left">费用总计：</td>
                    <td><em class="total-price">&yen;{%$data.order_info.total_price%}</em>（{%$data.order_info.payment_typte%}）</td>
                </tr>
            </tbody>
        </table>

    </div>
</div>