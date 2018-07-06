let selectors = {
  primary:   '.form-field-logo-url input:text',
  maxHeight: '.form-field-cropping-height input[type="number"]',
  maxWidth: '.form-field-cropping-width input[type="number"]',
  croppingStyleSelector: `.form-field-cropping-style input:checked`,
  hasMaxWidthMaxHeight: true
}


new G5ImageEditor(selectors, function(){
  //edit successful callback
});
