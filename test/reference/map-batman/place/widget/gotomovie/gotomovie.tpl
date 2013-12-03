{%* 路线搜索 *%}
<div class="place-widget-goto" style="display: block;" track-top="poidtl">
    <ul class="movie-searchbtn btn_margin_hor">
        <li id="detail-search" track="to_neby">
        	<a class="near needsclick" href="{%$widget_data.nearby%}" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_NEAR_CLICK%}, wd:'{%$wd%}', name:'{%$bname%}'}">
        		<span class="search-btn">搜周边</span>
        	</a>
        </li>
        <li id="detail-gotohere" track="to_ghere">
        	<a class="to needsclick" href="{%$widget_data.to%}" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_TO_CLICK%}, wd:'{%$wd%}', name:'{%$bname%}'}">
        		<span class="goto-btn">到这儿去</span></li>
        	</a>
        {%if !empty($phone)%}
        <li id="detail-phone" track="to_call">
            <a data-tel="{%$phone%}" href="tel:{%$phone%}">
                <span class="shoptel-btn">电话</span>
            </a>
        </li>
        {%/if%}
    </ul>
</div>
{%if !empty($phone)%}
{%script%}
    var gotomovie = require("place:widget/gotomovie/gotomovie.js");
    gotomovie.init();
{%/script%}
 {%/if%}