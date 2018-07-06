class MultifamilyIuiHomeV2Widget {
  constructor(configs){
    Object.assign(this, { configs, widget: $(`#${configs.widgetId}`) });
    this.fetchInventory().done(inventory => {
      this.inventory = inventory;
      var { floorplan_groups: floorplanGroups } = inventory;
      this.createFloorplanGroupClickEvents(this.buildMarkup(floorplanGroups));
      this.listenForPhoneNumberService();
    });
  }

  fetchInventory() {
    var { configs: { floorplans_service_host, location_urn } } = this;
    return $.ajax({
      url: `${floorplans_service_host}/api/v1/apartment_complexes/${location_urn}/floorplans`,
      dataType: 'json'
    });
  }

  listenForPhoneNumberService() {
    var { configs: { widgetId, client_urn:clientUrn, location_urn:locationUrn, cpns_url:cpnsUrl } } = this;

    widgetId  = `#${widgetId}`;

    new PhoneNumber({ clientUrn, locationUrn, cpnsUrl }, widgetId);

    $(widgetId).on('phoneNumbersReady', () => {
      this.replacePhoneNumbers(widgetId);
    });
  }

  replacePhoneNumbers() {
    var { configs: { location_urn:locationUrn } } = this;
    var { g5PhoneList } = window;

    if (g5PhoneList && g5PhoneList.numbers[locationUrn].phone_number) {
      let ctn = g5PhoneList.numbers[locationUrn].phone_number;
      let phoneRegex = /\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/;

      ctn = ctn.replace(/\D/g,'');
      ctn = ctn.split('');
      ctn.splice(3, 0, '-');
      ctn.splice(7, 0, '-');
      ctn = ctn.join('');

      this.widget.find('[data-category].phone').each((i, e)=> {
        var $e = $(e), text = $e.text();

        if (text && ctn && text.match(phoneRegex)) {
          text = text.replace(phoneRegex, `<div style="white-space: nowrap;">${ctn}</div>`);
          $e.html(text);

          $e.attr('href', `tel:${ctn}`);
        }
      });
    }
  }

  buildMarkup(floorplanGroups) {
    var { configs: { floorplan_page_url:floorplanPageUrl }} = this;
    var markupArray = floorplanGroups.map(group => this.buttonTemplate(group));
    const allButton = `<div class='iui-size iui-view-all'>
                          <a class='btn' href='${floorplanPageUrl}/#/categories/all/floorplans'>
                          View All
                          </a>
                        </div>`;

    markupArray.push(allButton);
    return this.widget.addClass(`count-${floorplanGroups.length}`)
                .find('.iui-container')
                  .html(markupArray.join(''));
  }

  buttonTemplate(floorplanGroup) {
    var { configs: { floorplan_page_url:floorplanPageUrl } } = this;
    var { id, description, call_to_action_id: ctaId }        = floorplanGroup;
    var hasFloorplans                                        = this.hasFloorplans(floorplanGroup);
   return `<div class='iui-size ${ctaId ? 'has-cta' : ''} ${!hasFloorplans ? 'empty' : ''}'>
             <a class='btn btn-beds' ${ !ctaId ? `href='${floorplanPageUrl}/#/categories/${id}/floorplans'`: '' }>
               ${description}
             </a>
             ${ctaId ? this.ctaTemplate(ctaId, floorplanGroup, hasFloorplans) : ''}
           </div>`;
  }

  ctaTemplate(ctaId, floorplanGroup, hasFloorplans) {
    var cta = this.inventory.call_to_actions.filter(cta => cta.id === ctaId).pop();
    var { id, empty_group_label:emptyGroupLabel } = floorplanGroup;
    var { action_type: actionType, is_external: isExternal, url, name } = cta;
    return `<div class="dropdown-content">
                <span>${emptyGroupLabel}</span>
                <a data-category="${id}" ${(actionType == 'call' || isExternal) ? `href="${url}" class='phone'`: "class='form'"} ${isExternal ? `target="_blank"`: ''}>${name}</a>
              </div>`;
  }

  createFloorplanGroupClickEvents(markup) {
    let modal = new MultifamilyIuiHomeV2Modal(widget);

    markup.find('.has-cta').click(({ currentTarget, target }) => {
      if ($(target).hasClass('dropdown-content')) return;

      if ($(currentTarget).hasClass('active')) {
        $(currentTarget).removeClass('active');
      } else {
        this.widget.find('.has-cta').removeClass('active');
        $(currentTarget).addClass('active');
      }
    });

    markup.find('[data-category].form').click(({ currentTarget }) => {
      var { category: categoryId } = $(currentTarget).data();

      var { floorplan_groups:floorplanGroups,
            call_to_actions : ctas } = this.inventory;

      var floorplanGroup = floorplanGroups.filter(c => c.id === categoryId).pop();

      var cta = ctas.filter(cta => cta.id === floorplanGroup.call_to_action_id).pop();

      modal.open(cta);
    });

    $(window).click(({ target }) => $(target).parent().hasClass('iui-size') || $(target).hasClass('dropdown-content') ? null : markup.find('.has-cta').removeClass('active'));
  }

  hasFloorplans(floorplanGroup) {
    return !!this.inventory.floorplans.filter(fp => fp.floorplan_group_ids.includes(floorplanGroup.id)).length;
  }
}

class MultifamilyIuiHomeV2Modal {
  constructor(widget) {
    Object.assign(this, { widget });
  }

  open(cta) {
    this.displayModal();
    this.attachForm(cta);
  }

  close() {
    this.removeModal();
  }

  displayModal() {
    var modal = $(`<div id="mf-search-v2-modal-wrapper" class="modal">
                                    <div id="modal-content">
                                      <span id="close">&times;</span>
                                      <div class="mf-home-v2-form" id="form">
                                      </div>
                                    </div>
                                  </div>`);

    $('body').append(modal);

    this.modalEvents(modal);
  }

  removeModal() {
    $('#mf-search-v2-modal-wrapper').remove();
  }

  modalEvents(modal) {
    //modal should close when exit clicked, or outside of modal is clicked.
    modal.find('#close').click(() => this.close());
    $(window).click(({ target }) => target == modal[0] ? this.close() : null);
  }

  attachForm(cta) {
    var submissionOptions = this.buildSubmissionOptions(cta);

    if (G5Leads && G5Leads.g5FormEnhancer) {
      G5Leads.g5FormEnhancer(submissionOptions);
    } else {
      console.error(`Missing G5Leads JS to enhance form with CTA: ${cta}`);
    }
  }

  buildSubmissionOptions(cta) {
    var options = {
      formUrl: cta.url,
      enhanceClass: "mf-home-v2-form"
    };

    if (cta.redirect_url) {
      options.successRedirectUrl = cta.redirect_url;
    }

    return options;
  }
}

G5.loadWidgetConfigs('.home-multifamily-iui-v2 .config', MultifamilyIuiHomeV2Widget);
