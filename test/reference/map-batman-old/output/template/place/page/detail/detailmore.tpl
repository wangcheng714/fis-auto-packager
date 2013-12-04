{%extends file="common/page/layout.tpl"%}

{%block name="js"%}
    {%require name="common:static/js/util.js"%}
    {%require name="common:widget/stat/stat.js"%}
{%/block%}

{%block name="main"%}
	{%$widget_list=[
        [
            "tpl"=>"place:widget/groupon/groupon.tpl",
            "isShow"=>$data.widget.groupon,
            "data"=>[
                "groupon"=>$data.content.ext.detail_info.groupon,
                "src_name"=>$data.content.ext.src_name,
                "name"=>$data.content.name
            ]
        ],
        [
            "tpl"=>"place:widget/premium/premium.tpl",
            "isShow"=>$data.widget.premium,
            "data"=>[
                "premium"=>$data.content.ext.detail_info.premium2,
                "uid"=>$data.content.uid,
                "src_name"=>$data.content.ext.src_name,
                "name"=>$data.content.name
            ]
        ]
    ]%}
    {%foreach from=$widget_list item=widget_item%}
        {%widget name=$widget_item.tpl widget_data=$widget_item.data%}
    {%/foreach%}
{%require name='place:page/detail/detailmore.tpl'%}{%/block%}