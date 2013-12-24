{%extends file="taxi/page/base.tpl"%} 
{%block name="wrapper"%}
{%widget name="taxi:widget/home/home.tpl" mode="quickling" pagelet_id="taxi-pagelet-home"%}
{%widget name="taxi:widget/waiting/waiting.tpl" mode="quickling" pagelet_id="taxi-pagelet-waiting"%}
{%widget name="taxi:widget/resubmit/resubmit.tpl" mode="quickling" pagelet_id="taxi-pagelet-resubmit"%}
{%widget name="taxi:widget/response/response.tpl" mode="quickling" pagelet_id="taxi-pagelet-response"%}
{%widget name="taxi:widget/settings/settings.tpl" mode="quickling" pagelet_id="taxi-pagelet-settings"%}
{%widget name="taxi:widget/verify/verify.tpl" mode="quickling" pagelet_id="taxi-pagelet-verify"%}
{%widget name="taxi:widget/about/about.tpl" mode="quickling" pagelet_id="taxi-pagelet-about"%}
{%widget name="taxi:widget/channel/channel.tpl" mode="quickling" pagelet_id="taxi-pagelet-channel"%}
{%widget name="taxi:widget/shuangdan/shuangdan.tpl" mode="quickling" pagelet_id="taxi-pagelet-shuangdan"%}
{%require name='taxi:page/index.tpl'%}{%/block%}
