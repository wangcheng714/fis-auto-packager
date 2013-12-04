<!-- @fileOverview 首页行业细分 by jican -->
<div class="index-widget-cateinfo">
    {%$cateinfo = $data%}
    {%for $i = 0; $i < count($cateinfo.other); $i++ %}
        {%$key = $cateinfo.other[$i]%}
        {%$cate = $cateinfo.content[$key]%}
        <dl class="clearfix">    
                <dt id="{%$cate.className%}" class="categoryparent">
                        <span class="titie-name">{%$cate.name%}</span>
                        <div class="icon"></div>
                        <span class="back-icon"></span>
                </dt>
           
            <dd class="subwrap">
                {%for $index=0, $j = 0; $j < count($cate.subcate); $j++ %}
                    {%$word = $cate.subcate[$j].name%}
                    {%$id = $cate.id%}
                    {%if $index%2==0 %}
                        <ul class="sublist">
                    {%/if%}
                        <li>
                        <span class="acon">
                             <a href="javascript:void(0);">{%$word%}</a>
                        </span>
                            
                        </li>
                    {%if $index%2==1 %}
                        </ul>
                    {%/if%}
                    {%$index = $index+1%}
                {%/for%}
            </dd>
        </dl>
    {%/for%}
</div>
{%script%}
    (require("morecategory.js")).init();
{%/script%}