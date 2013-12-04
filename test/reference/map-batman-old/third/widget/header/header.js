/**
 * @fileOverview 头部导航逻辑
 */

var quickdelete = require('common:widget/quickdelete/quickdelete.js');
var suggestion  = require('common:widget/suggestion/suggestion.js');
var poisearch   = require('common:widget/search/poisearch.js');
var stat        = require('common:widget/stat/stat.js');


var $header = $(".common-widget-header");

/**
 * 绑定用户点击事件
 * @return {void}
 */
var bind = function () {
	var $searchBtn = $header.find(".sb-wrapper");
	$searchBtn.on("click", _onClickSearchBtn);
	$header.find(".se-poi-form").on("submit", _onFormSubmit);
	$header.find(".p-btn-submit").on("click", _submit);

	initSug();
}


/**
 * 处理点击下拉搜索框
 * @return {[type]}
 */
var _onClickSearchBtn = function () {
	var $searchBar = $header.find(".se-wrap");
	$searchBar.toggleClass("hide");

	// 搜索按钮点击量  add by cdq
	stat.addStat(COM_STAT_CODE.HEADER_SEARCH_CLICK);
}

var _onFormSubmit = function (evt) {
	evt.preventDefault();
	_submit();
}

var _getValue = function () {
	return $header.find("input").val();
}

var _submit = function () {
	var word = _getValue();
	var $input = $header.find("input");
	if(!_checkInput($input)){
        return false;
    }

	// 通过头部搜索框发起检索的量 by cdq
    stat.addCookieStat(COM_STAT_CODE.HEADER_USER_SEARCH_TOTAL);

    poisearch.search(word);
}

    /**
     * 检查表单元素内容是否为空 自动聚焦
     * @param {Element} element
     * @return {Boolean} 是否检查通过
     * @author jican
     * @date 2013/01/21
     */
var _checkInput = function (element) {
        if(!element) {
            return false;
        } else if (!/\S+/.test(element.val())) {
            element.focus();
            return false;
        }
        return true;
    }

/**
 * 初始化suggestion
 * @return {[type]}
 */
var initSug = function () {
	// 注册quickdelete
	var _poiQuick = $.ui.quickdelete({
            container: '#pro_txt_poi',
            offset: {
                x: 0,
                y: 2
            }
        });
	
    var poiSearchSugg = $.ui.suggestion({
        container: "#pro_txt_poi",
        mask: "#p_se_poi",
        source: "http://map.baidu.com/su",
        listCount: 6, // SUG条目
        posAdapt: false, // 自动调整位置
        isSharing: true, // 是否共享
        offset: { // 设置初始偏移量
            x: 0,
            y: 52
        },
        param: $.param({
            type: "0",
            newmap: "1",
            ie: "utf-8"
        }),
        onsubmit: function() { //兼容widget老版，采用onEventName方式绑定
            var word = this.getValue();
			var $input = $header.find("input");
            $input.val(word);
            if (!word) {
                return;
            } else {
	            _submit();
            }
        }
    });
}

/**
 * 初始化
 * @return {void}
 */
module.exports.init = function () {
	bind();

}