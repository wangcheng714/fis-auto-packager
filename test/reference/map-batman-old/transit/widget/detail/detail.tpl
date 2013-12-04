
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