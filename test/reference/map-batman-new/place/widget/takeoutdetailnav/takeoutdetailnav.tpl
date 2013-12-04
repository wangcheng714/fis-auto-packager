<!-- @fileoverview 通用返回条模板 -->

<div class="place-widget-takeout-detail-nav" >
    <div class="base-btn back-btn" onclick="history.back()">&nbsp;</div>
    <div class="title">
        <span>商户详情</span>
    </div>
    <div class="base-btn menu-btn">
        <a href="javascript:void(0);">
            <span>菜单分类</span>
            <em></em>
        </a>
    </div>

    {%widget name="place:widget/dishcategory/dishcategory.tpl"%}
</div>

{%script%}
    require('place:widget/takeoutdetailnav/takeoutdetailnav.js').init();
{%/script%}