<div class="more-icons">
	<ul class="line">
	{%if ($action == "transit")%}
		<li><a class="weather" data-wd="天气"><s></s>天气</a></li>	
	{%elseif ($action == 'weather')%}
		<li><a class="transit" data-wd="公交"><s></s>公交</a></li>
	{%/if%}
		<li><a class="subway" data-wd="地铁图"><s></s>地铁图</a></li>
		<li><a class="streetspace" data-wd="全景"><s></s>全景</a></li>
		<li><a class="shop" data-wd="团购"><s></s>团购</a></li>
	</ul>
	<ul class="line">
		<li><a class="hotel" data-wd="酒店"><s></s>酒店</a></li>
		<li><a class="film" data-wd="电影院"><s></s>电影院</a></li>
		<li><a class="more" data-wd="更多"><s></s>更多</a></li>
		<li></li>
	</ul>
</div>
{%script%}
    (require("moreicons.js")).init();
{%/script%}