<!-- @fileOverview footer模板 -->
<footer class="common-widget-footer third-footer">
	{%widget name="third:widget/moreicons/moreicons.tpl"%}   
	<div class="footer">
		<a class="btn rec needsclick" href="/mobile/webapp/index/index/force=simple" data-log="{code:{%$STAT_CODE.STAT_FOOT_INDEX_CLICK%}}">
			百度地图
		</a>
		<a class=" needsclick" href="{%$commonUrl.footer.feedback%}" data-log="{code:{%$STAT_CODE.STAT_FEEDBACK_CLICK%}}">
			意见反馈
		</a>
	</div>
</footer>
{%script%}
    (require('third:widget/footer/footer.js')).init();
{%/script%}
