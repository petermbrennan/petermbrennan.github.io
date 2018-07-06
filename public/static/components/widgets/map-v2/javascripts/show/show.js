class MapWidget {
  constructor(configs) {
    this.configs = configs;
    this.widget = $("#" + this.configs.widgetId);
    this.canvas = this.widget.find('.canvas');
    this.setupConfigs();
    this.setupResize();
    G5.googleMapsApi.registerWidget(this, 'getMapCoords');
  }

  setupConfigs(){
    this.address = this.configs.address;
    this.panZoom = this.configs.panZoom;
    this.styles = this.configs.styles;
    this.override = this.configs.overrides;
    this.latitude = this.configs.latitude;
    this.longitude = this.configs.longitude;
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
      console.log("Failed to load Google Maps Geocode API");
    });
  }

  setMap(coordinates) {
    if (this.override === true){
      var latLng = { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) };
    } else {
      var latLng = { lat: coordinates.lat, lng: coordinates.lng };
    }
    var mapOptions = {
      scrollwheel: this.panZoom,
      draggable: this.panZoom,
      disableDefaultUI: !this.panZoom,
      disableDoubleClickZoom: !this.panZoom,
      zoom: 16,
      center: latLng,
      mapTypeId: google.maps.MapTypeId["ROADMAP"],
      styles: this.styles
    };
    var markerOptions = {
      position: latLng
    };
    this.marker = new google.maps.Marker(markerOptions);
    this.map = new google.maps.Map(this.canvas[0], mapOptions);
    return this.marker.setMap(this.map);
  }

  setupResize(){
    $(window).smartresize(()=>{
      this.resize();
    });
    this.resize();
  }

  resize(){
    var canvasHeight = Math.min(800, Math.max(this.canvas.width()*0.75 + 30, 200));
    this.canvas.css({height: canvasHeight});
    if (this.map){
      this.map.setCenter(this.marker.getPosition());
    }
  }
};

G5.loadWidgetConfigs('.map-v2 .config', MapWidget);
