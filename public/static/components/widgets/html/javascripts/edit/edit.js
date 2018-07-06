class EditHtmlWidget {
  constructor(){
    this.topWindow = window.top;
    this.modalContent = this.topWindow.$('.modal .modal-content');
    this.tabs = this.modalContent.find('.tabs');
    this.label = this.modalContent.find('.form-field-text label');

    let event = 'resize.html orientationchange.html';
    $(this.topWindow).off(event).on(event, ()=>{
      this.resizeEditor();
    });
    if (this.topWindow.CKEDITOR){
      this.topWindow.CKEDITOR.on('instanceReady', (e)=>{
        this.resizeEditor();
      });
    }
  }

  resizeEditor(){
    if (this.topWindow.CKEDITOR){
      let ckes = this.modalContent.find('.ckeditor');
      ckes.each((i, elem)=>{
        let cke = this.topWindow.CKEDITOR.instances[$(elem).attr('id')];
        try {
          cke.resize('100%', Math.max(this.calculateEditorHeight(), 300));
        } catch (e) { }
      });
    }
  }

  calculateEditorHeight(){
    return this.modalContent.outerHeight(true)-this.label.outerHeight(true)-this.tabs.outerHeight(true)-10;
  }
}

new EditHtmlWidget();