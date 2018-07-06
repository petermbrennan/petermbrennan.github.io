let selectors = {
  primary:   '.form-field-favicon input:text',
  maxHeight: '.form-field-cropping-height input[type="number"]',
  maxWidth: '.form-field-cropping-width input[type="number"]',
  hasMaxWidthMaxHeight: true,
  croppingStyleSelector: `.form-field-cropping-style input:checked`
}


new G5ImageEditor(selectors, function(){
  //edit successful callback
});
