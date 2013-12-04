<!-- @fileOverview footer模板 -->
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
    (require("./footer.js")).init();
{%/script%}