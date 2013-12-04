<!-- @fileOverview 附近检索模版 by jican -->
<div class="index-widget-nearby">
    {%*某些页面不需要头部*%}
    {%$noHeaderPages = array('index','searchnearby')%}
    {%if !in_array($pagename, $noHeaderPages)%}
    {%/if%}

    <ul class="list">
        {%for $i = 0; $i < 5; $i++ %}
            <li>
                {%$main = $data.main%}
                {%$key = $main.fixrank[$i]%}
                {%$content = $main.content[$key]%}
                {%$word = $content.name%}
                {%$module = $content.module%}
                {%$action = $content.action%}
                {%$id = $content.id%}
                <a href="javascript:void(0);" jsaction="jump" userdata="{wd:'{%$word%}', module:'{%$module%}', action:'{%$action%}', id:'{%$id%}'}">
                    <b class="icon {%$main.content[$key].className%}"></b>{%$word%}
                </a>
            </li>
        {%/for%}
    </ul>
    <ul class="list">
        {%for $i = 5; $i < 10; $i++ %}
            <li>
                {%$main = $data.main%}
                {%$key = $main.fixrank[$i]%}
                {%$content = $main.content[$key]%}
                {%$word = $content.name%}
                {%$module = $content.module%}
                {%$action = $content.action%}
                {%$id = $content.id%}
                <a href="javascript:void(0);" jsaction="jump" userdata="{wd:'{%$word%}', module:'{%$module%}', action:'{%$action%}', id:'{%$id%}'}">
                    <b class="icon {%$main.content[$key].className%}"></b>{%$word%}
                </a>
            </li>
        {%/for%}
    </ul>
</div>
{%script%}
    (require("nearby.js")).init('{%$pagename%}');
{%/script%}