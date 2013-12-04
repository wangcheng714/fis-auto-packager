{%style id="/widget/traffictitle/traffictitle.inline.less"%}.common-widget-traffictitle .nav-middle {
  width: 100%;
  line-height: 44px;
  font-size: 16px;
  color: #373a3d;
  text-align: center;
  font-weight: normal;
  position: relative;
}
.common-widget-traffictitle .nav-middle-txt {
  margin: 0 72px;
  color: #373a3d;
  display: block;
  white-space: nowrap;
}
.common-widget-traffictitle .bus-sel-wrap {
  display: inline-block;
  width: 100%;
  height: 51px;
  position: relative;
  line-height: 51px;
  font-size: 14px;
  left: -2px;
}
.common-widget-traffictitle .bus-sel-wrap a {
  color: #3b3b3b;
  display: inline-block;
  font-size: 14px;
  width: 49px;
}
.common-widget-traffictitle .bus-sel-wrap a:last-child {
  border: none;
}
.common-widget-traffictitle em {
  width: 21px;
  height: 21px;
  background: url(/static/common/images/lineIcon_251e24f.png) no-repeat;
  background-size: 20px 245px;
  display: inline-block;
  position: relative;
  top: 4px;
  left: -1px;
}
.common-widget-traffictitle .train {
  background-position: 0 -31px;
}
.common-widget-traffictitle .current .train {
  background-position: 0 -151px;
}
.common-widget-traffictitle .walk {
  background-position: 0 -103px;
}
.common-widget-traffictitle .current .walk {
  background-position: 0 -224px;
}
.common-widget-traffictitle .air {
  background-position: 0 -5px;
}
.common-widget-traffictitle .current .air {
  background-position: 0 -126px;
}
.common-widget-traffictitle .drive {
  background-position: 0 -79px;
}
.common-widget-traffictitle .current .drive {
  background-position: 0 -199px;
}
.common-widget-traffictitle .transit {
  background-position: 0 -55px;
}
.common-widget-traffictitle .current .transit {
  background-position: 0 -176px;
}
{%/style%}<div class="nav-middle common-widget-traffictitle">
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