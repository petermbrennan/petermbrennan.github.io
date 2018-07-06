let selectors = {
  primary:   '.form-field-photo-source-url input:text',
  maxHeight: '.form-field-cropping-height input[type="number"]',
  maxWidth: '.form-field-cropping-width input[type="number"]',
  hasMaxWidthMaxHeight: true
}


new G5ImageEditor(selectors, function(){
  //edit successful callback
});

class EditPhotoRollover {

  constructor(){
    this.initPhotoRollover();
    this.togglePhotoRollover();
  }

  initPhotoRollover(){
    let photoRolloverOpt = $(".form-field-rollover-zoom input[type='checkbox']").is(':checked');
    let photoRolloverOpts = $(".rollover-zoom-opts");
    if (photoRolloverOpt === false) {
      photoRolloverOpts.css({'display':'none'});
    } else {
      photoRolloverOpts.css({'display':'block'});
    }
  }

  togglePhotoRollover(){
    $(".form-field-rollover-zoom input[type='checkbox']").on("click", function(e) {
      let photoRolloverOpt = $(".form-field-rollover-zoom input[type='checkbox']").is(':checked');
      let photoRolloverOpts = $(".rollover-zoom-opts");
      if (photoRolloverOpt === false) {
        photoRolloverOpts.css({'display':'none'});
      } else {
        photoRolloverOpts.css({'display':'block'});
      }
    });
  }

}

new EditPhotoRollover();