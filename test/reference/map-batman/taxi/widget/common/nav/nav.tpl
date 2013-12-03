<div class="taxi-widget-nav">
    <div class="title">{%$title%}</div>
    {%if (!empty($btnBack))%}
    <button class="btn-back" data-back="{%$back%}">返回</button>
    {%/if%}
</div>
{%script%}
require('nav.js').init();
{%/script%}