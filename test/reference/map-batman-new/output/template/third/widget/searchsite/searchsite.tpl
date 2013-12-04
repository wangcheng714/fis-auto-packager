{%style id="/widget/searchsite/searchsite.inline.less"%}.search-site{margin:16px 24px 20px}.search-site p{margin-bottom:7px;color:#5c5c5c;font-size:14px}.search-site .search-input{border:1px solid #d9d9d9;border-radius:3px}.search-site input{width:100%;height:33px;border:0;padding-left:5px;box-sizing:border-box}{%/style%}<div class="search-site">
<p>公交线路/站点查询：</p>
<div class="search-input">
<input type="text" placeholder="请输入公交线路/站点" class="se-input-poi"/>
</div>
</div>
{%script%}
    (require("third:widget/searchsite/searchsite.js")).init();
{%/script%}