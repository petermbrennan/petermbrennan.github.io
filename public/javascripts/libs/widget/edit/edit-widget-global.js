"use strict";function _classCallCheck(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,i){for(var e=0;e<i.length;e++){var n=i[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(i,e,n){return e&&t(i.prototype,e),n&&t(i,n),i}}(),WidgetEditGlobalJS=function(){function t(){_classCallCheck(this,t),this.topWindow=window.top,this.tabs=this.topWindow.$(".accordion-tabs-minimal"),this.container=this.topWindow.$(".modal-body"),this.setupToggleEvent(),this.setupNumberInputMinMax()}return _createClass(t,[{key:"setupToggleEvent",value:function(){this.tabs.each(function(t){$(this).children("li").first().children("a").addClass("is-active").next().addClass("is-open").css("display","block")}),this.tabs.on("click","li > a.tab-link",function(t){if($(this).hasClass("is-active"))t.preventDefault();else{t.preventDefault();var i=$(this).closest(".accordion-tabs-minimal");i.find(".is-open").removeClass("is-open").hide(),$(this).next().toggleClass("is-open").toggle(),i.find(".is-active").removeClass("is-active"),$(this).addClass("is-active")}}),this.tabs.first().find("li > a.tab-link").click()}},{key:"setupNumberInputMinMax",value:function(){var t=function(t){var i=$(t.currentTarget),e=parseInt(i.val()),n=parseInt(i.attr("max")),a=parseInt(i.attr("min"));e>n&&i.val(n),e<a&&i.val(a)};$(".edit-integer-field input").on({change:function(i){t(i)},input:function(i){t(i)},blur:function(i){t(i)}})}}]),t}();new WidgetEditGlobalJS;