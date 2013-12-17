{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
{%* 头部导航 *%}
{%widget name="common:widget/nav/nav.tpl" title="地铁专题图"%}
{%widget name="subway:widget/subway/subway.tpl"%}
{%widget name="subway:widget/zoomcontrol/zoomcontrol.tpl"%}
{%widget name="subway:widget/popupwindow/popupwindow.tpl"%}
{%script%}
    var model = require('subway:static/js/model/subway.js');
    var locator = require('common:widget/geolocation/location.js');
    var city = '{%$data.city|f_escape_data%}';
    var default_city = locator.getCityCode() > 1 ? locator.getCityCode() : '';

    model.fetch({
        city: (city && city != 1 ? city : default_city)
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

        if (error < -1) {
            setTimeout(function() {
                var url = require('common:widget/url/url.js');
                url.update({
                    'module': 'index',
                    'action': 'setsubwaycity'
                });
            }, 2000);
        }
    });
{%/script%}
{%/block%}

{%block name="footer"%}{%/block%}