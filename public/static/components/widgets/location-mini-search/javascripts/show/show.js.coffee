class LocationMiniSearchWidget
  constructor: (@configs)->
    @widget = $("##{@configs.widgetId}")
    @widgetElement  = @widget.find('.search-form')
    @searchInput = @widget.find('.search-input')
    @searchSubmit = @widget.find('.loc-search-btn')
    @stateSelect = @widget.find('.search-states')
    @citySelect = @widget.find('.search-cities')
    @neighborhoodSelect = @widget.find('.search-neighborhoods')
    @brandedName = ""
    @cityName = ""
    @neighborhoodName = ""
    @postalCode = ""
    @stateName = ""
    @wildcard = ""
    @FULL_WIDTH = 800
    @SMALL_WIDTH = 400
    
    @setupSearchStandard() if @configs.universalSearch == "false"
    @setupSearchTypeahead() if @configs.universalSearch == "true"
    @initResize()

  setupSearchStandard: ->
    @apiRequest()
    @selectChange()
    @linkHref()
    
  setupSearchTypeahead: ->
    @apiRequest() 
    @typeAheadSelect()
    @typeAheadSelected()
    @typeaheadCursorChangeVal()
    @typedComplete()
    @changeToWildcard()
    @inputWildcard()
    @keyUp()
    @clearInput()
    @linkHref()

  # Element Width query/size/apply-class
  initResize: ->
    $(window).on 'resize orientationchange', =>
      @resize()
    @resize()

  resize: ->
    parentContainer = @widgetElement.parent('.widget')
    parentWidth = parentContainer.width()
    if parentWidth >= @FULL_WIDTH
      @setSizeClass('xlarge')
    else if parentWidth >= @SMALL_WIDTH
      @setSizeClass('small narrow')
    else if parentWidth < @SMALL_WIDTH
      @setSizeClass('narrow')

  setSizeClass: (size)->
    if !@widgetElement.hasClass(size)
      @clearSizeClasses()
      @widgetElement.addClass(size)

  clearSizeClasses: ->
    @widgetElement.removeClass('narrow').removeClass('small').removeClass('xlarge')

  # Shared Functions
  apiRequest: ->
    build_api_url = @configs.clientURN.replace(/\s+/g, '')
    pending_location_param = if @configs.includePending is "true" then """&include_pending=true""" else ""
    $.ajax
      url: "#{@configs.serviceURL}/api/v3/client_search_data?client_urns=#{build_api_url}#{pending_location_param}"
      dataType: 'json'
      success: (data) =>
        @typeAheadBuilder(data) if data != null && @configs.universalSearch == "true"
        @corpSearchMarkupBuilder(data) if @configs.universalSearch == "false"
      error: () =>
        @widget.replaceWith("We are experiencing difficulty with our server to display this Search function, please refresh or check back later.  Thank you.")

  linkHref: ->
    paramBuilder = []
    # ember alphabatizes params, leave params in abc order.
    if @brandedName then paramBuilder.push("brandedName=#{@brandedName}")
    if @cityName then paramBuilder.push("city=#{@cityName}") else ''
    if @neighborhoodName then paramBuilder.push("neighborhoods=#{@neighborhoodName}") else ''
    paramBuilder.push("page=1")
    if @postalCode then paramBuilder.push("postalCode=#{@postalCode}")
    if @stateName then paramBuilder.push("state=#{@stateName}") else ''
    if @stateName == '' then paramBuilder.push("wildcard=#{@wildcard}")

    params = '?' + paramBuilder.join("&").replace(/\+/g, "%2B")
    @searchSubmit.attr('href', "#{@configs.corpSearchPage}/#/locations#{params}")

  # @setupSearchStandard functions
  # Define city/state selects and set up listener for when state changes
  corpSearchMarkupBuilder: (data) ->
    @optionsBuilder(data.states, @stateSelect)
    @stateSelect.change => 
      @citySelectUpdater(data, @stateSelect, @citySelect)
    @citySelect.change =>
      @neighborhoodSelectUpdater(data, @citySelect, @neighborhoodSelect)

  # Listening for a state change to repopulate the city dropdown
  citySelectUpdater: (data, stateSelect, citySelect) ->
    # reset the values in the city select
    citySelect.html("<option value=''>City</option>")
    # get the currently selected state
    selectedState = stateSelect.val()
    # build an array of currently relevant cities
    relevantCities = data.cities.filter((city) -> city.state_id == parseInt(selectedState,10))
    # update the select options
    @optionsBuilder(relevantCities, citySelect)

  neighborhoodSelectUpdater: (data, citySelect, neighborhoodSelect) ->
    # reset the values in the city select
    neighborhoodSelect.html("<option value=''>Neighborhood</option>")
    # get the currently selected state
    selectedCity = citySelect.val()
    # build an array of currently relevant cities
    relevantHoods = data.neighborhoods.filter((neighborhood) -> neighborhood.city_id == parseInt(selectedCity,10))
    # update the select options
    @optionsBuilder(relevantHoods, neighborhoodSelect)

  # Pass a select element and a list of options to fill it in with 
  optionsBuilder: (options, element) ->
    markupHash = []
    for option, index in options
      if element.text().trim() == "State"
        markupHash.push("<option value='#{option.id}'>#{option.name_abbr}</option>")
      else
        markupHash.push("<option value='#{option.id}'>#{option.name}</option>")
    element.append(markupHash.join(''))

  selectChange: () ->
    @stateSelect.change (e)=>
      selectedState = $(e.currentTarget).find("option:selected").html()
      @stateName = if selectedState == 'State' then '' else selectedState
      @cityName = ''
      @linkHref()
    @citySelect.change (e)=>
      selectedCity = $(e.currentTarget).find("option:selected").html()
      @cityName = if selectedCity == 'City' then '' else selectedCity
      @linkHref()
    @neighborhoodSelect.change (e)=>
      selectedNeighborhood = $(e.currentTarget).find("option:selected").html()
      @neighborhoodName = if selectedNeighborhood == 'Neighborhood' then '' else selectedNeighborhood
      @linkHref()

  # @setupSearchTypeahead functions
  typeAheadBuilder: (json_result) ->
    typeaheadData = []
    for brandedName in json_result.branded_names
      branded_name = brandedName.name
      typeaheadData.push({loc: branded_name, branded_name: branded_name})
    for state in json_result.states
      loc = state.name
      state_name = state.name
      typeaheadData.push({loc: loc, state: state_name})
      for cityId in state.cities
        cityById = json_result.cities.filter (obj) ->
          return obj.id == cityId;
        city = cityById[0].name
        state_name = state.name
        city_loc = "#{city}, #{state_name}"
        typeaheadData.push({city: city, state: state_name, loc: city_loc})
    for postalCode in json_result.postal_codes
      postal_code = postalCode.postal_code
      typeaheadData.push({loc: postal_code, postal_code: postal_code})

    @initializeTypeahead(typeaheadData)

  initializeTypeahead: (searchData) ->
    options = 
      autoselect: true
      minLength: 1
      highlight: true
    data = 
      name: 'locations'
      source: (q, sync) ->
        if q == '' then sync(locations.local) else locations.search(q, sync)
      display: 'loc'
      limit: 100
    locations = new Bloodhound(
      local: searchData
      identify: (obj) ->
        obj.loc
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('loc')
      queryTokenizer: Bloodhound.tokenizers.whitespace)

    @dataLocations = locations
    @searchInput.typeahead(options, data)

  emptyParams: ->
    @brandedName  = ""
    @cityName     = ""
    @postalCode   = ""
    @stateName    = ""

  typeAheadSelect: ->
    @searchInput.on 'typeahead:select typeahead:autocompleted', (e) => 
      obj = @dataLocations.index.datums[e.currentTarget.value]
      @brandedName  = obj.branded_name
      @cityName     = obj.city
      @postalCode   = obj.postal_code
      @stateName    = obj.state
      @linkHref()

  typeAheadSelected: ->
    @searchInput.on 'typeahead:selected typeahead:autocompleted', (e) =>
      selectedLocation = $(e.currentTarget).typeahead('val')
      # send to parent
      @typeaheadCurrentVal = e.target.value
      @linkHref()
      @searchInput.typeahead('close')

  typeaheadCursorChangeVal: ->
    @searchInput.on 'typeahead:cursorchange', (e) =>
      @typeaheadCurrentVal = e.target.value

  #this is when a user types the whole state & clicks out, we need a way to fire the typeahead event to select it.
  typedComplete: () ->
    @searchInput.bind 'typeahead:close', (e) =>
      dropdownMenu = @searchInput.siblings('.tt-menu')
      suggestions = dropdownMenu.find('.tt-suggestion')
      currentVal = @searchInput.typeahead('val')

      if (suggestions.first()[0] != undefined) && (currentVal.toLowerCase() is suggestions.first()[0].innerText.toLowerCase())
        suggestions.first().click()

  # backspace from a completed suggestion, turn it into a wildcard
  changeToWildcard: ->
    @searchInput.on 'typeahead:change', (e) =>
      dropdownMenu = @searchInput.siblings('.tt-menu')
      suggestions = dropdownMenu.find('.tt-suggestion')
      firstSuggesstion = suggestions.first()[0]
      currentVal = @searchInput.typeahead('val');
      
      if firstSuggesstion is undefined && currentVal.length >= 1 or firstSuggesstion.innerText != undefined && currentVal != firstSuggesstion.innerText 
        @emptyParams()
        @wildcard = currentVal
        @linkHref()

  inputWildcard: ->
    @searchInput.on 'keyup', (e) =>
      @wildcard = @widget.find( ".search-input.tt-input" ).val()
      @linkHref()

  keyUp: ->
    @searchInput.on 'keyup', (e) =>
      dropdownMenu = @searchInput.siblings('.tt-menu')
      suggestions = dropdownMenu.find('.tt-suggestion')
      currentVal = @searchInput.typeahead('val');
      # 8 = backspace
      # 9 = tab
      # 13 = enter
      # 27 = escape

      # backspace from a completed suggestion, turn it into a wildcard
      if (e.which == 8 && currentVal.length && suggestions.first()[0] is undefined)
        @emptyParams()
        @wildcard = currentVal
        @linkHref()

      # Backspace & length 0
      if e.which is 8 && currentVal.length is 0 
        @blankOutInput()
  
      # Tab or Enter
      if e.which is 9 or e.which is 13
        if @typeaheadCurrentVal
          @searchInput.typeahead('val')
          # @typeaheadCurrentVal = false
        else
          suggestions.first().click() #choose first option since @typeaheadCurrentVal hasn't been set yet

      # Escape key
      if e.which is 27
        @blankOutInput()  

  blankOutInput: ->
    @typeaheadCurrentVal = undefined
    @emptyParams()
    @wildcard = ""
    @searchInput.blur();
    @searchInput.typeahead('val', '');
    @linkHref()

  clearInput: ->
    @widget.find(".input-clear").on 'click', =>
      @blankOutInput()

G5.loadWidgetConfigs('.location-mini-search .config', LocationMiniSearchWidget)
