{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
{%* 头部导航 *%}
{%widget name="common:widget/nav/nav.tpl" title="地铁专题图"%}
{%widget name="subway:widget/subway/subway.tpl"%}
{%widget name="subway:widget/zoomcontrol/zoomcontrol.tpl"%}
{%widget name="subway:widget/popupwindow/popupwindow.tpl"%}
{%script%}
    var model = require('subway:static/js/model/subway.js');
    model.fetch({
        city: ('{%$data.city|f_escape_data%}' || 'beijing')
    }, function (data) {
        if (data.shortName) {
            $('.common-widget-nav .title span').text(data.shortName + '地铁');
        }

        var subway = require('subway:widget/subway/subway.js');
        subway.init(data);
        $("#swZoomControl").css({"visibility": ""});
    }, function (error) {
        var text = "您所在的城市不支持地铁专题图";
        if (error > -1) {
            text = "数据获取失败，请刷新页面"
        }    
        var popup = require('common:widget/popup/popup.js');
        popup.open({'text': text});
    });
{%/script%}
{%/block%}

{%block name="footer"%}{%/block%}