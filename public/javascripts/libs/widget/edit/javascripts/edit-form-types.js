class EditFormTypes {
  constructor(){
    var theData = $('.modal form div.data');
    if (theData.length) {
      this.options = {
        "cls_url": theData.data('cls-url'),
        "form_endpoint": theData.data('form-endpoint'),
        "selected_lead_type": theData.data('selected-lead-type')
      };
      this.getPage();
    }
  }

  getPage(){
    return $.ajax({
      url: `${this.options.cls_url}/api/v1/${this.options.form_endpoint}`,
      dataType: 'json',
      success: (data) => {
        if (data !== null) {
          this.buildLeadTypeSelect(data.forms);
        }
      }
    });
  }

  buildLeadTypeSelect(forms){
    var sel = $('.lead-types-select select');
    var selectedLeadType = this.options.selected_lead_type;

    if (forms.length){
      $(forms).each((idx, e) => {
        let isSelected = !!(selectedLeadType === e.id);
        sel.append($("<option>").attr('value',e.id).attr('selected', isSelected).text(e.name));
      });
      $('.lead-types-select select').material_select();
    }
  }
};

new EditFormTypes();
