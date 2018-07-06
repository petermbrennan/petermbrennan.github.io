class DirectoryWidget {
  constructor(configs) {
    this.configs = configs;
    this.widget = $(`#${this.configs.widgetId}`);

    Object.assign(this, {SMALL_WIDTHL: 400, MEDIUM_WIDTH: 525, LARGE_WIDTH: 768, FULL_WIDTH: 910, configs});
    this.expand = this.configs.expandOption || 'first_open';
    this.cpnsUrl = this.configs.cpnsUrl;
    this.clientUrn = this.configs.clientUrn;
    this.table = this.widget.find('.directory-table');
    this.headers =  this.widget.find('.directory-heading');

    this.initResize();
    this.initHeaders();
    this.initPhones();
    this.initIE();
    this.openHeaders();
  }

  initHeaders() {
    return this.headers.on('click', (function(e){
      const header = $(e.currentTarget);
      const isOpen = header.hasClass('open');
      const locations = header.next('.directory-locations');
      if (isOpen) {
        header.removeClass('open');
        locations.removeClass('open');
        return locations.css({'max-height': 0});
      } else {
        header.addClass('open');
        locations.addClass('open');
        const lHeight = locations.find('table').height();
        return locations.css({'max-height': lHeight+100});
      }
    })
    );
  }

  openHeaders() {
    if (this.headers && this.headers.length) {
      if (this.expand === 'first_open') {
        return this.headers[0].click();
      } else if (this.expand === 'all_open') {
        return this.headers.each(function() {
          return $(this).click();
        });
      }
    }
  }

  initResize() {
    $(window).on('resize orientationchange', () => {
      return this.resize();
    });
    return this.resize();
  }

  resize() {
    const parentContainer = this.table.parent('.widget');
    const parentWidth = parentContainer.width();
    if (parentWidth >= this.FULL_WIDTH) {
      this.setSizeClass('full');
    } else if (parentWidth >= this.LARGE_WIDTH) {
      this.setSizeClass('large');
    } else if (parentWidth >= this.MEDIUM_WIDTH) {
      this.setSizeClass('medium');
    } else if (parentWidth >= this.SMALL_WIDTH) {
      this.setSizeClass('small');
    } else {
      this.setSizeClass('tiny');
    }
    return this.resizeHeaders();
  }

  resizeHeaders() {
    return this.headers.each(function(idx, elem){
      const header = $(elem);
      if (header.hasClass('open')) {
        const locations = header.next('.directory-locations');
        locations.css({'max-height': 'none'});
        return;
      }
    });
  }

  setSizeClass(size){
    if (!this.table.hasClass(size)) {
      this.clearSizeClasses();
      return this.table.addClass(size);
    }
  }

  clearSizeClasses() {
    return this.table.removeClass('tiny').removeClass('small').removeClass('medium').removeClass('large').removeClass('full');
  }

  initPhones() {
    return this.phoneNumber = new PhoneNumber(this.getPhoneConfigs());
  }

  getPhoneConfigs() {
    let phoneConfigs;
    return phoneConfigs = {
      cpnsUrl: this.cpnsUrl,
      clientUrn: this.clientUrn,
      locationUrns: this.locationUrns()
    };
  }

  locationUrns() {
    return this.widget.find('.directory-row').map((idx, elem)=> {
      const locUrn = $(elem).attr('data-location-urn');
      return { urn: locUrn, scope: `tr[data-location-urn=${locUrn}]` };
  });
  }

  initIE() {
    if (this.isIE()) { return this.table.addClass('isIE'); }
  }

  isIE() {
    const { userAgent } = navigator;
    return !!(userAgent.match(/iemobile/i) || userAgent.match(/msie/i) || userAgent.match(/trident/i));
  }
};

G5.loadWidgetConfigs('.directory .config', DirectoryWidget);
