class EditFeaturedPropertiesWidget extends EditGallery {
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
        "name": "gallery_photoX_link",
        "type": "text"
      },
      "caption": {
        "name": "gallery_photoX_caption",
        "type": "text"
      }
    };
  }
}

let fpw = new EditFeaturedPropertiesWidget();

let selectors = {
  primary:   '.form-field_url .form-field-url input:text',
  maxHeight: '.gallery-image-max-height input[type="number"]',
  maxWidth: '.gallery-image-max-width input[type="number"]',
  hasMaxWidthMaxHeight: true,
  defaultCroppingType: 'fixed'
}

new G5ImageEditor(selectors, function(){
  fpw.renderPreview.apply(fpw);
});
