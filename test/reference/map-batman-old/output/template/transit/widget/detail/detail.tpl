{%style id="/widget/detail/detail.inline.less"%}/*
 * @fileoverview 公交方案详情 选择器以bus-detail开头
 * author: jican
 * date: 2013/01/22
 */
.transit-widget-detail .route-hd-wd p {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  width: 48%;
}
.transit-widget-detail .route-hd-wd p.sta {
  text-align: right;
}
.transit-widget-detail .route-hd-wd p.end {
  text-align: left;
}
.transit-widget-detail .bus-table-box {
  margin: 0 6px 20px 6px;
}
.transit-widget-detail .bus-detail-inner {
  height: 100%;
  overflow: hidden;
}
.transit-widget-detail .bus-detail {
  width: 100%;
}
.transit-widget-detail .bus-detail thead td {
  padding: 14px 0;
}
.transit-widget-detail .bus-detail a.link {
  color: #676767;
}
.transit-widget-detail .bus-detail a a {
  color: #00c;
  text-decoration: underline;
}
.transit-widget-detail .bus-detail .sum {
  font-size: 0.86em;
  color: #676767;
}
.transit-widget-detail .bus-detail .bus-nav {
  font-size: 13px;
  color: #2f2e2e;
}
.transit-widget-detail .send-phone {
  font-size: 3;
  background: -webkit-gradient(linear, 0 0, 0 63%, from(#8cbddc), to(#8cbddc));
  -webkit-border-radius: 6px;
  background-size: 14px 35px;
  background-position: 0 -17px;
  height: 43px;
  line-height: 46px;
  text-align: center;
  border: 1px solid #96b2d9;
  margin: 24px 22% 5px 22%;
}
.transit-widget-detail .send-phone a {
  color: #ffffff;
  position: relative;
  left: -5px;
}
.transit-widget-detail .send-phone-icon {
  background: url('/static/transit/images/sendicon_c32c5f9.png') no-repeat;
  background-size: 38px 49px;
  background-position: 0px -3px;
  width: 38px;
  height: 49px;
  margin: 0 6px 0 0;
  margin-bottom: -21px;
}
.transit-widget-detail .bus-detail th {
  width: 38px;
  font-size: 13px;
  font-weight: normal;
  color: #5c5c5c;
}
.transit-widget-detail .bus-detail tbody {
  background-color: #fff;
  border: 1px solid #dbdbdb;
}
.transit-widget-detail .bus-detail tbody th {
  background-color: #f6f9fb;
}
.transit-widget-detail .bus-icon,
.transit-widget-detail .bus-list-inner .hd .start em,
.transit-widget-detail .bus-list-inner .hd .end em {
  width: 17px;
  height: 16px;
  display: inline-block;
  background: url(/static/transit/images/line_4d3443a.png) no-repeat;
  background-size: 15px 123px;
  margin-top: 8px;
}
.transit-widget-detail .bus-icon.type-0 {
  background-position: 0 -33px;
}
.transit-widget-detail .bus-icon.type-1 {
  background-position: 0 -16px;
}
.transit-widget-detail .bus-detail tbody tr {
  border-bottom: 1px solid #DBDBDB;
  line-height: 25px;
}
.transit-widget-detail .bus-detail tbody td {
  color: #676767;
  padding: 12px 5px 12px 15px;
}
.transit-widget-detail .bus-detail b {
  color: #404040;
}
.transit-widget-detail .bus-other-line {
  color: blue;
  text-decoration: underline;
}
.transit-widget-detail .bus-detail .mb,
.transit-widget-detail .bus-detail .sb {
  padding: 0 4px;
  color: #ffba31;
  background-image: url('/static/transit/images/alert_8747832.png');
  background-repeat: no-repeat;
  background-size: 16px 12px;
  padding-left: 20px;
  background-position: 0 6px;
}
{%/style%}
<div id="bus-detail-inner" class="bus-detail-inner transit-widget-detail">
    {%$content = $data.content%}
    {%$result  = $data.result%}
    {%$taxi    = $data.taxi%}
    {%$detail  = $content.detail%}
    <div class="bus-table-box">
        <table class="bus-detail">
            <thead>
                <tr>
                    <th>0{%$content.index+1%}</th>
                    <td>
                        <div class="bus-nav">{%$content.title%}</div>
                        <div class="sum">
                         {%if ($content.tip != 3 && $content.arriveTime!="")%}
                              {%$content.arriveTime%}
                         {%/if%}
                            约{%$content.time%} / {%$content.distance%}
                         {%if ($content.tip == 1)%}
                             ，首班车没开的风险
                         {%/if%}
                         {%if ($content.tip == 2)%}
                             ，有错过末班车的风险
                         {%/if%}
                         {%if ($content.tip == 3)%}
                             ， 出发时有车辆已停运
                         {%/if%}
                        </div>
                    </td>
                </tr>
            </thead>
            <tbody>
                {%foreach $detail as $i => $temp%}
                    <tr>
                        {%if ($temp.type==11)%}
                            {%if ($temp.line)%}
                                <th><em class="bus-icon type-{%$temp.type%}"></em></th>
                                <td>
                                    <a href="{%$temp.url%}" class="link">
                                    步行{%$temp.dis%}, 换乘<b>{%$temp.line%}</b>。
                                    </a>
                                </td>
                            {%else%}
                                <th><em class="bus-icon type-{%$temp.type%}"></em></th>
                                <td>
                                    <a href="{%$temp.url%}" class="link">
                                    步行{%$temp.dis%}, 到达<b>{%$temp.stop%}</b>。
                                    </a>
                                </td>
                            {%/if%}
                        {%else%}
                            {%if ($temp.line !="")%}
                                <th><em class="bus-icon type-{%$temp.type%}"></em></th>
                                <td>
                                    <a href="{%$temp.url%}" class="link">
                                    乘坐<b>{%$temp.line%}</b>
                                    {%if ($temp.other && count($temp.other)>0)%}
                                        (或: 
                                            {%foreach $temp.other as $j => $value%}
                                            {%if ($j!=0)%},{%/if%}
                                                {%$value.n%}
                                            {%/foreach%}
                                        )
                                    {%/if%}
                                    , 经过{%$temp.num%}站, 
                                    在<b>{%$temp.stop%}</b>下车。{%$temp.exit%}
                                    {%if ($temp.tip == 1) %}
                                        <em class="sb">首班发车 {%$temp.startTime%}</em>
                                    {%/if%}
                                    {%if ($temp.tip == 2)%}
                                        <em class="mb">末班发车 {%$temp.endTime%}</em>
                                    {%/if%}
                                    </a>
                                </td>
                            {%/if%}
                        {%/if%}
                    </tr>
                {%/foreach%}
            </tbody>
        </table>
        <script type="text/javascript">
            //添加首屏统计时间 by jican
            PDC && PDC.first_screen && PDC.first_screen();
        </script>
        {%if ($result._platform == 'android')%}
            <div class="send-phone">
                <em class="send-phone-icon"></em>
                <a href='' id="share-to-friends">分享给好友</a>
            </div>
        {%/if%}
    </div>
</div>