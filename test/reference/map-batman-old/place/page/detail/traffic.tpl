{%* 交通 *%}

{%extends file="place/page/detail/base.tpl"%}
{%block name="richInfo"%}
    {%$widget_rich_list=[
	    [
            "tpl"=>"place:widget/petroprice/petroprice.tpl",
            "isShow"=>$data.widget.petroprice,
            "data"=>$data.content.ext.detail_info.oril_info.oril_detail
        ]
    ]%}
    {%foreach from=$widget_rich_list item=widget_item%}
        {%widget name=$widget_item.tpl widget_data=$widget_item.data pagelet_id=preg_replace('/(\w+)\:widget\/(\w+)\/(\w+)\.tpl/', '$1-pagelet-$2', $widget_item.tpl) mode="quickling"%}
    {%/foreach%}
{%/block%}
