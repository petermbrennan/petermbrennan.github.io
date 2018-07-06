// one day, this will be part of a real AreaPage Widget

class AreaPageWidget {
  constructor(configs){
    this.configs      = configs;
    this.numLocations = configs.addresses.length;
    this.widget       = $('.area-page'); // this will become an ID when this is a proper widget
    this.setupGoogleMaps();
    this.setupPhones();
    this.setupMapMarkers();
  }

  setupGoogleMaps(){
    window.googleMaps = {
      latlngbounds: new google.maps.LatLngBounds(),
      map: new google.maps.Map(this.widget.find(".canvas")[0], this.mapOptions())
    };
  }

  mapOptions(){
    return {
      scrollwheel: this.configs.panZoom,
      draggable: this.configs.panZoom,
      disableDefaultUI: !this.configs.panZoom,
      disableDoubleClickZoom: !this.configs.panZoom,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId[this.configs.mapType]
    }
  }

  setupMapMarkers(){
    for (let i = 0, count = this.configs.addresses.length; i < count; i++){
      let address = this.configs.addresses[i];
      this.getMapMarker(address[0], address[1]);
    }
  }

  getMapMarker(address, formattedAddress){
    $.getJSON(G5.googleMapsApi.geocodeUrl(), {
      address: address,
      sensor: "false"
    }).done((data)=>{
      this.setMapMarker(data, address, formattedAddress);
    });
  }

  setMapMarker(data, address, formattedAddress){
    let coordinates = data.results[0].geometry.location;
    let latlng = new google.maps.LatLng(coordinates.lat, coordinates.lng);
    let gMap = window.googleMaps;

    var locationMarker = new google.maps.Marker({
      position: latlng,
      map: gMap.map,
      title: address
    });

    var infowindow = new google.maps.InfoWindow({
      content: formattedAddress
    });
    google.maps.event.addListener(locationMarker, 'click', function() {
      infowindow.open(gMap.map, locationMarker);
    });

    if (this.numLocations === 1){
      gMap.map.setZoom(18);
      gMap.map.setCenter(latlng);
    } else {
      gMap.latlngbounds.extend(latlng);
      gMap.map.fitBounds(gMap.latlngbounds);
    }
  }

  setupPhones(){
    return new PhoneNumber(this.getPhoneConfigs());
  }

  getPhoneConfigs(){
    return {
      cpnsUrl: this.configs.cpnsUrl,
      clientUrn: this.configs.clientUrn,
      locationUrns: this.getLocationUrns()
    }
  }

  getLocationUrns(){
    return this.widget.find('.area-page-location').map(function(idx, elem) {
      let locUrn = $(elem).data('locationUrn');
      return { urn: locUrn, scope: `div#area-page-location-${locUrn}` }
    });
  }
}

function initializeAreaPage() {
  G5.loadWidgetConfigs('.area-page .config', AreaPageWidget);
}

$(document).ready(function(){
  let onAreaPage = $('.area-page .config').length
  if(onAreaPage){
    $.getScript(G5.googleMapsApi.apiScript('initializeAreaPage'));
  }
});

