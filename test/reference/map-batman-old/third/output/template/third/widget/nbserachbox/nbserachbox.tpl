{%style id="/widget/nbserachbox/nbserachbox.inline.less"%}.index-widget-nbserachbox{padding:8px 0 0}.index-widget-nbserachbox #search-more-nearby{margin:8px}.index-widget-nbserachbox #search-more-nearby .center-name{color:#276adc}.index-widget-nbserachbox .search-form{margin:0 8px 8px;padding:0 85px 0 0;border:1px solid #9a9a9a;background:#fff;box-shadow:inset 1px 1px 2px #ccc;position:relative;-webkit-border-radius:2px}.index-widget-nbserachbox .search-form form input{height:36px;width:100%;display:block;border:0;background:0;padding:0 4px 0 10px;color:#333}.index-widget-nbserachbox .search-form form .ipt-default{color:#b6b6b6}.index-widget-nbserachbox .search-form span{position:absolute;right:0;top:0;padding:0;height:100%;width:74px;color:#444b53;border-left:1px solid #9a9a9a;line-height:36px;text-align:center;background:-webkit-gradient(linear,50% 0,50% 100%,from(#f7f6f6),to(#dfdfdf))}{%/style%}
<div class="index-widget-nbserachbox" id="index-widget-nbserachbox">
{%*<p id="search-more-nearby">在 <span class="center-name">我的位置</span> 附近找</p>*%}
<div id="search-form-container">
<div class="search-form">
<form method="get" id="search-form">
<input class="ipt-default" value="输入其他分类" id="search-input" type="text"/>
</form>
<span id="search-button">搜索</span></div>
</div>
</div>
{%script%}
    (require("third:widget/nbserachbox/nbserachbox.js")).init();
{%/script%}