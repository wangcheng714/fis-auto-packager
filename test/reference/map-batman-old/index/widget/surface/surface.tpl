<!--首页从wapmap过来显示的浮层 by  xiaole -->
{%if $data && $data['isShow']%}
<div class="return-wap">
    <a href="http://wapmap.baidu.com" class="return">返回WAP地图</a>
    <a class="close"></a>
</div>
{%/if%}

{%script%}
require("./surface.js").init();
{%/script%}