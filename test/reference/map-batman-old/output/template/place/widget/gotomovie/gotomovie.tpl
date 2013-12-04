{%style id="/widget/gotomovie/gotomovie.inline.less"%}.place-widget-goto {
  overflow: hidden;
}
.place-widget-goto #movie-searchbtn {
  margin-bottom: 10px;
}
.place-widget-goto .movie-searchbtn {
  display: -webkit-box;
  height: 47px;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  border: 1px solid;
  border-color: #dadada #e4e4e4 #e4e4e4 #e4e4e4;
  border-radius: 0 0 3px 3px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
}
.place-widget-goto .movie-searchbtn li {
  -webkit-box-flex: 1;
  display: -webkit-box;
  -webkit-box-pack: center;
  border-right: 1px solid #dadada;
  width: 2px;
}
.place-widget-goto .movie-searchbtn li:last-child {
  border-right: none;
}
.place-widget-goto .movie-searchbtn li span {
  background: url("/static/place/images/gohere_logos_80ec91a.png") no-repeat;
  display: block;
  padding-left: 22px;
  -webkit-background-size: 20px 60px;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
}
.place-widget-goto .movie-searchbtn li .search-btn {
  background-position: 0 0;
}
.place-widget-goto .movie-searchbtn li .goto-btn {
  background-position: 0 -20px;
}
.place-widget-goto .movie-searchbtn li .shoptel-btn {
  background-position: 0 -40px;
}
.place-widget-goto .movie-searchbtn li .shoptel-btn a {
  color: #4d4d4d;
}
.place-widget-goto .btn_margin {
  margin: 10px 8px 0;
}
{%/style%}{%* 路线搜索 *%}
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