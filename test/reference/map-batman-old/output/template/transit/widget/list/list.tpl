{%style id="/widget/list/list.inline.less"%}/*
 * @file 公交方案页样式
 * author: nichenjian@baidu.com
 * date: 2013/07/31
 */
.date-box {
  position: absolute;
  top: 50%;
  z-index: 1000;
  left: -1000px;
  margin-left: -130px;
  width: 260px;
  background: #282828;
  color: #fff;
}
.date-box-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: 999;
}
.date-box .hd {
  line-height: 48px;
  padding-left: 8px;
  color: #38add7;
  border-bottom: 1px solid #38add7;
  margin-bottom: 3px;
}
.date-box .bd {
  height: 144px;
  overflow: hidden;
  padding: 0 8px;
  position: relative;
}
.date-box .bd li {
  line-height: 48px;
  font-size: 16px;
}
.date-box .bd .ymd,
.date-box .bd .h,
.date-box .bd .m {
  position: absolute;
  height: 100%;
  top: 0px;
}
.date-box .ft {
  line-height: 48px;
  border-top: 1px solid #3e3e3e;
  text-align: center;
  margin-top: 3px;
}
.date-box .bd .ymd {
  width: 100px;
  text-align: left;
  left: 0;
  text-indent: 28px;
}
.date-box .bd .h {
  width: 80px;
  left: 100px;
  text-align: center;
}
.date-box .bd .m {
  right: 0;
  width: 80px;
  text-align: left;
  text-indent: 27px;
}
.date-box .bd .l1,
.date-box .bd .l2,
.date-box .bd .l3,
.date-box .bd .l4,
.date-box .bd .l5,
.date-box .bd .l6 {
  position: absolute;
  left: 26px;
  width: 46px;
  height: 1px;
  background: #38add7;
  top: 47px;
}
.date-box .bd .l1,
.date-box .bd .l2 {
  width: 60px;
}
.date-box .bd .l2,
.date-box .bd .l4,
.date-box .bd .l6 {
  top: 96px;
}
.date-box .bd .l3,
.date-box .bd .l4 {
  left: 117px;
}
.date-box .bd .l5,
.date-box .bd .l6 {
  left: 191px;
}
.date-box .bd [name="hmsp"] {
  position: absolute;
  left: 173px;
  top: 50%;
  margin-top: -8px;
}
.transit-widget-list {
  /* 公交 驾车 通用样式 start */

  /* 公交 驾车 通用样式 end */

  /** 修复pad下 名称较短的问题 **/

  /*日期选择器*/

}
.transit-widget-list .bus-list-item.stop dt,
.transit-widget-list .bus-list-item.stop dd,
.transit-widget-list .bus-list-item.stop span {
  color: #acacac;
}
.transit-widget-list .bus-list-item.stop .bus-list-icon {
  background: #f1f1f1;
}
.transit-widget-list .bus-list-item.stop dt span {
  color: #fff;
  padding: 2px;
  background: #868383;
  border-radius: 4px;
  display: inline-block;
}
.transit-widget-list .bus-list li .mb {
  color: #e97605;
}
.transit-widget-list .bus-list li .sb {
  color: #029c11;
}
.transit-widget-list .route-tips {
  text-align: left;
  line-height: 1.5;
  position: relative;
  padding: 20px 0 20px 35px;
  margin: 0 15px;
  font-size: 16px;
}
.transit-widget-list .route-tips em {
  width: 28px;
  height: 26px;
  position: absolute;
  top: 50%;
  margin-top: -15px;
  left: 0;
  display: inline-block;
  vertical-align: middle;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqRJREFUeNq8ll2LUkEcxnUkRHHVvVA2VnyBIFasdiUT9qYbve6qmyLqA/QBossu+gR9gagulq661oIgBDNsK3EJAjFdSgJXPaRIHu15bGYx8eUcsR44zJw5M79nZs7M/Mfa6/VGlgXq9/sf6vX6SaVS2UQaG41GNpZbrVY9EAiUIpHICdJNu91+aRHHOs+o1WrlisWio1qt7lkMKBQKvY/H4z2v17tv1KhbKBQOS6WSanA8HA6f67r+GuZvkeostEGAXkFyVQhxHUXbLI/FYrlEInEB2Y25RpiWb9ls9gem6CJeO2A+BPzZL2jRaM5AML0J0/t4dWMqP6ZSKR+m9+wso24mk/kiTY5Qfrvdbn+1mJDb7d52Op1Pkd2hWTqdPoe8k9+EqpTP5w+VSafTuWbWhEK7Y7Ylgywy1bexUbPZfFMul/lPWhxJt9vtWFYU25JBFplknxphdbmY4p88MDCSu3i+y2emyCBrki3Qg3e1Wm0X+QrcDyxrkmRVyKaHwD75yQ9Ywgdq6a5DZJHJPD0EdryfL4PB4JVBRlum1WUVFZMeotFo7LADmqYdGTRqTRnOlWTq9FDLW1u2KSdUnTKcK8nU/tpHJmR46ialjDZ4jJgc0VIjyRyfecLv93/mGelyuc6vMKqFkkwbPUQ4HG5I95QJIwIeGRjRmEkPgcD159AT4obB6bu17GRQ00Ym8/QQOG0vM2jhPcijfl0bVrKCZNNjvBgYGWUwu+fxeIJLGE/wbMlnpsgga5ItpPt+NBrNMetwOB6jB+5VR8K2ZJBFpgrtp/somUzuMlgxaCGAvWAQM2vCNmyrAh+Z0/to3BmGX2WGnr30+Xx3jCwQ1mFdtlEmZKnoOu9yoiEyfpKB0PTlhNOFkSy+nPzv69Y/uUD+FmAA8H+P5i5rrB4AAAAASUVORK5CYII=") no-repeat;
}
.transit-widget-list .route-tips a {
  color: #00c;
  text-decoration: underline;
}
.transit-widget-list .route-cover {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: none;
  background: #000;
  filter: alpha(opacity=20);
  opacity: 0.2;
}
.transit-widget-list .select-scheme .down-icon {
  display: inline-block;
  width: 7px;
  height: 4px;
  margin-bottom: 3px;
  margin-left: 4px;
  background: url("data:image/gif;base64,R0lGODlhDgAHAJECAP39/TBbeP///wAAACH5BAEAAAIALAAAAAAOAAcAAAIQjI8oySHfzptxWmazytrlAgA7") 0 0 no-repeat;
  background-size: 7px 4px;
}
.transit-widget-list .bn-sel-panel {
  display: none;
  position: absolute;
  top: 39px;
  left: 50%;
  width: 124px;
  background-color: #F2F2F2;
  z-index: 1000;
  padding: 0px 1px;
  margin-left: -62px;
  font-size: 15px;
}
.transit-widget-list .bn-sel-panel .s-outer {
  height: 24px;
  overflow: hidden;
  position: absolute;
  width: 60px;
  top: -24px;
  left: 30px;
}
.transit-widget-list .bn-sel-panel .s-inner {
  -webkit-transform: rotate(45deg);
  height: 40px;
  width: 40px;
  position: absolute;
  left: 10px;
  top: 28px;
  background-color: #F2F2F2;
}
.transit-widget-list .bn-sel-panel .bus-sel {
  border-bottom: 1px dotted #a0a0a0;
}
.transit-widget-list .bn-sel-panel b {
  background: url(/static/transit/images/bus_nav_icon_6911995.png) no-repeat;
  background-size: 39px 50px;
  display: inline-block;
  width: 17px;
  height: 18px;
  margin-right: 7px;
  position: relative;
  top: 3px;
}
.transit-widget-list .bn-sel-panel .bus-sel-on,
.transit-widget-list .bn-sel-panel .nav-sel-on,
.transit-widget-list .bn-sel-panel .walk-sel-on {
  color: #8b8b8b;
}
.transit-widget-list .bn-sel-panel .bus-sel-off,
.transit-widget-list .bn-sel-panel .nav-sel-off,
.transit-widget-list .bn-sel-panel .walk-sel-off {
  color: #0c4da8;
}
.transit-widget-list .bn-sel-panel .bus-sel-on b {
  background-position: 0px 0px;
}
.transit-widget-list .bn-sel-panel .walk-sel-on b {
  background-position: 0px 0px;
}
.transit-widget-list .bn-sel-panel .bus-sel-off b {
  background-position: -22px 0px;
}
.transit-widget-list .bn-sel-panel .walk-sel-off b {
  background-position: -22px 0px;
}
.transit-widget-list .bn-sel-panel .nav-sel-on b {
  background-position: 0px -34px;
}
.transit-widget-list .bn-sel-panel .nav-sel-off b {
  background-position: -22px -34px;
}
.transit-widget-list .bn-sel-panel ul li {
  height: 52px;
  line-height: 52px;
}
.transit-widget-list .bus-list-inner {
  background: #F2F2F2;
  height: 100%;
  overflow: hidden;
}
.transit-widget-list .bus-list-inner .hd {
  padding: 0;
  position: relative;
  font-size: 14px;
  margin-top: 5px;
  min-height: 50px;
  overflow: hidden;
}
.transit-widget-list .bus-list-inner .hd .wd {
  color: #333;
  font-size: 1.1em;
  margin: 4px 0 0 10px;
  float: left;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.transit-widget-list .pad .bus-list-inner .hd .wd {
  width: 200px;
}
.transit-widget-list .bus-list-inner .hd em {
  width: 10px;
  height: 10px;
  display: inline-block;
  margin: 0 5px;
  border-radius: 20px;
}
.transit-widget-list .bus-tabs-wrap {
  height: 43px;
  display: -webkit-box;
  -webkit-box-align: center;
  -webkit-box-sizing: border-box;
  border-bottom: 1px solid #d9d9d9;
  background-color: #f3f3f3;
}
.transit-widget-list .bus-tabs {
  width: 95%;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  top: 4px;
}
.transit-widget-list .bus-tab {
  display: -webkit-box;
  width: 33.3%;
  height: 36px;
  float: left;
  -webkit-box-sizing: border-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  position: relative;
}
.transit-widget-list .bus-tab a {
  color: #000;
  width: 100%;
  height: 100%;
  display: block;
  text-align: center;
  line-height: 37px;
}
.transit-widget-list .bus-tab s {
  height: 9px;
  width: 1px;
  background: #d2d2d2;
  display: inline-block;
  border-right-color: #ffffff;
  border-right-width: 1px;
  border-right-style: solid;
  right: -2px;
  top: 14px;
  position: absolute;
}
.transit-widget-list .bus-tab.active {
  /*    border: 1px solid #BED0E8;
        background-color: #DBE5F2;
        color: #0A50B1;*/

  background: #f9f9f9;
  border: 1px solid #bfbfbf;
  border-bottom: none;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  position: relative;
}
.transit-widget-list .bus-tab.active a {
  color: #2e76d7;
}
.transit-widget-list .bus-tabs li:last-child s,
.transit-widget-list .bus-tabs li.active > s {
  width: 0px;
  border: 0px;
}
.transit-widget-list .bus-title {
  margin: 0px 20px;
  overflow: hidden;
  clear: both;
}
.transit-widget-list .bus-title .clear {
  height: 100%;
  overflow: hidden;
}
.transit-widget-list .bus-title .start,
.transit-widget-list .bus-title .end {
  width: 50%;
  display: block;
  float: left;
  margin-top: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-width: 100px;
}
.transit-widget-list .bus-title .ext {
  font-size: 0.8em;
  color: #818181;
  padding-top: 4px;
  margin: 4px 0 12px 0;
}
.transit-widget-list .bus-list li {
  display: -webkit-box;
  -webkit-box-align: center;
  padding: 0.2em 1.2em;
  min-height: 4.5em;
  border: 1px solid #fff;
  border-bottom-color: #d9d9d9;
  color: #606060;
  background-color: #F9F9F9;
  line-height: 1.4em;
}
.transit-widget-list .bus-list li.active {
  background-color: #F4F4F4;
}
.transit-widget-list .bus-list a:first-child li {
  border-top: 1px solid #D9D9D9;
}
.transit-widget-list .bus-list a:last-child li {
  border-bottom: 1px solid #D9D9D9;
}
.transit-widget-list .bus-list-icon {
  height: 1.7em;
  display: inline-block;
  line-height: 1.7em;
  position: relative;
  margin-right: 5px;
  color: #0c4da8;
  left: -10px;
  background: #e3f1fa;
  border-radius: 12px;
  padding: 0px 2px;
}
.transit-widget-list .bus-gt {
  width: 10px;
  height: 13px;
  display: inline-block;
  background: url("data:image/gif;base64,R0lGODlhDgAYAMQRAPv7+/r6+vf39+vr6+bm5ujo6Ozs7NnZ2eTk5Nra2t3d3erq6uHh4djY2PT09P39/dfX1////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAAOABgAAAVVYBQ9YmmWReOc5wBBKlsaL7zK0VLHuP7yMp8Nl9vdgkaiEMhaHptJGeBQI0gVNQbpBMC+tKxudmsSf8klMwR8CnjXaJF7zJqfZQi6TJCAEyMCC3EnIQA7") 0 0 no-repeat;
  background-size: 8px 12px;
}
.transit-widget-list .bus-list dl dt,
.transit-widget-list .bus-list dl dd {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.transit-widget-list .bus-list dl {
  -webkit-box-flex: 1;
}
.transit-widget-list .bus-list dl dt {
  color: #3E3D3D;
}
.transit-widget-list .bus-list dl dd {
  color: #676767;
  font-size: .85em;
}
.transit-widget-list .bus-list dt em {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
}
.transit-widget-list .bus-taxi {
  text-align: center;
  color: #676767;
  margin: 14px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-width: 300px;
}
.transit-widget-list #bus-list-wrap {
  padding-bottom: 10px;
}
.transit-widget-list .bus-list-inner .hd .start em,
.transit-widget-list .bus-list-inner .hd .end em {
  width: 15px;
  height: 22px;
  display: inline-block;
  background: url(/static/transit/images/line_4d3443a.png) no-repeat;
  background-size: 15px 123px;
  float: left;
  margin-top: 0px;
}
.transit-widget-list .bus-list-inner .hd .start em {
  background-position: 0 -81px;
  height: 21px;
}
.transit-widget-list .bus-list-inner .hd .end em {
  background-position: 0 -102px;
}
.transit-widget-list .bus-notice {
  color: #676767;
  margin-top: 14px;
  word-break: break-all;
  text-align: center;
}
.transit-widget-list .bus-selector {
  margin-bottom: 8px;
}
.transit-widget-list .bus-selector:after {
  display: table;
  line-height: 0;
  content: "";
  clear: both;
}
.transit-widget-list .bus-selector .start-time {
  float: left;
  width: 52%;
}
.transit-widget-list .bus-selector .start-time .drop,
.transit-widget-list .bus-selector .bus-tools .drop {
  border: 1px solid #c9c9c9;
  border-radius: 3px;
  margin-left: 8px;
  position: relative;
  overflow: hidden;
}
.transit-widget-list .bus-selector .start-time .drop .text {
  height: 28px;
  line-height: 28px;
  display: block;
  text-indent: 5px;
  background: #fff;
}
.transit-widget-list .bus-selector .start-time .drop input {
  position: absolute;
  top: 0;
  height: 26px;
  right: 0;
  left: 0;
  border: none;
  -webkit-appearance: none;
}
.transit-widget-list .bus-selector .bus-tools .drop {
  margin-right: 8px;
}
.transit-widget-list .bus-selector .start-time .drop em,
.transit-widget-list .bus-selector .bus-tools .drop em {
  position: absolute;
}
.transit-widget-list .bus-selector .bus-tools {
  float: left;
  width: 48%;
}
.transit-widget-list .bus-selector .bus-tools .drop select {
  width: 100%;
  height: 28px;
  background: #fff;
}
.transit-widget-list .bus-selector s,
.transit-widget-list .bus-selector s {
  background: url('/static/transit/images/icons_5be91b8.png') no-repeat 0 -184px;
  background-size: 74px 220px;
  position: absolute;
  right: 7px;
  top: 12px;
  width: 9px;
  height: 5px;
  z-index: 1;
}
.transit-widget-list .bus-gt {
  width: 10px;
  height: 13px;
  display: inline-block;
  background: url("data:image/gif;base64,R0lGODlhDgAYAMQRAPv7+/r6+vf39+vr6+bm5ujo6Ozs7NnZ2eTk5Nra2t3d3erq6uHh4djY2PT09P39/dfX1////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAAOABgAAAVVYBQ9YmmWReOc5wBBKlsaL7zK0VLHuP7yMp8Nl9vdgkaiEMhaHptJGeBQI0gVNQbpBMC+tKxudmsSf8klMwR8CnjXaJF7zJqfZQi6TJCAEyMCC3EnIQA7") 0 0 no-repeat;
  background-size: 8px 12px;
}
{%/style%}{%* @file 公交列表页模板 *%}
<div id="bus-list-wrap" class="transit-widget-list">
    <div id="bus-list-inner" class="bus-list-inner">
        {%assign var="result" value=$data.result %}
        {%assign var="content" value=$data.content %}
        {%assign var="taxi" value=$data.taxi %}
        {%if ($result._state == 1) %}
            <div class="bus-tabs-wrap">
                <ul id="bus-tabs" class="bus-tabs">
                    {%foreach $result.strategies as $key => $item %}
                            {%if ($item.name=="不坐地铁")%}
                                {%continue%}
                            {%/if%}
                        <li class="bus-tab {%if ($result.sy == $key)%}active{%/if%}">
                            <a {%if ($result.sy != $key)%}href="{%$item.url%}"{%/if%} data-log="{code:{%$STAT_CODE.BUS_STRATEGY_CLICK%}, type:{%$key%}}">
                                {%$item.name%} 
                            </a>
                            <s></s>
                        </li>   
                    {%/foreach%}
                </ul>
            </div>
            <dl>
                <dt class="hd bus-title">
                    <div class="start">
                        <em></em><span class="wd">{%$result.start.wd%}</span>
                    </div>
                    <div class="end">
                        <em></em><span class="wd">{%$result.end.wd%}</span>
                    </div>
                </dt>
                <dd class="bus-selector">
                    <div class="start-time">                    
                        <div class="drop">
                            <span class="text"></span>  
                            <input type="datetime" class="needsclick" style="display: none;"> <s></s>                    
                        </div>                
                    </div>                
                    <div class="bus-tools">                    
                        <div class="drop">
                            <select id="takesubwayselect">                   
                                <option value="0">全部</option>
                                <option value="1">不坐地铁 </option>
                            </select><s></s> 
                        </div>           
                    </div>            
                </dd>
                <dd>
                    <ol class="bus-list">
                    {%foreach $content as $i => $value %}
                        {%assign var="item" value=$content[$i]['lines'][0] %}
                        {%if ($i < 5)%}
                        <a href="{%$item.url%}">
                            <li class="bus-list-item {%if ($item.tip == 3)%}stop{%/if%}">
                                <span class="bus-list-icon">0{%$i+1%}</span>
                                <dl>
                                    <dt>
                                        <em {%if ($item.tip == 3)%}style="max-width:78%"{%/if%}%}>
                                            {%$item.title%}
                                        </em>
                                        {%if ($item.tip == 3)%}
                                            <span>停运</span>
                                        {%/if%}
                                    </dt>
                                    <dd>
                                        {%if ($item.tip != 3)%}
                                            <span>{%$item.arriveTime%}</span>
                                        {%/if%}
                                        约{%$item.time%} / {%$item.distance%}
                                    </dd>
                                    {%if ($item.tip == 1)%}
                                        <dd class="sb">首班车没开的风险!</dd>
                                    {%/if%}
                                    {%if ($item.tip == 2)%}
                                        <dd class="mb">有错过末班车的风险!</dd>
                                    {%/if%}
                                </dl>
                                <em class="bus-gt"></em>
                            </li>
                        </a>
                        {%/if%}
                    {%/foreach%}
                    </ol>
                </dd>
                {%if $taxi.detail[0].totalPrice%}
                    <dd class="bus-taxi">
                        打车费用：{%$taxi.detail[0].totalPrice%}元（按驾车的最短路程计算）
                    </dd>
                {%/if%}
                <script type="text/javascript">
                    //first screen time. by jican
                    PDC && PDC.first_screen && PDC.first_screen();
                </script>
            </dl>
            <div id="transit-footer-ad" class="ad_area"></div>
        {%else%}
            <p class="route-tips">
                <em></em>
                {%if ($result._state == -1)%}
                    起点与终点距离较近，您可以查看<a class="bus-to-walk" href="{%$result.plans.walk%}">步行方案</a>，或者重新选择地点。
                {%elseif ($result._state == -2)%}
                    暂不支持跨城市公交，您可以查看<a class="bus-to-drive" href="{%$result.plans.drive%}" data-log="{code:{%$STAT_CODE.BUS_TO_DRIVE%}}">驾车方案</a>，或者重新选择地点。
                {%elseif ($result._state == 0)%}
                    未找到公交方案，您可以查看<a class="bus-to-drive" href='{%$result.plans.drive%}' data-log="{code:{%$STAT_CODE.BUS_TO_DRIVE%}}">驾车方案</a>，或者重新选择地点。
                {%/if%}
            </p>
        {%/if%}
        <div id="bus-cover" class="route-cover"></div>
    </div>
</div>

{%script%}
    var pageinfo = {
        result : {%json_encode($result)%}//查询result
    };
                var content = {
                content:{%json_encode($content)%}
            };
    (require("transit:widget/list/list.js")).init(pageinfo);
{%/script%}