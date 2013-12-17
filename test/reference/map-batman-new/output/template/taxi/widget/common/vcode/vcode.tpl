{%style id="/widget/common/vcode/vcode.inline.less"%}.taxi-widget-common-vcode{display:-webkit-box;-webkit-box-pack:start;-webkit-box-align:start;height:30px}.taxi-widget-common-vcode .title{line-height:30px}.taxi-widget-common-vcode .input-code{width:4em;height:30px;line-height:22px;padding:5px;box-sizing:border-box;border:1px solid #ccc;margin-right:10px}.taxi-widget-common-vcode .image-code{display:block;margin-right:10px}.taxi-widget-common-vcode .btn-refresh{display:block;height:30px;line-height:30px;color:#06f}{%/style%}<div class="taxi-widget-common-vcode">
<div class="title">验证码：</div>
<input class="input-code" type="text" />
<input class="input-vcode" type="hidden" />
<img class="image-code" src="###" />
<a class="btn-refresh" href="javascript: void(0);">换一张</a>
</div>
{%script%}
require('taxi:widget/common/vcode/vcode.js').init();
{%/script%}