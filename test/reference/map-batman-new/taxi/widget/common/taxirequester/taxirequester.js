/**
 * @file taxirequester 打车请求发送的封装
 * @author liushuai02@baidu.com
 */
var stat = require('common:widget/stat/stat.js'),
    storage = require('taxi:static/js/storage.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    dialog = require('taxi:widget/common/dialog/dialog.js'),
    exports = {
        request: function (options) {
            var that = this;
            if (Boolean(storage.get('notShowDialogBeforeSubmit')) === false) {
                dialog.create({
                    content: [
                        '<div class="text">确定发起打车？</div>',
                        '<input type="checkbox" value="1" class="taxi-ui-checkbox" id="not-show-dialog-before-submit" />',
                        '<label for="not-show-dialog-before-submit"><span class="icon"></span>下次不再提醒</label>'
                    ].join(''),
                    buttons: {
                        '确定': function () {
                            if (this.$el.find('input').attr('checked')) {
                                storage.set('notShowDialogBeforeSubmit', true);
                            }
                            that.submit(options);
                            this.close();
                        },
                        '取消': function () {
                            this.close();
                        }
                    }
                }).open();
            } else {
                this.submit(options);
            }
        },
        submit: function (options) {
            // 发送请求
            popup.open({
                text: '正在发送打车请求...',
                layer: true,
                autoCloseTime: 0
            });

            LoadManager.request({
                data: options,
                success: function (data) {
                    storage.set('orderId', data.info.order_id);
                    storage.set('orderStartTime', Date.now());
                    LoadManager.loadPage('waiting', $.extend({}, options, data.info));
                    stat.addStat(STAT_CODE.TAXI_USERREQ, {
                        addPrice: options.add_price
                    });
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -121:
                            text = '发单太频繁，请稍后再试！';
                            break;
                        case -101:
                            text = '请求参数错误！';
                            break;
                        default:
                            text = '系统错误！';
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        }
    };
module.exports = exports;