{%style id="/widget/searchbox/searchbox.inline.less"%}.index-widget-searchbox{background-color:#fff}.index-widget-searchbox .se-form{padding:10px;background-color:#fff;position:relative;top:2px;box-shadow:0 2px 3px -1px rgba(0,0,0,.18);-webkit-box-shadow:0 2px 3px -1px rgba(0,0,0,.18);z-index:11}.index-widget-searchbox .se-wrap{border:1px solid #9a9a9a;background:#fff;position:relative;height:36px;border:1px solid #6BB1F7}.index-widget-searchbox .se-inner{display:-webkit-box}.index-widget-searchbox .se-input{-webkit-box-flex:1;position:relative}.index-widget-searchbox .se-input-poi{color:#333;border:0;background:0;width:100%;padding:6px 7px}.index-widget-searchbox .se-btn{height:36px;width:49px;border-left:1px solid #9A9A9A;background:-webkit-gradient(linear,0 100%,0 0,from(#e7e7e7),to(#f5f5f5));border-left:1px solid #6BB1F7;background:#6BB1F7;color:#FFF;line-height:36px;text-align:center}{%/style%}
<div class="index-widget-searchbox">
<form class="se-form">
<div class="se-wrap">
<div class="se-inner">
<div class="se-input">
<input key="place" type="text" class="se-input-poi" id="se-input-poi" placeholder="搜索地点、公交车、路线"/>
</div>
<div class="se-btn" id="se-btn" user-data="se-btn">搜索</div>
</div>
</div>
</form>
</div>
{%script%}
    (require("index:widget/searchbox/searchbox.js")).init();
{%/script%}