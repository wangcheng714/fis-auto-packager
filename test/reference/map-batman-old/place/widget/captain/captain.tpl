<div class="place-widget-captain {%if $ism%}movie{%/if%}">
    
	<div class="name" id="place-widget-captain-name">{%htmlspecialchars_decode($widget_data._name)%}</div>

    {%if (!empty($widget_data.addr))%}
    <div class="addr">地址：{%htmlspecialchars_decode($widget_data.addr)%}</div>
    {%/if%}

</div>
{%script%}
    require('captain.js');
{%/script%}