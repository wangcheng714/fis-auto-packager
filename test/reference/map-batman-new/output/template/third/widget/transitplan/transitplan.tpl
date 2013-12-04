{%style id="/widget/transitplan/transitplan.inline.less"%}.third-widget-transitplan a{display:inline-block;width:50%;box-sizing:border-box;-webkit-box-sizing:border-box;height:40px;line-height:40px;text-align:center;float:left;font-size:15px;color:#525252}.third-widget-transitplan a.click{border-left:1px solid #e8e8e8;border-bottom:1px solid #e8e8e8;background:#f9f9f9;border-bottom-left-radius:3px}.third-widget-transitplan a.search-plan-click{border-right:1px solid #e8e8e8;border-bottom:1px solid #e8e8e8;background:#f9f9f9;border-bottom-right-radius:3px}{%/style%}<div class="third-widget-transitplan">
{%if $data.type == 'site'%}
<a href="{%$data.url|f_escape_xml%}" class="search-plan-click needsclick">方案查询</a>
<a class="active" href="javascript:void(0);">线路/站点</a>
{%else%}
<a class="active">方案查询</a>
<a href="{%$data.url|f_escape_xml%}" class="click needsclick" href="javascript:void(0);">线路/站点</a>
{%/if%}
</div>