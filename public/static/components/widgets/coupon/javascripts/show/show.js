class CouponWidget {
  constructor(configs){
    this.configs = configs;
    this.widgetId = this.configs.widgetId;
    this.widget = $('#'+this.widgetId);
    this.printButton = this.widget.find(".coupon-print");
    this.mapButton = this.widget.find(".show-coupon-map");
    this.couponDrawer = this.widget.find(".coupon-drawer");
    this.bindEvents();
    this.loadGoogleMapsImage();
  }

  bindEvents(){
    this.couponDrawer.hide();
    this.mapButton.on('click', (e) =>{
      this.couponDrawer.slideToggle();
    });
    // Open window with coupon, print, close
    this.printButton.on('click', (e)=>{
      this.setCouponVars();
    });
  }

  loadGoogleMapsImage(){
    let img = `<img src="${this.googleMapsUrl()}">`;
    this.widget.find('.map-canvas').html(img);
  }

  googleMapsUrl(){
    return "https://maps.googleapis.com/maps/api/staticmap?markers=" +
      `${this.configs.streetAddress},${this.configs.city},${this.configs.state},${this.configs.postalCode}` +
      "&zoom=15&size=400x400&scale=2&sensor=false" +
      "&key=" + G5.googleMapsApi.apiKey();
  }

  setCouponVars(){
    this.couponDrawer.show();
    let coupon = this.printButton.parents(".coupon");
    let w = coupon.outerWidth(true);
    let h = coupon.outerHeight(true);
    let content = coupon.wrap('<div class="coupon-wrapper"></div>').parent().html();
    this.printCoupon(content, w, h);
    coupon.unwrap();
  }

  printCoupon(content, w, h){
    // Grab necessary stylesheets
    // DEV FYI - THERE ARE NO STYLES LOCALLY, Must be deployed to a CLW to see this junk work.
    let appStylesheet = $('head link[href*=application]').attr('href');
    let stylesheets = `<link rel="stylesheet" href="${appStylesheet}">`;

    // Get coordinates for centering print window
    let windowLeft = window.screenLeft ? window.screenLeft : window.screenX;
    let windowTop = window.screenTop ? window.screenTop : window.screenY;
    let newLeft = windowLeft + (window.innerWidth / 2) - (w / 2);
    let newTop = windowTop + (window.innerHeight / 2) - (h / 2);

    // Open new window and paste coupon html and stylesheet into it
    let title = 'Print Coupon'
    let options = 'toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=yes, copyhistory=no, ' +
              'height=' + h + ', width=' + w + ', left=' + newLeft + ', top=' + newTop;
    var myWindow = window.open('', title, options);
    let myWindowHead = `<head><title>Print Coupon</title>${stylesheets}</head>`;
    let myWindowBody = `<body style="border: none">${content}</body>`;
    myWindow.document.write(`<html>${myWindowHead}${myWindowBody}</html>`);

    myWindow.document.close();
    myWindow.focus();

    setTimeout(function(){
      myWindow.print()
      myWindow.close()
    }, 500);
  }
}

G5.loadWidgetConfigs('.coupon .config', CouponWidget);