{%$weather = $data.weather%}
<div class="third-widget-weather">
	{%if $weather.status == 1%}
	<div class="error">抱歉，无法查询{%$data.city%}的天气</div>
	{%else%}
	<div class="tabs">
		<div class="tab left active" id="today_btn">今天</div>
		<div class="tab" id="week_btn">五天预报</div>
	</div>
	<div class="detail_today" style="display:none;">
		<div class="content weather">
			<div class="w_title city">
				<span class="city_cur" id="current-city" data-city={%$weather.city%} data-code={%$data.code%}>{%$weather.city%}</span>
				<span class="switch">[切换]</span>
			</div>
			<div class="detail">
				<div class="d1">
					<div class="left" style="{%if $weather.today.temp=='-'%}padding-top:30px;{%/if%}">
						{%if $weather.today.temp!='-'%}
						<div class="t">
							<span id="t_now">{%$weather.today.temp%}</span>℃
						</div>
						{%/if%}
						<div class="t_small">
							<span id="t_max">{%$weather.today.temp_max%}</span>℃
							<span class="t_space">/</span>
							<span id="t_min">{%$weather.today.temp_min%}</span>℃
						</div>
						
						<div class="t_small">
							{%$weather.today.update_time%}更新
						</div>

					</div>
					<div class="right">
						<div class="bg bg1 bg_img_{%$weather.today.weather_icon%}"></div>
						<div class="bg_text">{%$weather.today.weather%}</div>
					</div>
				</div>
				<!--<div class="d2">
					<span id="update_time">{%$weather.today.update_time%}</span>更新
				</div>-->
			</div>
		</div>
		{%if $weather.today.pm25%}
		<div class="content pm2_5">
			<div class="w_title">PM 2.5</div>
			<div class="detail">
				<div class="d1">
					<div class="left">
						<div class="t" id="pm_val">{%$weather.today.pm25%}</div>
						<div class="t_small t_end" id="pm_text">
							{%if $weather.today.pm25_state == '0'%}
								健康
							{%else%}
								不健康
							{%/if%}
						</div>
					</div>
					<div class="right">
						<div class="bg  		
							{%if $weather.today.pm25_state == '0'%}
								bg2_good
							{%else%}
								bg2_bad
							{%/if%}"></div>
					</div>
				</div>
			</div>
		</div>
		{%/if%}
	</div>

	<div class="detail_week" style="display:none;">
		<div class="content oneweek">
			<div class="w_title city no_b_border">
				<span class="city_cur">{%$weather.city%}</span>
				<span class="switch">[切换]</span>
			</div>
			{%for $i = 0; $i < count($weather.week);  $i++ %}
			<div class="w_con">
				<span class="box day">{%$weather.week[$i].day%}</span>
				<span class="box  bg_img_{%$weather.week[$i].weather_icon%} icon"></span>
				<span class="box deg">{%$weather.week[$i].temp_max%}℃/{%$weather.week[$i].temp_min%}℃</span>
			</div>
			{%/for%}
		</div>
	</div>
	{%/if%}
</div>

{%script%}
require("weather.js").init();
{%/script%}