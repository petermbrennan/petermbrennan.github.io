class EditContentStripeWidget extends EditLayout {
  selectLayoutTag(){
    return 'select-row-layout';
  }

  layoutTag(){
    return 'col';
  }

  layoutTitle(){
    return 'Column';
  }

  layoutClasses(){
    return [
      "single halves uneven-thirds-1 uneven-thirds-2 thirds quarters",
      "halves uneven-thirds-1 uneven-thirds-2 thirds quarters",
      "thirds quarters",
      "quarters"
    ];
  }
}

new EditContentStripeWidget();

let selectors = {
  primary: '.form-field-row-bg-image input:text',
  uploadAndCropButton: '.row-bg-image .cloudinary-upload-crop',
  maxHeight: '.row-bg-image .form-field-background-image-cropping-height input[type="number"]',
  maxWidth: '.row-bg-image .form-field-background-image-cropping-width input[type="number"]',
  hasMaxWidthMaxHeight: true,
  croppingStyleSelector: `.form-field-background-image-cropping-style input:checked`
}

new G5ImageEditor(selectors, function(){
  this.renderThumbs();
});

let dividerSelectors = {
  primary: '.form-field-row-divider-image input:text',
  uploadAndCropButton: '.row-divider-image .cloudinary-upload-crop',
  maxHeight: '.row-divider-image .form-field-divider-image-cropping-height input[type="number"]',
  maxWidth: '.row-divider-image .form-field-divider-image-cropping-width input[type="number"]',
  hasMaxWidthMaxHeight: true,
  croppingStyleSelector: `.form-field-divider-image-cropping-style input:checked`
}

new G5ImageEditor(dividerSelectors, function(){
  this.renderThumbs();
});
