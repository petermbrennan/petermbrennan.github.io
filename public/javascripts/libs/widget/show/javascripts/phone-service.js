$('body').on('runG5PhoneService', function() {
  // leaving this here to prevent js errors when trying to call it
  return;
});

class PhoneNumberList {
  constructor(phoneOptions, scope) {
    this.phoneList = [];
    this.bindGaEvent();
    this.bindPreviewEvent();
    this.previewMode = $(document).data("g5_preview_mode");
    this.cpmCode = this.getOrStoreCpmCode();
    this.locationUrns = [];
    this.callTrackingPromise = null;
    this.numbers = {}
  }

  addPhoneNumber(phoneNumber) {
    var needToRun = (this.phoneList.length <= 0 && $(document).data("g5_ga_ready"));
    this.phoneList.push(phoneNumber);
    this.cpnsUrl = phoneNumber.cpnsUrl;

    // set the number if it has already been fetched
    this.setExistingNumber(phoneNumber, this.getNumberForUrn(phoneNumber.locationUrn));

    if (!phoneNumber.number) {
      //set the number if it is in the cache, but fetch anyway to refresh the lease
      this.setExistingNumber(phoneNumber, this.getCachedNumber(phoneNumber.locationUrn));
      this.addLocationUrn(phoneNumber.locationUrn);
      this.fetchOrWait();
    }

    if (needToRun) {
      this.runCallTracking();
    }
  }

  setExistingNumber(phone, existing) {
    if(existing) {
      phone.number = existing;
      $(phone.scope).trigger("phoneNumbersReady");
    }
  }

  getNumberForUrn(urn) {
    if(this.numbers) {
      return this.numbers[urn];
    }
  }

  addLocationUrn(urn) {
    if($.inArray( urn, this.locationUrns) < 0 ) {
      this.locationUrns.push(urn);
    }
  }

  runCallTracking() {
    this.fetch();
    $(document).data("G5CallTrackingRun", true);
  }

  bindGaEvent() {
    $(document).on("G5GaReady", (e)=>{
      this.runCallTracking();
    });
  }

  bindPreviewEvent() {
    $(document).on("G5PreviewReady", (e)=>{
      this.previewMode = $(document).data("g5_preview_mode");
      this.showForPreview();
    });
  }

  // only used in the test suite because things are dumb
  unbindGaEvent() {
    $(document).off("G5GaReady");
    $(document).off("G5PreviewReady");
  }

  fetchOrWait() {
    // if we have already been trigged by GA and are not currently running, kick a fetch off
    if($(document).data("G5CallTrackingRun") && !this.callTrackingPromise) {
      this.fetch();
    }
  }

  fetch() {
    // we do not want to provision number on preview sites
    if (this.previewMode) { return; }

    if (!this.callTrackingPromise) {
      this.callTrackingPromise = $.post(
        this.cpnsUrl,
        {
          phone_number: {
            screen_width: $(document).width(),
            cpm_code: this.cpmCode,
            location_urns: this.locationUrns,
            ga_client_id: this.getGaClientId()
          }
        },
        function() {},
        "json"
      )
    }

    this.callTrackingPromise.then((data, status, xhr)=>{
      $.each(data, (urn, phone)=>{
        // remove urn from locationUrns list, set phones data and cache number
        this.locationUrns.splice(this.locationUrns.indexOf(urn),1);
        this.numbers[urn] = phone;
        this.cacheNumber(phone, urn);
      });
      this.phoneReady();
      this.callTrackingPromise = null;

      // fetch for any urns added while we were fetching the last block
      if(this.locationUrns.length > 0) {
        this.fetch();
      }
    });

    return this.callTrackingPromise;
  }

  phoneReady() {
    this.phoneList.forEach((phone)=>{
      phone.number = this.numbers[phone.locationUrn];
      if(phone.number) {
        $(phone.scope).trigger("phoneNumbersReady");
      }
    });
  }

  showForPreview() {
    this.phoneList.forEach((phone)=>{
      phone.showNumber();
    });
  }

  getOrStoreCpmCode() {
    let newCpmCode = this.getParameterByName('cpm');
    let cpmCode = newCpmCode || sessionStorage.getItem('cpm');
    if (newCpmCode) {
      sessionStorage.setItem('cpm', newCpmCode);
    }
    return cpmCode;
  }

  getParameterByName(name) {
    let value = null;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    let results = regex.exec(location.search);
    if (results !== null) {
      value = decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    return value;
  }

  getGaClientId() {
    var gaId;
    if(typeof ga !== "undefined") {
      ga(function(tracker) {
        gaId = tracker.get('clientId');
      });
    }

    if(!gaId) {
      gaId = sessionStorage.getItem("g5GaClientId-PhoneNumbers");
      if(gaId === null) {
        gaId = "G5NoClientId" + Math.random().toString();
      }
    }

    sessionStorage.setItem("g5GaClientId-PhoneNumbers", gaId);
    return gaId;
  }

  cacheNumber(data, urn) {
    if(data['phone_number']) {
      sessionStorage.setItem(`g5PhoneNumber-${urn}`, JSON.stringify(data));
    }
  }

  getCachedNumber(urn) {
    return JSON.parse(sessionStorage.getItem(`g5PhoneNumber-${urn}`));
  }
}

var g5PhoneList = new PhoneNumberList();


class PhoneNumber {
  constructor(configs, scope) {
    this.configs = configs;

    //If there are mulitple URNs, we need to pull back multiple phone numbers
    this.locationUrns = this.configs.locationUrns;
    if (this.hasMultipleLocationUrns()) {
      return;
    }

    this.scope = scope || "body";
    this.linkMode = this.configs.linkMode || 'off';
    this.clientUrn = this.configs.clientUrn;
    this.cpnsUrl = this.configs.cpnsUrl;
    this.locationUrn = this.configs.locationUrn || "";
    this.updated = false;

    if (!this.valid()) {
      throw "Invalid PhoneNumber config options";
    }

    $(this.scope).bind("phoneNumbersReady", (e)=>{
      return this.update();
    });

    g5PhoneList.addPhoneNumber(this);

    if ($('head').data("g5_preview_mode")) {
      this.showNumber();
    }
  }

  hasMultipleLocationUrns(){
    if (this.locationUrns){
      delete this.configs.locationUrns;
      $.each(this.locationUrns, (index, loc)=>{
        let tempConfigs = {};
        $.extend(true, tempConfigs, this.configs);
        tempConfigs.locationUrn = loc["urn"];
        new PhoneNumber(tempConfigs, loc["scope"]);
      });
      return true;
    }
    return false;
  }

  valid() {
    return !!(this.cpnsUrl &&
              this.cpnsUrl.length &&
              this.clientUrn &&
              this.clientUrn.length &&
              this.locationUrn &&
              this.locationUrn.length);
  }

  telTags(elem) {
    let telTags = elem.find('.p-tel');
    if (!telTags.length) {
      if (elem.hasClass('p-tel')) {
        telTags = elem;
      } else {
        telTags = [];
      }
    }
    return telTags;
  }

  showNumber() {
    let telTags = this.telTags($(this.scope));
    if (telTags.length > 0) {
      telTags.css("visibility", "visible");
    }
  }

  update() {
    if (this.updated) {
      return;
    }
    this.updated = true;

    let elem = $(this.scope);
    let telTags = this.telTags(elem);
    if (!telTags.length) {
      return;
    }

    let numLink = elem.hasClass('number') ? elem : elem.find('.number');
    let number = this.number['phone_number'];
    let formattedNumber = this.getFormattedNumber(number);

    if (number.length && formattedNumber.length) {
      telTags.css("visibility", "hidden");
    }
    if (formattedNumber.length) {
      telTags.html(formattedNumber);
    }

    if (numLink.length) {
      if (this.linkMode === 'off' && !this.isMobileWidth()) {
        numLink.contents().unwrap();
      } else {
        if (number.length) {
          let countryCode = this.getCountryCode() || "";
          numLink.attr("href", `tel:${countryCode}${number}`);
        }
        if (this.linkMode === 'no-click' && !this.isMobileWidth()) {
          numLink.attr("href", "").css({cursor: 'default'});
          numLink.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          });
        }
      }
    }
    telTags.css("visibility", "visible");
  }

  getCountryCode(num) {
    return this.number["country_code_prefix"];
  }

  getFormattedNumber(num) {
    if (num.length) {
      return num.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    return "";
  }

  isMobileWidth() {
    return !!($(document).width() < 768);
  }

  errorMessage(msg) {
    if (console !== 'undefined' && msg.length) {
      return console.log(msg);
    }
  }
}
