<!-- @fileOverview 路线页缩略图模板(集成nearbystation) by yuanzhijia -->
<div class="index-widget-navethumbnail">
    <div id="route-pic" style="display:none">
        <div class="location-area">
            <div class="poipic-wrapper">
                <div class="poipic-area" style="position: relative; border: 1px solid #dadada;">
                    <div class="poipic routepic">
                        <div class="pic-area" id="poipic-area">
                            <a id="right-a"  href="/mobile/webapp/index/index/foo=bar/vt=map&traffic=on&showmygeo=1">
                                <img id="mapimg" style="width: 100%; height: 100%;" src="">
                                <div style="text-align: center; position: absolute; right: 1px; bottom: 1px; height: 22px; line-height: 22px; width: 57px; background-color: white; font-size: 12px; color: #4a4a4a;">百度路况</div>
                            </a>
                            <div id="error-cnt" class="error-cnt" style="display:none;width: 100%; height: 100%;">
                                <p style="padding-top: 41px; color: #4197d3; font-size: 14px; margin: 0 auto;">
                                     <a style="color:#515a64" href="/mobile/webapp/index/index/foo=bar/vt=map&traffic=on&showmygeo=1">
                                    点击查看地图
                                </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id ="nearbystation">
        <div class="route-wrapper">
            <div class="nb-station">
                <div class="nb-bus" id="nb-bus" style="display:none;">
                    <span>附近公交站：</span>
                    <span class="bs">
                        <span class="st station" data-title="bus">
                                <a href="" data-log="{code:{%$STAT_CODE.STAT_LINEINDEX_BUS_CLICK%}}"  id="busspan" style="color: #515a64;">
                                </a>
                        </span>
                    </span>
                </div>
                
                
                <div class="nb-subway" id="nb-subway" style="margin-top:11px;display:none;" >
                    <span>附近地铁站：</span>
                    <span class="ss">
                        <span class="st station" data-title="subway">
                             <a href="" style="color: #515a64;" id="stationspan" data-log="{code:{%$STAT_CODE.STAT_LINEINDEX_SUBWAY_CLICK%}}">
                             </a>
                        </span>
                    </span>
                </div>
                
            <a href="" id="subwayBtn" style="color: #515a64;display:none" data-log="{code:{%$STAT_CODE.STAT_LINEINDEX_SUBWAYBTN_CLICK%}}">
            <div class="sw-btn">
                <em class="route-pic"></em>
                <span>
                    <span class="city-name"></span>
                    <span id="cityNameCnt"></span>
                </span>
            </div>
            </a>
        </div>
    </div>
</div>
</div>
{%script%}
    (require("navethumbnail.js")).init();
{%/script%}