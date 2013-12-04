{%* 商户电话 *%}
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
