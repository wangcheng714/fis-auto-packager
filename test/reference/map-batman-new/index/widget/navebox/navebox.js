var url = require('common:widget/url/url.js');

module.exports = {
    init: function() {
        this.bind();
    },

    bind: function() {
        $('.index-widget-navebox [jsaction]').on('click', $.proxy(this.go, this));
    },

    go: function(e) {
        var target = $(e.currentTarget);
        switch (target.attr('jsaction')) {
            case 'toNearBySearch':
                url.update({
                    module: 'index',
                    action: 'index',
                    query: {
                        'foo': 'bar'
                    },
                    pageState: {
                        vt: ''
                    }
                }, {
                    queryReplace: true,
                    pageStateReplace: true
                });
                break;

            case 'toMapSearch':
                url.update({
                    module: 'index',
                    action: 'index',
                    query: {
                        'foo': 'bar'
                    },
                    pageState: {
                        vt: 'map'
                    }
                }, {
                    queryReplace: true,
                    pageStateReplace: true
                });
                break;
        }
        return false;
    }
};