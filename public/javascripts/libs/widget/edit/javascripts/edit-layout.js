class EditWidgetModal {
  constructor(widgetId, widgetName, rowWidgetId) {
    this.topModal = window.top.$('.modal-content');
    this.widgetId = widgetId;
    this.widgetName = widgetName;
    this.rowWidgetId = rowWidgetId;
    this.setModal();
  }

  setModal(){
    this.topModal.data("component").set("selectedWidgetName", this.widgetName);
    this.topModal.find('.heading').text(`Edit ${this.widgetName}`);
  }
};


class EditLayout extends EditDraggable {
  constructor(){
    super();
    this.initDraggableObjects();
    this.setSettingsList();
    this.initLayoutWidgetModal();
  }

  layoutClass(idx){
    return this.layoutClasses()[idx];
  }

  allLayoutClasses(){
    return this.layoutClasses()[0];
  }

  getLayoutTag(){
    return `.${this.layoutTag()}-widgets`;
  }

  initDraggableObjects(){
    this.draggableObjects().each((idx, elem)=>{
      let widget = $(elem);
      this.makeDraggable(widget);
      this.initSelects(widget);
    });
  }

  openLayoutWidgetModal(widgetId) {
    this.editWidgetModal = new EditWidgetModal(widgetId, null);
    this.editWidgetModal.getEditForm();
  }

  initLayoutWidgetModal() {
    this.initChangeLayout();
    this.updatePositions(false);
    this.hideDraggableObjects();
    this.hideSaveWarning();
    this.showSelectedLayout();
  }

  initChangeLayout(){
    this.getSelectedLayout().on('change', (e)=>{
      this.showSaveWarning();
      this.hideDraggableObjects();
      this.hideEditLinks();
      this.showSelectedLayout();
    });
  }

  initSelects(widget){
    widget.find("select").on('change', (e)=>{
      this.selectChanged($(e.currentTarget));
    });
  }

  selectChanged(select){
    let value = select.val();
    // necessary to manually set selected for drag and drop to work
    select.find('option[selected]').removeAttr('selected');
    select.find('option[value="'+value+'"]').attr('selected', true);
    this.showSaveWarning();
    this.hideEditLinks();
  }

  initEditLinks(widget){
    var rowWidgetId = this.topModal.find(`.${this.layoutTag()}-edit`).data(`${this.layoutTag()}-id`);
    widget.find(".edit-widget").on('click', (e)=>{
      let elem = $(e.currentTarget);
      this.editWidgetModal = new EditWidgetModal(elem.data("widget-id"), elem.data("widget-name"), rowWidgetId);
      this.editWidgetModal.getEditForm();
      return false;
    });
  }

  afterDragDrop(){
    this.updatePositions(true);
    this.showSaveWarning();
  }

  draggableContainer(){
    return this.topModal.find('.layout-fields');
  }

  draggableClass(){
    return this.getLayoutTag();
  }

  draggableData(){
    return { index: this.dragElem.data('index') };
  }

  draggableObjects(){
    return this.topModal.find(this.getLayoutTag());
  }

  updatePositions(dragAndDrop){
    this.draggableObjects().each((idx, elem)=>{
      this.updatePosition(idx, elem, dragAndDrop);
    });
    if (dragAndDrop){
      this.transferSettings();
    }
  }

  updatePosition(idx, elem, dragAndDrop){
    let widget = $(elem);
    let i = idx+1;
    let dataIndex = this.layoutTitle().toLowerCase()+'_'+i;

    widget.removeClass(this.allLayoutClasses()).addClass(this.layoutClass(idx));
    widget.attr('data-index', dataIndex).data('index', dataIndex);
    widget.find('label').text(`${this.layoutTitle()} ${i} Widget`);
    if (dragAndDrop){
      if (!widget.hasClass('dropped')){
        widget.find('.edit-widget').hide();
        widget.find('select').material_select();
        widget.addClass('dropped');
      }
    }
  }

  setSettingsList(){
    this.settingsList = [];
    this.draggableObjects().each((idx, elem)=>{
      let widget = $(elem);
      this.settingsList.push({ name: widget.data('name'), id: widget.data('id') });
    });
  }

  transferSettings(){
    this.draggableObjects().each((idx, elem)=>{
      let widget = $(elem);
      // Remap the settings values - hacky as hell, but works!
      widget = this.transferSetting(widget, 'name', this.settingsList[idx]['name']);
      widget = this.transferSetting(widget, 'id', this.settingsList[idx]['id']);
    });
    this.setSettingsList();
  }

  transferSetting(widget, type, value){
    let oldSetting = widget.data(type);
    widget.attr('data-'+type, value).data(type, value);

    let html = widget.html();
    // This regex is safe because setting IDs are always guaranteed greater than the widget IDs
    let settingRegEx = new RegExp(oldSetting, 'g');
    widget.html(html.replace(settingRegEx, value));
    return widget;
  }

  getSelectedLayout(){
    return this.topModal.find(`.${this.selectLayoutTag()} select`);
  }

  showSelectedLayout(){
    let selectedLayout = this.getSelectedLayout().val();
    $(`.${selectedLayout}`).show();
  }

  hideDraggableObjects(){
    this.draggableObjects().hide();
  }

  hideEditLinks(){
    this.topModal.find(".edit-widget").hide();
  }

  hideSaveWarning(){
    this.topModal.find(".save-warning").removeClass('show');
  }

  showSaveWarning(){
    this.topModal.find(".save-warning").addClass('show');
  }

  selectLayoutTag(){
    // override in child classes
    throw new Error('selectLayoutTag not defined');
  }

  layoutTag(){
    // override in child classes
    throw new Error('layoutTag not defined');
  }

  layoutTitle(){
    // override in child classes
    throw new Error('layoutTitle not defined');
  }

  layoutClasses(){
    // override in child classes
    throw new Error('layoutClasses not defined');
  }
}

