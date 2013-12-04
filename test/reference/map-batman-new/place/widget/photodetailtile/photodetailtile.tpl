<div id="phototile">
    <h3 class="tile-title">商家图片<span class="tile-num">({%count($widget_data.photos)%}张)</span>
    </h3>
    <div class="tile-arena">
    </div>
    <div class="tile-footer">
         <a id="photo-tile-more-imgs">查看更多图片 &gt;</a>
    </div>
    {%script%}
        (require('photodetailtile.js')).init({%json_encode($widget_data)%});
    {%/script%}
</div>