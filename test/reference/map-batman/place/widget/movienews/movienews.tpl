{%* 参数：$widget_data *%}
{%if ($data.widget.movienews)%}
<div class="place-widget-movienews">
    <div class="movienews-content">
    </div>
    <div class="movienews-loading">
        正在获取实时影讯信息...
    </div>
</div>
{%script%}
    require.async(['place:widget/movienews/movienews.js'], function(m) {
        m.init("{%$widget_data.uid%}", "{%$widget_data.other_info.webview_style%}", "{%$smarty.now|date_format:"%Y-%m-%d"%}");
    });
{%/script%}
{%/if%}
