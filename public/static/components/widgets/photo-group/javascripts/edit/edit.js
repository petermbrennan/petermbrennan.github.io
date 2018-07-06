class EditPhotoGroupWidget extends EditGallery {
  photoValues(){
    return {
      "url": {
        "name": "photoX_url",
        "type": "text"
      },
      "alt_tag": {
        "name": "photoX_alt",
        "type": "text"
      }
    };
  }
}

let pg = new EditPhotoGroupWidget();

let selectors = {
  primary:   '.form-field_url .form-field-url input:text',
  maxHeight: '.gallery-image-max-height input[type="number"]',
  maxWidth: '.gallery-image-max-width input[type="number"]',
  hasMaxWidthMaxHeight: true,
  defaultCroppingType: 'fixed'
}

new G5ImageEditor(selectors, function(){
  pg.renderPreview.apply(pg);
});
