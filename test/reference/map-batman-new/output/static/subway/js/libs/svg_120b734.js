define("subway:static/js/libs/svg.js",function(t,e,n){var i=this.SVG=function(t){return i.supported?new i.Doc(t):void 0};if(i.ns="http://www.w3.org/2000/svg",i.xlink="http://www.w3.org/1999/xlink",i.did=1e3,i.eid=function(t){return"svgjs"+t.charAt(0).toUpperCase()+t.slice(1)+i.did++},i.create=function(t){var e=document.createElementNS(this.ns,t);return e.setAttribute("id",this.eid(t)),e},i.extend=function(){var t,e,n,i;for(t=[].slice.call(arguments),e=t.pop(),i=t.length-1;i>=0;i--)if(t[i])for(n in e)t[i].prototype[n]=e[n]},i.get=function(t){var e=document.getElementById(t);return e?e.instance:void 0},i.supported=function(){return!!document.createElementNS&&!!document.createElementNS(i.ns,"svg").createSVGRect}(),!i.supported)return!1;i.regex={test:function(t,e){return this[e].test(t)},unit:/^(-?[\d\.]+)([a-z%]{0,2})$/,rgb:/rgb\((\d+),(\d+),(\d+)\)/,isRgb:/^rgb\(/,isCss:/[^:]+:[^;]+;?/,isStyle:/^font|text|leading|cursor/,isBlank:/^(\s+)?$/,isNumber:/^-?[\d\.]+$/},i.defaults={matrix:"1,0,0,1,0,0",attrs:{"fill-opacity":1,"stroke-opacity":1,"stroke-width":0,fill:"#000",stroke:"#000",opacity:1,x:0,y:0,cx:0,cy:0,width:0,height:0,r:0,rx:0,ry:0,offset:0},trans:function(){return{x:0,y:0,scaleX:1,scaleY:1,matrix:this.matrix,a:1,b:0,c:0,d:1,e:0,f:0}}},i.Color=function(t){var e;this.r=0,this.g=0,this.b=0,"string"==typeof t&&i.regex.isRgb.test(t)&&(e=i.regex.rgb.exec(t.replace(/\s/g,"")),this.r=parseInt(e[1]),this.g=parseInt(e[2]),this.b=parseInt(e[3]))},i.extend(i.Color,{toString:function(){return this.toHex()},toHex:function(){return"#"+this._compToHex(this.r)+this._compToHex(this.g)+this._compToHex(this.b)},_compToHex:function(t){var e=t.toString(16);return 1==e.length?"0"+e:e}}),i.Color.test=function(t){return t+="",i.regex.isRgb.test(t)},i.Color.isRgb=function(t){return t&&"number"==typeof t.r},i.ViewBox=function(t){var e,n,i,s,r=t.bbox(),o=(t.attr("viewBox")||"").match(/-?[\d\.]+/g);this.x=r.x,this.y=r.y,this.width=t.node.clientWidth||t.node.getBoundingClientRect().width,this.height=t.node.clientHeight||t.node.getBoundingClientRect().height,o&&(e=parseFloat(o[0]),n=parseFloat(o[1]),i=parseFloat(o[2]),s=parseFloat(o[3]),this.zoom=this.width/this.height>i/s?this.height/s:this.width/i,this.x=e,this.y=n,this.width=i,this.height=s),this.zoom=this.zoom||1},i.extend(i.ViewBox,{toString:function(){return this.x+" "+this.y+" "+this.width+" "+this.height}}),i.BBox=function(t){var e;try{e=t.node.getBBox()}catch(n){e={x:t.node.clientLeft,y:t.node.clientTop,width:t.node.clientWidth,height:t.node.clientHeight}}this.x=e.x+t.trans.x,this.y=e.y+t.trans.y,this.width=e.width*t.trans.scaleX,this.height=e.height*t.trans.scaleY,this.cx=this.x+this.width/2,this.cy=this.y+this.height/2},i.Element=function(t){this._stroke=i.defaults.attrs.stroke,this.styles={},this.trans=i.defaults.trans(),(this.node=t)&&(this.type=t.nodeName,this.node.instance=this)},i.extend(i.Element,{x:function(t){return t&&(t/=this.trans.scaleX),this.attr("x",t)},y:function(t){return t&&(t/=this.trans.scaleY),this.attr("y",t)},cx:function(t){return null==t?this.bbox().cx:this.x(t-this.bbox().width/2)},cy:function(t){return null==t?this.bbox().cy:this.y(t-this.bbox().height/2)},move:function(t,e){return this.x(t).y(e)},center:function(t,e){return this.cx(t).cy(e)},size:function(t,e){return this.attr({width:t,height:e})},remove:function(){return this.parent&&this.parent.removeElement(this),this},doc:function(t){return this._parent(t||i.Doc)},attr:function(t,e,n){if(null==t){for(t={},e=this.node.attributes,n=e.length-1;n>=0;n--)t[e[n].nodeName]=i.regex.test(e[n].nodeValue,"isNumber")?parseFloat(e[n].nodeValue):e[n].nodeValue;return t}if("object"==typeof t)for(e in t)this.attr(e,t[e]);else if(null===e)this.node.removeAttribute(t);else{if(null==e)return this._isStyle(t)?"text"==t?this.content:"leading"==t&&this.leading?this.leading():this.style(t):(e=this.node.getAttribute(t),null==e?i.defaults.attrs[t]:i.regex.test(e,"isNumber")?parseFloat(e):e);if("style"==t)return this.style(e);if("x"==t&&Array.isArray(this.lines))for(n=this.lines.length-1;n>=0;n--)this.lines[n].attr(t,e);"stroke-width"==t?this.attr("stroke",parseFloat(e)>0?this._stroke:null):"stroke"==t&&(this._stroke=e),(i.Color.test(e)||i.Color.isRgb(e))&&(e=new i.Color(e).toHex()),null!=n?this.node.setAttributeNS(n,t,e.toString()):this.node.setAttribute(t,e.toString()),this._isStyle(t)&&("text"==t?this.text(e):"leading"==t&&this.leading?this.leading(e):this.style(t,e),this.rebuild&&this.rebuild(t,e))}return this},transform:function(t,e){if(0==arguments.length)return this.trans;if("string"==typeof t){if(arguments.length<2)return this.trans[t];var n={};return n[t]=e,this.transform(n)}var n=[];t=this._parseMatrix(t);for(e in t)null!=t[e]&&(this.trans[e]=t[e]);return this.trans.matrix=this.trans.a+","+this.trans.b+","+this.trans.c+","+this.trans.d+","+this.trans.e+","+this.trans.f,t=this.trans,t.matrix!=i.defaults.matrix&&n.push("matrix("+t.matrix+")"),(1!=t.scaleX||1!=t.scaleY)&&n.push("scale("+t.scaleX+","+t.scaleY+")"),(0!=t.x||0!=t.y)&&n.push("translate("+t.x/t.scaleX+","+t.y/t.scaleY+")"),this._offset&&0!=this._offset.x&&0!=this._offset.y&&n.push("translate("+-this._offset.x+","+-this._offset.y+")"),0==n.length?this.node.removeAttribute("transform"):this.node.setAttribute("transform",n.join(" ")),this},style:function(t,e){if(0==arguments.length)return this.attr("style")||"";if(arguments.length<2)if("object"==typeof t)for(e in t)this.style(e,t[e]);else{if(!i.regex.isCss.test(t))return this.styles[t];t=t.split(";");for(var n=0;n<t.length;n++)e=t[n].split(":"),2==e.length&&this.style(e[0].replace(/\s+/g,""),e[1].replace(/^\s+/,"").replace(/\s+$/,""))}else null===e||i.regex.test(e,"isBlank")?delete this.styles[t]:this.styles[t]=e;t="";for(e in this.styles)t+=e+":"+this.styles[e]+";";return""==t?this.node.removeAttribute("style"):this.node.setAttribute("style",t),this},data:function(t,e,n){if(arguments.length<2)try{return JSON.parse(this.attr("data-"+t))}catch(i){return this.attr("data-"+t)}else this.attr("data-"+t,null===e?null:n===!0||"string"==typeof e||"number"==typeof e?e:JSON.stringify(e));return this},bbox:function(){return new i.BBox(this)},show:function(){return this.style("display","")},hide:function(){return this.style("display","none")},visible:function(){return"none"!=this.style("display")},toString:function(){return this.attr("id")},_parent:function(t){for(var e=this;null!=e&&!(e instanceof t);)e=e.parent;return e},_isStyle:function(t){return"string"==typeof t?i.regex.test(t,"isStyle"):!1},_parseMatrix:function(t){if(t.matrix){var e=t.matrix.replace(/\s/g,"").split(",");6==e.length&&(t.a=parseFloat(e[0]),t.b=parseFloat(e[1]),t.c=parseFloat(e[2]),t.d=parseFloat(e[3]),t.e=parseFloat(e[4]),t.f=parseFloat(e[5]))}return t}}),i.Container=function(t){this.constructor.call(this,t)},i.Container.prototype=new i.Element,i.extend(i.Container,{children:function(){return this._children||(this._children=[])},add:function(t,e){if(!this.has(t)){if(e=null==e?this.children().length:e,t.parent){var n=t.parent.children().indexOf(t);t.parent.children().splice(n,1)}this.children().splice(e,0,t),this.node.insertBefore(t.node,this.node.childNodes[e]||null),t.parent=this}return this},put:function(t,e){return this.add(t,e),t},has:function(t){return this.children().indexOf(t)>=0},each:function(t){var e,n=this.children();for(e=0,length=n.length;length>e;e++)n[e]instanceof i.Shape&&t.apply(n[e],[e,n]);return this},removeElement:function(t){var e=this.children().indexOf(t);return this.children().splice(e,1),this.node.removeChild(t.node),t.parent=null,this},group:function(){return this.put(new i.G)},rect:function(t,e){return this.put((new i.Rect).size(t,e))},circle:function(t){return this.ellipse(t,t)},ellipse:function(t,e){return this.put((new i.Ellipse).size(t,e).move(0,0))},line:function(t,e,n,s){return this.put((new i.Line).plot(t,e,n,s))},polyline:function(t,e){return this.put(new i.Polyline(e)).plot(t)},path:function(t,e){return this.put(new i.Path(e)).plot(t)},image:function(t,e,n){return e=null!=e?e:100,this.put((new i.Image).load(t).size(e,null!=n?n:e))},text:function(t){return this.put((new i.Text).text(t))},viewbox:function(t){return 0==arguments.length?new i.ViewBox(this):(t=1==arguments.length?[t.x,t.y,t.width,t.height]:[].slice.call(arguments),this.attr("viewBox",t.join(" ")))},clear:function(){for(var t=this.children().length-1;t>=0;t--)this.removeElement(this.children()[t]);return this}}),["click","dblclick","mousedown","mouseup","mouseover","mouseout","mousemove","mouseenter","mouseleave","touchstart","touchend","touchmove","touchcancel"].forEach(function(t){i.Element.prototype[t]=function(e){var n=this;return this.node["on"+t]="function"==typeof e?function(){return e.apply(n,arguments)}:null,this}}),i.on=function(t,e,n){t.addEventListener?t.addEventListener(e,n,!1):t.attachEvent("on"+e,n)},i.off=function(t,e,n){t.removeEventListener?t.removeEventListener(e,n,!1):t.detachEvent("on"+e,n)},i.extend(i.Element,{on:function(t,e){return i.on(this.node,t,e),this},off:function(t,e){return i.off(this.node,t,e),this}}),i.G=function(){this.constructor.call(this,i.create("g"))},i.G.prototype=new i.Container,i.extend(i.G,{x:function(t){return null==t?this.trans.x:this.transform("x",t)},y:function(t){return null==t?this.trans.y:this.transform("y",t)}}),i.Doc=function(t){this.parent="string"==typeof t?document.getElementById(t):t,this.constructor.call(this,"svg"==this.parent.nodeName?this.parent:i.create("svg")),this.attr({xmlns:i.ns,version:"1.1",width:"100%",height:"100%"}).attr("xlink",i.xlink,i.ns),"svg"!=this.parent.nodeName&&this.stage()},i.Doc.prototype=new i.Container,i.extend(i.Doc,{stage:function(){var t,e=this,n=document.createElement("div");return n.style.cssText="position:relative;height:100%;",e.parent.appendChild(n),n.appendChild(e.node),t=function(){"complete"===document.readyState?(e.style("position:absolute;"),setTimeout(function(){e.style("position:relative;"),e.parent.removeChild(e.node.parentNode),e.node.parentNode.removeChild(e.node),e.parent.appendChild(e.node),e.fixSubPixelOffset(),i.on(window,"resize",function(){e.fixSubPixelOffset()})},5)):setTimeout(t,10)},t(),this},fixSubPixelOffset:function(){var t=this.node.getScreenCTM();this.style("left",-t.e%1+"px").style("top",-t.f%1+"px")}}),i.Shape=function(t){this.constructor.call(this,t)},i.Shape.prototype=new i.Element,i.Rect=function(){this.constructor.call(this,i.create("rect"))},i.Rect.prototype=new i.Shape,i.Ellipse=function(){this.constructor.call(this,i.create("ellipse"))},i.Ellipse.prototype=new i.Shape,i.extend(i.Ellipse,{x:function(t){return null==t?this.cx()-this.attr("rx"):this.cx(t+this.attr("rx"))},y:function(t){return null==t?this.cy()-this.attr("ry"):this.cy(t+this.attr("ry"))},cx:function(t){return null==t?this.attr("cx"):this.attr("cx",t/this.trans.scaleX)},cy:function(t){return null==t?this.attr("cy"):this.attr("cy",t/this.trans.scaleY)},size:function(t,e){return this.attr({rx:t/2,ry:e/2})}}),i.Line=function(){this.constructor.call(this,i.create("line"))},i.Line.prototype=new i.Shape,i.extend(i.Line,{x:function(t){var e=this.bbox();return null==t?e.x:this.attr({x1:this.attr("x1")-e.x+t,x2:this.attr("x2")-e.x+t})},y:function(t){var e=this.bbox();return null==t?e.y:this.attr({y1:this.attr("y1")-e.y+t,y2:this.attr("y2")-e.y+t})},cx:function(t){var e=this.bbox().width/2;return null==t?this.x()+e:this.x(t-e)},cy:function(t){var e=this.bbox().height/2;return null==t?this.y()+e:this.y(t-e)},size:function(t,e){var n=this.bbox();return this.attr(this.attr("x1")<this.attr("x2")?"x2":"x1",n.x+t).attr(this.attr("y1")<this.attr("y2")?"y2":"y1",n.y+e)},plot:function(t,e,n,i){return this.attr({x1:t,y1:e,x2:n,y2:i})}}),i.Polyline=function(){this.constructor.call(this,i.create("polyline"))},i.Polyline.prototype=new i.Shape,i.Path=function(t){this.constructor.call(this,i.create("path")),this.unbiased=!!t},i.Path.prototype=new i.Shape,i.extend(i.Path,{_plot:function(t){return this.attr("d",t||"M0,0")}}),i.extend(i.Polyline,i.Path,{x:function(t){return null==t?this.bbox().x:this.transform("x",t)},y:function(t){return null==t?this.bbox().y:this.transform("y",t)},size:function(t,e){var n=t/this._offset.width;return this.transform({scaleX:n,scaleY:null!=e?e/this._offset.height:n})},plot:function(t){var e=this.trans.scaleX,n=this.trans.scaleY;return this._plot(t),this._offset=this.transform({scaleX:1,scaleY:1}).bbox(),this.unbiased?this._offset.x=this._offset.y=0:(this._offset.x-=this.trans.x,this._offset.y-=this.trans.y),this.transform({scaleX:e,scaleY:n})}}),i.Image=function(){this.constructor.call(this,i.create("image"))},i.Image.prototype=new i.Shape,i.extend(i.Image,{load:function(t){return t?this.attr("href",this.src=t,i.xlink):this}});var s="size family weight stretch variant style".split(" ");i.Text=function(){this.constructor.call(this,i.create("text")),this.styles={"font-size":16,"font-family":"Helvetica, Arial, sans-serif","text-anchor":"start"},this._leading=1.2,this._base=.276666666},i.Text.prototype=new i.Shape,i.extend(i.Text,{x:function(t,e){return null==t?e?this.attr("x"):this.bbox().x:(e||(e=this.style("text-anchor"),t="start"==e?t:"end"==e?t+this.bbox().width:t+this.bbox().width/2),this.attr("x",t))},cx:function(t){return null==t?this.bbox().cx:this.x(t-this.bbox().width/2)},cy:function(t,e){return null==t?this.bbox().cy:this.y(e?t:t-this.bbox().height/2)},move:function(t,e,n){return this.x(t,n).y(e)},center:function(t,e,n){return this.cx(t,n).cy(e,n)},text:function(t){if(null==t)return this.content;this.clear(),this.content=i.regex.isBlank.test(t)?"text":t;var e,n,s=t.split("\n");for(e=0,n=s.length;n>e;e++)this.tspan(s[e]);return this.attr("textLength",1).attr("textLength",null)},tspan:function(t){var e=(new i.TSpan).text(t);return this.node.appendChild(e.node),this.lines.push(e),e.attr("style",this.style())},size:function(t){return this.attr("font-size",t)},leading:function(t){return null==t?this._leading:(this._leading=t,this.rebuild("leading",t))},rebuild:function(){var t,e,n=this.styles["font-size"];for(t=0,e=this.lines.length;e>t;t++)this.lines[t].attr({dy:n*this._leading-(0==t?n*this._base:0),x:this.attr("x")||0,style:this.style()});return this},clear:function(){for(;this.node.hasChildNodes();)this.node.removeChild(this.node.lastChild);return this.lines=[],this}}),i.TSpan=function(){this.constructor.call(this,i.create("tspan"))},i.TSpan.prototype=new i.Shape,i.extend(i.TSpan,{text:function(t){return this.node.appendChild(document.createTextNode(t)),this}}),i.Nested=function(){this.constructor.call(this,i.create("svg")),this.style("overflow","visible")},i.Nested.prototype=new i.Container,i._stroke=["color","width","opacity","linecap","linejoin","miterlimit","dasharray","dashoffset"],i._fill=["color","opacity","rule"];var r=function(t,e){return"color"==e?t:t+"-"+e};["fill","stroke"].forEach(function(t){var e={};e[t]=function(e){if("string"==typeof e||i.Color.isRgb(e))this.attr(t,e);else for(index=i["_"+t].length-1;index>=0;index--)null!=e[i["_"+t][index]]&&this.attr(r(t,i["_"+t][index]),e[i["_"+t][index]]);return this},i.extend(i.Shape,e)}),i.extend(i.Element,{scale:function(t,e){return this.transform({scaleX:t,scaleY:null==e?t:e})},matrix:function(t){return this.transform({matrix:t})},opacity:function(t){return this.attr("opacity",t)}}),i.Text&&i.extend(i.Text,{font:function(t){for(var e in t)"anchor"==e?this.attr("text-anchor",t[e]):s.indexOf(e)>-1?this.attr("font-"+e,t[e]):this.attr(e,t[e]);return this}}),n.exports=i});