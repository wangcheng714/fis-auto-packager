{%style id="/widget/locsearch/locsearch.inline.less"%}.index-widget-locsearch {
  margin: 8px;
  padding: 0 85px 0 0;
  -webkit-border-radius: 2px;
  border: 1px solid #6BB1F7;
  background: white;
  position: relative;
}
.index-widget-locsearch form input {
  height: 36px;
  width: 100%;
  display: block;
  border: none;
  background: none;
  padding: 0 4px 0 10px;
  color: #333;
}
.index-widget-locsearch form .ipt {
  color: #b6b6b6;
}
.index-widget-locsearch span {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0;
  height: 100%;
  width: 74px;
  color: #fff;
  border-left: 1px solid #6BB1F7;
  line-height: 36px;
  text-align: center;
  background: #6BB1F7;
}
{%/style%}<div class="index-widget-locsearch">
	<form id="search-form">
		<input class="ipt" data-value="输入城市或者其他位置" value="输入城市或者其他位置" id="search-input"/>
	</form>
	<span id="search-button" class="needsclick">搜索</span>
</div>	


{%script%}
require("index:widget/locsearch/locsearch.js").init();
{%/script%}