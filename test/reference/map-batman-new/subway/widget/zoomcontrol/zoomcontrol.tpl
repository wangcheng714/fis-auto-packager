{%* 放大缩小按钮 *%}
<div id="swZoomControl" class="needsclick" style="visibility:hidden;">
    <div id="swZoomOut" class="block_zoom_btn block_zoom_out_btn">
        <div class="inline_zoom_btn inline_zoom_out"></div>
    </div>
    <div id="swZoomIn" class="block_zoom_btn block_zoom_in_btn">
        <div class="inline_zoom_btn inline_zoom_in"></div>
    </div>
</div>
{%script%}
    (require('subway:widget/zoomcontrol/zoomcontrol.js')).init();
{%/script%}