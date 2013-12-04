{%* 公交地图页 *%}
{%extends file="common/page/maplayout.tpl"%}
{%block name="header"%}{%/block%}
{%block name="main"%}
    {%$title = join('>', array($data.result.start.wd, $data.result.end.wd))%}
    {%widget name="common:widget/nav/nav.tpl" title=$title%}
    {%script%}
        var data = {%json_encode($data)%};
        require('common:widget/map/map.js').init(function(){
            //各模块地图相关业务代码初始化
            require('transit:widget/helper/maphelper.js').init(data);
        });
    {%/script%}
{%/block%}
{%block name="footer"%}{%/block%}