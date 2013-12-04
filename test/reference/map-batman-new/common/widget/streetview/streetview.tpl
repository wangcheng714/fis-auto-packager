<div id="street-holder">
    <div class="sc">
        <div id="streetview-container"></div>
        <div id="eagleeye-container">
            <div id="eagleeye-map"></div>
        </div>
        <div class="mode"></div>
        <span class="addr"></span>
    </div>
</div>
{%script%}
    // 全景依赖MAP API，需要先加载
    require.async([
        'common:widget/api/api.js',
        'common:widget/api/ext/custommarker.js'
    ], function(BMap, CustomMarker){
        (require('common:widget/streetview/streetview.js')).init({
            BMap : BMap,
            CustomMarker : CustomMarker
        });
    });
{%/script%}