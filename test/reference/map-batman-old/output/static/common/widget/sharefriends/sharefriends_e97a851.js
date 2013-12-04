define('common:widget/sharefriends/sharefriends.js', function(require, exports, module){

/**
* @file 分享给好友
* @author nichenjian@baidu.com
*/


var util  = require('common:static/js/util.js'),
    href  = require('common:widget/url/url.js'),
    stat  = require('common:widget/stat/stat.js');

ShareToFriends = {
	/**
	* 分享给好友初始化
	* @param {string} type 分享的页面类型，支持transit, drive, walk
	*/
	init: function(type){
		this.type = type;
		this.bindEvent();
	},
	bindEvent: function(){
		$('.send-phone').on('click', $.proxy(this.shareToFriends, this));
	},
	/**
    * 发送短信将位置共享给好友
    * 用户点击时，异步获取短信信息，获取成功后将自动触发click事件
    * @param {object} e 事件对象
    */
    shareToFriends: function(e){
        var me = this;
        var $share = $('#share-to-friends');
        var value = $share.attr('href');
        //链接已经包含短信，直接触发短信
        if(value && value.indexOf('body') > -1){
            return;
        }
        if(this.type == 'transit'){
        	var url = me.getTransitSmsUrl();
        }else{
        	var url = me.getSmsUrl();
        }
        
        //成功回调
        var successCallback = function(data){
            if(!data || !data.sms_content){
                return;
            }

            var content = data.sms_content;
            $share.attr('href', 'sms:?body=' + content);
            //模拟触发用户click事件
            me.fireEvent($share[0],'click');
        }
        //失败回调
        var errorCallback = function(data){}

        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: successCallback,
            error: errorCallback
        })

        e.preventDefault();
        //分享给好友的点击统计
        stat.addStat(COM_STAT_CODE.SHARESMS_CLICK);
    },
    /**
    * 获取公交详情短信的url
    * @return {string} 拼装后短信的url
    */
    getTransitSmsUrl: function(){
        var location  = href.get();
        var query = location.query || {};
        var state = location.pageState || {};
        var i = state.i + ',1,1';
        //ready接口基础url
        var BASE_READY_URL = 'http://map.baidu.com/ag/sms/ready?url=';
        //qt的url
        var BASE_QT_URL = 'http://map.baidu.com/?i='+ i + '&s=' + query.qt;

        //编码的query
        var q = encodeURIComponent('&' + util.jsonToQuery(query));
        //需要将qt和query再次编码
        var url = BASE_READY_URL + encodeURIComponent(BASE_QT_URL + q + '&sc=0&smsf=1') + '&t=' + new Date().getTime();
        return url;
    },
    /**
    * 获取短信的url, 驾车和步行进入此逻辑
    * @return {string} 拼装后短信的url
    */
    getSmsUrl: function(){
        var location = href.get();
        var query = location.query || {};
        //ready接口基础url
        var BASE_READY_URL = 'http://map.baidu.com/ag/sms/ready?url=';
        //qt的url
        var BASE_QT_URL = 'http://map.baidu.com/?s=' + query.qt;

        //删除version参数，防止短信接口不返回里程。
        delete query.version;

        //编码的query
        var q = encodeURIComponent('&' + util.jsonToQuery(query));
        //需要将qt和query再次编码
        var url = BASE_READY_URL + encodeURIComponent(BASE_QT_URL + q + '&sc=0&smsf=1') + '&t=' + new Date().getTime();
        return url;
    },
    /**
    * 触发事件
    * @param {object} dom节点
    * @param {string} evt事件，如'click' 
    */
    fireEvent: function(obj, evt){
        var fireOnThis = obj;
        if( document.createEvent ) {
            var evObj = document.createEvent('MouseEvents');
            evObj.initEvent( evt, true, false );
            fireOnThis.dispatchEvent( evObj );
        }
    }
};

module.exports = ShareToFriends;

});