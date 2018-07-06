class EditPhotoRandomizerWidget extends EditGallery {
  photoValues(){
    return {
      "url": {
        "name": "photo_X_url",
        "type": "text"
      },
      "alt_tag": {
        "name": "photo_X_alt",
        "type": "text"
      }
    };
  }
}



let prw = new EditPhotoRandomizerWidget();

let selectors = {
  primary:   '.form-field_url .form-field-url input:text',
  maxHeight: '.gallery-image-max-height input[type="number"]',
  maxWidth: '.gallery-image-max-width input[type="number"]',
  hasMaxWidthMaxHeight: true,
  defaultCroppingType: 'fixed'
}

new G5ImageEditor(selectors, function(){
  prw.renderPreview.apply(prw);
});
