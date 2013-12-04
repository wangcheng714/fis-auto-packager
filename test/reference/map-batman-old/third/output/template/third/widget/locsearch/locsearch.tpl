{%style id="/widget/locsearch/locsearch.inline.less"%}.index-widget-locsearch{margin:8px;padding:0 85px 0 0;border:1px solid #9a9a9a;background:#fff;box-shadow:inset 1px 1px 2px #ccc;position:relative;-webkit-border-radius:2px}.index-widget-locsearch form input{height:36px;width:100%;display:block;border:0;background:0;padding:0 4px 0 10px;color:#333}.index-widget-locsearch form .ipt{color:#b6b6b6}.index-widget-locsearch span{position:absolute;right:0;top:0;padding:0;height:100%;width:74px;color:#444b53;border-left:1px solid #9a9a9a;line-height:36px;text-align:center;background:-webkit-gradient(linear,50% 0,50% 100%,from(#f7f6f6),to(#dfdfdf))}{%/style%}<div class="index-widget-locsearch">
<form id="search-form">
<input class="ipt" data-value="输入城市或者其他位置" value="输入城市或者其他位置" id="search-input"/>
</form>
<span id="search-button">搜索</span>
</div>{%script%}
require("third:widget/locsearch/locsearch.js").init();
{%/script%}