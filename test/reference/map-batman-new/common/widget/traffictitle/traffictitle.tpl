<div class="nav-middle common-widget-traffictitle">
	<div class="nav-middle-txt">
		<div class='bus-sel-wrap'>
			{%$plans = $data.result.plans%}
			{%$endCode = $data.result.end_city[0].code%}
			{%$startCode   = $data.result.start_city.code%}
			{%if ($trafficType == 'train') 
				|| ($trafficType == 'air')
				|| ($trafficType == 'drive' && ($startCode != $endCode))%} 
			    {%if $trafficType == 'air'%}
			    	<a class="current"><em class="air"></em></a>
			    {%else%}
			    	<a href="{%$plans.air%}" data-log="{code:{%$COM_STAT_CODE.CROSS_TRANSIT_PLAN_CLICK%}, type:'air'}"><em class="air"></em></a>
			    {%/if%}
			  	{%if $trafficType == 'train'%}
			    	<a class="current"><em class="train"></em></a>
			    {%else%}
			    	<a href="{%$plans.train%}" data-log="{code:{%$COM_STAT_CODE.CROSS_TRANSIT_PLAN_CLICK%}, type:'train'}"><em class="train"></em></a>
			    {%/if%}	
			    {%if $trafficType == 'drive'%}
			    	<a class="current"><em class="drive"></em></a>
			    {%else%}
			    	<a href="{%$plans.drive%}" data-log="{code:{%$COM_STAT_CODE.TO_DRIVE%}}"><em class="drive"></em></a>
			    {%/if%}	
		    {%else%}
				{%if $trafficType == 'transit'%}
			    	<a class="current"><em class="transit"></em></a>
			    {%else%}
			    	<a href="{%$plans.transit%}" data-log="{code:{%$COM_STAT_CODE.TO_BUS%}}"><em class="transit"></em></a>
			    {%/if%}
			    {%if $trafficType == 'drive'%}
			    	<a class="current"><em class="drive"></em></a>
			    {%else%}
			    	<a href="{%$plans.drive%}" data-log="{code:{%$COM_STAT_CODE.TO_DRIVE%}}"><em class="drive"></em></a>
			    {%/if%}
			    {%if $trafficType == 'walk'%}
			    	<a class="current"><em class="walk"></em></a>
			    {%else%}
			    	<a href="{%$plans.walk%}" data-log="{code:{%$COM_STAT_CODE.TO_WALK%}}"><em class="walk"></em></a>
			    {%/if%}   	
		    {%/if%}
		</div>
	</div>
</div>