define('index:widget/morecategory/morecategory.js', function(require, exports, module){

/**
 * @fileOverview 更多分类
 * @author yuanzhijia@baidu.com
 * @date 2013-08-06
 */
MY_GEO = "我的位置";
var loc = require('common:widget/geolocation/location.js'),
    parseurl = (require('common:widget/url/url.js')).get();
module.exports = {
    init : function () {
        this.render();
        this.bind();
    },
    /**
    * 反将页面元素填充至this
    */
    render : function () {
       this.parentele = $('.categoryparent');
       this.morecategory = $('#more-category');
       this.childele = $('.categorychild h4');
    },
    /**
    * 给元素绑定事件
    */
    bind : function () {
        var me = this;
        me.parentele.on('click', $.proxy(me['_handleClickEvent'], this));
        me._setCenterName();
        me.childele.on('click',$.proxy(me['_redirect'], this));
    },
    /**
    *单击标题转向
    */
    _redirect : function(e){
        var opts = this.getUrl($(e.target).text()),
            url = "/mobile/webapp/"+opts.action+"/"+opts.module+"/"+$.param(opts.query)+"/"+$.param(opts.pageState);
        location.href = url;
    },
    /*
    ** 展示和折叠下部详细内容
    */
    _handleClickEvent: function(e){
        var me = this,
            target = e.target;
        me.toggleClickedLiIcon(e);
    },
    /**
    * 获取检索的中心点名称
    */
    _setCenterName : function(){
        var pageState =  parseurl.pageState;
        var query =  parseurl.query;

        //若关键字wd如'建国门 美食'则展示中心点在建国门
        var wd = (query.wd || '').split('     ');
        if(wd[1] === '更多'){
            this.centerName = wd[0];
            return this.centerName;
        }

        if(pageState.center_name){
            return decodeURIComponent(pageState.center_name);
        } else if(loc.hasExactPoi()) {
            return MY_GEO;
        } else {
            return loc.getCity();
        }
    },
    /**
    * 切换点击的li元素的图标
    */
    toggleClickedLiIcon: function(e){
        var me = this,
                element = $(e.target).parent();
                childli = element.next('.rl_sub_list');
        if(childli.css('display') == 'none'){
            element.find('em').removeClass('rl_opt_close');
            element.find('em').addClass('rl_opt_open');
            $('.rl_sub_list').hide();
            childli.show();
        }else{
            element.find('em').removeClass('rl_opt_open');
            element.find('em').addClass('rl_opt_close');
            childli.hide();
        }
        me.currentLi = me.getCurrentLi(e.target);
        me._scrollToCurrentCategory();
    },
    /**
    *用户切换的时候滚动到用户可见的区域内
    */
    _scrollToCurrentCategory: function(){
        var me = this;
        var offset = $(me.currentLi).offset();
        window.scroll(0, offset.top);
    },
    /**
    * 获取点击的dom节点邻近li元素
    * @param {object} target 鼠标点击的dom节点
    * @return {object} parent 获取target邻近的li元素
    */
    getCurrentLi: function(target){
        var parent = target;

        if(parent.nodeName !== 'LI'){
            while(target.parentNode != null){
                if(target.parentNode.nodeName === 'LI'){
                    parent = target.parentNode;
                    break;
                }else{
                    target = target.parentNode;
                }
            }
        }

        return parent;
    },
    /**
    * 切换页面
    * @param {string} wd 关键字
    */
    getUrl: function(wd){
        //更多分类页各个类别的点击量        
        var opts = {
            module : "search",
            action : "search",
            query  : { 
                qt          : "s",
                wd          : this.centerName ? wd + ' ' + this.centerName : wd,
                searchFlag  : "more_cate",
                c           : loc.getCityCode() || 1
            },
            pageState : {

            }
        };

        opts = this.setCenterPoi(opts);

        //如果包含centerName变量，表示从某区发起的检索，删除中心点
        if(this.centerName){
            delete opts.query.nb_x;
            delete opts.query.nb_y;
            delete opts.query.center_rank;
            delete opts.pageState.center_name;
        }
        return opts;
    },
    // 设置中心点参数
    setCenterPoi : function(opts){
        var _opts = opts || {};
        _opts.query = _opts.query || {};
        _opts.pageState = _opts.pageState || {};

        var pageState = parseurl.pageState,
            query = parseurl.query;
        if(pageState && pageState.type == "searchnearby" || pageState && pageState.from == "searchnearby") {
            _opts.query["center_rank"] = 1;
            _opts.query["nb_x"] = query.nb_x;
            _opts.query["nb_y"] = query.nb_y;
            _opts.pageState["center_name"] = pageState.center_name;
            return _opts;
        }

        if(loc.hasExactPoi()) { //非周边检索
            _opts.query["center_rank"] = 1; //以位置为中心点进行周边检索 
            _opts.query["nb_x"] = loc.getPointX();
            _opts.query["nb_y"] = loc.getPointY();

            _opts.pageState["center_name"] = loc.isUserInput() ? loc.getAddress() : '我的位置';
        }
        return _opts;
    }
}

});