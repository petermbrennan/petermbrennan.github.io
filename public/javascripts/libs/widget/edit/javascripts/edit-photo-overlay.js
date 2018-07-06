class EditPhotoOverlay {
  constructor(){
    this.topWindow       = window.top;
    this.form            = $(".modal-content form");
    this.initPhotoOverlay();
    this.togglePhotoOverlay();
  }

  initPhotoOverlay(){
    let photoOverlayOpt = $(".form-field-photo-filter option[value='false']").is(':selected');
    let photoFilterOpts = $(".photo-filter-options");
    //Photo overlay is off
    if (photoOverlayOpt === true) {
      photoFilterOpts.css({'display':'none'});
    } else {
      photoFilterOpts.css({'display':'block'});
    }
  }

  togglePhotoOverlay(){
    this.form.on("change", ".form-field-photo-filter", function(e) {
      let selectedOption = $(".form-field-photo-filter option[value='false']").is(':selected');
      let photoFilterOpts = $(".photo-filter-options");
      if (selectedOption === true) {
        if (photoFilterOpts.css({'display':'block'})) {
          photoFilterOpts.slideUp();
        } else {
          photoFilterOpts.hide();
        }
      } else {
        photoFilterOpts.slideDown('slow');
      }
    });
  }
}
new EditPhotoOverlay();