
<div class='mycenter-head'>
<div class='mycenter-avatar'><img src=http://himg.bdimg.com/sys/portrait/item/{%$data.strCode|f_escape_path%}.jpg></div>
<div class='mycenter-about'>
<div class="mycenter-name">{%$data.username|f_escape_xml%}
</div>
<div class="mycenter-score">积分 :<span class='mycenter-scrore-num'>{%$data.integral_total|f_escape_xml%}</span></div>
</div>
<a class='mycenter-go-score' id='seeScore' href="{%$data.score_url|f_escape_xml%}" data-log="{code:{%$STAT_CODE.STAT_USER_MYCENTER_GO_STORE_CLICK|f_escape_xml%}}">查看积分></a>
</div>
<div class='mycenter-mytrace'>
<div class='mycenter-title'>我的足迹</div>
<hr class='mycenter-mytrace-line'>
<div class='mycenter-mytrace-con'>
<div class='mycenter-mytrace-ul'>
<ul>
{%foreach $data.list as $i => $itemI%}
{%foreach $itemI.list as $j => $itemJ%}
{%if $i < 10%}
<li class='mycenter-mytrace-list'>
<div class='mycenter-mytrace-point'></div>
<div class='mycenter-mytrace-data mycenter-mytrace-height'>{%$itemI.visitTime|f_escape_xml%}</div>
<div class='mycenter-mytrace-shop mycenter-mytrace-height'>{%$itemI.name|f_escape_xml%}</div>
<div class='mycenter-mytrace-address mycenter-mytrace-height'>
<div class='mycenter-mytrace-address-logo'></div>
<div class='mycenter-mytrace-address-con'>{%$itemI.address|f_escape_xml%}</div>
</div>
<div class='mycenter-mytrace-comment  mycenter-mytrace-height'>
<div class='mycenter-mytrace-comment-logo'></div>
<div class='mycenter-mytrace-comment-con'>{%$itemJ.content|f_escape_xml%}</div>
</div>
</li>
{%/if%}
{%/foreach%}
{%/foreach%}
</ul>
</div>
{%if count($data.list) > 10  %}
<a class="mycenter_loadmore" style="cursor:pointer;">加载更多足迹信息</a>
{%/if%}
<div class='mycenter-mytrace-blank'></div>
</div>
</div>
{%script%}
	var data = {
		list: {%json_encode($data.list)%}
	};
	(require('user:widget/mycenter/mycenter.js')).init(data);
{%/script%}