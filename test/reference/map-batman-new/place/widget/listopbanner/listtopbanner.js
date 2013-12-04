/**
 * Place电影列表页头部Banner
 */
var ListTopBanner = function () {
    this.init();
};

ListTopBanner.prototype = {
    init: function () {
        this.$el = $('#place-widget-listtopbanner');
        this.getBannerData();
    },
    getBannerData: function () {
        $.ajax({
            'url': '/detail?qt=mcdkey&act=advert&from=webapp',
            'type': 'GET',
            'dataType': 'json',
            'context': this,
            'success': function (rs) {
                var data = rs ? ($.isArray(rs.list) ? rs.list[0] : null) : null;
                if (!data) { return; }
                this.render(data);
            }
        });
    },
    render: function (data) {
        var $bg = this.$el.find('.bg');
        var $banner = this.$el.find('.banner');

        $bg.css('background-color', data.background_color || '#ffffff');
        $banner.css({
            'background-image': 'url('+data.image_url+')',
            'background-position': 'center'
        });
        $banner.attr('href', data.link_url);
        this.$el.show();
    }
};

module.exports.init = function () {
    return new ListTopBanner();
};