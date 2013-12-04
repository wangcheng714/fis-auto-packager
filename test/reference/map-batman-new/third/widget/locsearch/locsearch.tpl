<div class="index-widget-locsearch">
	<form id="search-form">
		<input class="ipt" data-value="输入城市或者其他位置" value="输入城市或者其他位置" id="search-input"/>
	</form>
	<span id="search-button">搜索</span>
</div>	


{%script%}
require("./locsearch.js").init();
{%/script%}