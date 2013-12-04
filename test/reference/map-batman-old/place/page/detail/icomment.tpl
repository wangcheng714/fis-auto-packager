{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%* 导航widget *%}
    {%widget name="common:widget/nav/nav.tpl" title="我去过{%$data.name%}" addcommentLink=true%}

    {%widget name="place:widget/icomment/icomment.tpl" uid=$data.uid url=$data.action_url%}
{%/block%}
