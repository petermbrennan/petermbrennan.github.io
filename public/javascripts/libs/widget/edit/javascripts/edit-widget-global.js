class WidgetEditGlobalJS {
  constructor(){
    this.topWindow      = window.top;
    this.tabs           = this.topWindow.$('.accordion-tabs-minimal');
    this.container      = this.topWindow.$(".modal-body");
    this.setupToggleEvent();
    this.setupNumberInputMinMax();
  }

  setupToggleEvent() {
    this.tabs.each(function(index) {
      $(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').css("display", "block");
    });
    this.tabs.on('click', 'li > a.tab-link', function(event) {
      if (!$(this).hasClass('is-active')) {
        event.preventDefault();
        var accordionTabs = $(this).closest('.accordion-tabs-minimal');
        accordionTabs.find('.is-open').removeClass('is-open').hide();
        $(this).next().toggleClass('is-open').toggle();
        accordionTabs.find('.is-active').removeClass('is-active');
        $(this).addClass('is-active');
      } else {
        event.preventDefault();
      }
    });
    this.tabs.first().find('li > a.tab-link').click();
  }

  setupNumberInputMinMax() {
    let checkForValidInput = (e) => {
      var $currentTarget = $(e.currentTarget),
            number = parseInt($currentTarget.val()),
            max = parseInt($currentTarget.attr('max')),
            min = parseInt($currentTarget.attr('min'));
      if (number > max) $currentTarget.val(max);
      if (number < min) $currentTarget.val(min);
    }
    $('.edit-integer-field input').on({
      change: (e) => {checkForValidInput(e);},
      input : (e) => {checkForValidInput(e);},
      blur  : (e) => {checkForValidInput(e);}
    });
  }
}
new WidgetEditGlobalJS();
