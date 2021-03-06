!function(){function e(e){this.editor=e,this.registered={},this.instances={},this.selected=[],this.widgetHoldingFocusedEditable=this.focused=null,this._={nextId:0,upcasts:[],upcastCallbacks:[],filters:{}},R(this),O(this),this.on("checkWidgets",r),this.editor.on("contentDomInvalidated",this.checkWidgets,this),D(this),_(this),y(this),b(this),T(this)}function t(e,i,n,a,r){var o=e.editor;CKEDITOR.tools.extend(this,a,{editor:o,id:i,inline:"span"==n.getParent().getName(),element:n,data:CKEDITOR.tools.extend({},"function"==typeof a.defaults?a.defaults():a.defaults),dataReady:!1,inited:!1,ready:!1,edit:t.prototype.edit,focusedEditable:null,definition:a,repository:e,draggable:!1!==a.draggable,_:{downcastFn:a.downcast&&"string"==typeof a.downcast?a.downcasts[a.downcast]:a.downcast}},!0),e.fire("instanceCreated",this),W(this,a),this.init&&this.init(),this.inited=!0,(e=this.element.data("cke-widget-data"))&&this.setData(JSON.parse(decodeURIComponent(e))),r&&this.setData(r),this.data.classes||this.setData("classes",this.getClasses()),this.dataReady=!0,V(this),this.fire("data",this.data),this.isInited()&&o.editable().contains(this.wrapper)&&(this.ready=!0,this.fire("ready"))}function i(e,t,i){CKEDITOR.dom.element.call(this,t.$),this.editor=e,t=this.filter=i.filter,CKEDITOR.dtd[this.getName()].p?(this.enterMode=t?t.getAllowedEnterMode(e.enterMode):e.enterMode,this.shiftEnterMode=t?t.getAllowedEnterMode(e.shiftEnterMode,!0):e.shiftEnterMode):this.enterMode=this.shiftEnterMode=CKEDITOR.ENTER_BR}function n(e,t){e.addCommand(t.name,{exec:function(){function i(){e.widgets.finalizeCreation(o)}var n=e.widgets.focused;if(n&&n.name==t.name)n.edit();else if(t.insert)t.insert();else if(t.template){var a,n="function"==typeof t.defaults?t.defaults():t.defaults,n=CKEDITOR.dom.element.createFromHtml(t.template.output(n)),r=e.widgets.wrapElement(n,t.name),o=new CKEDITOR.dom.documentFragment(r.getDocument());o.append(r),(a=e.widgets.initOn(n,t))?(n=a.once("edit",function(t){t.data.dialog?a.once("dialog",function(t){var n,r,t=t.data;n=t.once("ok",i,null,null,20),r=t.once("cancel",function(){e.widgets.destroy(a,!0)}),t.once("hide",function(){n.removeListener(),r.removeListener()})}):i()},null,null,999),a.edit(),n.removeListener()):i()}},refresh:function(e,t){this.setState(d(e.editable(),t.blockLimit)?CKEDITOR.TRISTATE_DISABLED:CKEDITOR.TRISTATE_OFF)},context:"div",allowedContent:t.allowedContent,requiredContent:t.requiredContent,contentForms:t.contentForms,contentTransformations:t.contentTransformations})}function a(e,t){if(e.focused=null,t.isInited()){var i=t.editor.checkDirty();e.fire("widgetBlurred",{widget:t}),t.setFocused(!1),!i&&t.editor.resetDirty()}}function r(e){if(e=e.data,"wysiwyg"==this.editor.mode){var t,i,n=this.editor.editable(),a=this.instances;if(n){for(t in a)n.contains(a[t].wrapper)||this.destroy(a[t],!0);if(e&&e.initOnlyNew)n=this.initOnAll();else{var r=n.find(".cke_widget_wrapper"),n=[];for(t=0,a=r.count();a>t;t++){i=r.getItem(t);var o;if(o=!this.getByElement(i,!0)){e:{o=m;for(var s=i;s=s.getParent();)if(o(s)){o=!0;break e}o=!1}o=!o}o&&(i.addClass("cke_widget_new"),n.push(this.initOn(i.getFirst(f))))}}e&&e.focusInited&&1==n.length&&n[0].focus()}}}function o(e,t,i){if(!i.allowedContent)return null;var n=this._.filters[e];return n||(this._.filters[e]=n={}),(e=n[t])||(n[t]=e=new CKEDITOR.filter(i.allowedContent)),e}function s(e){var t=[],i=e._.upcasts,n=e._.upcastCallbacks;return{toBeWrapped:t,iterator:function(e){var a,r,o,s,d;if("data-cke-widget-wrapper"in e.attributes)return(e=e.getFirst(u))&&t.push([e]),!1;if("data-widget"in e.attributes)return t.push([e]),!1;if(d=i.length){if(e.attributes["data-cke-widget-upcasted"])return!1;for(s=0,a=n.length;a>s;++s)if(!1===n[s](e))return;for(s=0;d>s;++s)if(a=i[s],o={},r=a[0](e,o))return r instanceof CKEDITOR.htmlParser.element&&(e=r),e.attributes["data-cke-widget-data"]=encodeURIComponent(JSON.stringify(o)),e.attributes["data-cke-widget-upcasted"]=1,t.push([e,a[1]]),!1}}}}function d(e,t){return!t||t.equals(e)?null:g(t)?t:d(e,t.getParent())}function l(e){return{tabindex:-1,contenteditable:"false","data-cke-widget-wrapper":1,"data-cke-filter":"off","class":"cke_widget_wrapper cke_widget_new cke_widget_"+(e?"inline":"block")}}function c(e,t,i){if(e.type==CKEDITOR.NODE_ELEMENT){var n=CKEDITOR.dtd[e.name];if(n&&!n[i.name]){var n=e.split(t),a=e.parent,t=n.getIndex();return e.children.length||(t-=1,e.remove()),n.children.length||n.remove(),c(a,t,i)}}e.add(i,t)}function u(e){return e.type==CKEDITOR.NODE_ELEMENT&&!!e.attributes["data-widget"]}function f(e){return e.type==CKEDITOR.NODE_ELEMENT&&e.hasAttribute("data-widget")}function p(e,t){return"boolean"==typeof e.inline?e.inline:!!CKEDITOR.dtd.$inline[t]}function h(e){return e.type==CKEDITOR.NODE_ELEMENT&&e.hasAttribute("data-cke-widget-wrapper")}function g(e){return e.type==CKEDITOR.NODE_ELEMENT&&e.hasAttribute("data-cke-widget-editable")}function m(e){return e.hasAttribute("data-cke-temp")}function E(e){return e.type==CKEDITOR.NODE_ELEMENT&&e.hasClass("cke_widget_drag_handler_container")}function w(e,t,i){t.focus(),e.fire("saveSnapshot"),e.fire("lockSnapshot",{dontUpdate:!0}),i.select(),i=t.wrapper.getOuterHtml(),t.wrapper.remove(),e.widgets.destroy(t,!0),e.execCommand("paste",i),e.fire("unlockSnapshot")}function k(e,t,i,n){var a=e.editor;a.fire("lockSnapshot"),i?(n=i.data("cke-widget-editable"),n=t.editables[n],e.widgetHoldingFocusedEditable=t,t.focusedEditable=n,i.addClass("cke_widget_editable_focused"),n.filter&&a.setActiveFilter(n.filter),a.setActiveEnterMode(n.enterMode,n.shiftEnterMode)):(n||t.focusedEditable.removeClass("cke_widget_editable_focused"),t.focusedEditable=null,e.widgetHoldingFocusedEditable=null,a.setActiveFilter(null),a.setActiveEnterMode(null,null)),a.fire("unlockSnapshot")}function v(e){e.contextMenu&&e.contextMenu.addListener(function(t){return(t=e.widgets.getByElement(t,!0))?t.fire("contextMenu",{}):void 0})}function C(e,t){return CKEDITOR.tools.trim(t)}function b(e){var t=e.editor,i=CKEDITOR.plugins.lineutils;t.on("contentDom",function(){var n=t.editable(),a=CKEDITOR.env.ie&&9>CKEDITOR.env.version||n.isInline()?n:t.document;n.attachListener(a,"drop",function(i){var n,a,r=i.data.$.dataTransfer.getData("text");if(r){try{n=JSON.parse(r)}catch(o){return}if("cke-widget"==n.type&&(i.data.preventDefault(),n.editor==t.name&&(a=e.instances[n.id]))){e:if(n=i.data.$,r=t.createRange(),i.data.testRange)r=i.data.testRange;else if(document.caretRangeFromPoint)i=t.document.$.caretRangeFromPoint(n.clientX,n.clientY),r.setStart(CKEDITOR.dom.node(i.startContainer),i.startOffset),r.collapse(!0);else if(n.rangeParent)r.setStart(CKEDITOR.dom.node(n.rangeParent),n.rangeOffset),r.collapse(!0);else{if(!document.body.createTextRange){r=null;break e}i=t.document.getBody().$.createTextRange(),i.moveToPoint(n.clientX,n.clientY),n="cke-temp-"+(new Date).getTime(),i.pasteHTML('<span id="'+n+'">​</span>'),i=t.document.getById(n),r.moveToPosition(i,CKEDITOR.POSITION_BEFORE_START),i.remove()}r&&(CKEDITOR.env.gecko?setTimeout(w,0,t,a,r):w(t,a,r))}}}),CKEDITOR.tools.extend(e,{finder:new i.finder(t,{lookups:{"default":function(e){if(!e.is(CKEDITOR.dtd.$listItem)&&e.is(CKEDITOR.dtd.$block)){for(;e;){if(g(e))return;e=e.getParent()}return CKEDITOR.LINEUTILS_BEFORE|CKEDITOR.LINEUTILS_AFTER}}}}),locator:new i.locator(t),liner:new i.liner(t,{lineStyle:{cursor:"move !important","border-top-color":"#666"},tipLeftStyle:{"border-left-color":"#666"},tipRightStyle:{"border-right-color":"#666"}})},!0)})}function _(e){var t=e.editor;t.on("contentDom",function(){var i,n,a=t.editable(),r=a.isInline()?a:t.document;a.attachListener(r,"mousedown",function(t){var a=t.data.getTarget();return a.type?(i=e.getByElement(a),n=0,void(i&&(i.inline&&a.type==CKEDITOR.NODE_ELEMENT&&a.hasAttribute("data-cke-widget-drag-handler")?n=1:d(i.wrapper,a)?i=null:(t.data.preventDefault(),CKEDITOR.env.ie||i.focus())))):!1}),a.attachListener(r,"mouseup",function(){i&&n&&(n=0,i.focus())}),CKEDITOR.env.ie&&a.attachListener(r,"mouseup",function(){i&&setTimeout(function(){i.focus(),i=null})})}),t.on("doubleclick",function(t){var i=e.getByElement(t.data.element);return i&&!d(i.wrapper,t.data.element)?i.fire("doubleclick",{element:t.data.element}):void 0},null,null,1)}function y(e){e.editor.on("key",function(t){var i,n=e.focused,a=e.widgetHoldingFocusedEditable;return n?i=n.fire("key",{keyCode:t.data.keyCode}):a&&(n=t.data.keyCode,t=a.focusedEditable,n==CKEDITOR.CTRL+65?(n=t.getBogus(),a=a.editor.createRange(),a.selectNodeContents(t),n&&a.setEndAt(n,CKEDITOR.POSITION_BEFORE_START),a.select(),i=!1):8==n||46==n?(i=a.editor.getSelection().getRanges(),a=i[0],i=!(1==i.length&&a.collapsed&&a.checkBoundaryOfElement(t,CKEDITOR[8==n?"START":"END"]))):i=void 0),i},null,null,1)}function T(e){function t(t){e.focused&&N(e.focused,"cut"==t.name)}var i=e.editor;i.on("contentDom",function(){var e=i.editable();e.attachListener(e,"copy",t),e.attachListener(e,"cut",t)})}function D(e){var t=e.editor;t.on("selectionCheck",function(){e.fire("checkSelection")}),e.on("checkSelection",e.checkSelection,e),t.on("selectionChange",function(i){var n=(i=d(t.editable(),i.data.selection.getStartElement()))&&e.getByElement(i),a=e.widgetHoldingFocusedEditable;a?a===n&&a.focusedEditable.equals(i)||(k(e,a,null),n&&i&&k(e,n,i)):n&&i&&k(e,n,i)}),t.on("dataReady",function(){I(e).commit()}),t.on("blur",function(){var t;(t=e.focused)&&a(e,t),(t=e.widgetHoldingFocusedEditable)&&k(e,t,null)})}function O(e){var t=e.editor,i={};t.on("toDataFormat",function(t){var n=CKEDITOR.tools.getNextNumber(),a=[];t.data.downcastingSessionId=n,i[n]=a,t.data.dataValue.forEach(function(t){var i,n=t.attributes;if("data-cke-widget-id"in n)(n=e.instances[n["data-cke-widget-id"]])&&(i=t.getFirst(u),a.push({wrapper:t,element:i,widget:n,editables:{}}),"1"!=i.attributes["data-cke-widget-keep-attr"]&&delete i.attributes["data-widget"]);else if("data-cke-widget-editable"in n)return a[a.length-1].editables[n["data-cke-widget-editable"]]=t,!1},CKEDITOR.NODE_ELEMENT,!0)},null,null,8),t.on("toDataFormat",function(e){if(e.data.downcastingSessionId)for(var t,n,a,r,o,s,e=i[e.data.downcastingSessionId];t=e.shift();){n=t.widget,a=t.element,r=n._.downcastFn&&n._.downcastFn.call(n,a);for(s in t.editables)o=t.editables[s],delete o.attributes.contenteditable,o.setHtml(n.editables[s].getData());r||(r=a),t.wrapper.replaceWith(r)}},null,null,13),t.on("contentDomUnload",function(){e.destroyAll(!0)})}function R(e){function t(){a.fire("lockSnapshot"),e.checkWidgets({initOnlyNew:!0,focusInited:i}),a.fire("unlockSnapshot")}var i,n,a=e.editor;a.on("toHtml",function(t){var n,a=s(e);for(t.data.dataValue.forEach(a.iterator,CKEDITOR.NODE_ELEMENT,!0);n=a.toBeWrapped.pop();){var r=n[0],o=r.parent;o.type==CKEDITOR.NODE_ELEMENT&&o.attributes["data-cke-widget-wrapper"]&&o.replaceWith(r),e.wrapElement(n[0],n[1])}i=1==t.data.dataValue.children.length&&t.data.dataValue.children[0].type==CKEDITOR.NODE_ELEMENT&&t.data.dataValue.children[0].attributes["data-cke-widget-wrapper"]},null,null,8),a.on("dataReady",function(){if(n)for(var t,i,r=e,o=a.editable().find(".cke_widget_wrapper"),s=0,d=o.count();d>s;++s)t=o.getItem(s),i=t.getFirst(f),i.type==CKEDITOR.NODE_ELEMENT&&i.data("widget")?(i.replace(t),r.wrapElement(i)):t.remove();n=0,e.destroyAll(!0),e.initOnAll()}),a.on("loadSnapshot",function(t){/data-cke-widget/.test(t.data)&&(n=1),e.destroyAll(!0)},null,null,9),a.on("paste",function(e){e.data.dataValue=e.data.dataValue.replace(z,C)}),a.on("insertText",t,null,null,999),a.on("insertHtml",t,null,null,999)}function I(e){var t=e.selected,i=[],n=t.slice(0),r=null;return{select:function(e){return 0>CKEDITOR.tools.indexOf(t,e)&&i.push(e),e=CKEDITOR.tools.indexOf(n,e),e>=0&&n.splice(e,1),this},focus:function(e){return r=e,this},commit:function(){var o,s,d=e.focused!==r;for(e.editor.fire("lockSnapshot"),d&&(o=e.focused)&&a(e,o);o=n.pop();)t.splice(CKEDITOR.tools.indexOf(t,o),1),o.isInited()&&(s=o.editor.checkDirty(),o.setSelected(!1),!s&&o.editor.resetDirty());for(d&&r&&(s=e.editor.checkDirty(),e.focused=r,e.fire("widgetFocused",{widget:r}),r.setFocused(!0),!s&&e.editor.resetDirty());o=i.pop();)t.push(o),o.setSelected(!0);e.editor.fire("unlockSnapshot")}}}function K(e,t,i){var n,a=0,t=A(t),r=e.data.classes||{};if(t){for(r=CKEDITOR.tools.clone(r);n=t.pop();)i?r[n]||(a=r[n]=1):r[n]&&(delete r[n],a=1);a&&e.setData("classes",r)}}function S(e){e.cancel()}function N(e,t){var i=e.editor,n=i.document;if(!n.getById("cke_copybin")){var a=i.blockless||CKEDITOR.env.ie?"span":"div",r=n.createElement(a),o=n.createElement(a),a=CKEDITOR.env.ie&&9>CKEDITOR.env.version;o.setAttributes({id:"cke_copybin","data-cke-temp":"1"}),r.setStyles({position:"absolute",width:"1px",height:"1px",overflow:"hidden"}),r.setStyle("ltr"==i.config.contentsLangDirection?"left":"right","-5000px"),r.setHtml('<span data-cke-copybin-start="1">​</span>'+e.wrapper.getOuterHtml()+'<span data-cke-copybin-end="1">​</span>'),i.fire("saveSnapshot"),i.fire("lockSnapshot"),o.append(r),i.editable().append(o);var s=i.on("selectionChange",S,null,null,0),d=e.repository.on("checkSelection",S,null,null,0);if(a)var l=n.getDocumentElement().$,c=l.scrollTop;n=i.createRange(),n.selectNodeContents(r),n.select(),a&&(l.scrollTop=c),setTimeout(function(){t||e.focus(),o.remove(),s.removeListener(),d.removeListener(),i.fire("unlockSnapshot"),t&&(e.repository.del(e),i.fire("saveSnapshot"))},100)}}function A(e){return(e=(e=e.getDefinition().attributes)&&e["class"])?e.split(/\s+/):null}function L(){var e=CKEDITOR.document.getActive(),t=this.editor,i=t.editable();(i.isInline()?i:t.document.getWindow().getFrame()).equals(e)&&t.focusManager.focus(i)}function x(){CKEDITOR.env.gecko&&this.editor.unlockSelection(),CKEDITOR.env.webkit||(this.editor.forceNextSelectionCheck(),this.editor.selectionChange(1))}function M(e){var t=null;e.on("data",function(){var e,i=this.data.classes;if(t!=i){for(e in t)(!i||!i[e])&&this.removeClass(e);for(e in i)this.addClass(e);t=i}})}function F(e){if(e.draggable){var t,i=e.editor,n=e.wrapper.getLast(E);n?t=n.findOne("img"):(n=new CKEDITOR.dom.element("span",i.document),n.setAttributes({"class":"cke_reset cke_widget_drag_handler_container",style:"background:rgba(220,220,220,0.5);background-image:url("+i.plugins.widget.path+"images/handle.png)"}),t=new CKEDITOR.dom.element("img",i.document),t.setAttributes({"class":"cke_reset cke_widget_drag_handler","data-cke-widget-drag-handler":"1",src:CKEDITOR.tools.transparentImageData,width:q,title:i.lang.widget.move,height:q}),e.inline&&t.setAttribute("draggable","true"),n.append(t),e.wrapper.append(n)),e.wrapper.on("mouseenter",e.updateDragHandlerPosition,e),setTimeout(function(){e.on("data",e.updateDragHandlerPosition,e)},50),e.inline?t.on("dragstart",function(t){t.data.$.dataTransfer.setData("text",JSON.stringify({type:"cke-widget",editor:i.name,id:e.id}))}):t.on("mousedown",P,e),e.dragHandlerContainer=n}}function P(){function e(){var e;for(u.reset();e=d.pop();)e.removeListener();var t=l,i=this.repository.finder;e=this.repository.liner;var n=this.editor,a=this.editor.editable();CKEDITOR.tools.isEmpty(e.visible)||(t=i.getRange(t[0]),this.focus(),n.fire("saveSnapshot"),n.fire("lockSnapshot",{dontUpdate:1}),n.getSelection().reset(),a.insertElementIntoRange(this.wrapper,t),this.focus(),n.fire("unlockSnapshot"),n.fire("saveSnapshot")),a.removeClass("cke_widget_dragging"),e.hideVisible()}var t,i,n=this.repository.finder,a=this.repository.locator,r=this.repository.liner,o=this.editor,s=o.editable(),d=[],l=[],c=n.greedySearch(),u=CKEDITOR.tools.eventsBuffer(50,function(){t=a.locate(c),l=a.sort(i,1),l.length&&(r.prepare(c,t),r.placeLine(l[0]),r.cleanup())});s.addClass("cke_widget_dragging"),d.push(s.on("mousemove",function(e){i=e.data.$.clientY,u.input()})),d.push(o.document.once("mouseup",e,this)),d.push(CKEDITOR.document.once("mouseup",e,this))}function H(e){var t,i,n=e.editables;if(e.editables={},e.editables)for(t in n)i=n[t],e.initEditable(t,"string"==typeof i?{selector:i}:i)}function B(e){if(e.mask){var t=e.wrapper.findOne(".cke_widget_mask");t||(t=new CKEDITOR.dom.element("img",e.editor.document),t.setAttributes({src:CKEDITOR.tools.transparentImageData,"class":"cke_reset cke_widget_mask"}),e.wrapper.append(t)),e.mask=t}}function $(e){if(e.parts){var t,i,n={};for(i in e.parts)t=e.wrapper.findOne(e.parts[i]),n[i]=t;e.parts=n}}function W(e,t){U(e),$(e),H(e),B(e),F(e),M(e),CKEDITOR.env.ie&&9>CKEDITOR.env.version&&e.wrapper.on("dragstart",function(t){var i=t.data.getTarget();!(d(e,i)||e.inline&&i.type==CKEDITOR.NODE_ELEMENT&&i.hasAttribute("data-cke-widget-drag-handler")||!t.data.preventDefault())}),e.wrapper.removeClass("cke_widget_new"),e.element.addClass("cke_widget_element"),e.on("key",function(t){if(t=t.data.keyCode,13==t)e.edit();else{if(t==CKEDITOR.CTRL+67||t==CKEDITOR.CTRL+88)return void N(e,t==CKEDITOR.CTRL+88);if(t in J||CKEDITOR.CTRL&t||CKEDITOR.ALT&t)return}return!1},null,null,999),e.on("doubleclick",function(t){e.edit()&&t.cancel()}),t.data&&e.on("data",t.data),t.edit&&e.on("edit",t.edit)}function U(e){(e.wrapper=e.element.getParent()).setAttribute("data-cke-widget-id",e.id)}function V(e){e.element.data("cke-widget-data",encodeURIComponent(JSON.stringify(e.data)))}var q=15;CKEDITOR.plugins.add("widget",{lang:"af,ar,ca,cs,cy,da,de,el,en,en-gb,eo,es,fa,fi,fr,gl,he,hr,hu,it,ja,km,ko,ku,nb,nl,no,pl,pt,pt-br,ru,sk,sl,sq,sv,tr,tt,uk,vi,zh,zh-cn",requires:"lineutils,clipboard",onLoad:function(){CKEDITOR.addCss(".cke_widget_wrapper{position:relative;outline:none}.cke_widget_inline{display:inline-block}.cke_widget_wrapper:hover>.cke_widget_element{outline:2px solid yellow;cursor:default}.cke_widget_wrapper:hover .cke_widget_editable{outline:2px solid yellow}.cke_widget_wrapper.cke_widget_focused>.cke_widget_element,.cke_widget_wrapper .cke_widget_editable.cke_widget_editable_focused{outline:2px solid #ace}.cke_widget_editable{cursor:text}.cke_widget_drag_handler_container{position:absolute;width:"+q+"px;height:0;left:-9999px;opacity:0.75;transition:height 0s 0.2s;line-height:0}.cke_widget_wrapper:hover>.cke_widget_drag_handler_container{height:"+q+"px;transition:none}.cke_widget_drag_handler_container:hover{opacity:1}img.cke_widget_drag_handler{cursor:move;width:"+q+"px;height:"+q+"px;display:inline-block}.cke_widget_mask{position:absolute;top:0;left:0;width:100%;height:100%;display:block}.cke_editable.cke_widget_dragging, .cke_editable.cke_widget_dragging *{cursor:move !important}")},beforeInit:function(t){t.widgets=new e(t)},afterInit:function(e){var t,i,n,a=e.widgets.registered;for(i in a)t=a[i],(n=t.button)&&e.ui.addButton&&e.ui.addButton(CKEDITOR.tools.capitalize(t.name,!0),{label:n,command:t.name,toolbar:"insert,10"});v(e)}}),e.prototype={MIN_SELECTION_CHECK_INTERVAL:500,add:function(e,t){t=CKEDITOR.tools.prototypedCopy(t),t.name=e,t._=t._||{},this.editor.fire("widgetDefinition",t),t.template&&(t.template=new CKEDITOR.template(t.template)),n(this.editor,t);var i=t,a=i.upcast;if(a)if("string"==typeof a)for(a=a.split(",");a.length;)this._.upcasts.push([i.upcasts[a.pop()],i.name]);else this._.upcasts.push([a,i.name]);return this.registered[e]=t},addUpcastCallback:function(e){this._.upcastCallbacks.push(e)},checkSelection:function(){var e,t=this.editor.getSelection(),i=t.getSelectedElement(),n=I(this);if(i&&(e=this.getByElement(i,!0)))return n.focus(e).select(e).commit();if(t=t.getRanges()[0],!t||t.collapsed)return n.commit();for(t=new CKEDITOR.dom.walker(t),t.evaluator=h;i=t.next();)n.select(this.getByElement(i));n.commit()},checkWidgets:function(e){this.fire("checkWidgets",CKEDITOR.tools.copy(e||{}))},del:function(e){if(this.focused===e){var t,i=e.editor,n=i.createRange();(t=n.moveToClosestEditablePosition(e.wrapper,!0))||(t=n.moveToClosestEditablePosition(e.wrapper,!1)),t&&i.getSelection().selectRanges([n])}e.wrapper.remove(),this.destroy(e,!0)},destroy:function(e,t){this.widgetHoldingFocusedEditable===e&&k(this,e,null,t),e.destroy(t),delete this.instances[e.id],this.fire("instanceDestroyed",e)},destroyAll:function(e){var t,i,n=this.instances;for(i in n)t=n[i],this.destroy(t,e)},finalizeCreation:function(e){(e=e.getFirst())&&h(e)&&(this.editor.insertElement(e),e=this.getByElement(e),e.ready=!0,e.fire("ready"),e.focus())},getByElement:function(){var e={div:1,span:1};return function(t,i){if(!t)return null;var n=t.is(e)&&t.data("cke-widget-id");if(!i&&!n){var a=this.editor.editable();do t=t.getParent();while(t&&!t.equals(a)&&!(n=t.is(e)&&t.data("cke-widget-id")))}return this.instances[n]||null}}(),initOn:function(e,i,n){if(i?"string"==typeof i&&(i=this.registered[i]):i=this.registered[e.data("widget")],!i)return null;var a=this.wrapElement(e,i.name);return a?a.hasClass("cke_widget_new")?(e=new t(this,this._.nextId++,e,i,n),e.isInited()?this.instances[e.id]=e:null):this.getByElement(e):null},initOnAll:function(e){for(var t,e=(e||this.editor.editable()).find(".cke_widget_new"),i=[],n=e.count();n--;)(t=this.initOn(e.getItem(n).getFirst(f)))&&i.push(t);return i},parseElementClasses:function(e){if(!e)return null;for(var t,e=CKEDITOR.tools.trim(e).split(/\s+/),i={},n=0;t=e.pop();)-1==t.indexOf("cke_")&&(i[t]=n=1);return n?i:null},wrapElement:function(e,t){var i,n,a=null;if(e instanceof CKEDITOR.dom.element){if(i=this.registered[t||e.data("widget")],!i)return null;if((a=e.getParent())&&a.type==CKEDITOR.NODE_ELEMENT&&a.data("cke-widget-wrapper"))return a;e.hasAttribute("data-cke-widget-keep-attr")||e.data("cke-widget-keep-attr",e.data("widget")?1:0),t&&e.data("widget",t),n=p(i,e.getName()),a=new CKEDITOR.dom.element(n?"span":"div"),a.setAttributes(l(n)),a.data("cke-display-name",i.pathName?i.pathName:e.getName()),e.getParent(!0)&&a.replace(e),e.appendTo(a)}else if(e instanceof CKEDITOR.htmlParser.element){if(i=this.registered[t||e.attributes["data-widget"]],!i)return null;if((a=e.parent)&&a.type==CKEDITOR.NODE_ELEMENT&&a.attributes["data-cke-widget-wrapper"])return a;"data-cke-widget-keep-attr"in e.attributes||(e.attributes["data-cke-widget-keep-attr"]=e.attributes["data-widget"]?1:0),t&&(e.attributes["data-widget"]=t),n=p(i,e.name),a=new CKEDITOR.htmlParser.element(n?"span":"div",l(n)),a.attributes["data-cke-display-name"]=i.pathName?i.pathName:e.name,i=e.parent;var r;i&&(r=e.getIndex(),e.remove()),a.add(e),i&&c(i,r,a)}return a},_tests_getNestedEditable:d,_tests_createEditableFilter:o},CKEDITOR.event.implementOn(e.prototype),t.prototype={addClass:function(e){this.element.addClass(e)},applyStyle:function(e){K(this,e,1)},checkStyleActive:function(e){var t,e=A(e);if(!e)return!1;for(;t=e.pop();)if(!this.hasClass(t))return!1;return!0},destroy:function(e){if(this.fire("destroy"),this.editables)for(var t in this.editables)this.destroyEditable(t,e);e||("0"==this.element.data("cke-widget-keep-attr")&&this.element.removeAttribute("data-widget"),this.element.removeAttributes(["data-cke-widget-data","data-cke-widget-keep-attr"]),this.element.removeClass("cke_widget_element"),this.element.replace(this.wrapper)),this.wrapper=null},destroyEditable:function(e,t){var i=this.editables[e];i.removeListener("focus",x),i.removeListener("blur",L),this.editor.focusManager.remove(i),t||(i.removeClass("cke_widget_editable"),i.removeClass("cke_widget_editable_focused"),i.removeAttributes(["contenteditable","data-cke-widget-editable","data-cke-enter-mode"])),delete this.editables[e]},edit:function(){var e={dialog:this.dialog},t=this;return!1!==this.fire("edit",e)&&e.dialog?(this.editor.openDialog(e.dialog,function(e){var i,n;!1!==t.fire("dialog",e)&&(i=e.on("show",function(){e.setupContent(t)}),n=e.on("ok",function(){var i,n=t.on("data",function(e){i=1,e.cancel()},null,null,0);t.editor.fire("saveSnapshot"),e.commitContent(t),n.removeListener(),i&&(t.fire("data",t.data),t.editor.fire("saveSnapshot"))}),e.once("hide",function(){i.removeListener(),n.removeListener()}))}),!0):!1},getClasses:function(){return this.repository.parseElementClasses(this.element.getAttribute("class"))},hasClass:function(e){return this.element.hasClass(e)},initEditable:function(e,t){var n=this.wrapper.findOne(t.selector);return n&&n.is(CKEDITOR.dtd.$editable)?(n=new i(this.editor,n,{filter:o.call(this.repository,this.name,e,t)}),this.editables[e]=n,n.setAttributes({contenteditable:"true","data-cke-widget-editable":e,"data-cke-enter-mode":n.enterMode}),n.filter&&n.data("cke-filter",n.filter.id),n.addClass("cke_widget_editable"),n.removeClass("cke_widget_editable_focused"),t.pathName&&n.data("cke-display-name",t.pathName),this.editor.focusManager.add(n),n.on("focus",x,this),CKEDITOR.env.ie&&n.on("blur",L,this),n.setData(n.getHtml()),!0):!1},isInited:function(){return!(!this.wrapper||!this.inited)},isReady:function(){return this.isInited()&&this.ready},focus:function(){var e=this.editor.getSelection();if(e){var t=this.editor.checkDirty();e.fake(this.wrapper),!t&&this.editor.resetDirty()}this.editor.focus()},removeClass:function(e){this.element.removeClass(e)},removeStyle:function(e){K(this,e,0)},setData:function(e,t){var i=this.data,n=0;if("string"==typeof e)i[e]!==t&&(i[e]=t,n=1);else{var a=e;for(e in a)i[e]!==a[e]&&(n=1,i[e]=a[e])}return n&&this.dataReady&&(V(this),this.fire("data",i)),this},setFocused:function(e){return this.wrapper[e?"addClass":"removeClass"]("cke_widget_focused"),this.fire(e?"focus":"blur"),this},setSelected:function(e){return this.wrapper[e?"addClass":"removeClass"]("cke_widget_selected"),this.fire(e?"select":"deselect"),this},updateDragHandlerPosition:function(){var e=this.editor,t=this.element.$,i=this._.dragHandlerOffset,t={x:t.offsetLeft,y:t.offsetTop-q};i&&t.x==i.x&&t.y==i.y||(i=e.checkDirty(),e.fire("lockSnapshot"),this.dragHandlerContainer.setStyles({top:t.y+"px",left:t.x+"px"}),e.fire("unlockSnapshot"),!i&&e.resetDirty(),this._.dragHandlerOffset=t)}},CKEDITOR.event.implementOn(t.prototype),i.prototype=CKEDITOR.tools.extend(CKEDITOR.tools.prototypedCopy(CKEDITOR.dom.element.prototype),{setData:function(e){e=this.editor.dataProcessor.toHtml(e,{context:this.getName(),filter:this.filter,enterMode:this.enterMode}),this.setHtml(e),this.editor.widgets.initOnAll(this)},getData:function(){return this.editor.dataProcessor.toDataFormat(this.getHtml(),{context:this.getName(),filter:this.filter,enterMode:this.enterMode})}});var z=RegExp('^(?:<(?:div|span)(?: data-cke-temp="1")?(?: id="cke_copybin")?(?: data-cke-temp="1")?>)?(?:<(?:div|span)(?: style="[^"]+")?>)?<span [^>]*data-cke-copybin-start="1"[^>]*>.?</span>([\\s\\S]+)<span [^>]*data-cke-copybin-end="1"[^>]*>.?</span>(?:</(?:div|span)>)?(?:</(?:div|span)>)?$'),J={37:1,38:1,39:1,40:1,8:1,46:1};!function(){function e(){}function t(e,t,i){return i&&this.checkElement(e)?(e=i.widgets.getByElement(e,!0))&&e.checkStyleActive(this):!1}CKEDITOR.style.addCustomHandler({type:"widget",setup:function(e){this.widget=e.widget},apply:function(e){e instanceof CKEDITOR.editor&&this.checkApplicable(e.elementPath(),e)&&e.widgets.focused.applyStyle(this)},remove:function(e){e instanceof CKEDITOR.editor&&this.checkApplicable(e.elementPath(),e)&&e.widgets.focused.removeStyle(this)},checkActive:function(e,t){return this.checkElementMatch(e.lastElement,0,t)},checkApplicable:function(e,t){return t instanceof CKEDITOR.editor?this.checkElement(e.lastElement):!1},checkElementMatch:t,checkElementRemovable:t,checkElement:function(e){return h(e)?(e=e.getFirst(f))&&e.data("widget")==this.widget:!1},buildPreview:function(e){return e||this._.definition.name},toAllowedContentRules:function(e){if(!e)return null;var t,e=e.widgets.registered[this.widget],i={};return e?e.styleableElements?(t=this.getClassesArray())?(i[e.styleableElements]={classes:t,propertiesOnly:!0},i):null:e.styleToAllowedContentRules?e.styleToAllowedContentRules(this):null:null},getClassesArray:function(){var e=this._.definition.attributes&&this._.definition.attributes["class"];return e?CKEDITOR.tools.trim(e).split(/\s+/):null},applyToRange:e,removeFromRange:e,applyToObject:e})}(),CKEDITOR.plugins.widget=t,t.repository=e,t.nestedEditable=i}();