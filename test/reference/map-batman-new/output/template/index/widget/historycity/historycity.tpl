{%style id="/widget/historycity/historycity.inline.less"%}.index-widget-historycity{border:2px solid #f1f1f1;background:#fff;-webkit-border-radius:2px;margin:9px 8px}.index-widget-historycity .history-title{border-bottom:1px solid #e1e1e1;font-size:16px;color:#575757;font-weight:400;padding:14px}.index-widget-historycity .history-clean{float:right;cursor:pointer}.index-widget-historycity .historycity-item{color:#3c6aa7;display:block;padding:10px 7px}.index-widget-historycity .historycity-item:hover{background:#F2F2F2}.index-widget-historycity .historycity-list{padding:5px 8px}.index-widget-historycity .historycity-list li{float:left}{%/style%}<div class="index-widget-historycity" style="display:none;">
<div class="history-title">
<span>历史定位记录</span>
<span class="history-clean">清除历史记录</span>
</div>
<div class="history-content">
</div>
</div>
{%script%}
require("index:widget/historycity/historycity.js").init();
{%/script%}