
<div class='exchange-gogift'>
去百度地图客户端兑换礼物 ></div>
<div class='exchange-gift'>
{%$list = $data.result.list%}
{%for $i = 0;$i < count($list) ;$i++%}
{%if ($i < 10)%}
<ul class='exchange-gift-list1'>
<li class='exchange-gift-list1'>
<div class='exchange-gift-img'><img src={%$list[$i].pic_url|f_escape_path%}></div>
<div class='exchange-gift-contain'>
<div class='exchange-gift-title'>{%$list[$i].title|f_escape_xml%}</div>
<div class='exchange-gift-des'>{%$list[$i].description|f_escape_xml%}</div>
<div class='exchange-gift-all'>总量{%$list[$i].total_num|f_escape_xml%}件 剩余{%$list[$i].total_num-$list[$i].exchange_num%}件</div>
<div class='exchange-gift-buy'>兑换（-{%$list[$i].need_integral|f_escape_xml%}积分）</div>
</div>
</li>
{%$i=$i+1%}
{%if ($i != count($list))%}
<li class='exchange-gift-list2'>
<div class='exchange-gift-img'><img src={%$list[$i].pic_url|f_escape_path%}></div>
<div class='exchange-gift-contain'>
<div class='exchange-gift-title'>{%$list[$i].title|f_escape_xml%}</div>
<div class='exchange-gift-des'>{%$list[$i].title|f_escape_xml%}</div>
<div class='exchange-gift-all'>总量{%$list[$i].total_num|f_escape_xml%}件 剩余{%$list[$i].total_num-$list[$i].exchange_num%}件</div>
<div class='exchange-gift-buy'>兑换（-{%$list[$i].need_integral|f_escape_xml%}积分）</div>
</div>
</li>
{%else%}
<li class='exchange-gift-list2' style='visibility:hidden;'>
<div class='exchange-gift-img'><img src={%$list[i-1].pic_url%}></div>
<div class='exchange-gift-contain'>
<div class='exchange-gift-title'>{%$list[i-1].title%}</div>
<div class='exchange-gift-des'>{%$list[i-1].title%}</div>
<div class='exchange-gift-all'>总量{%$list[i-1].total_num%}件 剩余{%$list[i-1].total_num-$list[i-1].exchange_num%}件</div>
<div class='exchange-gift-buy'>兑换（-{%$list[i-1].need_integral%}积分）</div>
</div>
</li>
{%/if%}
</ul>
{%/if%}
{%/for%}
</div>
{%if count($data.result.list) > 10 %}
<a class="gift_loadmore" style="cursor:pointer;">加载更多礼品信息</a>
{%/if%}
{%script%}
	var data = {
		list: {%json_encode($data.result.list)%}
	};
	(require('user:widget/exchange/exchange.js')).init(data);
{%/script%}
