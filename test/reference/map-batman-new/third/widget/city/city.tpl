<div class="third-widget-curcity">
	<span id="current-city" data-city={%$data.city%} data-code={%$data.code%}>{%$data.city%}</span> 
	<span class="change">[<span class="change-city">切换</span>]</span>
</div>
{%script%}
require("city.js").init();
{%/script%}
