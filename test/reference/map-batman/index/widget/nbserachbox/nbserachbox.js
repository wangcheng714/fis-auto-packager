/**
 * @fileOverview 更多分类
 * @author yuanzhijia@baidu.com
 * @date 2013-08-06
 */
MY_GEO = "我的位置";
var loc = require('common:widget/geolocation/location.js'),
    parseurl = (require('common:widget/url/url.js').get()),
    stat = require('common:widget/stat/stat.js');
module.exports = {
    init : function () {
        this.render();
        this.bind();
    },
    /**
    * 反将页面元素填充至this
    */
    render : function () {
       this.searchmorenearby = $('#index-widget-nbserachbox');
       this.searchInput = $('#search-input');
       this.DEFAULT_VALUE = "输入其他分类";
       this.searchBtn = $('#search-button');
       this.searcForm = $('#search-form');
    },
    /**
    * 给元素绑定事件
    */
    bind : function () {
        var me = this;
        me._renderCenterName();
        me.searchInput.on('focus', $.proxy(me._clearInput, this));
        me.searchInput.on('blur', $.proxy(me._resetInput, this));
        me.searcForm.on('submit', $.proxy(me._searchPoint, this));
        me.searchBtn.on('click', $.proxy(me._searchPoint, this));
    },
    _renderCenterName: function(){
       var centerName = this._getCenterName()
        me  = this;
        me.searchmorenearby.prepend('<p id="search-more-nearby">在 <span class="center-name">' + centerName + '</span> 附近找</p>');
    },
    // 获取检索的中心点名称
    _getCenterName : function(){
        var pageState =  parseurl.pageState;
        var query =  parseurl.query;
        //若关键字wd如'建国门 美食'则展示中心点在建国门
        var wd = (query.wd || '').split('     ');
        if(wd[1] === '更多'){
            this.centerName = wd[0];
            return this.centerName;
        }

        if(pageState.center_name){
            return pageState.center_name;
        } else if(loc.hasExactPoi()) {
            return MY_GEO;
        } else {
            return loc.getCity();
        }
    },
    _clearInput: function(e){
        var me = this;
        var $input = $(e.target);
        if($input.val() === me.DEFAULT_VALUE){
            $input.val('');
            $input.removeClass('ipt-default');
        }
    },
    _resetInput: function(e){
        var me = this;
        var $input = $(e.target);
        var value = $input.val();
        if($.trim(value) === ''){
            $input.val(me.DEFAULT_VALUE);
            $input.addClass('ipt-default');
        }
    },
    /**
    * 检索地点
    * @param {object} e 事件对象
    */
    _searchPoint: function(opts){
        if(opts && opts.stopPropagation) {
            opts.stopPropagation(); /*阻止冒泡*/
        }
        if(opts && opts.preventDefault) {
            opts.preventDefault(); /*阻止表单默认事件的派发*/
        }
        var me = this;
        var $input = $('#search-input');
        var value = $input.val();

        //收起输入框
        $input.get(0).blur();

        if(me._checkValueValid(value)){
            me.search($.trim(value));
        }else{
            return;
        }
        return false;
    },
    /**
    * 检查用户输入是否合法
    * @param {string} value 用户输入
    * @return {bool} 
    */
    _checkValueValid: function(value){
        if($.trim(value) !== '' && $.trim(value) !== this.DEFAULT_VALUE){
            return true;
        }else{
            return false;
        }
    },
    search : function(val){
        if (parseurl.action == "more") {
            stat.addStat(STAT_CODE.STAT_MORE_CATEGORY_SEARCH_INPUT);
        };
        var me = this ,param = me._getDirParam($.trim(val));
        location.href = "/mobile/webapp/search/search/"+$.param(param);
    },
    _getDirParam: function(word, opts){
        if(!word || !(typeof(word)=="string")) {
            return;
        }

        opts = opts || {};
        var param = {
            'qt'            : 's',
            'wd'            : this.centerName ? word + ' ' + this.centerName : word ,
            'c'             : loc.getCityCode() || 1,
            'searchFlag'    : opts.from || ''
        };  

        var pagestate =  parseurl.pageState;

        //若pagestate中存在x,y点，则将点放入query中进行检索，否则检查是否精确定位成功，将精确点放入query
        if(pagestate.nb_x && pagestate.nb_x){
            param['nb_x'] = pagestate.nb_x;
            param['nb_y'] = pagestate.nb_y;
            param['center_rank'] = 1; 
            param['center_name'] = pagestate.center_name;        
        }else if(loc.hasExactPoi()) {
            param['nb_x'] = loc.getPointX();
            param['nb_y'] = loc.getPointY();
            param['center_rank'] = 1;
        }
        
        param['searchFlag'] = "more_cate";
        return param;     
    }
}