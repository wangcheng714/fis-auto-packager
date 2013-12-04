{%style id="/widget/weather/weather.inline.less"%}.third-widget-weather{background-color:#fff;font-size:15px;color:#5c5c5c}.third-widget-weather .error{margin:12px}.third-widget-weather .w_title{height:39px;padding:0 11px;line-height:39px;border-bottom:1px solid #ECECEC}.third-widget-weather .no_b_border{border-bottom:0}.third-widget-weather .w_con{height:44px;padding:0 11px;line-height:44px;border-top:1px solid #ececec}.third-widget-weather .tabs{height:42px;display:-webkit-box;color:#525252}.third-widget-weather .tabs .tab{display:block;height:100%;text-align:center;-webkit-box-flex:1;line-height:42px;background-color:#f9f9f9;border-bottom:1px solid #ececec;width:50%}.third-widget-weather .tabs .left{border-right:1px solid #ececec}.third-widget-weather .tabs .active{background-color:#fff;border-bottom:0}.third-widget-weather .content{margin:12px 12px 0;border:1px solid #ececec}.third-widget-weather .city .switch{float:right;color:#4C90F9}.third-widget-weather .d1{display:-webkit-box;text-align:center}.third-widget-weather .d1 .left{-webkit-box-flex:1;width:50%}.third-widget-weather .d1 .left .t{font-size:36px;padding:13px 0 3px}.third-widget-weather .d1 .left .t_small{padding-bottom:3px}.third-widget-weather .d1 .left .t_end{padding-bottom:11px}.third-widget-weather .d1 .right{-webkit-box-flex:1;width:50%}.third-widget-weather .d1 .right .bg{width:84px;height:84px;margin:0 auto;background-position:center center}.third-widget-weather .d1 .right .bg_text{padding-top:0;padding-bottom:8px}.third-widget-weather .d1 .right .bg1{background-size:76px 76px;background-position:center;height:91px;background-repeat:no-repeat}.third-widget-weather .d1 .right .bg2_good{background:url(/mobile/simple/static/third/images/weather/good_ef49b1f.png) 0 0 no-repeat;background-size:77px 55px;background-position:center}.third-widget-weather .d1 .right .bg2_bad{background:url(/mobile/simple/static/third/images/weather/bad_d5ad7d6.png) 0 0 no-repeat;background-size:77px 55px;background-position:center}.third-widget-weather .d2{text-align:right;padding:4px 14px;color:#8E8E8E}.third-widget-weather .box{-webkit-box-flex:1;display:block}.third-widget-weather .w_con{height:44px;padding:0 11px;line-height:44px;border-top:1px solid #ECECEC;display:-webkit-box}.third-widget-weather .icon{width:25px;height:44px;background-size:25px;background-position:center;background-repeat:no-repeat}.third-widget-weather .deg{text-align:right;width:33%}.third-widget-weather .bg_img_1{background-image:url(/mobile/simple/static/third/images/weather/1_3777257.png)}.third-widget-weather .bg_img_2{background-image:url(/mobile/simple/static/third/images/weather/2_380e751.png)}.third-widget-weather .bg_img_3{background-image:url(/mobile/simple/static/third/images/weather/3_872c04a.png)}.third-widget-weather .bg_img_4{background-image:url(/mobile/simple/static/third/images/weather/4_b086cfc.png)}.third-widget-weather .bg_img_5{background-image:url(/mobile/simple/static/third/images/weather/5_d3db28d.png)}.third-widget-weather .bg_img_6{background-image:url(/mobile/simple/static/third/images/weather/6_3971d5d.png)}.third-widget-weather .bg_img_7{background-image:url(/mobile/simple/static/third/images/weather/7_dde99ee.png)}.third-widget-weather .bg_img_8{background-image:url(/mobile/simple/static/third/images/weather/8_4bd68fe.png)}.third-widget-weather .bg_img_9{background-image:url(/mobile/simple/static/third/images/weather/9_1d01a2b.png)}.third-widget-weather .bg_img_10{background-image:url(/mobile/simple/static/third/images/weather/10_c6836e4.png)}.third-widget-weather .bg_img_11{background-image:url(/mobile/simple/static/third/images/weather/11_91efd56.png)}.third-widget-weather .bg_img_12{background-image:url(/mobile/simple/static/third/images/weather/12_2fac60c.png)}.third-widget-weather .bg_img_13{background-image:url(/mobile/simple/static/third/images/weather/13_595a6e8.png)}.third-widget-weather .bg_img_14{background-image:url(/mobile/simple/static/third/images/weather/14_d17eb3a.png)}.third-widget-weather .bg_img_15{background-image:url(/mobile/simple/static/third/images/weather/15_6f611e4.png)}.third-widget-weather .bg_img_16{background-image:url(/mobile/simple/static/third/images/weather/16_64de857.png)}.third-widget-weather .bg_img_17{background-image:url(/mobile/simple/static/third/images/weather/17_4c5278a.png)}.third-widget-weather .bg_img_18{background-image:url(/mobile/simple/static/third/images/weather/18_8d8bead.png)}.third-widget-weather .bg_img_19{background-image:url(/mobile/simple/static/third/images/weather/19_9056c54.png)}.third-widget-weather .bg_img_20{background-image:url(/mobile/simple/static/third/images/weather/20_7232d8b.png)}.third-widget-weather .bg_img_21{background-image:url(/mobile/simple/static/third/images/weather/21_d5580a3.png)}.third-widget-weather .bg_img_22{background-image:url(/mobile/simple/static/third/images/weather/22_7f56505.png)}.third-widget-weather .bg_img_23{background-image:url(/mobile/simple/static/third/images/weather/23_e930773.png)}.third-widget-weather .bg_img_24{background-image:url(/mobile/simple/static/third/images/weather/24_ef149b7.png)}.third-widget-weather .bg_img_25{background-image:url(/mobile/simple/static/third/images/weather/25_d444d31.png)}{%/style%}{%$weather = $data.weather%}
<div class="third-widget-weather">
{%if $weather.status == 1%}
<div class="error">抱歉，无法查询{%$data.city|f_escape_xml%}的天气</div>
{%else%}
<div class="tabs">
<div class="tab left active" id="today_btn">今天</div>
<div class="tab" id="week_btn">五天预报</div>
</div>
<div class="detail_today" style="display:none;">
<div class="content weather">
<div class="w_title city">
<span class="city_cur" id="current-city" data-city={%$weather.city|f_escape_xml%} data-code={%$data.code|f_escape_xml%}>{%$weather.city|f_escape_xml%}</span>
<span class="switch">[切换]</span>
</div>
<div class="detail">
<div class="d1">
<div class="left" style="{%if $weather.today.temp=='-'%}padding-top:30px;{%/if%}">
{%if $weather.today.temp!='-'%}
<div class="t">
<span id="t_now">{%$weather.today.temp|f_escape_xml%}</span>℃</div>
{%/if%}
<div class="t_small">
<span id="t_max">{%$weather.today.temp_max|f_escape_xml%}</span>℃<span class="t_space">/</span>
<span id="t_min">{%$weather.today.temp_min|f_escape_xml%}</span>℃</div>
<div class="t_small">
{%$weather.today.update_time|f_escape_xml%}更新</div>
</div>
<div class="right">
<div class="bg bg1 bg_img_{%$weather.today.weather_icon|f_escape_xml%}"></div>
<div class="bg_text">{%$weather.today.weather|f_escape_xml%}</div>
</div>
</div>
</div>
</div>
{%if $weather.today.pm25%}
<div class="content pm2_5">
<div class="w_title">PM 2.5</div>
<div class="detail">
<div class="d1">
<div class="left">
<div class="t" id="pm_val">{%$weather.today.pm25|f_escape_xml%}</div>
<div class="t_small t_end" id="pm_text">
{%if $weather.today.pm25_state == '0'%}
健康{%else%}
不健康{%/if%}
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
<span class="city_cur">{%$weather.city|f_escape_xml%}</span>
<span class="switch">[切换]</span>
</div>
{%for $i = 0; $i < count($weather.week);  $i++ %}
<div class="w_con">
<span class="box day">{%$weather.week[$i].day|f_escape_xml%}</span>
<span class="box  bg_img_{%$weather.week[$i].weather_icon|f_escape_xml%} icon"></span>
<span class="box deg">{%$weather.week[$i].temp_max|f_escape_xml%}℃/{%$weather.week[$i].temp_min|f_escape_xml%}℃</span>
</div>
{%/for%}
</div>
</div>
{%/if%}
</div>
{%script%}
require("third:widget/weather/weather.js").init();
{%/script%}