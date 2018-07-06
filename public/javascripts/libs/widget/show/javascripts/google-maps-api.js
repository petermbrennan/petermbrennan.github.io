class GoogleMapsApi extends ApiManager {
  apiName(){
    return "googlemapsapi";
  }
  apiScript(callback='googleMapsLoaded'){
    return '//maps.googleapis.com/maps/api/js?v=3&sensor=false&key='+this.apiKey()+'&callback='+callback;
  }
  geocodeUrl(){
    return 'https://maps.googleapis.com/maps/api/geocode/json?key='+this.apiKey();
  }
  apiKey(){
    return "AIzaSyBl9UzLhZvyo2iBo4SiK6-iMxlbukGNEg4";
  }
};

window.googleMapsLoaded = function(){
  G5.googleMapsApi.doneLoading();
};

G5.googleMapsApi = new GoogleMapsApi();
