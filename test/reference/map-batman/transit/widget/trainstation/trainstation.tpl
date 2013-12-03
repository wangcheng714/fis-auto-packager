<div id="trainstation" class="bus-list-inner">
	<div class="title">
    	<span class="station-title">车站</span>
      <span class="station-date">日期</span>
    	<span class="arrivetime">到达时间</span>
	</div>
    {%$stations = $data.trainstationData.stations%}
   	<ul>
   	{%foreach $stations as $i => $item%}
      {%if ($item.isOverStation && ($item.isOverStation == 1))%}
        <li class="over-station">
      {%else%}
        <li>
      {%/if%}
        <span class="list-icon">{%sprintf('%02d',$i)%}</span>
   			<span class="start-station">{%$item.name%}</span>
        <span class="start-date">{%$item.date%}</span>
   			<span class="start-point">{%$item.start_time%}</span>
   		</li>
   	{%/foreach%}
   	</ul>
</div>