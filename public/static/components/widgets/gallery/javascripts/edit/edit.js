class EditGalleryWidget extends EditGallery {
  photoValues(){
    return {
      "url": {
        "name": "gallery_photoX_url",
        "type": "text"
      },
      "alt_tag": {
        "name": "gallery_photoX_alt_tag",
        "type": "text"
      },
      "title": {
        "name": "gallery_photoX_title",
        "type": "text"
      },
      "caption": {
        "name": "gallery_photoX_caption",
        "type": "text"
      }
    };
  }
}
let selectors = {
  primary:   '.form-field_url .form-field-url input:text',
  maxHeight: '.gallery-image-max-height input[type="number"]',
  maxWidth: '.gallery-image-max-width input[type="number"]',
  hasMaxWidthMaxHeight: true,
  defaultCroppingType: 'fixed'
}

let gw = new EditGalleryWidget(selectors);

// selects for calculating, and an on success callback
new G5ImageEditor(selectors, function(){
  gw.renderPreview.apply(gw);
});
