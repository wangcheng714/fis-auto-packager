{%* @file 公交列表页模板 *%}
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
    (require("list.js")).init(pageinfo);
{%/script%}