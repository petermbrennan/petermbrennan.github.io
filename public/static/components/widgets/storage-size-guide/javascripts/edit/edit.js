
class EditStorageSizeGuide {
  constructor(){
    for (var i = 1; i <= 8; i++) {
      let editImageField = {
        primary: `.form-field-storage-image-custom-${i} input:text`,
        uploadAndCropButton: `.cloudinary-options.${i} .cloudinary-upload-crop`,
        maxHeight: `.form-field-photo-${i}-cropping-height input[type="number"]`,
        maxWidth: `.form-field-photo-${i}-cropping-width input[type="number"]`,
        croppingStyleSelector: `.form-field-photo-${i}-cropping-style input:checked`,
        hasMaxWidthMaxHeight: true
      }
      new G5ImageEditor(editImageField, function(){
        this.renderThumbs();
      });
    }
    this.imageSelect = null;
    this.target = null;
    this.topWindow = null;
    this.topWindow = window.top;
    this.imageSelect = this.topWindow.$('.form-field-storage-image-type input');
    this.imageSelect.on('change', () => {
      return this.setTargetImageType();
    });
    this.setTargetImageType();
  }

  setTargetImageType(){
    this.target = $('.form-field-storage-image-type input:checked').val();
    const customField = this.topWindow.$('.custom-image-field');
    switch (this.target) {
      case 'custom':
        customField.show();
        $('.cloudinary-options, .img-thumbnail-preview').show();
        break;
      case 'storage-unit-overview':
      case 'man-in-box':
      case '3d-view':
        this.hideAndClear(customField);
        break;
    }
  }

  hideAndClear(fields){
    fields.hide();
    $('.cloudinary-options, .img-thumbnail-preview').hide();
    setTimeout(()=>{
      $('.img-thumbnail-preview').hide();
    }, 100);
  }
}

let essg = new EditStorageSizeGuide();
