{%* 首页 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
<style type="text/css">.index-page-nearby-hd{margin:35px 0 6px;font-size:16px;padding-left:14px;color:#575757;display:none}</style>
<script type="text/javascript">"use strict";if(window.EventRecorder=function(e,t){var n={click:!0},i={MouseEvent:"initMouseEvent",MouseEvents:"initMouseEvent"};n={click:!1,touchstart:!0,touchmove:!0,touchend:!0};var r,c={add:function(e,i){var r;e=e||t;for(r in n)n[r]&&e.addEventListener(r,i,!1)},remove:function(e,i){var r;e=e||t;for(r in n)n[r]&&e.removeEventListener(r,i,!1)},execute:function(e,t){if(e){var i=c.simulate(e.event);"function"==typeof n[i.type]&&n[i.type](i),"function"==typeof t&&t()}},simulate:function(e){var t=this.create(e);return this.dispatch(e.target,t),t},create:function(n){var r=n.constructor.name,c=t.createEvent(r);return i[r]?(c[i[r]](n.type,n.bubbles,n.cancelable,e,n.detail,n.screenX,n.screenY,n.clientX,n.clientY,n.altKey,n.shiftKey,n.metaKey,n.button,n.relatedTarget),c):void 0},dispatch:function(e,t){e&&e.dispatchEvent(t)},get:function(e){return t.getElementById(e)}},o=0,a=1,s=2;return r=function(e){this.elem=e||t,this.lastEvent=null,this.status=s,this.captureListener=null},r.prototype.record=function(){var e=this,t=function(t){var n={event:t||window.event,context:window,time:Date.now()},i=window.userClickTime||{};e.matchTarget(n)?(("record"!==i.type||"number"!=typeof i.time)&&(window.userClickTime={time:Date.now(),type:"record"}),e.lastEvent=n):"se-input-poi"===n.event.target.id&&(window.currInputFocused=!0)},n={},i=function(e){switch(e.type){case"touchstart":n.x1=e.touches[0].pageX,n.y1=e.touches[0].pageY;break;case"touchmove":n.x2=e.touches[0].pageX,n.y2=e.touches[0].pageY;break;case"touchend":if(!n.x2&&!n.y2||n.x2&&Math.abs(n.x1-n.x2)<30||n.y2&&Math.abs(n.y1-n.y2)<30){n={};var i=e.changedTouches[0],r={type:"click",bubbles:!0,cancelable:!0,detail:1,screenX:i.screenX,screenY:i.screenY,clientX:i.clientX,clientY:i.clientY,altKey:!1,shiftKey:!1,metaKey:!1,button:0,target:e.target,relatedTarget:e.target,constructor:{name:"MouseEvent"}};t(r)}break;case"click":t(e)}};this.status=o,c.add(this.elem,i),this.captureListener=i},r.prototype.play=function(){this.status=a,this.execute(this.lastEvent,a)},r.prototype.stop=function(){this.status=s,this.captureListener&&(c.remove(this.elem,this.captureListener),this.captureListener=null)},r.prototype.execute=function(e,t){return e?(this.matchTarget(e)&&t===this.status&&c.execute(e,function(){}),void 0):(this.stop(),void 0)},r.prototype.matchTarget=function(e){function n(e){return"a"===e.tagName.toLowerCase()||"jump"===e.getAttribute("jsaction")||e.hasAttribute("data-href")||"se-btn"===e.id&&c.get("se-input-poi")&&/[^\s]/.test(c.get("se-input-poi").value)}var i=e.event.target,r=t.body;do{if(n(i))return!0;i=i.parentNode}while(i&&i!==r);return!1},r}(window,document),window.EventRecorder){var eventRecorder=new window.EventRecorder(document.body);eventRecorder.record()}</script>
{%/block%}
{%block name="cover"%}
{%if $data.isShowCover == "true"%}
{%widget name="common:widget/cover/cover.tpl" pagename="index" netype="{%$wise_info.netype|f_escape_xml%}"%}
{%/if%}
{%/block%}
{%block name="header"%}
{%widget name="common:widget/header/header.tpl" pagelet_id="index-header-widget" mode="quickling"%}
{%/block%}
{%block name="main"%}
{%widget name="index:widget/tabgroup/tabgroup.tpl"%}
{%widget name="index:widget/searchbox/searchbox.tpl"%}
{%*topbanner后端策略与异步逻辑合体*%}
{%if ($page_config.topbanner == 1)%}
{%widget name="common:widget/topbanner/topbanner.tpl" pagelet_id="index-topbanner-widget" mode="quickling"%}
{%script%}
             BigPipe.asyncLoad({id: "index-topbanner-widget"});
        {%/script%}
{%/if%}
{%widget name="index:widget/nearby/nearby.tpl" pagename="index"%}
<script type="text/javascript">
        PDC && PDC.first_screen && PDC.first_screen();
    </script>
{%widget name="index:widget/thumbnail/thumbnail.tpl" pagename="index" pagelet_id="index-thumbnail-widget" mode="quickling"%}
{%widget name="index:widget/addestop/addestop.tpl" pagename="index"  pagelet_id="index-addestop-widget" mode="quickling"%}
{%widget name="index:widget/surface/surface.tpl" pagename="index" pagelet_id="index-surface-widget" mode="quickling"%}
{%script%}
        BigPipe.asyncLoad([{
            id: "index-addestop-widget"
        },{
            id:"index-thumbnail-widget"
        },{
             id:"index-surface-widget"
        },{
            id:"index-header-widget"
        }]);
        (require("index:widget/helper/revert.js")).init();
        require.async("common:widget/login/login.js",function(login){
                login.checkLogin();
        });
    {%/script%}
{%require name='index:page/index.tpl'%}{%/block%}