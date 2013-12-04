{%* 查天气 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%widget name="common:widget/nav/nav.tpl" title="查天气"%}
{%widget name="third:widget/weather/weather.tpl" pagename="weather"%}
{%/block%}
{%block name="footer"%}
{%widget name="third:widget/footer/footer.tpl"%}
{%require name='third:page/weather.tpl'%}{%/block%}
