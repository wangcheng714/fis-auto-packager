define('index:widget/historycity/historycity.js', function(require, exports, module){

/**
 * @file 历史城市组件逻辑
 * @author xuyihan
 * @date 2013/08/01
 */
 'use strict';
 var setCity = require("common:widget/setcity/setcity.js");

module.exports = {
	init: function(){
		this.render();
		this.bind();
	},
	render: function(){

		var content = $('.history-content');
		var data = this._localStorage();
		if(data === undefined || data === ""){
			return;
		}else{
			$('.index-widget-historycity').show();
			data = data.split(encodeURIComponent(','));
			var ul = $('<ul class="historycity-list"></ul>');
			for (var i = 0; i < data.length; i++){
				var cityinfo = data[i].split('-');
				var cityName = cityinfo[0];
				var cityId = cityinfo[1];
				var cityeng = cityinfo[2];
				var span = $('<span class="historycity-item"></span>');
				span.attr('data-cityid',cityId);
				span.attr('data-city',cityName);
				span.attr('data-cityeng',cityeng);
				var li = $('<li ></li>');
				span.html(cityName);
				li.append(span);	
				ul.append(li);
				if( i == data.length - 1){
					var br = $("<br style='clear:both'>");
					ul.append(br);
				}
			}
			content.append(ul);
		}


	},
	/**
	* 绑定事件
	*/
	bind:function(){
		var me = this;
		var $cityWrap = $('.index-widget-allcity');
		$('.historycity-item').on('click',me._onClickCity);
		$('.history-clean').on('click',$.proxy(this._onCleanHistory, this));
	},
	_onCleanHistory:function(){
		this._localStorage(null);
		$('.index-widget-historycity').hide();
	},
	_onClickCity:function(e){
		var $dom = $(e.target);
		var cityName = $.trim($dom.data('city')),
			cityId = $dom.data('cityid'),
			cityeng = $dom.data('cityeng');
		
		setCity.setAndRedirect(cityName, cityId, cityeng);
	},

	_localStorage:function(value){
		 var ret,
            localdata,
            data,
            index,
            id='historyCity';

        try{
            if (value === null) window.localStorage[id] = '';
            else if (value !== undefined) {
                localdata = window.localStorage[id];
                data = localdata ? localdata.split(encodeURIComponent(',')) : [];
                var cityInfo = value.cityName + '-' + value.cityId + '-' + value.cityeng;
                if (!!~$.inArray(cityInfo, data)) {
                    index = data.indexOf(cityInfo);
                    data.splice(index, 1);
       
                }
                data.unshift(cityInfo);
                if(data.length > 5){
                    data.splice(5, 1);
                }
                window.localStorage[id] = data.join(encodeURIComponent(','));
            }
            ret = window.localStorage[id];
        } catch(e){}
        return ret;
	}

};


});