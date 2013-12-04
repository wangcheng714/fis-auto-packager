<div id="addr-inner" class="addr-widget-list" data-log="{code:{%$STAT.WLAN_BUS_DETAIL%}}">
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