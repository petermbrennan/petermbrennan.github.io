class EditCallOutsWidget extends EditGallery {
  photoValues(){
    return {
      "url": {
        "name": "callout_image_url_X",
        "type": "text"
      },
      "link": {
        "name": "callout_url_X",
        "type": "text"
      },
      "label": {
        "name": "callout_label_X",
        "type": "text"
      },
      "alt": {
        "name": "callout_image_alt_X",
        "type": "text"
      },
      "new_window": {
        "name": "callout_X_new_window",
        "type": "checkbox"
      }
    };
  }
}

new EditCallOutsWidget();

for (var i = 1; i <= 6; i++) {
  let editImageField = {
    primary: `.form-field-callout-image-url-${i} input:text`,
    uploadAndCropButton: `.photo-field-${i} .cloudinary-upload-crop`,
    maxHeight: `.form-field-callout-image-height-${i} input[type="number"]`,
    maxWidth: `.form-field-callout-image-width-${i} input[type="number"]`,
    croppingStyleSelector: `.form-field-callout-image-cropping-styles-${i} input:checked`,
    hasMaxWidthMaxHeight: true
  }
  new G5ImageEditor(editImageField, function(){
    this.renderThumbs();
  });
}
