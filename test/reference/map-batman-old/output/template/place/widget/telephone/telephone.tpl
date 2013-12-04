{%style id="/widget/telephone/telephone.inline.less"%}.place-widget-telephone {
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
.place-widget-telephone a {
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
{%/style%}{%* 商户电话 *%}
{%if !empty($widget_data.phone)%}
<div class="place-widget-telephone">
    <a data-tel="{%$widget_data.phone%}" href="tel:{%$widget_data.phone%}">商户电话&nbsp;{%$widget_data.phone%}</a>
</div>

{%script%}
    var telephone = require("place:widget/telephone/telephone.js"),
    	statData = {
	    	wd: '{%$wd%}',
	    	name: '{%$bname%}',
	    	srcname: '{%$srcname%}'
	    };
    telephone.init(statData);
{%/script%}
{%/if%}
