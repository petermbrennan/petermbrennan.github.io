var topModal = window.top.$('#modal')

  class editLeadFormOptions {
    constructor(topModal){
      this.form = topModal.find('form')
      this.fieldset = topModal.find('fieldset')
      this.wrapperClass()
      this.init()
      this.editToggle()
    }

    init(){
      $(this.fieldset).each(function() {
        let checkbox = $(this).find(".on-off-toggle input[type='checkbox']"),
            opts = $(this).find('.edit-opts')
        if (checkbox.length === 0) {
          return
        } else if ($(checkbox).is(':checked')){
          // This may be buggy, make sure the scope is correct.
          if ($(this).parent('.edit-opts').css({'display':'block'})){
            $(this).parent('.edit-opts').slideDown('slow')
          }
        } else {
          $(this).find('.edit-opts').hide()
        }
      });
    }

    editToggle(){
      let checkboxes = $(this.form).find('.on-off-toggle')
      $(checkboxes).each(function(e, elem) {
        let checkbox = $(this).find("input[type='checkbox']")
        checkbox.change(function(e, elem) {
          let opts = $(this).closest('.on-off-toggle').parent().next()
          if ($(this).is(':checked')) {
            opts.slideDown('slow');
          } else {
            opts.slideUp('slow');
          }
        });
      });
    }

    wrapperClass(){
      $(this.fieldset).each(function(e, elem) {
        let checkbox = $(elem).find('.on-off-toggle')
        if (checkbox.length === 1) {
          let feed_opts = $(elem).closest('fieldset').find('.form-field:not(.on-off-toggle)')
          $(feed_opts).wrapAll('<div class="edit-opts" />')
        }
      }.bind(this));
    }
  }

new editLeadFormOptions(topModal);