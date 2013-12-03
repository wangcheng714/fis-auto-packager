{%style id="/widget/waitforloc/waitforloc.inline.less"%}.index-widget-waitforloc {
  position: relative;
  margin-top: 4px;
  text-align: center;
  min-height: 300px;
}
.index-widget-waitforloc p {
  position: relative;
  top: 144px;
  -webkit-box-align: center;
  margin: 0 auto;
  color: #333333;
  font-size: 16px;
}
.index-widget-waitforloc .page-loading {
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-box-pack: start;
  -webkit-box-align: center;
  background: #F9F9F9;
  /*visibility: hidden;*/

  position: absolute;
  top: 63px;
  left: 0px;
  z-index: 9000;
  height: 64px;
  width: 100%;
  -webkit-transform-origin: 0px 0px;
  opacity: 1;
  -webkit-transform: scale(1, 1);
}
.index-widget-waitforloc .page-loading div {
  width: 100px;
  height: 100px;
  -webkit-box-align: center;
  -moz-box-align: center;
  box-align: center;
  -webkit-animation: rotation 1.5s linear infinite;
  margin: 0 auto;
}
.index-widget-waitforloc .page-loading div span {
  width: 16px;
  height: 16px;
  -webkit-border-radius: 30px;
  background: #a6a6a6;
  position: absolute;
  left: 42px;
  top: 42px;
}
.index-widget-waitforloc .page-loading .dot-1 {
  -webkit-transform: rotate(0deg) translate(0, -42px);
  opacity: 0.3;
}
.index-widget-waitforloc .page-loading .dot-2 {
  -webkit-transform: rotate(45deg) translate(0, -42px);
  opacity: 0.4;
}
.index-widget-waitforloc .page-loading .dot-3 {
  -webkit-transform: rotate(90deg) translate(0, -42px);
  opacity: 0.5;
}
.index-widget-waitforloc .page-loading .dot-4 {
  -webkit-transform: rotate(135deg) translate(0, -42px);
  opacity: 0.6;
}
.index-widget-waitforloc .page-loading .dot-5 {
  -webkit-transform: rotate(180deg) translate(0, -42px);
  opacity: 0.7;
}
.index-widget-waitforloc .page-loading .dot-6 {
  -webkit-transform: rotate(225deg) translate(0, -42px);
  opacity: 0.8;
}
.index-widget-waitforloc .page-loading .dot-7 {
  -webkit-transform: rotate(270deg) translate(0, -42px);
  opacity: 0.9;
}
.index-widget-waitforloc .page-loading .dot-8 {
  -webkit-transform: rotate(315deg) translate(0, -42px);
  opacity: 1;
}
{%/style%}<div class="index-widget-waitforloc">
	<div class="page-loading">
		<div>
	       <span class="dot-1"></span>
	       <span class="dot-2"></span>
	       <span class="dot-3"></span>
	       <span class="dot-4"></span>
	       <span class="dot-5"></span>
	       <span class="dot-6"></span>
	       <span class="dot-7"></span>
	       <span class="dot-8"></span>
	    </div>
	</div> 
	<p>正在获取您的位置......</p>
</div>