{%style id="/widget/title/title.inline.less"%}.transit-widget-title .nav-middle {
  width: 100%;
  line-height: 44px;
  font-size: 16px;
  color: #373a3d;
  text-align: center;
  font-weight: normal;
  position: relative;
}
.transit-widget-title .nav-middle-txt {
  margin: 0 72px;
  color: #373a3d;
  display: block;
  white-space: nowrap;
}
.transit-widget-title .bus-sel-wrap {
  border: 1px solid #909191;
  display: table;
  background-image: -moz-linear-gradient(top, #f8f8f8, #e6e6e6);
  background-image: -webkit-gradient(linear, 0 0, 0 63%, from(#ffffff), to(#f7f8f9));
  width: 100%;
  height: 30px;
  position: relative;
  line-height: 30px;
  font-size: 14px;
  left: -2px;
}
.transit-widget-title .bus-sel-wrap a {
  color: #3b3b3b;
  display: table-cell;
  border-right: 1px solid #adaeaf;
  font-size: 14px;
}
.transit-widget-title .bus-sel-wrap a:last-child {
  border: none;
}
.transit-widget-title .bus-sel-wrap a.current {
  background: #d5d4d4;
  -webkit-box-shadow: inset 0 0 3px #a2a2a2;
  box-shadow: inset 0 0 3px #a2a2a2;
}
{%/style%}<div class="nav-middle transit-widget-title">
	<div class="nav-middle-txt">
		<div class='bus-sel-wrap'>
		    <a class='current'>公交</a>
		    <a href="">驾车</a>
		    <a href="">步行</a>
		</div>
	</div>
</div>