class EditNeighborhoodMapWidget {
  constructor(){
    this.topModal = window.top.$('.modal');
    this.stylesBlock = this.topModal.find("#map-styles");
    this.mapUrl = "/static/components/widgets/neighborhood-map/map.json";
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
    }).fail(()=>{
      console.error("Failed to load JSON");
    });
  }

  buildMarkup(){
    var markup = "";
    var currentId = parseInt(this.topModal.find(".map-id").val());
    this.styles.forEach((item)=>{
      let isCurrentItem = (currentId === item.id);
      let isSelected = isCurrentItem ? " selected" : "";
      let isChecked = isCurrentItem ? " checked='checked'" : "";
      markup += `<div class='map-wrap${isSelected}'>
                            <h3>${item.name}</h3>
                            <img src='${item.imageUrl}'>
                            <input type='radio' name='map-type' value='${item.id}'${isChecked}>
                          </div>`;
    });
    this.stylesBlock.append(markup);
  }

  setContent(){
    var mapWrap = this.stylesBlock.find('.map-wrap');
    let selectedMapID = parseInt($('.map-wrap.selected').find('input:radio').val());

    mapWrap.on("click", (e)=>{
      let selectedMap = $(e.currentTarget);
      let selectedRadio = selectedMap.find('input:radio');
      selectedMapID = parseInt(selectedRadio.val());

      mapWrap.removeClass('selected');
      selectedMap.addClass('selected');
      selectedRadio.attr('checked', true);

      this.setStyles(selectedMapID);
    });
    this.setStyles(selectedMapID);
  }

  setStyles(selectedMapID) {
    this.styles.forEach((style)=>{
      if (style.id === selectedMapID) {
        this.currentStyle = style.json.replace(/'/g, '"');
        this.currentId = style.id;
      }
    });
    this.mapIdField.val(this.currentId);
    this.mapValuesField.val(JSON.stringify(this.currentStyle));
  }
}

new EditNeighborhoodMapWidget();
