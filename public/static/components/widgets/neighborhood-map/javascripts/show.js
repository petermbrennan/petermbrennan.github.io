"use strict";function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,i=Array(t.length);e<t.length;e++)i[e]=t[e];return i}return Array.from(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}(),NeighborhoodMapWidget=function(){function t(e){_classCallCheck(this,t),this.configs=e,this.widget=$("#"+this.configs.widgetId),this.canvas=this.widget.find(".canvas"),this.categories=this.widget.find(".neighborhood-map-filter"),Object.assign(this,{SMALL:500,MEDIUM:750,LARGE:1100,configs:e}),Object.assign(this,this.configs),G5.googleMapsApi.registerWidget(this,"getMapCoords"),G5.fortAwesomeApi.registerWidget(this,"fortAwesomeLoaded"),this.setupResize(),this.neighborhoodMarkers=[],this.infoWindows=[],this.neighborhoodData=this.getNeighborhoodData(),this.generateCategoryButtons(),this.filterButtons()}return _createClass(t,[{key:"getMapCoords",value:function(){var t=this;$.getJSON(G5.googleMapsApi.geocodeUrl(),{address:this.address,sensor:"false"}).done(function(e){if("OK"===e.status){var i=e.results[0].geometry.location;return t.setMap(i)}console.log("Failed to load address at "+t.address)}).fail(function(){console.error("Failed to load Google Maps Geocode API")})}},{key:"setMap",value:function(t){var e=this.getLatLng(t),i=this.getMapOptions(e),s=this.getLocationImage(),a={position:e,icon:s,animation:google.maps.Animation.DROP};return this.marker=new google.maps.Marker(a),this.map=new google.maps.Map(this.canvas[0],i),this.map.fitBounds(this.addMarkers()),this.marker.setMap(this.map)}},{key:"addMarkers",value:function(){for(var t=new google.maps.LatLngBounds,e=this.categoryDefault,i=0;i<this.neighborhoodData.length;i++){this.addMarker(this.neighborhoodData[i]);var s=this.neighborhoodMarkers[i];s.category.includes(e)?(t.extend(s.getPosition()),s.setVisible(!0)):s.setVisible(!1)}return t}},{key:"generateCategoryButtons",value:function(t){for(var e=this.neighborhoodData,i=this.categories,s='<button class="all" value=""><i class="fa fa-check" aria-hidden="true"></i>View All</button>',a=[s],o=[].concat(_toConsumableArray(new Set(e.map(function(t){return t.location_type})))),n=0;n<o.length;n++){var r=o[n],l=r.replace("_","-"),h=this.categoryDefault.replace("_","-"),g=this.setCategoryLabel(r),d="<button class='"+l+" "+(h!==l&&h.length?"":"active")+"' value='"+r+"'>"+g+"</button>";a.push(d)}return i.append(a.join(""))}},{key:"setCategoryLabel",value:function(t){switch(t){case"food_drink":return this.labels.food_drink;case"entertainment":return this.labels.entertainment;case"shopping":return this.labels.shopping;case"activities":return this.labels.activities;case"schools_community":return this.labels.community;default:return""}}},{key:"addMarker",value:function(t){var e=this,i=t.name,s=t.address,a=t.city,o=t.state,n=t.postal_code,r=t.phone_number,l=t.google_map_url,h=t.website,g=t.location_type,d="<span class='name'>"+i+"</span>\n                          <span class='address'>"+s+"</span>\n                          <span class='city-state-zip'>"+a+", "+o+" "+n+"</span>\n                          <span class='phone'>"+r+"</span>\n                          <span class='map-link'><a href='"+l+"' target='_blank'>Link to Google Map</a></span>\n                          <span class='website-link'><a href='"+h+"' target='_blank'>"+h+"</a></span>",c=new google.maps.LatLng(t.latitude,t.longitude),u=this.getMarkerImage(g),p=Object.assign({},u);p.scale=.23;var m=new google.maps.Marker({position:c,map:this.map,category:g,animation:google.maps.Animation.DROP,icon:u});this.neighborhoodMarkers.push(m);var f=(this.neighborhoodMarkers,new google.maps.InfoWindow({content:""}));google.maps.event.addListener(m,"click",function(t,e){return function(){f.setContent('<div class="infowindow">'+e+"</div>"),"undefined"==typeof this.map.openWindows?this.map.openWindows=[]:this.map.openWindows.forEach(function(t){t.close()}),f.open(this.map,t),this.map.openWindows.push(f),this.map.panTo(this.getPosition())}}(m,d)),google.maps.event.addListener(this.map,"click",function(){f.close()}),google.maps.event.addListener(f,"domready",function(){e.setInfoWindow()})}},{key:"getNeighborhoodData",value:function(){return this.pointsOfInterest}},{key:"getLatLng",value:function(t){return this.override===!0?{lat:parseFloat(this.latitude),lng:parseFloat(this.longitude)}:{lat:t.lat,lng:t.lng}}},{key:"getMapOptions",value:function(t){return{scrollwheel:this.panZoom,draggable:this.panZoom,disableDefaultUI:!this.panZoom,disableDoubleClickZoom:!this.panZoom,maxZoom:18,center:t,mapTypeId:google.maps.MapTypeId.ROADMAP,styles:this.styles.length?JSON.parse(this.styles):[]}}},{key:"getLocationImage",value:function(){var t=Number(this.homeSvgOpacity),e=Number(this.homeSvgStrokeWeight),i=Number(this.homeSvgStrokeOpacity);return{path:this.homeSvgPath,fillColor:this.locationPinColor,fillOpacity:t,scale:.25,strokeColor:this.locationPinColor,strokeWeight:e,strokeOpacity:i}}},{key:"getMarkerImage",value:function(t){var e=this.getMarkerColor(t),i=Number(this.poiPinSvgOpacity),s=Number(this.poiPinSvgStrokeWeight),a=Number(this.poiPinSvgStrokeOpacity);return{path:this.poiPinSvgPath,fillColor:e,fillOpacity:i,scale:.2,strokeColor:e,strokeWeight:s,strokeOpacity:a}}},{key:"getMarkerColor",value:function(t){switch(t){case"food_drink":return this.poiColorFoodDrink;case"shopping":return this.poiColorShopping;case"entertainment":return this.poiColorEntertainment;case"activities":return this.poiColorActivities;case"schools_community":return this.poiColorSchoolsCommunity;default:return this.poiColorButtons}}},{key:"setInfoWindow",value:function(){var t=this.widget.find(".gm-style-iw"),e=t.prev(),i=t.next();e.children(":nth-child(2)").css({display:"none"}),e.children(":nth-child(4)").css({display:"none"}),e.children(":nth-child(3)").find("div").children().css({"box-shadow":"none","z-index":"1"}),i.css({opacity:"1",right:"20px",top:"20px","border-radius":"10px","box-shadow":"0 0 5px #3990B9"}),i.mouseout(function(){$(this).css({opacity:"1"})})}},{key:"filterButtons",value:function(){var t=this,e=this.categories;e.on("click","button",function(i){for(var s=new google.maps.LatLngBounds,a=t.widget.find(".gm-style-iw"),o=$(i.target),n=0;n<t.neighborhoodData.length;n++){var r=t.neighborhoodMarkers[n],l=o.val();0===l.length||r.category===l?(r.setVisible(!0),e.find("button").addClass("active").siblings().removeClass("active"),s.extend(r.getPosition()),a.addClass("hide")):r.setVisible(!1)}t.map.fitBounds(s)}),e.on("click","button",function(t){$(this).addClass("active").siblings().removeClass("active")}),e.on("click","button.all",function(t){$(this).addClass("active").siblings().addClass("active")})}},{key:"setupResize",value:function(){var t=this;$(window).smartresize(function(){t.resize()}),this.resize()}},{key:"resize",value:function(){var t=Math.min(800,Math.max(.75*this.canvas.width()+30,200));this.canvas.css({height:t}),this.map&&this.map.setCenter(this.marker.getPosition()),this.widget.width()<this.SMALL&&(this.widget.addClass("small"),this.widget.removeClass("medium large x-large")),this.widget.width()>=this.SMALL&&this.widget.width()<this.MEDIUM&&(this.widget.addClass("medium"),this.widget.removeClass("small large x-large")),this.widget.width()>=this.MEDIUM&&this.widget.width()<=this.LARGE&&(this.widget.addClass("large"),this.widget.removeClass("small medium x-large")),this.widget.width()>this.LARGE&&(this.widget.addClass("x-large"),this.widget.removeClass("small medium large"))}}]),t}();G5.loadWidgetConfigs(".neighborhood-map .config",NeighborhoodMapWidget);