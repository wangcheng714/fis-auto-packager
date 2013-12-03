{%json file="index/sventry.json" assign="loc_conf"%}

<div class="index-widget-sventry">
	{%$citys = $data.citys%}
	{%for $i = 0; $i < count($citys); $i++ %}
		<a class = "city-item" href="javascript:void(0);" data="{'heading':'{%$citys[$i]->heading%}','name':'{%$citys[$i]->name%}', 'pitch':'{%$citys[$i]->pitch%}', 'sid':'{%$citys[$i]->sid%}', 'type':'{%$citys[$i]->type%}', 'x':'{%$citys[$i]->x%}','y':'{%$citys[$i]->y%}'}">
			<!--<div class="city-pic" style="background-image: url({%$data[$i]->imageUrl%})"></div>-->
			<div class="city-pic" style="background-image: url({%$citys[$i]->imageUrl%})" ></div>
			<div class="city-name">
				<span class="name" sidx={%$i%}>{%$citys[$i]->name%}</span>
				<span class="arrow"></span>
			</div>
		</a>
	{%/for%}

</div>


{%script%}
require("./sventry.js").init();
{%/script%}
