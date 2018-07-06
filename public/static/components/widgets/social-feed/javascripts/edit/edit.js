class EditSocialFeedWidget {
  constructor(){
    this.topWindow = window.top;
    this.topModal = this.topWindow.$('.modal-content');
    this.form = this.topModal.find('form');
    this.fieldset = this.topModal.find('fieldset');
    this.sortableElem = this.topModal.find('.social-order');
    this.sortable = this.buildSortable();

    this.wrapperClass();
    this.socialOptions();
    this.socialToggle();
  }

  buildSortable(){
    return new Sortable(this.sortableElem[0], {
      sort: true,
      group: "social",
      draggable: ".item",
      ghostClass: "ghost",
      chosenClass: "chosen",
      dataIdAttr: 'data-class',
      store: {
        get(sortable) {
          let order = sortable.toArray();
          let map = {};
          let sorted = [];
          order.forEach(function(item, index){
            let position = $(`.${item} input:text`).val();
            map[position] = item;
          });
          Object.keys(map).forEach(function(item) {
            sorted.push(map[item]);
          });
          return sorted;
        },

        set(sortable) {
          let order = sortable.toArray();
          order.forEach(function(item, index){
            $(`.${item} input:text`).val(index + 1);
          });
        }
      }
    });
  }

  socialOptions(){
    this.fieldset.each((idx, e)=>{
      let elem = $(e);
      let checkbox = elem.find(".on-off-toggle input[type='checkbox']");
      if (checkbox.length === 0) {
        return;
      }
      if ($(checkbox).is(':checked')){
        let elemParent = elem.parent();
        if (elemParent.css({'display':'block'})){
          elemParent.slideDown('slow');
        }
      } else {
        elem.find('.social-opts').hide();
      }
    });
  }

  socialToggle(){
    this.form.find('.on-off-toggle').each((idx, e)=>{
      let checkbox = $(e).find("input[type='checkbox']");
      checkbox.change((e)=>{
        let cb = $(e.currentTarget);
        let opts = cb.closest('.on-off-toggle').parent().next();
        if (cb.is(':checked')) {
          opts.slideDown('slow');
        } else {
          opts.slideUp('slow');
        }
      });
    });
  }

  wrapperClass(){
    this.fieldset.each((idx, e)=>{
      let elem = $(e);
      let checkbox = elem.find('.on-off-toggle');
      if (checkbox.length === 1) {
        let feed_opts = elem.closest('fieldset').find('.form-field:not(.on-off-toggle)');
        feed_opts.wrapAll('<div class="social-opts" />');
      }
    });
  }
}

new EditSocialFeedWidget();