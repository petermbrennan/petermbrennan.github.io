var EditNavigation = {
  form: null,

  init: function(){
    this.form = $("#modal form");
    this.initDisplayNavigation();
    this.initNavigationCheckboxes();
  },

  initDisplayNavigation: function(){
    this.form.find('input.display-navigation').click(function(){
      if (!$(this).is(':checked')){
        if (!confirm('Are you sure?')){
          $(this).prop('checked', true);
        }
      };
    });
  },

  initNavigationCheckboxes: function(){
    this.form.find('input.nav-checkbox').each(function(idx, elem){
      var input = $(elem);
      input.click(function(e){
        this.toggleSubNavCheckboxes($(e.currentTarget));
      }.bind(this));
      this.toggleSubNavCheckboxes(input);
    }.bind(this));
  },

  toggleSubNavCheckboxes: function(input){
    if (input.attr('data-parent-id') != 0){ return; }
    var thisId = input.attr('data-id');
    var checked = input.prop('checked');
    this.form.find('input.nav-checkbox[data-parent-id='+thisId+']').each(function(idx, elem){
      var subnav = $(elem);
      subnav.prop('disabled', !checked);
      if (!checked){
        subnav.prop('checked', false);
      }
    }.bind(this));
  }
};

$(document).ready(function(){
  EditNavigation.init();
});



