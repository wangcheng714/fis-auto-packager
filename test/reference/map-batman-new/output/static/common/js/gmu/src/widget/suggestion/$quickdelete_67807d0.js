define("common:static/js/gmu/src/widget/suggestion/$quickdelete.js",function(i){i("common:static/js/gmu/src/widget/suggestion/suggestion.js"),function(i,e){i.Suggestion.register("quickdelete",{_init:function(){var i,t,u=this;u.on("ready",function(){i=u.getEl(),t=u.eventNs,u.$mask.append(u.$quickDel=e('<div class="ui-suggestion-quickdel"></div>')),i.on("focus"+t+" input"+t,function(){u["_quickDel"+(e.trim(i.val())?"Show":"Hide")]()}),i.on("blur"+t,function(){u._quickDelHide()}),u.$quickDel.on("click"+t,function(e){e.preventDefault(),e.formDelete=!0,i.val(""),u.trigger("delete").trigger("input")._quickDelHide(),i.blur().focus()}),u.on("destroy",function(){u.$quickDel.off().remove()})})},_quickDelShow:function(){this.quickDelShow||(i.staticCall(this.$quickDel.get(0),"css","visibility","visible"),this.quickDelShow=!0)},_quickDelHide:function(){this.quickDelShow&&(i.staticCall(this.$quickDel.get(0),"css","visibility","hidden"),this.quickDelShow=!1)}})}(gmu,gmu.$)});