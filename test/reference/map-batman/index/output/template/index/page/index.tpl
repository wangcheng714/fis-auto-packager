{%* 首页 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
<style type="text/css">.index-page-nearby-hd{margin:35px 0 6px;font-size:16px;padding-left:14px;color:#575757;display:none}</style>
<script type="text/javascript">var EventRecorder=function(e,t){var n={click:!0},i={MouseEvent:"initMouseEvent",MouseEvents:"initMouseEvent"};n={click:!1,touchstart:!0,touchmove:!0,touchend:!0};var r,o={add:function(e,i){var r;e=e||t;for(r in n)n[r]&&e.addEventListener(r,i,!1)},remove:function(e,i){var r;e=e||t;for(r in n)n[r]&&e.removeEventListener(r,i,!1)},execute:function(e,t){if(e){var i=o.simulate(e.event);"function"==typeof n[i.type]&&n[i.type](i),"function"==typeof t&&t()}},simulate:function(e){var t=this.create(e);return this.dispatch(e.target,t),t},create:function(n){var r=n.constructor.name,o=t.createEvent(r);return i[r]?(o[i[r]](n.type,n.bubbles,n.cancelable,e,n.detail,n.screenX,n.screenY,n.clientX,n.clientY,n.altKey,n.shiftKey,n.metaKey,n.button,n.relatedTarget),o):void 0},dispatch:function(e,t){e&&e.dispatchEvent(t)},get:function(e){return t.getElementById(e)}},c={show:function(){var n=o.get("index-loading-popup");return n?(n.style.left=(e.innerWidth-124)/2+"px",n.style.top=e.innerHeight/2-42+e.scrollY+"px",void 0):(n=t.createElement("div"),n.id="index-loading-popup",n.style.cssText=["display:table-cell","vertical-align:middle","text-align:center","padding:11px 27px","background-color:#000","opacity:0.7","border-radius:5px","color:#ffffff","font-size:14px","text-align:center","margin:0 auto","position:absolute","z-index:80000","left:"+(e.innerWidth-124)/2+"px","top:"+(e.innerHeight/2-42+e.scrollY)+"px"].join(";"),n.innerText="正在加载中",t.body.appendChild(n),void 0)}},a=0,s=1,u=2;return r=function(e){this.elem=e||t,this.lastEvent=null,this.status=u,this.captureListener=null},r.prototype.record=function(){var e=this,t=function(t){var n={event:t||window.event,context:window,time:Date.now()},i=window.userClickTime||{};e.matchTarget(n)?(("record"!==i.type||"number"!=typeof i.time)&&(window.userClickTime={time:Date.now(),type:"record"}),c.show(),e.lastEvent=n):"se-input-poi"==n.event.target.id&&(window.currInputFocused=!0)},n={},i=function(e){switch(e.type){case"touchstart":n.x1=e.touches[0].pageX,n.y1=e.touches[0].pageY;break;case"touchmove":n.x2=e.touches[0].pageX,n.y2=e.touches[0].pageY;break;case"touchend":if(!n.x2&&!n.y2||n.x2&&Math.abs(n.x1-n.x2)<30||n.y2&&Math.abs(n.y1-n.y2)<30){n={};var i=e.changedTouches[0],r={type:"click",bubbles:!0,cancelable:!0,detail:1,screenX:i.screenX,screenY:i.screenY,clientX:i.clientX,clientY:i.clientY,altKey:!1,shiftKey:!1,metaKey:!1,button:0,target:e.target,relatedTarget:e.target,constructor:{name:"MouseEvent"}};t(r)}break;case"click":t(e)}};this.status=a,o.add(this.elem,i),this.captureListener=i},r.prototype.play=function(){this.status=s,this.execute(this.lastEvent,s)},r.prototype.stop=function(){this.status=u,this.captureListener&&(o.remove(this.elem,this.captureListener),this.captureListener=null)},r.prototype.execute=function(e,t){return e?(this.matchTarget(e)&&t===this.status&&o.execute(e,function(){}),void 0):(this.stop(),void 0)},r.prototype.matchTarget=function(e){function n(e){return"a"===e.tagName.toLowerCase()||"jump"==e.getAttribute("jsaction")||"se-btn"==e.id&&o.get("se-input-poi")&&/[^\s]/.test(o.get("se-input-poi").value)}var i=e.event.target,r=t.body;do{if(n(i))return!0;i=i.parentNode}while(i&&i!=r);return!1},r}(window,document);if(window.EventRecorder){var eventRecorder=new window.EventRecorder(document.body);eventRecorder.record()}</script>
{%/block%}
{%block name="cover"%}
{%widget name="common:widget/cover/cover.tpl" pagename="index" netype="{%$wise_info.netype|f_escape_xml%}"%}
{%/block%}
{%block name="header"%}
{%widget name="common:widget/header/header.tpl" hideRight=true%}
{%/block%}
{%block name="main"%}{%widget name="index:widget/searchbox/searchbox.tpl"%}
{%if ($page_config.topbanner == 1)%}
{%widget name="common:widget/topbanner/topbanner.tpl"%}
{%/if%}
{%widget name="index:widget/nearby/nearby.tpl" pagename="index" %}
{%widget name="index:widget/thumbnail/thumbnail.tpl" pagename="index"%}
{%widget name="index:widget/addestop/addestop.tpl" pagename="index"%}
<script type="text/javascript">
        PDC && PDC.first_screen && PDC.first_screen();
    </script>
{%script%}
        (require("index:widget/helper/revert.js")).init();
    {%/script%}
{%widget name="index:widget/surface/surface.tpl" pagename="index"%}
{%require name='index:page/index.tpl'%}{%/block%}