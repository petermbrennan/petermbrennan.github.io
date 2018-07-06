class sssHomeWidget
  constructor: (@configs) ->
    if @configs.destinationPageTest isnt null
      @widget = $("##{@configs.widgetId}")
      @sssSelect = @widget.find('.sss-search-storage-categories-select')
      @sssInput = @widget.find('.sss-search-input')
      @sssSubmit = @widget.find('.sss-search-btn')
      @category = ""
      @stateName = ""
      @cityName = ""
      @wildcard = ""
      @setupWidget()

  setupWidget: ->
    @api_request()
    @linkHref()
    @selectChange()
    @typeAheadChange()
    @clearInput()
    @keyUp()
    @setEvents()
    @setTypeaheadEvents()
    @typedComplete()
    @fieldValue()

    new PseudoMediaQuery(@widget)

  api_request: ->
    build_api_url = @configs.clientUrn.replace(/\s+/g, '')
    pending_location_param = if @configs.includePending is "true" then """&include_pending=true""" else ""
    $.ajax
      url: "#{@configs.apiHost}/api/v3/client_search_data?client_urns=#{build_api_url}#{pending_location_param}"
      dataType: 'json'
      success: (data) =>
        @typeAheadBuilder(data) if data != null
        @buildCategories(data) if data != null

  buildCategories: (json_result) ->
    for category in json_result.categories
      @sssSelect.append($("<option>").attr('value', category.name).text(category.name))
    @sssSelect

  typeAheadBuilder: (json_result) ->
    typeaheadData = []
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
    for postal_code in json_result.postal_codes
      typeaheadData.push({loc: postal_code.postal_code})
    for branded_name in json_result.branded_names
      typeaheadData.push({loc: branded_name.name})
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
    @sssInput.typeahead(options, data)

  typeAheadChange: ->
    @sssInput.on 'typeahead:select', (e) =>
      obj = @dataLocations.index.datums[e.currentTarget.value]
      @stateName = obj.state
      @cityName = obj.city
      @wildcard = obj.loc
      @linkHref()

  selectChange: () ->
    @sssSelect.change (e)=>
      newSelectCat = $(e.currentTarget).find("option:selected").attr('value')
      @category = newSelectCat
      @linkHref()

  fieldValue: () ->
    @sssInput.on 'keyup', (e) =>
      @wildcard = @widget.find( ".sss-search-input.typeahead.tt-input" ).val()
      @linkHref()

  linkHref: () ->
    paramBuilder = []
    if @category then paramBuilder.push("category=#{encodeURIComponent(@category)}") else ''
    paramBuilder.push("page=1")
    if @cityName && @stateName then paramBuilder.push("wildcard=#{@cityName}, #{@stateName}") else ''
    if @stateName && !@cityName then paramBuilder.push("state=#{@stateName}") else ''
    if !@stateName then paramBuilder.push("wildcard=#{@wildcard}")
    params = '?' + paramBuilder.join("&").replace(/\+/g, "%2B")
    @widget.find('.sss-search-btn').attr('href', "#{@configs.destinationPage}#/locations#{params}")

  blankOutInput: () ->
    @stateName = ""
    @cityName = ""
    @wildcard = ""
    @sssInput.blur();
    @sssInput.typeahead('val', '');
    @linkHref()

  clearInput: () ->
    @widget.find(".input-clear").on 'click', =>
      @blankOutInput()

  setEvents: () ->
    @sssInput.on 'typeahead:selected typeahead:autocompleted', (e) =>
      selectedLocation = $(e.currentTarget).typeahead('val')
      # send to parent
      @typeaheadCurrentVal = e.target.value
      @linkHref()
      @sssInput.typeahead('close')
      @sssSubmit.focus()

  setTypeaheadEvents: () ->
    @sssInput.bind 'typeahead:cursorchange', (e) =>
      @typeaheadCurrentVal = e.target.value

  #this is when a user types the whole state & clicks out, we need a way to fire the typeahead event to select it.
  typedComplete: () ->
    @sssInput.bind 'typeahead:close', (e) =>
      unless @typeaheadCurrentVal?
        dropdownMenu = @sssInput.siblings('.tt-menu')
        suggestions = dropdownMenu.find('.tt-suggestion')
        suggestions.first().click()

  keyUp: () ->
    @sssInput.on 'keyup', (e) =>
      dropdownMenu = @sssInput.siblings('.tt-menu')
      suggestions = dropdownMenu.find('.tt-suggestion')
      currentVal = @sssInput.typeahead('val');
      if suggestions.length == 0
        return false

      # Backspace & length 0
      if (event.which == 8 && currentVal.length == 0 )
        self.blankOutInput(widgetVars)

      # Tab or Enter
      if e.which is 13 or e.which is 9
        if @typeaheadCurrentVal
          @sssInput.typeahead('val')
          @typeaheadCurrentVal = false
        else
          suggestions.first().click()

      # Escape key
      else if e.which is 27
        @blankOutInput()

      #Tab & input val is greater than 1
      else if e.which is 9 && checkInput.val().length >= 1
        @find('.sss-search-input').typeahead('close')

class PseudoMediaQuery
  constructor: (@widget) ->
    width = @getWidth()
    @setClass(width)

    $( window ).resize () =>
      width = @getWidth()
      @setClass(width)

  setClass: (width) ->
    if width > 1025 #XLARGE UP
      @widget.removeClass("large medium small")
      @widget.addClass("xlarge")
    else if width > 856 #Large Up
      @widget.removeClass("xlarge medium small")
      @widget.addClass("large")
    else if width > 585 #Medium Up
      @widget.removeClass("xlarge large small")
      @widget.addClass("medium")
    else #Mobile / Medium
      @widget.removeClass("xlarge medium large")
      @widget.addClass("small")

  getWidth: () ->
    @widget.width()

G5.loadWidgetConfigs('.self-storage-search-home .config', sssHomeWidget)