"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),UnitSizeCalculator=function(){function t(){_classCallCheck(this,t)}return _createClass(t,null,[{key:"calculateSize",value:function(t){if(!t.length)return{root:{h:0,w:0}};var e,i;this.root={x:0,y:0,w:t[0].w,h:t[0].h};for(var n=0;n<t.length;n++)i=t[n],(e=this.findNode(this.root,i.w,i.h))?i.fit=this.splitNode(e,i.w,i.h):i.fit=this.growNode(i.w,i.h);return this.root}},{key:"findNode",value:function(t,e,i){return t.used?this.findNode(t.right,e,i)||this.findNode(t.down,e,i):e<=t.w&&i<=t.h?t:null}},{key:"splitNode",value:function(t,e,i){return t.used=!0,t.down={x:t.x,y:t.y+i,w:t.w,h:t.h-i},t.right={x:t.x+e,y:t.y,w:t.w-e,h:i},t}},{key:"growNode",value:function(t,e){var i=t<=this.root.w,n=e<=this.root.h,s=n&&this.root.h>=this.root.w+t,a=i&&this.root.w>=this.root.h+e;return s?this.growRight(t,e):a?this.growDown(t,e):n?this.growRight(t,e):i?this.growDown(t,e):null}},{key:"growRight",value:function(t,e){var i;return this.root={used:!0,x:0,y:0,w:this.root.w+t,h:this.root.h,down:this.root,right:{x:this.root.w,y:0,w:t,h:this.root.h}},(i=this.findNode(this.root,t,e))?this.splitNode(i,t,e):null}},{key:"growDown",value:function(t,e){var i;return this.root={used:!0,x:0,y:0,w:this.root.w,h:this.root.h+e,down:{x:0,y:this.root.h,w:this.root.w,h:e},right:this.root},(i=this.findNode(this.root,t,e))?this.splitNode(i,t,e):null}}]),t}(),StorageCalculatorWidget=function(){function t(e){var i=this;_classCallCheck(this,t),this.configs=e,this.fetchTabs(e.tabsURL).then(function(){i.widget=$("#"+i.configs.widgetId),i.addInitialText(i.configs),i.createCalculator(),i.setInitialValues(),i.setupSlide(),i.setupItemCountChange(),i.setupTagDimensions(),i.openFirstTab()})}return _createClass(t,[{key:"openFirstTab",value:function(){"true"===this.configs.firstTabOpen&&this.widget.find(".storage-calc-category-name").first().click()}},{key:"setInitialValues",value:function(){this.items=this.widget.find(".storage-calc-item"),this.calculatedSize=this.widget.find(".calculated-size"),this.inputWraper=this.widget.find(".input-wrapper"),this.unitCount=this.widget.find(".unit-count")}},{key:"addInitialText",value:function(t){this.widget.find(".recommended-text").text("RECOMMENDED SIZE: "),this.widget.find(".instructional-text").text(t.instructionalText),this.widget.find(".disclaimer-text-wrapper").text(t.disclaimerText),this.widget.find(".calculated-size").text("0 x 0"),"true"===this.configs.useCustomFont&&this.widget.find(".calculated-size").css({"font-family":"CustomCalcFont"})}},{key:"fetchTabs",value:function(t){var e=this;return $.get(t,function(t){t=JSON.parse(t),e.tabs=t.tabs})}},{key:"createCalculator",value:function(){for(var t,e=0;e<this.tabs.length;e++){t=this.tabs[e];var i=this.createSection(t);this.widget.find(".storage-calc-sections").append(i)}}},{key:"createSection",value:function(t){var e=this.createEmptySection(t.name),i=this.createSectionFilling(t.storageItems);return e.find(".storage-calc-item-container").append(i),e}},{key:"createEmptySection",value:function(t){return $("<div class='storage-calc-category'>\n                <a class='storage-calc-category-name'>\n                  <h3>"+t+" <span class='acc-arrow'></span></h3>\n                  "+("BOXES"!=t?"<hr>":"")+"\n                </a>\n                <div style='display:none;' class='storage-calc-item-container'>\n                </div>\n              </div>")}},{key:"createSectionFilling",value:function(t){for(var e,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=0;n<t.length;n++)e=t[n],i.push($('<div class="storage-calc-item">\n                                    <div class="storage-calc-item-info">\n                                    <img src='+(this.configs.s3BucketLink+e.name.replace(/ +/g,"-")+("-"+this.configs.imageColor+".png"))+" />\n                                      <h4>"+e.name+'</h4>\n                                    </div>\n                                    <div class="storage-calc-item-counter">\n                                    <div class="input-wrapper">\n                                      <div data-add="1" class="before-arrow">\n                                        <svg width="9" height="6" viewBox="-2.5 -5 75 60" preserveAspectRatio="none">\n                                          <path d="M0,0 l35,50 l35,-50" fill="none" stroke="white" stroke-linecap="round" stroke-width="14" />\n                                        </svg>\n                                      </div>\n                                      <div contenteditable="true" class="unit-count">0</div>\n                                      <div data-add="-1" class="after-arrow">\n                                        <svg width="9" height="6" viewBox="-2.5 -5 75 60" preserveAspectRatio="none">\n                                          <path d="M0,0 l35,50 l35,-50" fill="none" stroke="white" stroke-linecap="round" stroke-width="14" />\n                                        </svg>\n                                      </div>\n                                      <div class="item-info" data-width='+e.x+" data-height="+e.y+" data-depth="+e.z+" stackable="+e.stackable+" />\n                                    </div>\n                                    </div>\n                                  </div>").get(0));return $(i)}},{key:"setupSlide",value:function(){this.widget.find(".storage-calc-category-name").click(function(){var t=$(this).next(".storage-calc-item-container");t.is(":visible")?($(this).removeClass("open"),t.slideUp("slow")):($(this).addClass("open"),t.slideDown("slow").css({display:"flex"}))})}},{key:"setupTagDimensions",value:function(){var t=this,e=function(){t.setItemSize(),t.setFontSize()};$(window).resize(e),e()}},{key:"setItemSize",value:function(){var t=this.widget.find(".storage-calc-wrapper"),e=t.width();e<180?this.setItemCSS(45,43,47):e<250?this.setItemCSS(46.5,70,70):e<=360?this.setItemCSS(46.5,105,105):this.setItemCSS(30.7,95,95)}},{key:"setItemCSS",value:function(t,e,i){this.items.css({"max-width":t+"%",flex:"1 1 "+e+"px","min-width":i+"px"})}},{key:"setFontSize",value:function(){var t=this.widget.find(".recommended-text-container");t.find(".recommended-text").css({"font-size":.04*t.width()+"px"}),this.items.css({"font-size":.023*t.width()+"px"}),this.widget.find(".instructional-text").css({"font-size":.04*t.width()+"px"}),this.widget.find(".disclaimer-text-wrapper").css({"font-size":.03*t.width()+"px"}),this.widget.find(".unit-count").css({"font-size":.04*t.width()+"px"}),"true"===this.configs.useCustomFont?t.find(".calculated-size").css({"font-size":.128*t.width()+"px"}):t.find(".calculated-size").css({"font-size":.106*t.width()+"px"})}},{key:"setupItemCountChange",value:function(){this.setupArrowsClicked(),this.setupUserKeyboardInput()}},{key:"setupArrowsClicked",value:function(){var t=this,e=function(e){var i=$($(e.currentTarget).parent().find(".unit-count").get(0)),n=$(e.currentTarget).data("add"),s=parseInt(i.text());s+n<0||s+n===100||(i.text(parseInt(i.text())+parseInt(n)),t.updateRecommendedSize())};this.widget.find(".before-arrow").click(e),this.widget.find(".after-arrow").click(e)}},{key:"setupUserKeyboardInput",value:function(){var t=this,e=function(e){var i=$(e.currentTarget),n=i.text();n.length&&$.isNumeric(n)?n.length>2&&i.text(n.slice(0,-1)):i.text(0),t.updateRecommendedSize()},i=function(e){38===e.keyCode&&99!=$(e.currentTarget).text()?$(e.currentTarget).text(parseInt($(e.currentTarget).text())+1):40===e.keyCode&&0!=$(e.currentTarget).text()&&$(e.currentTarget).text(parseInt($(e.currentTarget).text())-1),t.updateRecommendedSize()};this.unitCount.on({change:function(t){e(t)},input:function(t){e(t)},blur:function(t){e(t)},keydown:function(t){i(t)}}),this.widget.find(".storage-calc-item-info").on("click",function(e){var i=$(e.currentTarget).next().find(".unit-count");99!=i.text()&&i.text(parseInt(i.text())+1),t.updateRecommendedSize()})}},{key:"updateRecommendedSize",value:function(){var t=[];this.inputWraper.each(function(e,i){var n=$(i).find(".item-info"),s=parseInt($(i).find(".unit-count").text());if(s)for(var a=n.data("width"),o=n.data("height");s;s--)t.push({w:a,h:o})}),t=t.sort(function(t,e){return t.h*t.w<e.h*e.w?1:t.h*t.w>e.h*e.w?-1:0});var e=UnitSizeCalculator.calculateSize(t),i=e.w,n=void 0===i?0:i,s=e.h,a=void 0===s?0:s;n=5*Math.ceil(n/5),a=5*Math.ceil(a/5),this.calculatedSize.text(n+" x "+a)}}]),t}();G5.loadWidgetConfigs(".storage-size-calculator .config",StorageCalculatorWidget);