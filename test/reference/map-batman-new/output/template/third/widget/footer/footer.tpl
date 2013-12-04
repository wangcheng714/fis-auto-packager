{%style id="/widget/footer/footer.inline.less"%}.third-footer{background-color:#fff}.third-footer .blank{height:10px}.third-footer .footer{width:100%;font-size:13px;color:#636363;height:44px;line-height:44px;display:-webkit-box;background-color:#EAEAEA;border-top:1px solid #D4D4D4}.third-footer .footer a{color:#636363;display:block;height:100%;text-align:center;-webkit-box-flex:1}.third-footer .footer .user,.third-footer .footer .btn{border-right:1px solid #D4D4D4;-webkit-box-sizing:border-box}.third-footer .footer em{background:url(/static/images/tabicon.png) no-repeat;background-size:35px 167px;width:17px;margin:0 2px -1px 0}.third-footer .footer .btn em{background-position:0 -126px;width:17px;height:14px}.third-footer .footer .rec em{background-position:0 -151px;width:17px;height:16px}.third-footer .footer .rec .new{width:8px;height:8px;background-color:#f33f0c;-webkit-border-radius:4px;border-radius:4px;display:inline-block;margin:10px 2px;position:absolute}.third-footer .footer .other_footer{font-size:12px;color:#999;text-align:center;padding-top:15px;padding-bottom:15px}.third-footer .footer .user{margin-right:-1px;border-right:1px solid #d4d4d4}.third-footer .footer .user em{background-position:0 -101px;width:17px;height:16px}{%/style%}
<footer class="common-widget-footer third-footer">
{%widget name="third:widget/moreicons/moreicons.tpl"%}<div class="footer">
<a class="btn rec needsclick" href="/mobile/webapp/index/index/force=simple" data-log="{code:{%$STAT_CODE.STAT_FOOT_INDEX_CLICK|f_escape_xml%}}">
百度地图</a>
<a class=" needsclick" href="{%$commonUrl.footer.feedback|f_escape_xml%}" data-log="{code:{%$STAT_CODE.STAT_FEEDBACK_CLICK|f_escape_xml%}}">
意见反馈</a>
</div>
</footer>
{%script%}
    (require('third:widget/footer/footer.js')).init();
{%/script%}
