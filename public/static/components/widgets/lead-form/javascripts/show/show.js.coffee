class LeadFormWidget
  constructor: (@configs) ->
    if @configs?
      @widget = $("##{@configs.widgetId}")
      @userSelectOptions = @configs.user_select_forms
      @clsUrl = @configs.secure_cls_url
      @locationUrn = @configs.location_urn
      @submitHackUrn = @configs.hack_urn
      @form = @widget.find('form')
      @formSelectDropdown = @widget.find(".user-form-options")
      @leadSlugForLocSelect = @configs.form_to_append_location_select
      @locationDropdown = @widget.find('.location-select')
      @runLocSelectOnce = false #allow location select to be appended once to a form, no matter how many forms are on page.

      @userSelect()
      @triggerEnhancer()
      @hideLocationSelect()
      @appendLocationDropdown()

  userSelect: ->
    if @userSelectOptions
      select = """<div class="user-form-select" style="margin-bottom:15px;">
                    <h4>Please select the type of form you would like to submit</h4>
                    <select class="user-form-options"></select>
                  </div>"""

      @widget.prepend(select)
      $.each @userSelectOptions, (i, val) =>
        formUrl = """#{@clsUrl}/api/v1/locations/#{@locationUrn}/html_forms/#{i}""" 
        optionMarkup = """<option value="#{formUrl}">#{val}</option>"""

        @widget.find('.user-form-options').append optionMarkup

  triggerEnhancer: ->
    that = @
    @widget.find(".user-form-options").change ->
      chosenFormUrl = $(this).attr("value")
      that.runLocSelectOnce = false
      # Plug into g5FormEnhancer and get it to fire when the select is changed.
      window.G5Leads.g5FormEnhancer({formUrl: chosenFormUrl, enhanceClass: "#{that.configs.widgetId}.lead-form .g5-enhanced-form"})

  triggerUrnSwap: ->
    if @submitHackUrn == "true" 
      @widget.find('.g5-enhanced-form .location-list-urn option:selected').prop("selected", false); #reset prior selections
      @widget.find('.g5-enhanced-form .location-list-urn option:first').attr('selected','selected'); #reset to first empty option
      hiddenLocSelectInput = $("input[type='hidden'][name='location-list-select']")
      @widget.find('.location-list-urn').change ->
        selectedLocationUrn = $(this).attr("value")
        hiddenLocSelectInput.remove()
        loadedForm = $(this).parent().parent()
        formActionURL = loadedForm.attr('action')
        newActionUrl = formActionURL.split("/")
        newActionUrl.splice(6, 1, selectedLocationUrn) #Find loc URN in form actions and swap it with chosen loc urn
        loadedForm.attr('action', newActionUrl.join('/'))

  hideLocationSelect: ->
    $(window).on 'G5FormResponseComplete', =>
      @widget.find('.location-select').hide()
      @widget.find('.user-form-select').hide()

  appendLocationDropdown: -> 
    if @leadSlugForLocSelect != ""
      $(window).on 'G5FormRendered', =>
        hasProperFormLoaded = @widget.find(".g5-enhanced-form .#{@leadSlugForLocSelect}") #does the dom have the correct form to append this select?
        if hasProperFormLoaded.length and !@runLocSelectOnce   
          leadForm = @widget.find(".#{@leadSlugForLocSelect} div:first")
          @locationDropdown.clone().insertBefore(leadForm).fadeIn()
          @triggerUrnSwap()
          @runLocSelectOnce = true #needed so this only appends loc select markup once, as a subsequent loading form could trigger this function again, depending on how many form are on a page.

G5.loadWidgetConfigs(".lead-configs", LeadFormWidget)