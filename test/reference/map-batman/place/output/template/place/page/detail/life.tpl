{%* 生活 *%}
{%extends file="place/page/detail/base.tpl"%} 
{%block name="detailInfo"%}
{%if $data.isMovieth%}
{%*widget name="place:widget/basicmovieinfo/basicmovieinfo.tpl" widget_data=$data.content.ext pagelet_id="place-pagelet-basicinfo" mode="quickling"*%}
{%else%}
{%widget name="place:widget/basicinfo/basicinfo.tpl" widget_data=$data.content.ext pagelet_id="place-pagelet-basicinfo" mode="quickling"%}
{%/if%}
{%/block%}
{%block name="richInfo"%}
{%if $data.isMovieth%}
{%$widget_rich_list=[
            [
                "tpl"=>"place:widget/movienews/movienews.tpl",
                "isShow"=>$data.widget.movienews,
                "data"=>[
                    "other_info"=>$data.content.ext.other_info,
                    "uid"=>$data.uid
                ]
            ],
            [
                "tpl"=>"place:widget/basicmovieinfo/basicmovieinfo.tpl",
                "isShow"=>$data.content.ext.detail_info,
                "data"=>["data"=>$data.content.ext,
                    "src_name"=>$data.content.ext.src_name]
            ],
            [
                "tpl"=>"place:widget/promotionm/promotionm.tpl",
                "isShow"=>$data.widget.promotionm,
                "data"=>["data"=>$data.content.ext.detail_info,
                    "src_name"=>$data.content.ext.src_name,
                    "name"=>$data.content.name]
            ],

            [
                "tpl"=>"place:widget/comment/comment.tpl",
                "isShow"=>$data.widget.comment,
                "data"=>["data"=>$data.content.ext,
                         "src_name"=>$data.content.ext.src_name,
                         "name"=>$data.content.name]
            ]
        ]%}
{%else%}
{%$widget_rich_list=[
            [
                "tpl"=>"place:widget/petroprice/petroprice.tpl",
                "isShow"=>$data.widget.petroprice,
                "data"=>$data.content.ext.detail_info.oril_info.oril_detail
            ],
            [
                "tpl"=>"place:widget/movienews/movienews.tpl",
                "isShow"=>$data.widget.movienews,
                "data"=>[
                    "other_info"=>$data.content.ext.other_info,
                    "uid"=>$data.uid
                ]
            ],
            [
                "tpl"=>"place:widget/promotion/promotion.tpl",
                "isShow"=>$data.widget.promotion,
                "data"=>["data"=>$data.content.ext.detail_info,
                    "src_name"=>$data.content.ext.src_name,
                    "name"=>$data.content.name]
            ],
            [
                "tpl"=>"place:widget/overview/overview.tpl",
                "isShow"=>$data.widget.overview,
                "data"=>["data"=>$data.content.ext.rich_info,
                         "src_name"=>$data.content.ext.src_name,
                         "name"=>$data.content.name]
            ],
            [
                "tpl"=>"place:widget/comment/comment.tpl",
                "isShow"=>$data.widget.comment,
                "data"=>["data"=>$data.content.ext,
                         "src_name"=>$data.content.ext.src_name,
                         "name"=>$data.content.name]
            ],
            [
                "tpl"=>"place:widget/sitelink/sitelink.tpl",
                "isShow"=>$data.widget.sitelink,
                "data"=>["data"=>$data.content.ext.detail_info.link,
                         "src_name"=>$data.content.ext.src_name,
                         "name"=>$data.content.name]
            ]
        ]%}
{%/if%}
{%foreach from=$widget_rich_list item=widget_item%}
{%widget name=$widget_item.tpl widget_data=$widget_item.data pagelet_id=preg_replace('/(\w+)\:widget\/(\w+)\/(\w+)\.tpl/', '$1-pagelet-$2', $widget_item.tpl) isMovie=$data.isMovieth mode="quickling"%}
{%/foreach%}
{%require name='place:page/detail/life.tpl'%}{%/block%}
