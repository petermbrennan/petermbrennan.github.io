let selectors = {
  primary:   '.form-field-location-logo-url input:text',
  maxHeight: '.form-field-cropping-height input[type="number"]',
  maxWidth: '.form-field-cropping-width input[type="number"]',
  hasMaxWidthMaxHeight: true
}


new G5ImageEditor(selectors, function(){
  //edit successful callback
});
