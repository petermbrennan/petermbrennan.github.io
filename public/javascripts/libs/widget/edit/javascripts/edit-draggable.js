class EditDraggable {
  constructor(){
    this.topWindow = window.top;
    this.topModal = this.topWindow.$('.modal-content');
  }

  makeDraggable(obj){
    obj.on('dragstart', (e)=>{ this.handleDragStart(e); });
    obj.on('dragenter', (e)=> { this.handleDragEnter(e); });
    obj.on('dragover', (e)=>{ this.handleDragOver(e); });
    obj.on('dragleave', (e)=> { this.handleDragLeave(e); });
    obj.on('drop', (e)=> { this.handleDragDrop(e); });
    obj.on('dragend', (e)=>{ this.handleDragEnd(e); });
  }

  handleDragStart(e) {
    this.draggableContainer().addClass('dragging');
    this.dragElem = window.top.$(e.currentTarget);
    this.dragElem.addClass('dragElem');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(this.draggableData()));
    return false;
  }

  handleDragEnter(e) {
    e.preventDefault();
    this.handleDragHover(e);
    return false;
  }

  handleDragOver(e) {
    this.handleDragHover(e);
    e.dataTransfer.dropEffect = 'move';
    e.preventDefault();
    return false;
  }

  handleDragHover(e) {
    let elem = this.topWindow.$(e.currentTarget);
    elem.addClass('dragHover');
    let cursorX = e.originalEvent.pageX;
    let halfway = elem.offset().left+(elem.width()*0.5);
    if (cursorX <= halfway){
      elem.removeClass('rightHalf').addClass('leftHalf');
    } else {
      elem.removeClass('leftHalf').addClass('rightHalf');
    }
    return false;
  }

  handleDragLeave(e) {
    let elem = this.topWindow.$(e.currentTarget);
    elem.removeClass('rightHalf leftHalf dragHover');
    e.preventDefault();
    return false;
  }

  handleDragDrop(e) {
    let elem = this.topWindow.$(e.currentTarget);
    let originalPos = this.dragElem.data('index');
    let targetPos = elem.data('index');
    if (originalPos !== targetPos) {
      let draggableIndex = `${this.draggableClass()}[data-index=${originalPos}]`;
      let sourceElem = this.draggableContainer().find(draggableIndex);
      if (elem.hasClass('leftHalf')){
        elem.before(sourceElem.detach());
      } else if (elem.hasClass('rightHalf')) {
        elem.after(sourceElem.detach());
      }
      this.afterDragDrop();
    }

    this.dragElem.css({opacity: 1.0});
    this.dragElem.removeClass('dragElem dragHover');
    this.draggableObjects().each((idx, elem)=>{
      var obj = this.topWindow.$(elem);
      obj.removeClass('rightHalf leftHalf dragHover');
      obj.css({opacity: 1.0});
    });
    this.draggableContainer().removeClass("dragging");

    e.preventDefault();
    e.stopPropagation(); // Stops some browsers from redirecting.
    $(window).trigger('dragDrop');
    return false;
  }

  handleDragEnd(e) {
    this.dragElem.removeClass('dragElem');
    this.dragElem = null;
    e.preventDefault();
    return false;
  }

  afterDragDrop(){
    // override with specific behaviors
    throw new Error('afterDragDrop not defined');
  }

  draggableContainer(){
    // override with specific selector
    throw new Error('draggableContainer not defined');
  }

  draggableClass(){
    // override with specific selector
    throw new Error('draggableClass not defined');
  }

  draggableData(){
    // override with specific data attr
    throw new Error('draggableData not defined');
  }

  draggableObjects(){
    // override with all draggable objects
    throw new Error('draggableObjects not defined');
  }
}
