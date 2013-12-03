{%style id="/widget/dishcategory/dishcategory.inline.less"%}.place-widget-dish-category{position:absolute;top:30px;right:15px;z-index:9000}.place-widget-dish-category .ddl_wrapper{overflow:hidden;max-height:360px;background-color:rgba(0,0,0,.7);-webkit-border-radius:3px;border-radius:3px;z-index:100;padding:3px;right:12px;display:block}.place-widget-dish-category s.arrow{position:relative;right:-90px;top:-7px;width:0;height:0;border-left:5px solid transparent;border-bottom:8px solid rgba(0,0,0,.7);border-right:5px solid transparent}.place-widget-dish-category .ul_scroll{max-height:360px}.place-widget-dish-category .ul_scroll ul{-webkit-border-radius:3px;border-radius:3px;overflow:hidden}.place-widget-dish-category .ul_scroll div{top:18px}.place-widget-dish-category .ul_scroll ul li{width:106px;height:33px;font-size:14px;color:#333;padding-left:8px;background-color:#fefefe;border-bottom:1px solid #c8c8c8;display:-webkit-box;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;-webkit-tap-highlight-color:rgba(0,0,0,0)}.place-widget-dish-category .ul_scroll ul li p{width:100%;line-height:33px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.place-widget-dish-category .ul_scroll ul li:last{border-bottom:0}.place-widget-dish-category .ul_scroll ul li:hover{background-color:#d8d8d8}.place-widget-dish-category .ul_scroll ul li:active{background-color:#eee}{%/style%}<div id="place-widget-dish-category" class="place-widget-dish-category" style="display:none">
<s class="arrow"></s>
<div class="ddl_wrapper">
<div class="ul_scroll">
<ul>
{%foreach $data.ShopDish.list as $list%}
<li>
<p id="{%$list.dishCategoryId|f_escape_xml%}" class="dish-name">{%$list.dishCategoryName|f_escape_xml%}</p>
</li>
{%/foreach%}
</ul>
</div>
</div>
</div>
{%script%}
require('place:widget/dishcategory/dishcategory.js');
{%/script%}