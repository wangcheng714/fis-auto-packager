{%style id="/widget/captain/captain.inline.less"%}.place-widget-captain{position:relative;font-size:14px}.place-widget-captain .name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700;line-height:1.2;font-size:1.07em;color:#4d4d4d;margin-bottom:10px}.place-widget-captain .addr{color:#4d4d4d;font-size:.85em}.place-widget-captain.movie{background-color:#fff;border:1px solid;border-color:#e4e4e4;border-radius:3px 3px 0 0;border-bottom:0;padding:10px}{%/style%}<div class="place-widget-captain {%if $ism%}movie{%/if%}">
<div class="name" id="place-widget-captain-name">{%htmlspecialchars_decode($widget_data._name)%}</div>
{%if (!empty($widget_data.addr))%}
<div class="addr">地址：{%htmlspecialchars_decode($widget_data.addr)%}</div>
{%/if%}
</div>
{%script%}
    require('place:widget/captain/captain.js');
{%/script%}