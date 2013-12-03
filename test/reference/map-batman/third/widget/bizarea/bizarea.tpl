<!-- @fileOverview 商圈模版 by jican -->
<div class="index-widget-bizarea">
    {%if isset($data.bizinfo)%}
        <h2>热门商区</h2>
        <ul class="clearfix biz-list">
            {%foreach item=list_item from=$data.bizinfo.area%}
                <li>
                    <a href="/mobile/webapp/index/casuallook/foo=bar/from=business&bd={%$list_item%}&code={%$data.bizinfo.code%}" jsaction="jump" user-data="{%$list_item%}" data-log="{code:{%$STAT_CODE.STAT_INDEX_BIZAREA_CLICK%}}">{%$list_item%}</a>
                </li>
            {%/foreach%}
        </ul>
    {%/if%}
    {%script%}
        (require("bizarea.js")).init({%isset($data.bizinfo)%});
    {%/script%}
</div>