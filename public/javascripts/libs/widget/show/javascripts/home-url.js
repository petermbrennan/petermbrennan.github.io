class HomeUrl {
  constructor(configs){
    this.configs = configs;
    this.hrefSelector = this.configs.hrefSelector;
    this.singleDomain = this.configs.singleDomain;

    this.setHomeUrl();
  }

  setHomeUrl() {
    let homeHref = window.location.protocol + '//' + window.location.host;
    if (this.singleDomain === "true"){
      homeHref += this.singleDomainPath();
    }
    if (homeHref) {
      $(this.hrefSelector).attr('href', homeHref);
    }
  }

  singleDomainPath() {
    let pathArray = window.location.pathname.split('/');
    let cleanArray = pathArray.filter(Boolean);
    let singleDomainPath = "/";
    let singleDomainPathLength = 4;

    if (cleanArray.length >= singleDomainPathLength){
      for (let i = 0; i < singleDomainPathLength; i++) {
        singleDomainPath += `${cleanArray[i]}/`;
      }
    }
    return singleDomainPath;
  }
}
