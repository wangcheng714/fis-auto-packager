{%style id="/widget/success/success.inline.less"%}.ordersuccess{font-size:14px;color:#737373;position:relative}.ordersuccess .success-notice{background:#f7f7f7;height:90px;border-bottom:1px solid #caced5;display:-webkit-box;-webkit-box-pack:center}.ordersuccess .success-notice .success-img{background:url(/static/place/images/book_success_7fc1840.png) 0 0 no-repeat;background-size:40px 35px;width:40px;height:35px;display:inline-block;float:left;margin-right:13px}.ordersuccess .success-notice p{padding-top:27px;width:220px}.ordersuccess .success-notice .book-success{font-size:16px;font-weight:700;color:#40b011;display:block;padding-bottom:4px}.ordersuccess .hotel-info{border:1px solid #dedede;margin:10px 8px 15px;border-radius:3px;background:#fafafa}.ordersuccess .hotel-info table{color:#333;width:97%;margin:0 1.5%}.ordersuccess .hotel-info td.left{width:35%;color:#737373;text-align:right}.ordersuccess .hotel-info td{border-bottom:1px solid #dedede;-webkit-box-shadow:0 2px #fff;box-shadow:0 2px #fff;padding:12px 0;line-height:20px}.ordersuccess .hotel-info tr.last td{border-bottom:0;box-shadow:none;-webkit-box-shadow:none}.ordersuccess .hotel-info .total-price{color:#ff5026}{%/style%}<div id="orderSuccess" class="ordersuccess">
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
<td>{%$data.order_info.hotel_name|f_escape_xml%}</td>
</tr>
<tr>
<td class="left">酒店地址：</td>
<td>{%$data.order_info.hotel_address|f_escape_xml%}</td>
</tr>
<tr>
<td class="left">入离时间：</td>
<td>{%$data.order_info.checkin_time|f_escape_xml%}到店；{%$data.order_info.checkout_time|f_escape_xml%}离店</td>
</tr>
<tr>
<td class="left">房型：</td>
<td>{%$data.order_info.room_name|f_escape_xml%}；{%$data.order_info.room_num|f_escape_xml%}间</td>
</tr>
<tr>
<td class="left">早餐：</td>
<td>
{%foreach from=$data.order_info.breakfast_info item=item name=breakfast%}
{%if $item.has_breakfast == 1%}
{%$item.date|f_escape_xml%}含早{%if !($smarty.foreach.breakfast.last)%}，{%/if%}
{%else%}
{%$item.date|f_escape_xml%}无早{%if !($smarty.foreach.breakfast.last)%}，{%/if%}
{%/if%}
{%/foreach%}
</td>
</tr>
<tr class="last">
<td class="left">费用总计：</td>
<td><em class="total-price">&yen;{%$data.order_info.total_price|f_escape_xml%}</em>（{%$data.order_info.payment_typte|f_escape_xml%}）</td>
</tr>
</tbody>
</table>
</div>
</div>