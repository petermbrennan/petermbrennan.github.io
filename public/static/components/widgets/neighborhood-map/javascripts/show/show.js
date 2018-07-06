class NeighborhoodMapWidget {
  constructor(configs) {
    this.configs = configs;
    this.widget = $("#" + this.configs.widgetId);
    this.canvas = this.widget.find('.canvas');
    this.categories = this.widget.find('.neighborhood-map-filter');
    Object.assign(this, {SMALL: 500, MEDIUM: 750, LARGE: 1100, configs});
    Object.assign(this, this.configs);
    G5.googleMapsApi.registerWidget(this, 'getMapCoords');
    G5.fortAwesomeApi.registerWidget(this, 'fortAwesomeLoaded');
    this.setupResize();
    this.neighborhoodMarkers = [];
    this.infoWindows = [];
    this.neighborhoodData = this.getNeighborhoodData();
    this.generateCategoryButtons();
    this.filterButtons();
  }

  getMapCoords() {
    $.getJSON(G5.googleMapsApi.geocodeUrl(), {
      address: this.address,
      sensor: "false"
    }).done((data)=>{
      if (data.status === "OK"){
        let coordinates = data.results[0].geometry.location;
        return this.setMap(coordinates);
      } else {
        console.log("Failed to load address at "+this.address);
      }
    }).fail(()=>{
      console.error("Failed to load Google Maps Geocode API");
    });
  }

  setMap(coordinates) {
    let latLng = this.getLatLng(coordinates);
    let mapOptions = this.getMapOptions(latLng);
    let image = this.getLocationImage();
    let markerOptions = {
      position: latLng,
      icon: image,
      animation: google.maps.Animation.DROP
    };
    this.marker = new google.maps.Marker(markerOptions);
    this.map = new google.maps.Map(this.canvas[0], mapOptions);

    this.map.fitBounds(this.addMarkers());
    return this.marker.setMap(this.map);
  }

  addMarkers(){
    let bounds = new google.maps.LatLngBounds();
    let catDefault = this.categoryDefault;
    for (let i = 0; i < this.neighborhoodData.length; i++) {
      this.addMarker(this.neighborhoodData[i]);
      let poiMarker = this.neighborhoodMarkers[i];
      if (poiMarker.category.includes(catDefault)) {
        bounds.extend(poiMarker.getPosition());
        poiMarker.setVisible(true);
      } else {
        poiMarker.setVisible(false);
      }
    }
    return bounds;
  }

  generateCategoryButtons(category){
    let allPois = this.neighborhoodData;
    var categoryButtons = this.categories;
    var viewAll = '<button class="all" value=""><i class="fa fa-check" aria-hidden="true"></i>View All</button>';
    var buttonLabels = [viewAll];
    let uniqueArr = [...new Set(allPois.map(poi => poi.location_type))];
    for (let i = 0; i < uniqueArr.length; i++) {
      let category = uniqueArr[i];
      let catClass = category.replace('_','-');
      let catDefault = this.categoryDefault.replace('_','-');
      var label = this.setCategoryLabel(category);
      let buttonMarkup = `<button class='${catClass} ${(catDefault === catClass || !catDefault.length) ? 'active': ''}' value='${category}'>${label}</button>`;
      buttonLabels.push(buttonMarkup);
    }

    return categoryButtons.append(buttonLabels.join(""));
  }

  setCategoryLabel(category){
    switch(category){
      case 'food_drink': { return this.labels.food_drink; }
      case 'entertainment': { return this.labels.entertainment; }
      case 'shopping': { return this.labels.shopping; }
      case 'activities': { return this.labels.activities; }
      case 'schools_community': { return this.labels.community; }
      default: { return ''; }
    }
  }

  addMarker(marker) {
    let { name, address, city, state, postal_code: zip, phone_number: phone, google_map_url: map, website, location_type: category } = marker;
    let content = `<span class='name'>${name}</span>
                          <span class='address'>${address}</span>
                          <span class='city-state-zip'>${city}, ${state} ${zip}</span>
                          <span class='phone'>${phone}</span>
                          <span class='map-link'><a href='${map}' target='_blank'>Link to Google Map</a></span>
                          <span class='website-link'><a href='${website}' target='_blank'>${website}</a></span>`;
    let pos = new google.maps.LatLng(marker.latitude, marker.longitude);

    var image = this.getMarkerImage(category);
    var highlightedImage = Object.assign({}, image);
    highlightedImage.scale = 0.23;

    var newMarker = new google.maps.Marker({
        position: pos,
        map: this.map,
        category: category,
        animation: google.maps.Animation.DROP,
        icon: image
    });
    this.neighborhoodMarkers.push(newMarker);
    let neighborhoodMarkers = this.neighborhoodMarkers;

    var infowindow = new google.maps.InfoWindow({
      content: ''
    });

    google.maps.event.addListener(newMarker, 'click', (function (newMarker, content) {

      return function () {
        infowindow.setContent(`<div class="infowindow">${content}</div>`);
        if (typeof this.map.openWindows == 'undefined') {
          this.map.openWindows = [];
        } else {
          this.map.openWindows.forEach(function(elem){
            elem.close();
          });
        }
        infowindow.open(this.map, newMarker);
        this.map.openWindows.push(infowindow);
        this.map.panTo(this.getPosition());
      }
    })(newMarker, content));

    google.maps.event.addListener(this.map, 'click', function() {
      infowindow.close();
    });

    google.maps.event.addListener(infowindow, 'domready', ()=> {
      this.setInfoWindow();
    });
  }

  getNeighborhoodData(){
    return this.pointsOfInterest;
  }

  getLatLng(coordinates){
    if (this.override === true){
      return { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) };
    } else {
      return { lat: coordinates.lat, lng: coordinates.lng };
    }
  }

  getMapOptions(latLng){
    return {
      scrollwheel: this.panZoom,
      draggable: this.panZoom,
      disableDefaultUI: !this.panZoom,
      disableDoubleClickZoom: !this.panZoom,
      maxZoom: 18,
      center: latLng,
      mapTypeId: google.maps.MapTypeId["ROADMAP"],
      styles: this.styles.length ? JSON.parse(this.styles) : []
    }
  }

  getLocationImage(){
    var opacity = Number(this.homeSvgOpacity);
    var strokeWeight = Number(this.homeSvgStrokeWeight);
    var strokeOpacity = Number(this.homeSvgStrokeOpacity);
    return {
      path: this.homeSvgPath,
      fillColor: this.locationPinColor,
      fillOpacity: opacity,
      scale: 0.25,
      strokeColor: this.locationPinColor,
      strokeWeight: strokeWeight,
      strokeOpacity: strokeOpacity
    }
  }

  getMarkerImage(category){
    let color = this.getMarkerColor(category);
    var opacity = Number(this.poiPinSvgOpacity);
    var strokeWeight = Number(this.poiPinSvgStrokeWeight);
    var strokeOpacity = Number(this.poiPinSvgStrokeOpacity);
    return {
      path: this.poiPinSvgPath,
      fillColor: color,
      fillOpacity: opacity,
      scale: 0.2,
      strokeColor: color,
      strokeWeight: strokeWeight,
      strokeOpacity: strokeOpacity
    };
  }

  getMarkerColor(category){
    switch(category){
      case 'food_drink': { return this.poiColorFoodDrink; }
      case 'shopping': { return this.poiColorShopping; }
      case 'entertainment': { return this.poiColorEntertainment; }
      case 'activities': { return this.poiColorActivities; }
      case 'schools_community': { return this.poiColorSchoolsCommunity; }
      default: { return this.poiColorButtons; }
    }
  }

  setInfoWindow(){
    let iwOuter = this.widget.find('.gm-style-iw');
    let iwBackground = iwOuter.prev();
    let iwCloseBtn = iwOuter.next();

    iwBackground.children(':nth-child(2)').css({'display' : 'none'});
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'none', 'z-index' : '1'});
    iwCloseBtn.css({
      'opacity': '1',
      'right': '20px', 'top': '20px',
      'border-radius': '10px',
      'box-shadow': '0 0 5px #3990B9'
    });

    iwCloseBtn.mouseout(function(){
      $(this).css({opacity: '1'});
    });
  }

  filterButtons() {
    var mapFilter = this.categories;
    mapFilter.on('click', 'button', (e)=> {
      var bounds = new google.maps.LatLngBounds();
      let infoWindow = this.widget.find('.gm-style-iw');
      let target = $(e.target);
      for (let i = 0; i < this.neighborhoodData.length; i++) {
        let marker = this.neighborhoodMarkers[i];
        let val = target.val();
        if (val.length === 0 || marker.category === val) {
          marker.setVisible(true);
          mapFilter.find('button').addClass("active").siblings().removeClass("active");
          bounds.extend( marker.getPosition() );
          infoWindow.addClass('hide');
        } else {
          marker.setVisible(false);
        }
      }
      this.map.fitBounds(bounds);
    });

    mapFilter.on('click', 'button', function (e) {
      $(this).addClass("active").siblings().removeClass("active");
    });

    mapFilter.on('click', 'button.all', function (e) {
      $(this).addClass("active").siblings().addClass("active");
    });
  }

  setupResize(){
    $(window).smartresize(()=>{
      this.resize();
    });
    this.resize();
  }

  resize(){
    let canvasHeight = Math.min(800, Math.max(this.canvas.width()*0.75 + 30, 200));
    this.canvas.css({height: canvasHeight});
    if (this.map){
      this.map.setCenter(this.marker.getPosition());
    }
    if (this.widget.width() < this.SMALL){
      this.widget.addClass('small');
      this.widget.removeClass('medium large x-large');
    }
    if ((this.widget.width() >= this.SMALL) && (this.widget.width() < this.MEDIUM)){
      this.widget.addClass('medium');
      this.widget.removeClass('small large x-large');
    }
    if ((this.widget.width() >= this.MEDIUM) && (this.widget.width() <= this.LARGE)){
      this.widget.addClass('large');
      this.widget.removeClass('small medium x-large');
    }
    if (this.widget.width() > this.LARGE){
      this.widget.addClass('x-large');
      this.widget.removeClass('small medium large');
    }
  }
};

G5.loadWidgetConfigs('.neighborhood-map .config', NeighborhoodMapWidget);
