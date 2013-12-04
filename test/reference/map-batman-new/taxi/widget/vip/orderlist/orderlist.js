/**
 * @file 订单列表
 */
require('taxi:static/js/template.js');
// 这句变量定义写到逗号运算符中会导致变异出错！！
/* jshint ignore: start */
var listItemTemplate = __inline('listitem.tmpl');
/* jshint ignore: end*/
var storage = require('taxi:static/js/storage.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    exports = {
        create: function () {
            var $el = $('.taxi-widget-vip-orderlist'),
                $listContainer = $el.find('.list-container');

            // 设置$listContainer高度
            $listContainer.height(window.innerHeight - 50);

            this.$listContainer = $listContainer;
            $listContainer.on('click', $.proxy(this.onListContainerClick, this));
        },
        onListContainerClick: function(e) {
            if(e.target.className === 'btn-retry') {
                this.resubmit(e.target);
            }
        },
        resubmit: function(target) {
            var $target;
            popup.open({
                text: '正在重新发送打车请求...',
                layer: true
            });
            LoadManager.request({
                data: {
                    qt: 'addpricereq',
                    city_code: storage.get('cityCode'),
                    add_price: '0',
                    order_id: target.getAttribute('data-order-id')
                },
                success: function() {
                    popup.open({
                        text: '发送成功！',
                        layer: true
                    });
                    $target = $(target);
                    $target.parent().append('<div class="status">推送中</div>');
                    $target.remove();
                },
                error: function(data) {
                    var text = '';
                    switch (data.errno) {
                        case -101:
                            text = '参数错误！';
                            break;
                        case -304:
                            text = '订单已失效，请建立新单发送！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        },
        loadList: function() {
            var $listContainer = this.$listContainer;

            LoadManager.request({
                data: {
                    qt: 'myorder',
                    third_phone: storage.get('thirdPhone')
                },
                success: function (data) {
                    $listContainer && $listContainer.html('').append(listItemTemplate(data));
                }
            });
        },
        destroy: function() {
            clearInterval(this.interval);
        },
        init: function () {
            this.create();
            this.loadList();
            this.interval = setInterval($.proxy(this.loadList, this), 30000);
        }
    };

module.exports = exports;