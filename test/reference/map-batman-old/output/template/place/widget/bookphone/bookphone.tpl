{%style id="/widget/bookphone/bookphone.inline.less"%}.place-widget-bookphone {
  font-size: 1.143em;
  background: -webkit-gradient(linear, 0 100%, 0 0, from(#eeeeee), to(#fdfdfd));
  height: 39px;
  line-height: 39px;
  border: #838991 solid 1px;
  border-radius: .25em;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.place-widget-bookphone a {
  display: block;
  text-decoration: none;
  text-align: center;
  font-weight: 700;
  width: 100%;
  height: 100%;
  color: #347e16;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
{%/style%}{%* 订房热线 *%}
{%if ($data.widget.bookphone)%}
<div class="place-widget-bookphone">
    <a data-tel="{%$widget_data.data.ota_phone%}" href="tel:{%$widget_data.data.ota_phone%}" data-log="{code:{%$STAT_CODE.PLACE_HOTEL_DETAIL_BOOKPHONE_CLICK%}}">订房热线&nbsp;{%$widget_data.data.ota_phone%}</a>
</div>
{%script%}
    var bookphone = require("place:widget/bookphone/bookphone.js");
    bookphone.init();
{%/script%}
{%/if%}
