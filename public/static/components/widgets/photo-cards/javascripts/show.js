"use strict";function _classCallCheck(t,o){if(!(t instanceof o))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,o){for(var e=0;e<o.length;e++){var r=o[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(o,e,r){return e&&t(o.prototype,e),r&&t(o,r),o}}(),PhotoCardsWidget=function(){function t(o){var e=this;_classCallCheck(this,t),this.configs=o,this.widget=$("#"+this.configs.widgetId),this.photoWrappers=this.widget.find(".photo-card-wrapper"),this.widget.hasClass("a-flip")&&this.widget.imagesLoaded(function(){e.setupFlip(),e.widget.addClass("photo-cards-loaded"),$(window).smartresize(function(){e.resetFlip(),e.setupFlip()})}),this.touchHovers(),this.widget.find(".photo-card-caption:has(p img)").addClass("has-image")}return _createClass(t,[{key:"setupFlip",value:function(){this.widget.css("opacity",1),this.widget.find(".photo-card-wrapper").each(function(){var t=$(this),o=t.find("img"),e=2*parseInt(t.css("padding-top")),r=o.outerWidth()+e+"px",a=o.outerWidth()+"px";t.css("width",r),t.find(".photo-card-front, .photo-card-back").css("width",a);var i=o.outerHeight()+"px",s=o.outerHeight()+e+"px";t.css("height",s),t.find(".photo-card-front, .photo-card-back").css("height",i)})}},{key:"resetFlip",value:function(){this.widget.find(".photo-card-wrapper, .photo-card-front, .photo-card-back").removeAttr("style")}},{key:"touchHovers",value:function(t){var o=this;this.widget.find(".photo-card-wrapper").on("touchend",function(t){o.photoWrappers.removeClass("hover"),$(t.currentTarget).addClass("hover"),t.stopPropagation()}),$("body").on("touchend",function(){o.photoWrappers.removeClass("hover")}),$(".photo-cards a").on("touchend",function(t){var o=$(t.currentTarget).closest(".photo-card-wrapper");o.hasClass("hover")||t.preventDefault()})}}]),t}();G5.loadWidgetConfigs(".photo-cards .config",PhotoCardsWidget);