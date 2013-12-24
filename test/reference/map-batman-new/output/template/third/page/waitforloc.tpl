{%extends file="common/page/nocontent.tpl"%} 
{%block name="content"%}
{%widget name="common:widget/header/header.tpl"%}
{%widget name="common:widget/nav/nav.tpl" title="获取定位" noBack=1%}
{%widget name="index:widget/waitforloc/waitforloc.tpl"%}
{%widget name="common:widget/footer/footer.tpl"%}
<img id="statImg" style="display:none"/>
{%json file="common/statcode.json" assign="COM_STAT_CODE"%}
{%script%}
        COM_STAT_CODE = {%json_encode($COM_STAT_CODE)%} || {};
        window._DEFAULT_CITY = {%json_encode($initData)%} || {};
        (require('index:widget/waitforloc/waitforloc.js')).init();
        // 设置app高度
        require('common:widget/appresize/appresize.js');
    {%/script%}
{%require name='third:page/waitforloc.tpl'%}{%/block%}
