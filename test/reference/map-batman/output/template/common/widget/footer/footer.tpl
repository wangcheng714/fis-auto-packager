{%style id="/widget/footer/footer.inline.less"%}/**
 * @fileOverview footer样式
 * @author caodongqing
 */
.common-widget-footer .blank {
  height: 10px;
}
.common-widget-footer .footer {
  width: 100%;
  font-size: 13px;
  color: #636363;
  height: 44px;
  line-height: 44px;
  display: -webkit-box;
  background-color: #EAEAEA;
  border-top: 1px solid #D4D4D4;
}
.common-widget-footer .footer a {
  color: #636363;
  display: block;
  height: 100%;
  text-align: center;
  -webkit-box-flex: 1;
}
.common-widget-footer .footer .user,
.common-widget-footer .footer .btn {
  border-right: 1px solid #D4D4D4;
  -webkit-box-sizing: border-box;
}
.common-widget-footer .footer em {
  background: url(/static/common/images/tabicon_600f854.png) no-repeat;
  background-size: 35px 167px;
  width: 17px;
  margin: 0 2px -1px 0;
}
.common-widget-footer .footer .btn em {
  background-position: 0 -126px;
  width: 17px;
  height: 14px;
}
.common-widget-footer .footer .rec em {
  background-position: 0 -151px;
  width: 17px;
  height: 16px;
}
.common-widget-footer .footer .rec .new {
  width: 8px;
  height: 8px;
  background-color: #f33f0c;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  display: inline-block;
  margin: 10px 2px;
  position: absolute;
}
.common-widget-footer .footer .other_footer {
  font-size: 12px;
  color: #999;
  text-align: center;
  padding-top: 15px;
  padding-bottom: 15px;
}
.common-widget-footer .footer .user {
  margin-right: -1px;
  border-right: 1px solid #d4d4d4;
}
.common-widget-footer .footer .user em {
  background-position: 0 -101px;
  width: 17px;
  height: 16px;
}
{%/style%}<!-- @fileOverview footer模板 -->
<footer class="common-widget-footer">
	<div class="blank"></div>
	<div class="footer">
		{%if ($module == 'index' && $page == 'index')%}
		<a class="user" href="javascript:void(0);" >
		<em></em>
			个人中心
		</a>
		{%/if%}
		<a class="btn needsclick" href="{%$commonUrl.footer.feedback%}" data-log="{code:{%$COM_STAT_CODE.FOOTER_FEEDBACK_CLICK%}}">
		<em></em>
			意见反馈
		</a>
		<a class="rec needsclick" href="{%$commonUrl.footer.recommend%}" data-log="{code:{%$COM_STAT_CODE.FOOTER_RECOMMEN_CLICK%}}">
			<em></em>
			应用推荐
		</a>
	</div>
</footer>
<footer class="common-widget-footer" style="display: none">
	Copyright © m.hao123.com　京ICP证030173号
</footer>
{%script%}
    (require("common:widget/footer/footer.js")).init();
{%/script%}