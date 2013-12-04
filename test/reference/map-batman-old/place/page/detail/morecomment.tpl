{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%* place detail页布局样式 *%}
    <link rel="stylesheet"  type="text/css" href="/static/css/detail.inline.less?__inline">
    {%* 导航widget *%}
    {%widget name="common:widget/nav/nav.tpl" title="评论信息"%}

    <div class="place-page-detail">

        {%* 添加我要评论按钮 *%}
        {%widget name="place:widget/commentbtn/commentbtn.tpl" widget_data=$data.content%}

        {%widget
            name="place:widget/thirdcomment/thirdcomment.tpl"
            widget_data=[
                "data"=>$data.review,
                "uid"=>$data.uid,
                "order"=>$data.order,
                "comment_url"=>$data.comment_url,
                "bdcomment"=>$data.bdcomment
            ]
            pagelet_id="place-pagelet-bdcomment"
            mode="quickling"
        %}

        {%widget
            name="place:widget/thirdcomment/thirdcomment.tpl"
            widget_data=[
                "data"=>$data.content.ext.review,
                "src_name"=>$data.content.ext.src_name,
                "name"=>$data.content.name
            ]
            pagelet_id="place-pagelet-thirdcomment"
            mode="quickling"
        %}

        {%script%}
            (function(){
                var util = require('common:static/js/util.js'),
                    matches = location.href.match(/orderby=([0-9])/i);
                    param = util.jsonToUrl({
                        uid: '{%$data.content.uid%}',
                        startIndex: 0,
                        maxResults: 5,
                        orderBy: (matches && matches[1]) || 2
                    });

                    BigPipe.asyncLoad({id: 'place-pagelet-bdcomment'}, param);
                    BigPipe.asyncLoad({id: 'place-pagelet-thirdcomment'});

            })();
        {%/script%}
    </div>
{%/block%}
