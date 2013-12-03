<!-- @fileOverview 附近检索模版 by jican -->
<div class="index-widget-nearby">
    {%*某些页面不需要头部*%}
    {%$noHeaderPages = array('index','searchnearby')%}
    {%if !in_array($pagename, $noHeaderPages)%}
        <div class="hd">
            <h2>附近</h2>
        </div>
    {%/if%}
    {%$main = $data.main%}
    {%$fixrank = $main.fixrank1%}
    {%if $pagename != 'index'%}
        {%$fixrank = $main.fixrank2%}
    {%/if%}
    {%* 按钮总数 *%}
    {%$max = count($fixrank)%}
    {%for $row = 0; $row < 4; $row++ %}
        <ul class="list">
            {%for $i = 3*$row; $i < 3*$row+3; $i++ %}
                {%if ($i < $max)%}
                    {%$key = $fixrank[$i]%}
                    {%$content = $main.content[$key]%}
                    {%$word = $content.name%}
                    {%$module = $content.module%}
                    {%$action = $content.action%}
                    {%$id = $content.id%}
                    <li class="item-{%$main.content[$key].className%}-{%$page%}">
                        <a href="javascript:void(0);" jsaction="jump" userdata="{wd:'{%$word%}', module:'{%$module%}', action:'{%$action%}', id:'{%$id%}'}">
                            <b class="icon needsclick {%$main.content[$key].className%}"> </b>
                            <span class='ui3-font'>{%$word%}
                                {%if ($main.content[$key].className === 'ui3-more' && $page === 'index')%}
                                ...
                                {%/if%}
                            </span>
                        </a>
                    </li>
                {%/if%}
            {%/for%}
        </ul>
    {%/for%}
</div>
{%script%}
    (require("nearby.js")).init('{%$pagename%}');
{%/script%}