class EditMapWidget {
  constructor(){
    this.topModal = window.top.$('.modal');
    this.stylesBlock = this.topModal.find("#map-styles");
    this.mapUrl = "/static/components/widgets/map-v2/map.json";
    this.mapIdField = this.topModal.find('.map-id').first();
    this.mapValuesField = this.topModal.find('.map-values').first();
    this.loadJSON();
  }

  loadJSON(){
    $.getJSON(this.mapUrl).done((json)=>{
      this.styles = json.styles;
      if (json.styles.length){
        this.buildMarkup();
        this.setContent();
      }
    });
  }

  buildMarkup(){
    var markup = "";
    var currentId = parseInt(this.topModal.find(".map-id").val());
    this.styles.forEach((item)=>{
      let isCurrentItem = (currentId === item.id);
      let isSelected = isCurrentItem ? " selected" : "";
      let isChecked = isCurrentItem ? " checked='checked'" : "";
      markup += `<div class='map-wrap${isSelected}'><h3>${item.name}</h3>`;
      markup += `<img src='${item.imageUrl}'>`;
      markup += `<input type='radio' name='map-type' value='${item.id}'${isChecked}></div>`;
    });
    this.stylesBlock.append(markup);
  }

  setContent(){
    var mapWrap = this.stylesBlock.find('.map-wrap');
    mapWrap.on("click", (e)=>{
      let selectedMap = $(e.currentTarget);
      let selectedRadio = selectedMap.find('input:radio');
      let radioVal = parseInt(selectedRadio.val());
      let currentId = "";

      mapWrap.removeClass('selected');
      selectedMap.addClass('selected');
      selectedRadio.attr('checked', true);

      this.styles.forEach((style)=>{
        if (style.id === radioVal) {
          this.currentStyle = style.json.replace(/'/g, '"');
          this.currentId = style.id;
        }
      });

      this.mapIdField.val(this.currentId);
      this.mapValuesField.val(this.currentStyle);
    });
  }
}

new EditMapWidget();