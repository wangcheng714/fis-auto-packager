{%* @file 驾车列表页模板 *%}
{%$result  = $data.result%}
{%$content = $data.content%}
{%$strategies = $result.strategies%}
<div id="drive-inner" class="drive-inner drive-widget-list">
    {%if ($result._state>0)%}
        {%$taxi  = $content.taxi%}
        {%$start = $result.start%}
        {%$end   = $result.end[count($result.end)-1]%}
        {%$route = $content.routes[0]%}
        {%$legs  = $route.legs%}
        <div class="drive-tabs-wrap">
            <ul id="drive-tabs" class="drive-tabs">
                {%foreach $strategies as $j => $item%}
                    {%if $j == $result.sy%}
                        {%$active = "active"%}
                    {%else%}
                        {%$active = ""%}
                    {%/if%}
                    {%$len=count($data.result.strategies)%}
                    {%$width = number_format(100/$len, 1)%}
                    <li class="drive-tab {%$active%}" style="width:{%$width%}%">
                        <a {%if $j != $result.sy%}href="{%$item.url%}"{%/if%} data-log="{code:{%$STAT_CODE.DRIVE_STRAGETY_CLICK%}, type:{%$j%}}">
                        {%$item.name%}
                        <s></s>
                    </a>
                    </li>
                {%/foreach%}
            </ul>
        </div>
        <dl>
            <dt class="hd drive-title">
                <div class="clear">
                    <div class="start">
                        <em></em><span class="wd">{%$start.wd%}</span>
                    </div>
                    <div class="end">
                        <em></em><span class="wd">{%$end.wd%}</span>
                    </div>
                </div>
                <div class="ext">{%$legs[0].duration%}/约{%$legs[0].distance%}{%if $content.taxi%}/打车约{%$content.taxi.detail[0]['total_price']%}元{%/if%}</div>
            </dt>
            <dd class="drive-list-wrap">
                <ol class="drive-list">
                {%$count = 0%}
                {%foreach $legs as $i => $leg%}
                    {%$steps = $leg.steps%}
                    {%$count = $count + count($steps)%}
                    {%foreach $steps as $j => $step %}
                        {%$number = (($i&&1*$count) + $j) + 1%}
                        {%$description = preg_replace('/color="0x000000"/','/class="poi"/', $step.instructions)%}
                        {%$description = preg_replace('/color="0xDC3C3C"/','/class="toll"/',$description)%}
                        <a href="{%$step.url%}">
                        <li class="drive-list-item">
                            <span class="icon">                      
                            {%if $number < 10%}
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
        <script type="text/javascript">
            //first screen time. by jican
            PDC && PDC.first_screen && PDC.first_screen();
        </script>
        <div class="gotonav">
           <em class="gotonav-icon"></em> 
           <a>发起导航</a>
           <p class="nav-tip"></p>
        </div>
        {%if ($result._platform == 'android')%}
            <div class="send-phone">
                <em class="send-phone-icon"></em>
                <a href='' id="share-to-friends">分享给好友</a>
            </div>
        {%/if%}
        <div id="drive-footer-ad" class="ad_area"></div>
    {%else%}
        <p class="route-tips">
            {%if ($result._state==0)%}
                <em></em>未能找到该驾车方案。
            {%/if%}
        </p>
    {%/if%}
    <div id="drive-cover" class="route-cover"></div>
</div>