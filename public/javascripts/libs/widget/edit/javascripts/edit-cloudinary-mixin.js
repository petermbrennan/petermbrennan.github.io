class CloudinaryImageMixin {
  constructor(selectors, uploadSuccessfulCallback) {
    this.selectors = selectors;
    this.options = {
      thumbnailWidth: 100,
    };
    this.options.hasMaxWidthMaxHeight = selectors.hasMaxWidthMaxHeight;
    this.onSuccessCallback = uploadSuccessfulCallback;
    this.setupAddingImages();
    this.renderThumbs();
    this.hideShowRadio();
  }

  setupAddingImages() {
    $('.cloudinary-asset-btn').bind('click', (e)=>{
      this.definePreviousValues();
      let {previousValues} = $('.cloudinary-asset-btn').data();
      $(window).trigger('add-assets-button-clicked', [e, previousValues]);
    });
    $(window).on('dragDrop', ()=>{this.renderThumbs();});

    $(window).on('assetSelected', (_, assets, inputSelector, width, height, croppingType, previousWidgetSettings) => {
      this.setInputValues(previousWidgetSettings);
      if (assets && assets.length) {
        let tabHref = `#${$(this.selectors.primary).closest(`.tab-content`).attr('id')}`; // change to the tab the user previously had open
        $(`a[href="${tabHref}"]`).click();
        setTimeout(()=>{
          var assetURLs = assets.map( a => this.createAssetURLs(a));
          if (inputSelector === 'bulk') {
            this.addBulkAssets(assetURLs);
          } else {
            this.addSingleAsset(assetURLs[0], inputSelector);
          }
          $(this.selectors.primary).change();
          this.renderThumbs();
        }, 100);
      }
    });
  }
  addBulkAssets(urls) {
    var selector = this.selectors.primary,
        thumbnailURLs = urls.map(url => this.getThumbnailURLs(url)),
        blankInputs = $(selector).filter(function() { return !$(this).val() });

    $(selector).each(function(i, e) {
      let urlAlreadyInInput = $(e).val();
      if (urls.includes(urlAlreadyInInput)) {
        urls.splice(urls.indexOf(urlAlreadyInInput), 1);
      }
    });

    if (blankInputs.length) {
      for (var i = 0; i < urls.length; i++) {
        $(blankInputs[i]).val(urls[i]);
      }
      $(window).trigger('imagesAddedToInputs');
      this.renderThumbs();
    }

    $(this.selectors.primary).each((i, e) => {
      let input = $(e),
          url = input.val(),
          thumbURL = this.getThumbnailURLs(url);
    });
  }
  addSingleAsset(url, inputSelector, openCropper=!url.includes('c_crop')) {
    if (inputSelector && $(inputSelector).length && $(this.selectors.primary).closest('fieldset').find(inputSelector).length) {
      $(inputSelector).val(url);
      $(window).trigger('imagesAddedToInputs');

      if (this.croppingType() !== 'none' && openCropper) {
        setTimeout(() => { //wait for css to load..
          if (!url.includes('.pdf')) {
            $(inputSelector).closest("fieldset").find('.fa-crop').click();
          }
        }, 1000);
      }
    }
  }
  createAssetURLs(asset) {
    var url = asset.secureUrl,
        [w, h] = this.getMaxWidthMaxHeight(),
        hasCoords = Boolean(asset.customCoordinates && asset.customCoordinates.length),
        croppingType = this.croppingType();

    if (croppingType === 'fixed') {
      url = url.replace('upload/', `upload/q_auto,f_auto,c_fill,g_center,h_${h},w_${w}/`);
    } else if (!hasCoords && croppingType !== 'fixed') {
      url = url.replace('upload/', `upload/q_auto,f_auto,c_fill,g_center,h_${asset.height},w_${asset.width}/`);
    }

    if (hasCoords) {
      let [x, y, w, h] = asset.customCoordinates;
      url = url.replace('upload/', `upload/x_${x},y_${y},h_${h},w_${w},c_crop/`);
    }

    if (url.includes(".pdf")) {
      url = `${this.cloudinaryURL}g5/${url.split('/g5/')[1]}`;
    }

    return url;
  }
  renderThumbs(inputID) {
    var renderThumb = (i, e) => {
      var parentContainer;
      if (!inputID) {
        parentContainer = $(e).closest('fieldset');
      } else  {
        parentContainer = $(inputID).closest('fieldset');
      }
      let inputVal = inputID ? $(inputID).val() : parentContainer.find(this.selectors.primary).val();
      var placeholderURL = "http://placehold.it/100x100",
          thumbURL = inputVal || placeholderURL;


      let cropper = `<div class="fa fa-crop" aria-hidden="true"></div>`;
      if (!parentContainer.find('.img-thumbnail-preview').length) {
        parentContainer.prepend(`<div data-index='${i}' class='img-thumbnail-preview'>${cropper} <img src=${thumbURL} class='image-thumb' /></div>`);
      }

      if (thumbURL.includes(".pdf")) {
        thumbURL = `${this.cloudinaryURL}/f_auto/g5/${thumbURL.split('/g5/')[1]}`;
      }

      parentContainer.find('.img-thumbnail-preview img').attr('src', thumbURL);
    };
    $(inputID).each(renderThumb);
    $(this.selectors.primary).each(renderThumb);
  }
  calculateAspectRatio(){
    let [w, h] = this.getMaxWidthMaxHeight();
    return w / h;
  }
  croppingType() {
    return this.selectors.defaultCroppingType || $(this.selectors.croppingStyleSelector).val() || $('.form-field-cropping-style input:checked').val();
  }
  calculateCroppingAspectRatio() {
    let aspectRatio  = this.calculateAspectRatio(),
        croppingType = this.croppingType();

    if (croppingType === 'fixed') {
      return aspectRatio;
    }
    return Infinity/Infinity;
  }
  getMaxWidthMaxHeight() {
    if (this.options.hasMaxWidthMaxHeight) {
      return [ parseInt($(this.selectors.maxWidth).val()), parseInt($(this.selectors.maxHeight).val()) ];
    }
    return [Infinity, Infinity];
  }
  getThumbnailURLs(imageURL) {
    let options = this.options;
    let [maxWidth, maxHeight] = this.getMaxWidthMaxHeight();
    let thumnailHeight = Math.round(options.thumbnailWidth/this.calculateAspectRatio());
    return imageURL.replace(`h_${maxHeight},w_${maxWidth}`,`h_${thumnailHeight},w_${options.thumbnailWidth}`);
  }
  definePreviousValues(){
    var currentWidgetSettings = { croppingTypes: {}, URLs: {}, radios: {}, checkedBoxes: {},notCheckedBoxes: {}, texts: {}, numbers: {}, maxWidths:{}, maxHeights:{} };
    var isGalleryWidget = Boolean($('.cloudinary-bulk-asset').length);
    var getIDtoVal = (elem) => {
      var IDtoVal = {};
      if (elem) {
        var id   = `#${elem.attr('id')}`;
        var val = elem.val();
        IDtoVal[id] = val;
      }
      return IDtoVal;
    }

    $('fieldset').each((_, e)=>{
      function tempSaveSetting(setting, type) {
        let IDtoVal = getIDtoVal(setting);
        Object.assign(currentWidgetSettings[type], IDtoVal);
      }

      let fieldset = $(e);
      var textInputs = fieldset.find('input:text').map((_, e)=>{return $(e)});
      var radioInputs = fieldset.find('input:radio:checked').map((_, e)=>{return $(e)});
      var numberInputs = fieldset.find('input[type="number"]').map((_, e)=>{return $(e)});

      var checkedBoxes = fieldset.find('input[type="checkbox"]:checked').map((_, e)=>{return $(e)});
      var notCheckedBoxes = fieldset.find('input[type="checkbox"]:not(:checked)').map((_, e)=>{return $(e)});

      textInputs.each((i, e)      => {tempSaveSetting($(e), 'texts')});
      radioInputs.each((i, e)     => {tempSaveSetting($(e), 'radios')});
      checkedBoxes.each((i, e)    => {tempSaveSetting($(e), 'checkedBoxes')});
      numberInputs.each((i, e)    => {tempSaveSetting($(e), 'numbers')});
      notCheckedBoxes.each((i, e) => {tempSaveSetting($(e), 'notCheckedBoxes')});
    });

    $('.cloudinary-asset-btn').each((_, e)=>{
      var { croppingTypes, maxWidths, maxHeights, URLs } = currentWidgetSettings;
      let assetBtn                  = $(e);
      let fieldset                  = assetBtn.closest('fieldset');
      let [widthInput, heightInput] = fieldset.find('input[type="number"]').map((_, e) => {return $(e)});

      let urlInput                  = fieldset.find('.edit-image-url-field input:text');
      let croppingType              = fieldset.find('input:radio:checked');

      if (croppingType) {
        assetBtn.data('croppingType', croppingType.val());
      }
      currentWidgetSettings.URLs = Object.assign(URLs, getIDtoVal(urlInput));

      if (!isGalleryWidget) {
        currentWidgetSettings.maxWidths     = Object.assign(maxWidths,      getIDtoVal(widthInput));
        currentWidgetSettings.maxHeights    = Object.assign(maxHeights,     getIDtoVal(heightInput));
        if (widthInput && heightInput) {
          assetBtn.data('maxWidth',     widthInput.val());
          assetBtn.data('maxHeight', heightInput.val());
        }
      } else {
        let [w, h] = this.getMaxWidthMaxHeight();
        assetBtn.data('maxWidth', w);
        assetBtn.data('maxHeight', h);
        if (this.selectors.maxWidth && this.selectors.maxHeight) {
          currentWidgetSettings.maxWidths[this.selectors.maxWidth] = w;
          currentWidgetSettings.maxHeights[this.selectors.maxHeight] = h;
        }
      }
    });

    this.setPreviousValues(currentWidgetSettings);
  }
  hideShowRadio() {
    $(this.selectors.primary).closest('fieldset').find('input:radio').change(()=>{
      if (this.croppingType()=='fixed') {
        $(this.selectors.primary).closest('fieldset').find('.max-width-max-height').show();
      }else {
        $(this.selectors.primary).closest('fieldset').find('.max-width-max-height').hide();
      }
    });
    $(this.selectors.primary).closest('fieldset').find('input:radio').change();
  }
  setPreviousValues(previousValues) {
    $('.cloudinary-asset-btn').data('previousValues', previousValues);
    $('.cloudinary-bulk-asset').data('previousValues', previousValues);
  }

  updateCheckbox(id, shouldBeChecked) {
    var checkedBoxes = $('input[type="checkbox"]:checked').map((_, e)=>{return `#${$(e).attr('id')}`});
    var notCheckedBoxes = $('input[type="checkbox"]:not(:checked)').map((_, e)=>{return `#${$(e).attr('id')}`});
    if (shouldBeChecked && [...notCheckedBoxes].includes(id)) {
      setTimeout(()=>{$(id).click();}, 2000);
    } else if (!shouldBeChecked && [...checkedBoxes].includes(id)) {
      setTimeout(()=>{$(id).click();}, 2000);
    }
  }

  updatePreviousValue(settingType, id, value) {
    switch (settingType) {
      case 'checkedBoxes':
        this.updateCheckbox(id, true);
        break;
      case 'notCheckedBoxes':
        this.updateCheckbox(id, false);
        break;
      case 'croppingTypes':
      case 'radios':
        setTimeout(()=>{$(id).click();}, 100);
        break;
      case 'URLs':
        this.renderThumbs(id);
      case 'maxHeights':
      case 'maxWidths':
      case 'texts':
      case 'numbers':
        $(id).val(value);
        break;
    }
  }

  setInputValues(previousValues) {
    for (var settingType in previousValues) { // n^2 I know..
      if (previousValues.hasOwnProperty(settingType)) {
        for (var inputSelector in previousValues[settingType]) {
          if (previousValues[settingType].hasOwnProperty(inputSelector)) {
            this.updatePreviousValue(settingType, inputSelector, previousValues[settingType][inputSelector]);
          }
        }
      }
    }
    this.renderThumbs();
  }
}

class G5ImageEditor extends CloudinaryImageMixin {
  constructor(options, onSuccessCallback) {

    super(options, onSuccessCallback);

    Object.assign(this, options);
    this.setUpImageEditor();
    this.cloudinaryURL = super.cloudinaryURL = "https://res.cloudinary.com/g5-assets-cld/image/upload/";
  }

  setUpImageEditor() {

    $('.fa-crop').on('click', (e)=>{
      if ($('#image-edit-preview-src').length) return;
      var closestFieldSet = $(e.currentTarget).closest('fieldset');
      this.closestFieldSet = closestFieldSet;

      let imgURL = closestFieldSet.find(this.primary).val();

      if (this.hasErrors(imgURL)) return;

      $('.modal-fullscreen').hide();
      this.loadImageToEdit(imgURL);
    });

    $('.cloudinary-remove-btn').click((e) => {
      var closestFieldSet = $(e.currentTarget).closest('fieldset');
      closestFieldSet.find(this.primary).val('');
      this.renderThumbs();
      this.onSuccessCallback();
    });

    this.setupRefreshOnTyping();
  }

  setupRefreshOnTyping() {
    var typingTimer,
        $input = $(this.selectors.primary);

    var inputChange = () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        if ($('#image-edit-preview-src').length) {
          $('.cancel-btn').click();
        } else {
          this.renderThumbs();
          super.setInputValues();
        }
      }, 1000);
    }

    $input.on('keyup', inputChange);
    $input.on('keydown', () => {
      clearTimeout(typingTimer);
    });
    $input.change(inputChange);

    $(window).on('dragDrop', inputChange);

  }

  loadImageToEdit(imgURL){
    this.previousImage = imgURL;

    this.originalImage = imgURL.slice(imgURL.indexOf('/g5/'), imgURL.length);
    var reader = new FileReader(),
        closestFieldSet = this.closestFieldSet;

    this.removeFieldsetAddCropHTML(closestFieldSet);
    this.canvas = this.createJcropCanvas(reader, closestFieldSet);

    let cloudinaryImage = this.cloudinaryURL + this.originalImage;

    // make a request for the regular sized image, comes from browser cache
    this.loadImage(cloudinaryImage).then(request => reader.readAsDataURL(request.response))
                                    .catch(error => console.error('There was an error loading your image.', error));
  }

  loadImage(cloudinaryImage) {
    var request = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      request.open('GET', cloudinaryImage, true);
      request.responseType = 'blob';

      request.onload = function() {
        try {
          if (this.status === 200) resolve(request);
        } catch (e) {
          reject(e);
        }
      };
      request.send();
    });
  }

  hasErrors(imgURL) {
    if (!imgURL.includes("cloudinary")) {
      alert('You must upload an image to Cloudinary before you can edit.'); return true;
    }
    if (!$('.fullscreen').length) {
      alert('Please expand the modal to edit an image.'); return true;
    }
    if (this.croppingType() === 'none') {
      return true;
    }
    if (this.croppingType() == 'fixed' && isNaN(this.calculateCroppingAspectRatio())) {
      alert("Fixed cropping requires width and height values. Please set width and height, or choose a different cropping mode."); return true;
    }

    return false;
  }

  removeFieldsetAddCropHTML(closestFieldSet) {
    closestFieldSet.children().hide(); // replace the closest fieldset html with jcrop html
    closestFieldSet.prepend(`<div class="image-edit-preview">
                               <h5 class="loading-cloudinary-image">loading..</h5>
                               <div class="source">
                                <div id="image-edit-preview-src"></div>
                               </div>
                               <div style=${this.croppingType() != 'fixed' ? "display:none;":"display:block;"} class="static-coords-card-panel card-panel">
                               <h4 style='margin:auto!important' class='static-cloudinary-coords'></h4>
                               <p class='go-back-text' >To change these dimensions, select cancel to go back to the edit modal</p>
                               </div>
                                <div class='edit-btns'>
                                 <a class="cancel-btn waves-effect btn red enabled"> Cancel</a>
                                 <a class="save-btn disabled waves-effect btn blue"> Save</a>
                               </div>
                             </div>`);

  }

  createJcropCanvas(reader, closestFieldSet) {
    var image  = new Image(),
        canvas = document.createElement('canvas');

    reader.onload = (event) => {
      image.onload = () => {
        $('.loading-cloudinary-image').text('');
        $('.edit-btns').css({'display':'inline'});
        this.setupButtonListeners(closestFieldSet);
        canvas.height = image.height;
        canvas.width  = image.width;
        var ctx = canvas.getContext('2d');
        // this is the canvas that overlays the image, it's actually blank and what we draw the cropping tool on.
        ctx.drawImage( image, 0, 0, canvas.width, canvas.height );
        // since we're drawing our own image not drawing shapes we set the div just below the canvas to be an image that we trace over.
        $('#image-edit-preview-src').html(`<img src="${canvas.toDataURL()}"/>`);
        // take care of some `this` binding issues, with instantiating Jcrop
        var onChange = cords => this.onChange(cords);
        // initialize jcrop with options

        $('#image-edit-preview-src img').Jcrop({
          boxWidth: 700,
          boxHeight: 400,
          bgColor: 'black',
          bgOpacity: .5,
          aspectRatio: this.calculateCroppingAspectRatio(),
          onChange
        });
        if (this.croppingType() == 'fixed') {
          let [width,height] = this.getMaxWidthMaxHeight();
          $('.static-cloudinary-coords').text(`Dimensions: ${width} x ${height}`);
        }
      }
      image.src = event.target.result;
    }
    return canvas;
  }

  onChange({h, w, x, x2, y, y2}) {

    $('.save-btn').removeClass('disabled').addClass('enabled');

    [h, w, x, x2, y, y2] = [h, w, x, x2, y, y2].map(Math.round);
    if (this.croppingType() == 'free') {
      $('.jcrop-tracker').first().html(`<div class='jcrop-coordinates'>${w} x ${h}</div>`);
    }
    let newImageURL = this.cloudinaryURL;
    // build image url
    newImageURL += `x_${x},y_${y},h_${h},w_${w},c_crop/q_auto,f_auto,fl_lossy,c_fill,g_center,h_${h},w_${w}${this.originalImage}`;
    this.canvas.getContext('2d').drawImage($('#image-edit-preview-src img')[0], x, y, w, h, 0, 0, this.canvas.width, this.canvas.height);
    this.newImageURL = newImageURL;
  }

  replacefinalWidthHeight(newImageURL) {
    let [w, h] = this.getMaxWidthMaxHeight();

    if (newImageURL.includes(',c_fill')) {
      newImageURL = newImageURL.replace(',c_fill', '');
    }

    var split = newImageURL.split('q_auto');
    var hreplace = split[1].replace(/h_\d*/, `h_${h}`);
    var wreplace = hreplace.replace(/w_\d*/, `w_${w}`);

    split[1] = wreplace;

    return split.join('q_auto');
  }

  setupButtonListeners(closestFieldSet) {
    var closeImage = () => {
      $('.image-edit-preview').empty();
      $('.image-edit-preview').remove();
      $('.modal-fullscreen').show();
      closestFieldSet.children().show();
      this.previousImage = undefined;
      this.renderThumbs();
    }

    $('.cancel-btn').click(closeImage);

    $('.save-btn').click(() => {
      if (this.newImageURL && this.newImageURL !== this.cloudinaryURL) {
        if (this.croppingType() == 'fixed') {
          this.newImageURL = this.replacefinalWidthHeight(this.newImageURL);
        }
        closestFieldSet.find(this.primary).val(this.newImageURL);
        this.onSuccessCallback();
      }
      closeImage();
    });
  }

}
