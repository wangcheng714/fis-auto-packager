<div id="photoslider">
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
        (require('photodetailslider.js')).init({%json_encode($widget_data)%});
{%/script%}
