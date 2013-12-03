{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%* 导航widget *%}
{%widget name="common:widget/nav/nav.tpl" title="我去过{%$data.name|f_escape_data%}" addcommentLink=true%}
{%widget name="place:widget/icomment/icomment.tpl" uid=$data.uid url=$data.action_url%}
{%require name='place:page/detail/icomment.tpl'%}{%/block%}
