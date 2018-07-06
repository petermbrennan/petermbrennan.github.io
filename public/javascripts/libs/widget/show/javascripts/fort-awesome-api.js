class FortAwesomeApi extends ApiManager {
  apiName() {
    return 'fortawesomeapi';
  }
  apiScript() {
    return '//use.fortawesome.com/' + this.apiKey() + '.js';
  }
  apiKey(){
    return "26805d78";
  }
};

window.fortAwesomeLoaded = function() {
  G5.fortAwesomeApi.doneLoading();
};


G5.fortAwesomeApi = new FortAwesomeApi();
