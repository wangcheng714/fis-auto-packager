<div id="crossbus-detail-inner" class="transit-widget-crossdetail">
	{%$detailData = $data.detailData%}
	{%$start      = $detailData.start%}
	{%$end        = $detailData.end%}
	{%$cList      = $detailData.cList%}
	{%$list       = $detailData.list%}
	<div class="city-bound">
		<em>城际</em>
		<span class="start">
	 		{%$start%}
 		</span>
 		>
 		<span class="end">
    		{%$end%}
 		</span>
	</div>
	{%foreach $list as $j => $item%}
	<div class="detail">
		<!-- 起终点开始 -->
		<div class="detail-title">
		    {%if ($item.type == 1)%}
			 	<em class="train-icon"></em>
			 	<span>{%$item.name%}</span>
			 	<span class="train-type">({%$item.trainType%})</span>
			{%else if ($item.type == 2)%}
			 	<em class="air-icon"></em>
			 	<span>{%$item.name%}</span>
		 	{%/if%}
		</div>
		<!-- 起终点结束 -->
		{%if count($list) > 1 %}
			<div class="detail-wrapmul">
		{%else%}
			<div class="detail-wrapsin">
		{%/if%}
			<div class="detail-info">
				<div class="detail-start">
					<p>{%$item.start.time%}</p>
					<p class="start-location">
					   {%$item.start.name%}
					</p>
				</div>
				<div class="arrow"></div>
				<div class="detail-end">
					<p>{%$item.end.time%}</p>
					<p class="end-location">
					   {%$item.end.name%}
					</p>
				</div>
				<div class="airdetail-processed">
					全程约{%$item.overTime%}
				</div>
				<div class="detail-lowest">
					最低价
					{%if ($item.price == 0)%}
						<span class="stress">暂无</span>
					{%else%}
						<span class="icon stress">¥</span>
						<span class="stress">{%$item.price%}</span>
					{%/if%}
					{%if ($item.discount && $item.discount <= 10)%}
						<span class="stress">（{%$item.discount%}折）</span>
					{%/if%}
				</div>			
			    {%if ($item.type == 1)%}
			    	<a class="train-booking" href="tel:{%$item.tel%}" data-tel="{%$item.tel%}"></a>
			    {%else if ($item.type == 2)%}
			    	<a class="air-booking" href="{%$item.url%}" target="_blank"></a>
			    {%/if%}
			</div>
		
		{%if ($item.type == 1 && $item.stations)%}
			<a class="train-station" href="{%$item.stationsUrl%}">	
				<span>途经{%$item.stations%}站</span>
				<em>></em>
	  		</a>
		{%/if%}
		<div class="flow"></div>
		</div>
	</div>
	{%/foreach%}

	<ul class="crossbus-list">
		{%foreach $cList as $i => $item%}
			<li i="{%$i%}">
				<span class="incity-plan" data-href="{%$item.url%}">
					{%if ($item['isStart'] == true)%}
						<em class="start-icon">出发</em>
					{%else if ($item['isEnd'] == true)%}
						<em class="end-icon">到达</em>
					{%else%}
						<em class="transfer-icon">中转</em>
					{%/if%}
					<span class="start-point">{%$item['start']['wd']%}</span>
					>
					<span class="start-transit">{%$item['end']['wd']%}</span>
					<em>></em>
				</span>
			</li>
		{%/foreach%}
	</ul>
</div>