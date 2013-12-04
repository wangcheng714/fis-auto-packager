{%style id="/widget/photodetailslider/photodetailslider.inline.less"%}.absolute-center-align{position:absolute;top:0;bottom:0;left:0;right:0;margin:auto}#photoslider{background:#292929;width:100%;position:absolute;z-index:10}#photoslider .ui-slider-group{height:100%}#photoslider .slider-area{position:absolute;width:100%;font-family:Helvetica "微软雅黑";font-size:16px;font-weight:700;overflow-x:hidden;bottom:0;top:0;overflow:hidden}#photoslider .colorgrey{color:#cfcfcf}#photoslider .colorwhite{color:#fff}#photoslider .colorblue{color:#2a8ac1}#photoslider .idx-indicator{float:right}#photoslider .info-area{width:90%;padding:0 5%;height:40px;line-height:40px}#photoslider .img-area{height:80%;position:relative;overflow:hidden;font-size:0;-webkit-transform:translateZ(0)}#photoslider .img-area-item{margin:auto;overflow:hidden;height:100%;width:100%;position:relative;float:left}#photoslider .img-area-item img{display:block;max-height:90%;max-width:90%}#photoslider .img-item-wrap{height:100%}#photoslider .loading:before{content:"...加载中...";font-size:12px;color:#fff;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;display:block;text-align:center;margin:50% 0 0;-webkit-animation:loading 2s linear infinite;animation:loading 2s linear infinite}@-webkit-keyframes loading{0%{opacity:0}50%{opacity:1}100%{opacity:0}}{%/style%}<div id="photoslider">
<div class="slider-area">
<div id="img-area" class="img-area">
{%for $num=1 to count($widget_data.photos)%}
<div class="img-area-item loading">
<img class="absolute-center-align"  lazyload="{%$widget_data.photos[$num - 1].imgUrl%}">
</div>
{%/for%}
</div>
<div class="info-area">
<span class="colorgrey">来自<span class="fromwhere"></span>
<span class="idx-indicator">
<span class="currentidx colorwhite"></span>
<span class="colorblue">/{%count($widget_data.photos)%}</span>
</span>
</span>
</div>
</div>
</div>
{%script%}
        require("common:static/js/gmu/src/widget/slider/slider.js");
        require("common:static/js/gmu/src/widget/slider/$touch.js");
        require("common:static/js/gmu/src/widget/slider/$lazyloadimg.js");
        (require('place:widget/photodetailslider/photodetailslider.js')).init({%json_encode($widget_data)%});
{%/script%}
