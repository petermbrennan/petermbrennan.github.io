class EditGalleryBasicWidget extends EditGallery {
  photoValues(){
    return {
      "url": {
        "name": "gallery_photoX_url",
        "type": "text"
      },
      "alt_tag": {
        "name": "gallery_photoX_alt",
        "type": "text"
      }
    };
  }
}

new EditGalleryBasicWidget();

let gbw = new EditGalleryBasicWidget();

let selectors = {
  primary:   '.form-field_url .form-field-url input:text',
  maxHeight: '.gallery-image-max-height input[type="number"]',
  maxWidth: '.gallery-image-max-width input[type="number"]',
  hasMaxWidthMaxHeight: true,
  defaultCroppingType: 'fixed'
}

new G5ImageEditor(selectors, function(){
  gbw.renderPreview.apply(gbw);
});
