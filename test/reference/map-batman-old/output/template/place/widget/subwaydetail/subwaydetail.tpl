{%style id="/widget/subwaydetail/subwaydetail.inline.less"%}.place-widget-subwaydetail {
  /*公交车详情页面*/

  /* 模块公共样式 */

}
.place-widget-subwaydetail dl dt a {
  display: block;
}
.place-widget-subwaydetail .res .hd_place {
  padding: 0px;
  position: relative;
  background: #F2F2F2;
  /*border-bottom: 1px solid #d9d9d9;*/

  font-size: 14px;
  padding: 10px 0;
}
.place-widget-subwaydetail .poi_binfo {
  margin: 5px 0px;
}
.place-widget-subwaydetail .line_info_tab {
  width: 100%;
  color: #6A6A6A;
}
.place-widget-subwaydetail .line_info_tab td {
  border-bottom: 1px solid #D1D1D1;
  border-top: 1px solid #F1F1F1;
}
.place-widget-subwaydetail .line_info_tab tr:first-child td {
  border-top: none;
}
.place-widget-subwaydetail .line_info_tab tr:last-child td {
  border-bottom: none;
}
.place-widget-subwaydetail .line_info_tab td {
  width: 50%;
  font-weight: normal;
  padding: 0.429em 1em;
  text-align: left;
  vertical-align: top;
}
.place-widget-subwaydetail .poi_icon {
  background: url(/static/place/images/place_b6c3cdf.png) no-repeat;
  background-size: 114px 60px;
  display: inline-block;
  vertical-align: -2px;
}
.place-widget-subwaydetail .info_mod {
  margin: 0.535em 0 0;
  -webkit-border-radius: 0.25em;
  /*-webkit-border-radius:0.25em;*/

  padding: 1px;
  border: 1px solid #d9d9d9;
  -webkit-box-shadow: inset 0 0 2px #fff;
  /*background-color:#EAEAEA;*/

  background-color: white;
  color: #606060;
}
.place-widget-subwaydetail .info_mod a {
  color: #4c4c4c;
  text-decoration: none;
  font-size: 1em;
}
.place-widget-subwaydetail #detail-line-info {
  margin-top: 10px;
}
.place-widget-subwaydetail #detail-line-title .titl {
  font-size: 16px;
  color: black;
  position: relative;
  margin-left: 30px;
}
.place-widget-subwaydetail #detail-line-title .sw {
  display: block;
  height: 39px;
  color: #353535;
  position: relative;
  padding: 0px 0px 0px 10px;
  border: 1px solid #cccccc;
  border-radius: 3px;
  margin: 5px 0px 0px;
  line-height: 35px;
  background-color: #fff;
}
.place-widget-subwaydetail #detail-line-title span {
  vertical-align: middle;
  padding-left: 5px;
}
.place-widget-subwaydetail #detail-line-title .go_sw {
  width: 16px;
  height: 39px;
  display: inline-block;
  vertical-align: middle;
  background: url(/static/place/images/go_sw_5358b49.png) 0 no-repeat;
  background-size: 16px 18px;
}
.place-widget-subwaydetail #detail-line-info div.poi_binfo {
  border: 1px solid #cccccc;
  border-radius: 3px;
  backgroud-color: white;
  color: #767676;
}
.place-widget-subwaydetail #detail-line-info div.poi_binfo table tr {
  padding: 4px;
}
.place-widget-subwaydetail #detail-line-info div.poi_binfo table {
  line-height: 27px;
  background: white;
  color: #484848;
}
.place-widget-subwaydetail #detail-line-stop.info_mod {
  background: white;
  border: 1px solid #cccccc;
  color: #606060;
  margin-bottom: 0.5em;
}
.place-widget-subwaydetail #detail-line-stop.mod_poidtl_list .title {
  height: 33px;
  text-indent: 0.786em;
  line-height: 33px;
  background: white;
  padding: 5px 44px 5px 0em;
  border-bottom: 2px solid #cccccc;
}
.place-widget-subwaydetail #detail-line-stop.mod_poidtl_list li {
  border-bottom: 1px solid #e9e9e9;
  border-top: 0px;
}
.place-widget-subwaydetail #detail-line-stop.mod_poidtl_list em.no {
  margin-top: 13px;
}
.place-widget-subwaydetail #detail-line-stop.mod_poidtl_list .list.s8 li {
  background-color: white;
}
.place-widget-subwaydetail #detail-line-stop.mod_poidtl_list .list.s8 li:last-child {
  border-bottom: 0px;
}
{%/style%}{%* 地铁站详情页面 *%}
<div id="detail-list" class="place-widget-subwaydetail">
    <div id="poiLineDtl" class="result" style="display: block;">
        <div class="res poi">
            <div id="detail-line-title">
                {%if ($widget_data.subwayHref)%}
                <a class="sw" href="{%$widget_data.subwayHref%}">
                    <span class="go_sw"></span>
                    <span style="color:#606060">地铁专题图</span>
                </a>
                {%/if%}
            </div>
            <div id="detail-line-info" class="bd">
                <div class="poi_binfo">
                    <table class="line_info_tab" cellpadding="0" cellspacing="0">
                        <tbody>
                             <tr>
                                <td>起点站首车时间</td>
                                <td>{%$widget_data.startTime%}</td>
                            </tr>
                            <tr>
                                <td>起点站末车时间</td>
                                <td>{%$widget_data.endTime%}</td>
                            </tr>
                            <tr>
                                <td>单程最高票价</td>
                                <td>{%$widget_data.maxPrice%}</td>
                            </tr>
                            <tr>
                                <td>是否月票有效</td>
                                <td>{%$widget_data.isMonTicket%}</td>
                            </tr>
                            <tr>
                                <td>所属公司</td>
                                <td>{%$widget_data.company%}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {%if isset($widget_data.stations)%}
            <div id="detail-line-stop" class="info_mod mod_poidtl_list">
                <div class="title">途经站：</div>
                <ol class="list s8 stop_list">
                    {%foreach  $widget_data.stations as $index=>$data%}                  
                        <li>
                            <em class="no">{%$data.no%}</em>
                            <dl>
                                <dt>
                                     <a href="{%$data.href%}">{%$data.name%} </a>
                                </dt>
                            </dl>
                        </li>                  
                    {%/foreach%}
                </ol>
            </div>
            {%/if%}
        </div>
    </div>
</div>