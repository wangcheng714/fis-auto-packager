{%style id="/widget/trainstation/trainstation.inline.less"%}#trainstation {
  color: #606060;
}
#trainstation .title {
  background: #f0f0f0;
  color: #3b3b3b;
  height: 37px;
  line-height: 37px;
  position: relative;
}
#trainstation .title span {
  position: absolute;
}
#trainstation .title .station-title {
  left: 14px;
}
#trainstation .title .station-date {
  right: 115px;
}
#trainstation .title .arrivetime {
  right: 14px;
}
#trainstation li {
  border-bottom: 1px solid #d9d9d9;
  background: #f2f2f2;
  height: 48px;
  position: relative;
}
#trainstation li.over-station {
  color: #0c4da8;
}
#trainstation .list-icon,
#trainstation .start-station,
#trainstation .start-point,
#trainstation .start-date {
  position: absolute;
  top: 15px;
}
#trainstation .list-icon {
  color: #0c4da8;
  left: 13px;
  background: #e3f1fa;
  border-radius: 12px;
  padding: 0 2px;
}
#trainstation .start-station {
  left: 42px;
}
#trainstation .start-point {
  right: 20px;
}
#trainstation .start-date {
  right: 115px;
}
{%/style%}<div id="trainstation" class="bus-list-inner">
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