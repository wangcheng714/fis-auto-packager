{%* @file 步行列表页模板 *%}
{%$result  = $data.result%}
{%$content = $data.content%}
{%$taxi    = $data.taxi%}
<div id="walk-inner" class="walk-inner walk-widget-list">
    {%if ($result._state>0)%}
        {%$start = $result.start%}
        {%$end   = $result.end[count($result.end)-1]%}
        {%$route = $content.routes[0]%}
        {%$legs  = $route.legs%}
        <dl>
            <dt class="hd walk-title">
                <div class="clear">
                    <div class="start">
                        <em></em><span class="wd">{%$start.wd%}</span>
                    </div>
                    <div class="end">
                        <em></em><span class="wd">{%$end.wd%}</span>
                    </div>
                </div>
                <div class="ext">{%$legs[0].duration%}/约{%$legs[0].distance%}
                    {%if $taxi.detail[0]['total_price']%}
                        /打车约{%$taxi.detail[0]['total_price']%}元
                    {%/if%}
                    </div>
            </dt>
            <dd class="walk-list-wrap">
                <p class="walk-tip">百度提醒您：步行功能正在测试中，请以道路实际情况为准。</p>
            </dd>
            <dd class="walk-list-wrap">
                <ol class="walk-list">
                {%$count = 0%}
                {%foreach $legs as $i => $leg%}
                    {%$steps = $leg.steps%}
                    {%$count = $count + count($steps)%}
                    {%foreach $steps as $j => $step %}
                        {%$number = (($i&&1*$count) + $j) + 1%}
                        {%$description = preg_replace('/color=\"0x000000\"/','/class=\"poi\"/', $step.instructions)%}
                        {%$description = preg_replace('/color="0xDC3C3C"/','/class="toll"/',$description)%}
                        <a href="{%$step.url%}">
                        <li class="walk-list-item">
                            <span class="icon">                      {%if $number < 10%}
                                0{%$number%}
                            {%else%}
                                {%$number%}
                            {%/if%}
                            </span>
                            <div class="des">{%$description|escape:"none"%}</div>
                            <em class="gt"></em>
                        </li>
                        </a>
                    {%/foreach%}
                {%/foreach%}
                </ol>
            </dd>
        </dl>
        {%if ($result._platform == 'android')%}
            <div class="send-phone">
                <em class="send-phone-icon"></em>
                <a href='' id="share-to-friends">分享给好友</a>
            </div>
        {%/if%}
    {%else%}
        <p class="route-tips">
            {%if ($result._state==0 || $result._state==-1)%}
                <em></em>未找到步行方案，您可更换关键词再尝试。
            {%/if%}
        </p>
    {%/if%}
    <div id="walk-cover" class="route-cover"></div>
</div>