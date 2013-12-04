<!-- @fileoverview 通用返回条模板 -->

<div class="place-widget-takeout-detail-nav" >
    <div class="base-btn back-btn" onclick="history.back()">&nbsp;</div>
    <div class="title">
        <span>商户详情</span>
    </div>
    <div class="meau-btn">
        <span>菜单分类</span>
    </div>

    {%widget name="place:widget/dishcategory/dishcategory.tpl"%}
</div>

{%script%}
require('takeoutdetailnav.js');
{%/script%}