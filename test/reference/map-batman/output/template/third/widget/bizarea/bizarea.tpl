{%style id="/widget/bizarea/bizarea.inline.less"%}.index-widget-bizarea {
  padding: 25px 14px;
  color: #575757;
  border-top: 1px solid #e1e1e1;
  background-color: #f9f9f9;
}
.index-widget-bizarea a {
  color: #444d62;
}
.index-widget-bizarea h2 {
  font-size: 16px;
  font-weight: 400;
}
.index-widget-bizarea .biz-list {
  font-size: 13px;
  margin-left: -11px;
}
.index-widget-bizarea .biz-list li {
  float: left;
  margin-left: 24px;
  margin-top: 15px;
}
{%/style%}<!-- @fileOverview 商圈模版 by jican -->
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
        (require("third:widget/bizarea/bizarea.js")).init({%isset($data.bizinfo)%});
    {%/script%}
</div>