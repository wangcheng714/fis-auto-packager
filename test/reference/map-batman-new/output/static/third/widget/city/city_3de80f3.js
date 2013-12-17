define('third:widget/city/city.js', function(require, exports, module){

var url = require("common:widget/url/url.js");

var ChangeCity = {
	init: function(){
		this.bindEvent();
	},
	bindEvent: function(){
		$('.change-city').on('click', $.proxy(this.changeCity, this));
	},
	changeCity: function(e){
		var path = window.location.pathname,
			module, action;

		if(window._APP_HASH.module === 'third' 
			&& window._APP_HASH.action === 'traffic'){
			module = 'third';
			action = 'settrafficcity';
		}else{
			module = 'third';
			action = 'changecity';
		}

	    url.update({
            module : module,
            action : action,
            query  : {
                'refer' : encodeURIComponent(path)
            }
        },{
            queryReplace: true
        });
        return false;	
	}
};

module.exports = ChangeCity;


});