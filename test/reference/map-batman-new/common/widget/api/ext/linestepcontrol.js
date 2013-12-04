var util        = require('common:static/js/util.js'),
    stat        = require('common:widget/stat/stat.js'),
    BaseControl = require('common:widget/api/ext/basecontrol.js'),
    stat = require('common:widget/stat/stat.js');

function LineStepControl(){
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
    this.isOn = false;
}
LineStepControl.prototype = new BaseControl();
$.extend(LineStepControl.prototype, {
    initialize: function(map){
        this._map = map;
        var box = this._content = document.createElement("div"),
        	arrowTpl = "<b></b>";

        box.className = "line_step";
        // box.cssText = "margin:100px;";

        var preBtn = document.createElement("div");
        preBtn.className = "step_pre";
        preBtn.innerHTML = arrowTpl;
        box.appendChild(preBtn);

        var nextBtn = document.createElement("div");
        nextBtn.className = "step_next";
        nextBtn.innerHTML = arrowTpl;
        box.appendChild(nextBtn);

        this.container = box;
        this.preBtn = preBtn;
        this.nextBtn = nextBtn;

        map.getContainer().appendChild(box);
        this.bind()
        return box;
    }
    ,bind: function(){
        var me = this;
        $(me.preBtn).on("touchend",function(){
        	me.goPreStop();
        });
        $(me.nextBtn).on("touchend",function(){
        	me.goNextStop();
        });
    }
    ,setIWCon: function(infoWindow) {
        this.iwCon = infoWindow;
    }
    /**
     * 跳转到前一个线路
     */
    ,goPreStop : function(){
        if (this.iwCon && this.iwCon.pre()){
            // 统计点击上一步的点击量
            stat.addStat(COM_STAT_CODE.MAP_LINE_STEP_PRE);
        }
    }
    /**
     * 跳转到后一个线路
     */
    ,goNextStop : function(){
        if (this.iwCon && this.iwCon.next()){
            // 统计点击下一步的点击量
            stat.addStat(COM_STAT_CODE.MAP_LINE_STEP_NEXT);
        }
    }
    ,draw : function(){
        this.container.style.margin = "";
    }

    /**
     * 启用按钮
     * @param {string} type 
     */
    ,ableBtn : function(type){
        if(typeof type !=="string"
            || !(type === "pre" || type === "next")){
            return;
        }
        var btn = type == "pre" ? this.preBtn : this.nextBtn;
        this._able(btn);
    }

    /**
     * 禁用按钮
     */
    ,disableBtn : function(type){
        if(typeof type !=="string"
            || !(type === "pre" || type === "next")){
            return;
        }
        var btn = type == "pre" ? this.preBtn : this.nextBtn;
        this._disable(btn);
    }
    /**
     * 设置按钮可点
     * @param {HTMLElement} ele    
     */
    ,_able : function(ele){
        if(!ele){
            return;
        }
        if($(ele).hasClass("able")) {
            return;
        }
        $(ele).removeClass("disable");
    }
    /**
     * 设置按钮不可点
     * @param {HTMLElement} ele    
     */
    ,_disable : function(ele){
        if(!ele){
            return;
        }
        if($(ele).hasClass("disable")) {
            return;
        }
        $(ele).addClass("disable");
    }
    /**
     * 重新设置控件位置
     */
    ,setPos : function() {
        var l = parseInt( (util.getClientSize().width - this.width)/2, 10);
        this.x = l;
        this.setPosition();
    }
    /**
     * 隐藏控件
     */
    ,hide : function(){
        this.isOn = false;
        //CtrMgr.cc["lineCtrl"].on = false;
        BaseControl.prototype.hide.call(this);
    }
    /**
     * 显示控件
     */
    ,show : function(){
        this.isOn = true;
        //CtrMgr.cc["lineCtrl"].on = true;
        BaseControl.prototype.show.call(this);
    }
});

LineStepControl._className_ = 'LineStepControl';

module.exports = LineStepControl;