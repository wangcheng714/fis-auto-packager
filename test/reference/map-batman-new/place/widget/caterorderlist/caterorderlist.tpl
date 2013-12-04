<div id="place-widget-caterorderlist">
    <div class="hd">
        预订手机：<span data-node="mobile"></span>
    </div>
    <div class="bd">
        <ul data-node="list">
            <li>加载中</li>
        </ul>
    </div>
    <div class="pagenav" data-node="pageNav" style="display:none;">
        <a data-node="pre" class="page-btn disabled">上一页</a>
        <a data-node="next" class="page-btn ">下一页</a>
    </div>
</div>

{%script%}
    require('caterorderlist.js').init({
        kehuduan: '{%$kehuduan%}'
    });
{%/script%}