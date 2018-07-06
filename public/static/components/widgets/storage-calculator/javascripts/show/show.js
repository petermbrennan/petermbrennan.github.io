class UnitSizeCalculator {
  static calculateSize(blocks){
    if (!blocks.length){
      return {root:{h:0,w:0}};
    }
    var node, block;
    this.root = { x: 0, y: 0, w: blocks[0].w, h: blocks[0].h };
    for (var i = 0; i < blocks.length; i++) {
      block = blocks[i];
      if (node = this.findNode(this.root, block.w, block.h)){
        block.fit = this.splitNode(node, block.w, block.h);
      } else {
        block.fit = this.growNode(block.w, block.h);
      }
    }
    return this.root;
  }
  static findNode(root, w, h) {
    if (root.used){
      return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    } else if ((w <= root.w) && (h <= root.h)) {
      return root;
    } else{
      return null;
    }
  }
  static splitNode(node, w, h) {
    node.used = true;
    node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
    node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
    return node;
  }
  static growNode(w, h) {
    var canGrowDown  = (w <= this.root.w);
    var canGrowRight = (h <= this.root.h);
    var shouldGrowRight = canGrowRight && (this.root.h >= (this.root.w + w));
    var shouldGrowDown  = canGrowDown  && (this.root.w >= (this.root.h + h));

     if (shouldGrowRight){
       return this.growRight(w, h);
     } else if (shouldGrowDown) {
       return this.growDown(w, h);
     }else if (canGrowRight) {
       return this.growRight(w, h);
     } else if (canGrowDown) {
       return this.growDown(w, h);
     } else {
       return null;
     }
   }
   static growRight(w, h) {
    var node;
    this.root = {
      used: true,
      x: 0,
      y: 0,
      w: this.root.w + w,
      h: this.root.h,
      down: this.root,
      right: { x: this.root.w, y: 0, w: w, h: this.root.h }
    };
    if (node = this.findNode(this.root, w, h)) {
      return this.splitNode(node, w, h);
    } else {
      return null;
    }
  }
  static growDown(w, h) {
    var node;
    this.root = {
      used: true,
      x: 0,
      y: 0,
      w: this.root.w,
      h: this.root.h + h,
      down:  { x: 0, y: this.root.h, w: this.root.w, h: h },
      right: this.root
    };
    if (node = this.findNode(this.root, w, h)) {
      return this.splitNode(node, w, h);
    }
    else {
      return null;
    }
  }
}

class StorageCalculatorWidget {
  constructor(configs){
    this.configs = configs;
    this.fetchTabs(configs.tabsURL).then(()=>{
      this.widget = $("#"+this.configs.widgetId);
      this.addInitialText(this.configs);
      this.createCalculator();
      this.setInitialValues();
      this.setupSlide();
      this.setupItemCountChange();
      this.setupTagDimensions();
      this.openFirstTab();
    });
  }

  openFirstTab(){
    if (this.configs.firstTabOpen === "true"){
      this.widget.find('.storage-calc-category-name').first().click();
    }
  }

  setInitialValues(){
    this.items = this.widget.find('.storage-calc-item');
    this.calculatedSize = this.widget.find('.calculated-size');
    this.inputWraper = this.widget.find('.input-wrapper');
    this.unitCount = this.widget.find('.unit-count');
  }

  addInitialText(configs) {
    this.widget.find('.recommended-text').text('RECOMMENDED SIZE: ');
    this.widget.find('.instructional-text').text(configs.instructionalText);
    this.widget.find('.disclaimer-text-wrapper').text(configs.disclaimerText);
    this.widget.find('.calculated-size').text('0 x 0');
    if (this.configs.useCustomFont === "true") {
      this.widget.find('.calculated-size').css({'font-family':'CustomCalcFont'});
    }
  }

  fetchTabs(url) {
    return $.get(url, (data)=>{
      data = JSON.parse(data);
      this.tabs = data.tabs;
    });
  }

  createCalculator(){
    var tab;
    for (var i = 0; i < this.tabs.length; i++) {
      tab = this.tabs[i];
      var $section = this.createSection(tab);
      this.widget.find('.storage-calc-sections').append($section);
    }
  }

  createSection(storageCategory){
    var $newSection = this.createEmptySection(storageCategory.name),
        $sectionInnerds = this.createSectionFilling(storageCategory.storageItems);
    $newSection.find('.storage-calc-item-container').append($sectionInnerds);
    return $newSection;
  }

  createEmptySection(storageCategoryName){
    return $(`<div class='storage-calc-category'>
                <a class='storage-calc-category-name'>
                  <h3>${storageCategoryName} <span class='acc-arrow'></span></h3>
                  ${storageCategoryName != 'BOXES' ? '<hr>': ''}
                </a>
                <div style='display:none;' class='storage-calc-item-container'>
                </div>
              </div>`);
  }

  createSectionFilling(storageCategoryItems, categoriesHTMLized=[]){
    var item;
    for (var i = 0; i < storageCategoryItems.length; i++) {
      item = storageCategoryItems[i];
      categoriesHTMLized.push($(`<div class="storage-calc-item">
                                    <div class="storage-calc-item-info">
                                    <img src=${this.configs.s3BucketLink+item.name.replace(/ +/g, '-')+`-${this.configs.imageColor}.png`} />
                                      <h4>${item.name}</h4>
                                    </div>
                                    <div class="storage-calc-item-counter">
                                    <div class="input-wrapper">
                                      <div data-add="1" class="before-arrow">
                                        <svg width="9" height="6" viewBox="-2.5 -5 75 60" preserveAspectRatio="none">
                                          <path d="M0,0 l35,50 l35,-50" fill="none" stroke="white" stroke-linecap="round" stroke-width="14" />
                                        </svg>
                                      </div>
                                      <div contenteditable="true" class="unit-count">0</div>
                                      <div data-add="-1" class="after-arrow">
                                        <svg width="9" height="6" viewBox="-2.5 -5 75 60" preserveAspectRatio="none">
                                          <path d="M0,0 l35,50 l35,-50" fill="none" stroke="white" stroke-linecap="round" stroke-width="14" />
                                        </svg>
                                      </div>
                                      <div class="item-info" data-width=${item.x} data-height=${item.y} data-depth=${item.z} stackable=${item.stackable} />
                                    </div>
                                    </div>
                                  </div>`).get(0));
    }
    return $(categoriesHTMLized);
  }

  setupSlide(){
    this.widget.find('.storage-calc-category-name').click(function(){
      var $toSlide = $(this).next('.storage-calc-item-container');
      //can't use toggle slide or toggle class because it doesn't play nicely with .css({'display':'flex'});
      if ( $toSlide.is(':visible') ) {
        $(this).removeClass('open');
        $toSlide.slideUp('slow');
      } else {
        $(this).addClass('open');
        $toSlide.slideDown('slow').css({'display': 'flex'});
      }
    });
  }

  setupTagDimensions(){
    var resize = () => {
      this.setItemSize();
      this.setFontSize();
    }
    $(window).resize(resize);
    resize();
  }

  setItemSize(){
    var $calc =            this.widget.find('.storage-calc-wrapper'),
        calculatorWidth =  $calc.width();
    if (calculatorWidth < 180){
      this.setItemCSS(45, 43, 47);
    } else if (calculatorWidth < 250){
      this.setItemCSS(46.5, 70, 70);
    } else if (calculatorWidth <= 360){
      this.setItemCSS(46.5, 105, 105);
    } else {
      this.setItemCSS(30.7, 95, 95);
    }
  }

  setItemCSS(maxWidth, flex, minWidth) {
    this.items.css({'max-width': `${maxWidth}%`,'flex':`1 1 ${flex}px`,'min-width':`${minWidth}px`});
  }

  setFontSize(){
    var $heading = this.widget.find('.recommended-text-container');
    $heading.find('.recommended-text').css({'font-size':`${.04 * $heading.width()}px`});
    this.items.css({'font-size':`${.023 * $heading.width()}px`});
    this.widget.find('.instructional-text').css({'font-size':`${.040 * $heading.width()}px`});
    this.widget.find('.disclaimer-text-wrapper').css({'font-size':`${.03 * $heading.width()}px`});
    this.widget.find('.unit-count').css({'font-size':`${.04 * $heading.width()}px`});
    if (this.configs.useCustomFont === "true"){
      $heading.find('.calculated-size').css({'font-size': `${.128 * $heading.width()}px`});
    } else {
      $heading.find('.calculated-size').css({'font-size': `${.106 * $heading.width()}px`});
    }
  }

  setupItemCountChange(){
    this.setupArrowsClicked();
    this.setupUserKeyboardInput();
  }

  setupArrowsClicked(){
    var arrowClickedCallback = (btn) => {
      var input        = $($(btn.currentTarget).parent().find('.unit-count').get(0)),
          add          = $(btn.currentTarget).data('add'),
          currentCount = parseInt(input.text());
      if ((currentCount + add) < 0 || (currentCount + add) === 100) {return;}
      input.text(parseInt(input.text()) + parseInt(add));
      this.updateRecommendedSize();
    }
    this.widget.find('.before-arrow').click(arrowClickedCallback);
    this.widget.find('.after-arrow').click(arrowClickedCallback);
  }

  setupUserKeyboardInput() {
    var checkForValidInput = (e) => {
      var $currentTarget = $(e.currentTarget),
            userInput = $currentTarget.text();
      if (!userInput.length || !$.isNumeric(userInput)){
        $currentTarget.text(0);
      } else if (userInput.length > 2){
        $currentTarget.text(userInput.slice(0, -1));
      }
      this.updateRecommendedSize();
    }
    var upOrDownArrow = (e) => {
      if (e.keyCode === 38 && $(e.currentTarget).text() != 99) {
        $(e.currentTarget).text(parseInt($(e.currentTarget).text()) + 1);
      } else if (e.keyCode === 40 && $(e.currentTarget).text() != 0) {
        $(e.currentTarget).text(parseInt($(e.currentTarget).text()) - 1);
      }
      this.updateRecommendedSize();
    }
    this.unitCount.on({
      change: (e) => {checkForValidInput(e);},
      input : (e) => {checkForValidInput(e);},
      blur  : (e) => {checkForValidInput(e);},
      keydown : (e) => {upOrDownArrow(e);}
    });
    this.widget.find(".storage-calc-item-info").on('click', (e) => {
      var $unitCount = $(e.currentTarget).next().find('.unit-count');
      if ($unitCount.text() != 99 ) {
        $unitCount.text(parseInt($unitCount.text()) + 1);
      }
      this.updateRecommendedSize();
    });
  }

  updateRecommendedSize(){
    var items = [];
    this.inputWraper.each(function(i, item) {
      var $dataDiv = $(item).find('.item-info'),
          itemCount = parseInt($(item).find('.unit-count').text());
      if (itemCount) {
        var w = $dataDiv.data('width'),
            h = $dataDiv.data('height');
        for (; itemCount; itemCount--) {
          items.push({ w, h});
        }
      }
    });
    //sort storage items in decreasing order according to the area they take up
    items = items.sort(function(a, b){
      if (a.h * a.w < b.h * b.w) {
        return 1;
      } else if (a.h * a.w > b.h * b.w) {
        return -1;
      }
      return 0;
    });
    var { w = 0, h = 0 } = UnitSizeCalculator.calculateSize(items);
    w = Math.ceil(w / 5) * 5;
    h = Math.ceil(h / 5) * 5;
    this.calculatedSize.text(w +' x ' + h);
  }
};
G5.loadWidgetConfigs('.storage-size-calculator .config', StorageCalculatorWidget);
