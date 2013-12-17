{%style id="/widget/linedetail/linedetail.inline.less"%}.place-widget-linedetail{}.place-widget-linedetail #detail-line-stop ol li dl dt a{display:block}.place-widget-linedetail .res .hd_place{padding:0;position:relative;background:#F2F2F2;font-size:14px;padding:10px 0}.place-widget-linedetail .poi_binfo{margin:5px 0}.place-widget-linedetail .line_info_tab{width:100%;color:#6A6A6A}.place-widget-linedetail .line_info_tab td{border-bottom:1px solid #D1D1D1;border-top:1px solid #F1F1F1}.place-widget-linedetail .line_info_tab tr:first-child td{border-top:0}.place-widget-linedetail .line_info_tab tr:last-child td{border-bottom:0}.place-widget-linedetail .line_info_tab td{width:50%;font-weight:400;padding:.429em 1em;text-align:left;vertical-align:top}.place-widget-linedetail .poi_icon{background:url(/static/place/images/place_b6c3cdf.png) no-repeat;background-size:114px 60px;display:inline-block;vertical-align:-2px}.place-widget-linedetail .info_mod{margin:.535em 0 0;-webkit-border-radius:.25em;padding:1px;border:1px solid #d9d9d9;-webkit-box-shadow:inset 0 0 2px #fff;background-color:#fff;color:#606060}.place-widget-linedetail .info_mod a{color:#4c4c4c;text-decoration:none;font-size:1em}.place-widget-linedetail #detail-line-info{margin-top:10px}.place-widget-linedetail #detail-line-title .titl{font-size:16px;color:#000;position:relative;margin-left:30px}.place-widget-linedetail #detail-line-title .sw{display:block;height:39px;color:#353535;position:relative;padding:0 0 0 10px;border:1px solid #ccc;border-radius:3px;margin:5px 0 0;line-height:35px;background-color:#fff}.place-widget-linedetail #detail-line-title span{vertical-align:middle;padding-left:5px}.place-widget-linedetail #detail-line-title .go_sw{width:16px;height:39px;display:inline-block;vertical-align:middle;background:url(/static/place/images/go_sw_c8ca2c7.png) 0 no-repeat;background-size:16px 18px}.place-widget-linedetail #detail-line-info div.poi_binfo{border:1px solid #ccc;border-radius:3px;backgroud-color:#fff;color:#767676}.place-widget-linedetail #detail-line-info div.poi_binfo table tr{padding:4px}.place-widget-linedetail #detail-line-info div.poi_binfo table{line-height:27px;background:#fff;color:#484848}.place-widget-linedetail #detail-line-stop.info_mod{background:#fff;border:1px solid #ccc;color:#606060;margin-bottom:.5em}.place-widget-linedetail #detail-line-stop.mod_poidtl_list .title{height:33px;text-indent:.786em;line-height:33px;background:#fff;padding:5px 44px 5px 0;border-bottom:2px solid #ccc}.place-widget-linedetail #detail-line-stop.mod_poidtl_list li{border-bottom:1px solid #e9e9e9;border-top:0}.place-widget-linedetail #detail-line-stop.mod_poidtl_list em.no{margin-top:13px}.place-widget-linedetail #detail-line-stop.mod_poidtl_list .list.s8 li{background-color:#fff}.place-widget-linedetail #detail-line-stop.mod_poidtl_list .list.s8 li:last-child{border-bottom:0}{%/style%}{%* 公交车详情页面 *%}
<section id="detail-list" class="place-widget-linedetail">
<div id="poiLineDtl" class="result" style="display: block;">
<div class="res poi">
<div id="detail-line-info" class="bd">
<div class="poi_binfo">
<table class="line_info_tab" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td>起点站首车时间</td>
<td>{%$widget_data.startTime|f_escape_xml%}</td>
</tr>
<tr>
<td>起点站末车时间</td>
<td>{%$widget_data.endTime|f_escape_xml%}</td>
</tr>
<tr>
<td>单程最高票价</td>
<td>{%$widget_data.maxPrice|f_escape_xml%}</td>
</tr>
<tr>
<td>是否月票有效</td>
<td>{%$widget_data.isMonTicket|f_escape_xml%}</td>
</tr>
<tr>
<td>所属公司</td>
<td>{%$widget_data.company|f_escape_xml%}</td>
</tr>
</tbody>
</table>
</div>
</div>
{%if isset($widget_data.stations)%}
<div id="detail-line-stop" class="info_mod mod_poidtl_list">
<div class="title">途经站：</div>
<ol class="list s8 stop_list">
{%foreach $widget_data.stations as $index=>$data%}
<li><em class="no">{%$data.no|f_escape_xml%}</em><dl>
<dt><a href="{%$data.href|f_escape_xml%}">{%$data.name|f_escape_xml%}</a></dt>
</dl>
</li>
{%/foreach%}
</ol>
</div>
{%/if%}
</div>
</div>
</section>