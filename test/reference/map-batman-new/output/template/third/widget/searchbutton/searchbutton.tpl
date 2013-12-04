{%style id="/widget/searchbutton/searchbutton.inline.less"%}.third-widget-searchbutton .search{height:49px;background:#f3f4f6;border:1px solid #e6e6e6;margin:0 24px;text-align:center;line-height:49px;border-radius:6px}.third-widget-searchbutton .search span{color:#4c90f9;font-size:16px;padding-left:25px;display:inline-block;background:url(/mobile/simple/static/third/images/search-icon_b2ccfec.png) no-repeat left center;background-size:15px 15px}.third-widget-searchbutton .search-bus,.third-widget-searchbutton .subway-button{display:block;border:1px solid #d7d7d7;background:#fbfafa;color:#525252;height:39px;line-height:39px;margin:0 24px;border-radius:6px;text-align:center;font-size:15px}.third-widget-searchbutton .search-bus{margin-bottom:15px;margin-top:28px}{%/style%}<div class="third-widget-searchbutton">
<div class="search se-bus-btn se-btn-tr" data-value="1">
<span>查询</span>
</div>
<span class="search-bus search-button" data-wd="公交站">查看附近公交站>></span>
<span class="subway-button search-button" data-wd="地铁图" style="display:none">城市地铁线路图>></span>
</div>
{%script%}
    (require("third:widget/searchbutton/searchbutton.js")).init();
{%/script%}
