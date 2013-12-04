
<div class='score-my'>
我的总积分 ：<span class='score-num'>{%$data.result.integral_total|f_escape_xml%}</span>
</div>
<div class='myscore-all'>
{%foreach $data.result.list as $i => $item%}
{%if ($i < 10)%}
<div class='score-contain'>
<div class='score-contain-left'>{%$item.integral_type_desc|f_escape_xml%}</div>
<div class='score-add'>{%($item.operation_type==2)?"-":"+"%}{%$item.integral|f_escape_xml%}积分</div>
<div class='score-time'>{%$item.operation_time|f_escape_xml%}</div>
</div>
{%/if%}
{%/foreach%}
</div>
{%if count($data.result.list) > 10 %}
<a class="myscore_loadmore" style="cursor:pointer;">加载更多积分信息</a>
{%/if%}
{%script%}
	var data = {
		list: {%json_encode($data.result.list)%}
	};
	(require('user:widget/score/score.js')).init(data);
{%/script%}
