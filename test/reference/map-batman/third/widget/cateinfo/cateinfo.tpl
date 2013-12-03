<!-- @fileOverview 首页行业细分 by jican -->
<div class="index-widget-cateinfo">
    {%$cateinfo = $data.cateinfo%}
    {%for $i = 0; $i < count($cateinfo.other); $i++ %}
        {%$key = $cateinfo.other[$i]%}
        {%$cate = $cateinfo.content[$key]%}
        <dl class="clearfix">
            <dt class="{%$cate.className%}">
                <div class="icon"></div>{%$cate.name%}
            </dt>
            <dd class="subwrap">
                {%for $index=0, $j = 0; $j < count($cate.subcate); $j++ %}
                    {%$word = $cate.subcate[$j].name%}
                    {%$id = $cate.id%}
                    {%if $index%3==0 %}
                        <ul class="sublist">
                    {%/if%}
                        <li>
                            <a href="javascript:void(0);" jsaction="jump" userdata="{wd:'{%$word%}',cate:'{%$id%}'}">
                                {%$word%}
                            </a>
                        </li>
                    {%if $index%3==2 %}
                        </ul>
                    {%/if%}
                    {%$index = $index+1%}
                {%/for%}
            </dd>
        </dl>
    {%/for%}
</div>
{%script%}
    (require("cateinfo.js")).init();
{%/script%}