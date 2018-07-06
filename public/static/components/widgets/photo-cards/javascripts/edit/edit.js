class EditPhotoCardsWidget extends EditGallery {
  photoValues(){
    return {
      "url": {
        "name": "photo_cards_X_url",
        "type": "text"
      },
      "thumb_url": {
        "name": "photo_cards_X_link",
        "type": "text"
      },
      "alt_tag": {
        "name": "photo_cards_X_link_target",
        "type": "checkbox"
      },
      "title": {
        "name": "photo_cards_X_alt",
        "type": "text"
      },
      "caption": {
        "name": "photo_cards_X_title",
        "type": "text"
      },
      "caption": {
        "name": "photo_cards_X_large_caption",
        "type": "ckeditor"
      }
    };
  }
}

let pcw = new EditPhotoCardsWidget();

let selectors = {
  primary:   '.form-field_url .form-field-url input:text',
  maxHeight: '.gallery-image-max-height input[type="number"]',
  maxWidth: '.gallery-image-max-width input[type="number"]',
  hasMaxWidthMaxHeight: true,
  defaultCroppingType: 'fixed'
}

new G5ImageEditor(selectors, function(){
  pcw.renderPreview.apply(pcw);
});
