// ********************************************
//
//  Olmsted Custom Theme
//
//  JS by Adam Sworob
//
// ********************************************

/*------------------------------------------------------------------

[Table of contents]

1. Variables
2. Home Body Classes
3. Hero
4. Navigation
5. Header / Nav Colors
6. Replace Phone
7. Replace Office Hours
8. Social Link Order
9. Sticky Navigation
10. Slide Wrapper
11. Directions Widget
12. Calls To Action Widget
13. Lead Form Widget
14. Combine Paragraphs
15. Switch Rows
16. Bed To Bedroom
17. Parallax
XX. On Page Ready
XX. On Window/Orientation Change
XX. On Scroll

*/

var olmsted = {

	initialize: function() {

    // 1. Variables
  	this.variables();

		// 2. Home Body Classes
  	this.homeBodyClasses();

  	// 3. Hero
  	this.heroAnimation();

  	// 4. Navigation
  	this.navOlmsted();

  	// 5. Header / Nav Colors
  	this.headerNavColors();

		// 6. Replace Phone
    this.replacePhone();

		// 7. Replace Office Hours
    this.replaceOfficeHours();

		// 8. Social Link Order
    this.socialLinkOrder();

    // 9. Sticky Navigation
		this.stickyNav();

		// 10. Slide Wrapper
		this.slideWrapper();

		// 11. Directions Widget
    this.directionsWidget();

		// 12. Calls To Action Widget
    this.callsToActionWidget();

    // 14. Combine Paragraphs
    this.combineParagraphs();

		// 15. Switch Rows
    this.switchRows();

    // 17. Parallax
    this.parallax();


		/*------------------------------------------------------------------
		[ X. On Scroll ]
		*/

		$(document).scroll(function() {

			// 17. Parallax
	  	this.parallax();

		}.bind(this));


		/*------------------------------------------------------------------
		[ X. On Window/Orientation Change ]
		*/

		$(window).smartresize(function() {

		  // 14. Combine Paragraphs
			this.combineParagraphs();

			// 15. Switch Rows
	    this.switchRows();

			// 17. Parallax
			this.parallax();

		}.bind(this));


		/*------------------------------------------------------------------
		[ X. Ajax Complete ]
		*/

		$(document).ajaxComplete(function(){

			// 13. Lead Form Widget
	    this.leadFormWidget();

	    // 16. Bed to Bedroom
			this.bedToBedroom();

		}.bind(this));

	},

  /*------------------------------------------------------------------
	[ 1. Variables ]
	*/

	variables: function() {

		this.body = $("body");
		this.header = $("[role=banner]");
		this.row = $(".row");
		this.row1 = $(".row:first-child");
		this.roleMain = $("[role=main]");
		this.rowHalves = $(".row-halves");
		this.leadForm = $(".lead-form");
		this.topSwitchedRow = $(".switch-row");

		this.targetNav = $("#drop-target-nav");
		this.nav = $(".navigation");
		this.topNav = $(".top-nav");
		this.navFirstItem = this.nav.find("li:first-of-type > a");

		this.phone = $(".phone .p-tel, .phone .tel"); // remove .phone .tel after microformat test

		this.officeHours = $(".office-hours p");

		this.socialLinks = $(".social-links");

		this.headerBtnAnchor = $("#drop-target-btn a").attr("href");
		this.headerBtnText = $("#drop-target-btn .btn").text();

		this.stickyOffset = 0;

		this.halvedParagraphs = $(".combine-paragraphs .row-halves");

   	this.homePage = this.body.hasClass("web-home-template");

   	this.multifamilyIUICards = $(".multifamily-iui-cards");

   	this.mobile = "(max-width: 979px)";
   	this.desktop = "(min-width: 980px)";

   	this.topNav.hover(
      function(e) {
        this.addHover(e);
      }.bind(this), function(e) {
        this.removeHover(e);
      }.bind(this)
   	);

   	// 10. Directions Widget
    $('.directions.widget .directions-submit').click(function(e) {
      this.directionsSubmitClick(e);
    }.bind(this));

	},

	/*------------------------------------------------------------------
	[ 2. Home Body Classes ]
	*/

	homeBodyClasses: function() {

		if(this.homePage) {

		  if( !$(this.row1).hasClass("hero") ) {
		    $(this.row1).addClass("hero");
		  }

		}

		this.hero = $(".hero");
		this.heroImg = this.hero.find("img");
	  this.heroRow = this.hero.find(".row-2");

	},


	/*------------------------------------------------------------------
	[ 3. Hero ]
	*/

	heroAnimation: function() {

		if(this.hero.length) {

  		this.body.addClass("load-animation-start");

			setTimeout( function() {
				this.body.addClass("load-animation");
			}.bind(this), 2500);

		}

	},

	/*------------------------------------------------------------------
	[ 4. Navigation ]
	*/

	navOlmsted: function() {
		this.navFirstItem.wrapInner( "<span class='home'></span>" );
		$("<span class='olmsted'>Olmsted</span>").insertAfter(".navigation li:first-of-type > a .home");
		$("<li><a href='" + this.headerBtnAnchor + "' target='_blank'> " + this.headerBtnText + " </a></li>").insertAfter(".navigation li:last-of-type");
	},

	addHover: function(e) {
    $(e.currentTarget).addClass("hover");
	},

	removeHover: function(e) {
    $(e.currentTarget).removeClass("hover");
  },


	/*------------------------------------------------------------------
	[ 5. Header / Nav Colors ]
	*/

	headerNavColors: function() {
		if(this.homePage) {
		  this.row2Color = $(".row:nth-of-type(2)").css("background-color");
			this.header.css("background-color", this.row2Color);
			this.targetNav.css("background-color", this.row2Color);
			this.nav.css("background-color", this.row2Color);
			this.roleMain.css("background-color", this.row2Color);
		}
		else{
		  this.row1Color = $(".row:nth-of-type(1)").css("background-color");
			this.header.css("background-color", this.row1Color);
			this.targetNav.css("background-color", this.row1Color);
			this.nav.css("background-color", this.row1Color);
			this.roleMain.css("background-color", this.row1Color);
		}
	},

	/*------------------------------------------------------------------
	[ 6. Replace Phone ]
	*/

	replacePhone: function() {
		this.phone.each(function(index, value) {
			this.newPhone = $(value).text().replace(/\-/g, '.');
			$(value).text(this.newPhone);
		}.bind(this));
	},

	/*------------------------------------------------------------------
	[ 7. Replace Office Hours ]
	*/

	replaceOfficeHours: function() {
		this.officeHours.each(function(index, value) {
			this.newOfficeHours = $(value).html().replace(/\:/g, '');
			$(value).html(this.newOfficeHours);
		}.bind(this));
	},

	/*------------------------------------------------------------------
	[ 8. Social Link Order ]
	*/

	socialLinkOrder: function() {
		this.socialLinks.each(function(index, value) {
			$(value).prepend($(value).find('.twitter'));
		}.bind(this));
	},

	/*------------------------------------------------------------------
	[ 9. Sticky Navigation ]
	*/

	stickyNav: function() {

		!function(){"use strict";function t(o){if(!o)throw new Error("No options passed to Waypoint constructor");if(!o.element)throw new Error("No element option passed to Waypoint constructor");if(!o.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+e,this.options=t.Adapter.extend({},t.defaults,o),this.element=this.options.element,this.adapter=new t.Adapter(this.element),this.callback=o.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=t.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=t.Context.findOrCreateByElement(this.options.context),t.offsetAliases[this.options.offset]&&(this.options.offset=t.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),i[this.key]=this,e+=1}var e=0,i={};t.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t)},t.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t)},t.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete i[this.key]},t.prototype.disable=function(){return this.enabled=!1,this},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},t.prototype.next=function(){return this.group.next(this)},t.prototype.previous=function(){return this.group.previous(this)},t.invokeAll=function(t){var e=[];for(var o in i)e.push(i[o]);for(var n=0,r=e.length;r>n;n++)e[n][t]()},t.destroyAll=function(){t.invokeAll("destroy")},t.disableAll=function(){t.invokeAll("disable")},t.enableAll=function(){t.invokeAll("enable")},t.refreshAll=function(){t.Context.refreshAll()},t.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},t.viewportWidth=function(){return document.documentElement.clientWidth},t.adapters=[],t.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},t.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=t}(),function(){"use strict";function t(t){window.setTimeout(t,1e3/60)}function e(t){this.element=t,this.Adapter=n.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,o[t.waypointContextKey]=this,i+=1,this.createThrottledScrollHandler(),this.createThrottledResizeHandler()}var i=0,o={},n=window.Waypoint,r=window.onload;e.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh()},e.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical);t&&e&&(this.adapter.off(".waypoints"),delete o[this.key])},e.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1}var e=this;this.adapter.on("resize.waypoints",function(){e.didResize||(e.didResize=!0,n.requestAnimationFrame(t))})},e.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1}var e=this;this.adapter.on("scroll.waypoints",function(){(!e.didScroll||n.isTouch)&&(e.didScroll=!0,n.requestAnimationFrame(t))})},e.prototype.handleResize=function(){n.Context.refreshAll()},e.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var o=e[i],n=o.newScroll>o.oldScroll,r=n?o.forward:o.backward;for(var s in this.waypoints[i]){var a=this.waypoints[i][s],l=o.oldScroll<a.triggerPoint,h=o.newScroll>=a.triggerPoint,p=l&&h,u=!l&&!h;(p||u)&&(a.queueTrigger(r),t[a.group.id]=a.group)}}for(var c in t)t[c].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll}},e.prototype.innerHeight=function(){return this.element==this.element.window?n.viewportHeight():this.adapter.innerHeight()},e.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty()},e.prototype.innerWidth=function(){return this.element==this.element.window?n.viewportWidth():this.adapter.innerWidth()},e.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var o=0,n=t.length;n>o;o++)t[o].destroy()},e.prototype.refresh=function(){var t,e=this.element==this.element.window,i=this.adapter.offset(),o={};this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};for(var n in t){var r=t[n];for(var s in this.waypoints[n]){var a,l,h,p,u,c=this.waypoints[n][s],d=c.options.offset,f=c.triggerPoint,w=0,y=null==f;c.element!==c.element.window&&(w=c.adapter.offset()[r.offsetProp]),"function"==typeof d?d=d.apply(c):"string"==typeof d&&(d=parseFloat(d),c.options.offset.indexOf("%")>-1&&(d=Math.ceil(r.contextDimension*d/100))),a=r.contextScroll-r.contextOffset,c.triggerPoint=w+a-d,l=f<r.oldScroll,h=c.triggerPoint>=r.oldScroll,p=l&&h,u=!l&&!h,!y&&p?(c.queueTrigger(r.backward),o[c.group.id]=c.group):!y&&u?(c.queueTrigger(r.forward),o[c.group.id]=c.group):y&&r.oldScroll>=c.triggerPoint&&(c.queueTrigger(r.forward),o[c.group.id]=c.group)}}for(var g in o)o[g].flushTriggers();return this},e.findOrCreateByElement=function(t){return e.findByElement(t)||new e(t)},e.refreshAll=function(){for(var t in o)o[t].refresh()},e.findByElement=function(t){return o[t.waypointContextKey]},window.onload=function(){r&&r(),e.refreshAll()},n.requestAnimationFrame=function(e){var i=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||t;i.call(window,e)},n.Context=e}(),function(){"use strict";function t(t,e){return t.triggerPoint-e.triggerPoint}function e(t,e){return e.triggerPoint-t.triggerPoint}function i(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),o[this.axis][this.name]=this}var o={vertical:{},horizontal:{}},n=window.Waypoint;i.prototype.add=function(t){this.waypoints.push(t)},i.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}},i.prototype.flushTriggers=function(){for(var i in this.triggerQueues){var o=this.triggerQueues[i],n="up"===i||"left"===i;o.sort(n?e:t);for(var r=0,s=o.length;s>r;r+=1){var a=o[r];(a.options.continuous||r===o.length-1)&&a.trigger([i])}}this.clearTriggerQueues()},i.prototype.next=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints),o=i===this.waypoints.length-1;return o?null:this.waypoints[i+1]},i.prototype.previous=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints);return i?this.waypoints[i-1]:null},i.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t)},i.prototype.remove=function(t){var e=n.Adapter.inArray(t,this.waypoints);e>-1&&this.waypoints.splice(e,1)},i.prototype.first=function(){return this.waypoints[0]},i.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},i.findOrCreate=function(t){return o[t.axis][t.name]||new i(t)},n.Group=i}(),function(){"use strict";function t(t){this.$element=e(t)}var e=window.jQuery,i=window.Waypoint;e.each(["innerHeight","innerWidth","off","offset","on","outerHeight","outerWidth","scrollLeft","scrollTop"],function(e,i){t.prototype[i]=function(){var t=Array.prototype.slice.call(arguments);return this.$element[i].apply(this.$element,t)}}),e.each(["extend","inArray","isEmptyObject"],function(i,o){t[o]=e[o]}),i.adapters.push({name:"jquery",Adapter:t}),i.Adapter=t}(),function(){"use strict";function t(t){return function(){var i=[],o=arguments[0];return t.isFunction(arguments[0])&&(o=t.extend({},arguments[1]),o.handler=arguments[0]),this.each(function(){var n=t.extend({},o,{element:this});"string"==typeof n.context&&(n.context=t(this).closest(n.context)[0]),i.push(new e(n))}),i}}var e=window.Waypoint;window.jQuery&&(window.jQuery.fn.waypoint=t(window.jQuery)),window.Zepto&&(window.Zepto.fn.waypoint=t(window.Zepto))}();
		!function(){"use strict";function t(s){this.options=e.extend({},i.defaults,t.defaults,s),this.element=this.options.element,this.$element=e(this.element),this.createWrapper(),this.createWaypoint()}var e=window.jQuery,i=window.Waypoint;t.prototype.createWaypoint=function(){var t=this.options.handler;this.waypoint=new i(e.extend({},this.options,{element:this.wrapper,handler:e.proxy(function(e){var i=this.options.direction.indexOf(e)>-1,s=i?this.$element.outerHeight(!0):"";this.$wrapper.height(s),this.$element.toggleClass(this.options.stuckClass,i),t&&t.call(this,e)},this)}))},t.prototype.createWrapper=function(){this.$element.wrap(this.options.wrapper),this.$wrapper=this.$element.parent(),this.wrapper=this.$wrapper[0]},t.prototype.destroy=function(){this.$element.parent()[0]===this.wrapper&&(this.waypoint.destroy(),this.$element.removeClass(this.options.stuckClass).unwrap())},t.defaults={wrapper:'<div class="sticky-wrapper" />',stuckClass:"stuck",direction:"down right"},i.Sticky=t}();

		this.sticky = new Waypoint.Sticky({

	    element: this.nav[0],
	    offset: function() {

		    if($("body").hasClass("web-home-template")) {
		      var stickyOffset = 1;
		    } else{
		      var stickyOffset = 180;
		    }

		    return -stickyOffset

			}

		});

	},


	/*------------------------------------------------------------------
	[ 10. Slide Wrapper ]
	*/

	slideWrapper: function() {
		$('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');
	},


	/*------------------------------------------------------------------
	[ 11. Directions Widget ]
	*/

	directionsWidget: function() {
	  this.roleMain.find('.directions.widget .text').each(function (index, value){
	    var $this = $(this);
	    $this.children(".directions-start").attr("placeholder", "Enter starting address");
	    $this.children(".directions-submit").before($this.children(".directions-start"));
	  });
	},

	directionsSubmitClick: function(e) {
	  var target = $(e.currentTarget).parent().siblings(".canvas");
	  $('html, body').animate({
	    scrollTop: target.offset().top
	  }, 1000);
	},


	/*------------------------------------------------------------------
	[ 12. Calls To Action Widget ]
	*/

	callsToActionWidget: function() {
	  this.rowHalves.each(function (index, value){
	    var $this = $(this);
	    if( ($this.find(".col-1 .action-calls li").length == 1) && ($this.find(".col-2 .action-calls li").length == 1) ) {
	    	$this.addClass("ctas-halves");
	    }
	  });
	},


	/*------------------------------------------------------------------
	[ 13. Lead Form Widget ]
	*/

	leadFormWidget: function() {
		if(this.leadForm.length) {
		  this.leadForm.each(function (index, value){
		  	var $this = $(this);
				$this.find("input[type=submit]").attr("value", "Submit");
			});
		}
	},


	/*------------------------------------------------------------------
	[ 14. Combine Paragraphs ]
	*/

	combineParagraphs: function() {
	  this.halvedParagraphs.each(function() {

	  	var $this = $(this);

	  	if(Modernizr.mq("(max-width: 599px)")) {
	  		$this.find(".col-1 p").append($this.find(".col-2 p span"));
	  	} else{
	  		$this.find(".col-2 p").append($this.find(".col-1 p span:nth-of-type(2)"));
	  	}

	  });
	},

	/*------------------------------------------------------------------
	[ 15. Switch Rows ]
	*/

	switchRows: function() {

	  this.topSwitchedRow.each(function (index, value){

	  	var $this = $(this);

	  	if(Modernizr.mq("(max-width: 599px)") && !$this.hasClass("mobile-set")) {
	  		$this.addClass("mobile-set");
	  		$this.insertAfter($this.next(".row"));
	  		$this.addClass("switched");
	  		$this.removeClass("desktop-set");
	  	} else if(Modernizr.mq("(min-width: 600px)") && $this.hasClass("switched") && !$this.hasClass("desktop-set")){
	  		$this.addClass("desktop-set");
			  $this.insertBefore($this.prev());
	  		$this.removeClass("switched");
	  		$this.removeClass("mobile-set");
			}

	  });

	  $(".figure-caption").each(function (index, value){

	  	var $this = $(this);

	  	if(Modernizr.mq("(max-width: 599px)")) {
	  		$this.find(".col-1").insertAfter($this.find(".col-1").next());
	  		$this.addClass("switched");
	  	} else if(Modernizr.mq("(min-width: 600px)") && $this.hasClass("switched")){
				$this.find(".col-1").insertBefore($this.find(".col-1").prev());
	  		$this.removeClass("switched");
			}

	  });


	},

	/*------------------------------------------------------------------
	[ 16. Bed To Bedroom ]
	*/

	bedToBedroom: function() {

		if(this.multifamilyIUICards.length) {

			this.multifamilyIUICards.find(".iui-cards-unit-categories .category-card-title span:nth-of-type(2)").each(function() {
				var $this = $(this);
				if($this.text() === "Bed") {
					$this.text("Bedroom");
				}
			})

	  }

	},


	/*------------------------------------------------------------------
	[ 17. Parallax ]
	*/

	parallax: function() {

		this.navOffset = $("#drop-target-nav").offset().top;
	  this.parallaxSpeed = ($(document).scrollTop() * -0.25);

  	if( ($(document).scrollTop() < this.navOffset) && Modernizr.mq(this.desktop) ) {

	    this.hero.css("top", function() {
	      return this.parallaxSpeed;
	    }.bind(this));

  	}

	}

}

/*------------------------------------------------------------------
[ XX. On Page Ready ]
*/

$(function() {
  olmsted.initialize();
});
