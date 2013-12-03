{%style id="/widget/list/list.inline.less"%}/*
 * @fileoverview 地址选择页样式 选择器以addr开头
 * author: jican
 * date: 2013/01/22
 */
.addr-widget-list {
  background-color: #F2F2F2;
  height: 100%;
  overflow: hidden;
}
.addr-widget-list .addr-section {
  margin: 0.5em 5px;
}
.addr-widget-list .addr-title {
  display: -webkit-box;
  -webkit-box-align: center;
  font-weight: 700;
  padding: 0.5em 0.7em;
  font-size: 14px;
  color: #fff;
  border-radius: 3px 3px 0 0;
}
.addr-widget-list .addr-title .wd {
  color: #fff;
  font-size: 1.2em;
  display: block;
  -webkit-box-flex: 1;
}
.addr-widget-list .addr-section .addr-title {
  background-color: #e16e2b;
}
.addr-widget-list .addr-section.strict .addr-title {
  background-color: #3677D3;
  border-radius: 0;
}
.addr-widget-list .addr-section .addr-list {
  display: block;
}
.addr-widget-list .addr-section.strict .addr-list {
  display: none;
}
.addr-widget-list .addr-title-icon {
  width: 22px;
  height: 25px;
  display: -webkit-box;
  -webkit-box-align: start;
  -webkit-box-pack: center;
  margin-right: 0.5em;
  background: url(/static/addr/images/marker_bg_ae7a758.png) 0 0 no-repeat;
  background-size: 57px 27px;
}
.addr-widget-list .addr-section .addr-title-icon {
  background-position: -15px 0;
}
.addr-widget-list .addr-section.strict .addr-title-icon {
  background-position: -37px 0;
}
.addr-widget-list .addr-list {
  -webkit-border-radius: 0;
  background-color: white;
  border: 1px solid #cccccc;
  border-top: none;
  border-radius: 3px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.addr-widget-list .addr-list li {
  padding: 0 0.8em;
  border: 1px solid #fff;
  border-bottom-color: #e9e9e9;
  display: -webkit-box;
  -webkit-box-align: center;
  height: 3.3em;
  min-height: 3.3em;
  color: #606060;
}
.addr-widget-list .addr-list a:last-child li {
  border-bottom: 0;
}
.addr-widget-list .addr-list dl {
  -webkit-box-flex: 1;
}
.addr-widget-list .addr-list dl dt,
.addr-widget-list .addr-list dl dd {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.addr-widget-list .addr-list dl dt {
  color: #3e3d3d;
  font-weight: 700;
}
.addr-widget-list .addr-list dl dd {
  color: #676767;
  font-size: 0.85em;
}
.addr-widget-list .addr-city {
  padding: 12px 20px;
}
.addr-widget-list .addr-city dt {
  margin-bottom: 5px;
}
.addr-widget-list .addr-city a {
  display: inline-block;
  width: 30%;
  padding: 3px 0;
  text-decoration: underline;
  color: blue;
}
.addr-widget-list .addr-city-list li {
  -webkit-box-orient: vertical;
  -webkit-box-align: start;
  -webkit-box-pack: center;
  height: auto;
  min-height: 0;
  border: 1px solid #fff;
  border-bottom-color: #e9e9e9;
}
.addr-widget-list .addr-city-list li a {
  display: block;
  padding: 0.6em 0.72em;
}
.addr-widget-list .icon-addr {
  font-weight: bolder;
  color: #fff;
  display: -webkit-box;
  -webkit-box-pack: center;
  margin-right: 0.5em;
  width: 17px;
  height: 25px;
  background-size: 17px 25px;
  background-image: url(/static/addr/images/gohere_new_a07c932.png);
  background-repeat: no-repeat;
  background-position: 0 0;
}
.addr-widget-list .addr-none {
  padding: 0.5em;
}
{%/style%}<div id="addr-inner" class="addr-widget-list" data-log="{code:{%$STAT.WLAN_BUS_DETAIL%}}">
    {%assign var="content"  value=$data.listData %}
    {%assign var="citylist" value=$data.cityList %}
    {%assign var="result"   value=$data.result %}
    {%assign var="morecity" value=$data.moreCity %}
    {%foreach $content as $i => $temp %}
        {%if $temp.sure%}
            {%assign var="sure" value="strict"%}
        {%else%}
            {%assign var="sure" value=""%}
        {%/if%}
        {%assign var="item"   value=$temp.data%}
        {%assign var="city"   value=$citylist[$i]%}
        {%assign var="more"   value=$morecity[$i]%}
        {%assign var="myChar" value=['A','B','C','D','E','F','G','H','I','J']%}
        <div id="addr-section-{%$i%}" class="addr-section {%$sure%}">
            <div class='addr-title'>
                <span class="addr-title-icon"></span>
                {%if $i %}终点：{%else%}起点：{%/if%}
                <span id="addr-wd-{%$i%}" class="wd">{%$temp.word%}</span>
            </div>
            {%if (!$city) %}
                {%if ($item && count($item)>0) %}
                    <ol class='addr-list'>
                        {%foreach $item as $k => $value %}
                        {%if $k < 10%}
                        <a href="{%$value.url%}">
                            <li class="addr-poi-link">
                                <span class='icon-addr'>{%$myChar[$k]%}</span>
                                <dl>
                                    <dt>{%$value.name%}</dt>
                                    <dd>{%$value.addr%}</dd>
                                </dl>
                            </li>
                        </a>
                        {%/if%}
                        {%/foreach%}
                    </ol>
                {%else%}
                    {%if ($sure != 'strict')%}
                        <p class="addr-none">未找到相关地点，您可更换关键词再尝试。</p>
                    {%/if%}
                {%/if%}
            {%else%}
                {%if ($more==1)%}
                    <ol class='addr-city-list'>
                        {%foreach $item as $k => $value%}
                            <li class="addr-city-link">
                                <a href="{%$value.url%}">
                                    <span>{%$value.name%}</span>
                                    <span>{%$value.num%}</span>
                                </a>
                            </li>
                        {%/foreach%}
                    </ol>
                {%else%}
                    <dl id="addr_city_{%$i%}" class="addr-city">
                        <dt>在以下城市有结果，请选择城市：</dt>
                        <dd>
                            {%for $j=0; $j<6; $j++%}
                                <a href="{%$item[$j].url%}" class="addr-city-link">
                                    {%$item[$j].name%}
                                </a>
                            {%/for%}
                            {%if count($item)>1 %}
                                <a href="{%$data.moreCityUrl[$i]%}" class="addr-city-link">
                                    更多城市
                                </a>
                            {%/if%}
                        </dd>
                    </dl>
                {%/if%}
            {%/if%}
        </div>
    {%/foreach%}
</div>