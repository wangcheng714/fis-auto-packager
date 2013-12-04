
/**
 * 街景中间页
 * by likun
 * @return {[type]} [description]
 */
var util = require('common:static/js/util.js'),
	url = require('common:widget/url/url.js');

module.exports.init = function () {
	bind();
};

var bind = function	(){
	$('.index-widget-sventry .city-item').on('click', function(e){
		//统计待修改 likun
		_onClickCity($(this));
	});
};

var _onClickCity = function(elem) {
	var dataStr = elem.attr('data');
	eval('var dataObj = ' + dataStr);
	window.egg = dataObj;
	//elem.attr("href", _getSvUrl(dataObj));
    url.update({
        module: 'index',
        action: 'streetview',
        query: {
        	ss_id : dataObj.sid,
        	ss_heading : dataObj.heading,
        	ss_pitch : dataObj.pitch
        }
    }, {
        queryReplace: true
    });


};

var _getSvUrl = function(opts){
	// /mobile/webapp/index/streetview/ss_id=0100220000130817164842340J5&ss_heading=-4.699&ss_pitch=5.04/vt=streetview
	var retUrl = '/mobile/webapp/index/streetview/ss_id=';
	window.egg = opts;
	retUrl += opts.sid + '&ss_heading=' + opts.heading + '&ss_pitch=' + opts.pitch;
	return retUrl;
}