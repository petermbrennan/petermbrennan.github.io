class MultifamilyMiniSearchWidget
  constructor: (@configs)->
    @widget = $("##{@configs.widgetId}")
    @primarySearch()
    @alternateSearch()

  primarySearch: ->
    $.ajax
      url: "#{@configs.serviceURL}/api/v0/client_locations?client_id=#{@configs.clientID}"
      dataType: 'json'
      success: (data) =>
        new corpSearchMarkupBuilder(data, @configs, @widget)
        @widget.find('.mf-search-go-button.default-submit-button').on('click', =>
          new searchSubmittal(data, @configs, @widget)
        )
      error: ()=>
        @widget.find('.mf-search-go-button').prop('disabled', true);
        @widget.find('.mf-search-states').prop('disabled', true);
        @widget.find('.mf-search-cities').prop('disabled', true);

  alternateSearch: ->
    altSearchVals = [ @configs.defaultSearchOption,
                      @configs.alternateSearchOption,
                      @configs.externalSearchURL,
                      @configs.alternateCoreClientID ]

    if altSearchVals.indexOf('') == -1
      new radioButtonBuilder(@configs, @widget)
      $.ajax
        url: "#{@configs.serviceURL}/api/v0/client_locations?client_id=#{@configs.alternateCoreClientID}"
        dataType: 'json'
        success: (altData) =>
          altStateSelect = @widget.find('select.mf-search-states.alternate-select')
          altCitySelect  = @widget.find('select.mf-search-cities.alternate-select')
          new optionsBuilder(altData.states, altStateSelect, @widget)
          altStateSelect.change -> new citySelectUpdater(altData, altStateSelect, altCitySelect)
          @widget.find('.mf-search-go-button.alternate-submit-button').on('click', =>
            new AlternateSearchSubmittal(altData, @configs, @widget)
          )


class radioButtonBuilder
  constructor: (@configs, @widget) ->
    radioButtons = "<div class='search-type-radio-buttons'>
                      <input type='radio' name='corp-search-type' id='default-search' value='default-search' checked>
                      <label for='default-search'>#{@configs.defaultSearchOption}</label>
                      <input type='radio' name='corp-search-type' id='alternate-search' value='alternate-search'>
                      <label for='alternate-search'>#{@configs.alternateSearchOption}</label>
                    </div>"

    $(radioButtons).insertAfter(@widget.find('h2'))
    new radioButtonListener(@configs, @widget)

class radioButtonListener
  constructor: (@configs, @widget) ->
    @setupListener() if @configs.alternateSearchButtonText != ""

  setupListener: ->
    buttons = @widget.find(".search-type-radio-buttons input[type='radio']")
    buttons.change( => @changeButtonText )

  changeButtonText: ->
    buttonValue = @widget.find(".search-type-radio-buttons input[type='radio']:checked").val()

    if buttonValue == 'default-search'
      newButtonText = 'Search'
      @widget.find(".alternate-select, .alternate-submit-button").hide()
      @widget.find(".default-select, .default-submit-button").show()
    else if buttonValue == 'alternate-search'
      newButtonText = @configs.alternateSearchButtonText
      @widget.find(".default-select, .default-submit-button").hide()
      @widget.find(".alternate-select, .alternate-submit-button").show()


# Define city/state selects and set up listener for when state changes
class corpSearchMarkupBuilder
  constructor: (data, @configs, @widget) ->
    stateSelect = @widget.find('select.mf-search-states.default-select')
    citySelect = @widget.find('select.mf-search-cities.default-select')
    new optionsBuilder(data.states, stateSelect)

    stateSelect.change -> new citySelectUpdater(data, stateSelect, citySelect)

# Listening for a state change to repopulate the city dropdown
class citySelectUpdater
  constructor: (data, stateSelect, citySelect) ->
    # reset the values in the city select
    citySelect.html("<option value=''>City</option>")
    # get the currently selected state
    selectedState = stateSelect.val()
    # build an array of currently relevant cities
    relevantCities = data.cities.filter((city) -> city.state_id == parseInt(selectedState,10))
    # update the select options
    new optionsBuilder(relevantCities, citySelect)

# Pass a select element and a list of options to fill it in with
class optionsBuilder
  constructor: (options, element) ->
    markupHash = []
    for option, index in options
      markupHash.push("<option value='#{option.id}'>#{option.name}</option>")

    element.append(markupHash.join(''))

class searchSubmittal
  constructor: (data, @configs, @widget) ->
    selectedState = @widget.find('select.mf-search-states.default-select').val()
    selectedCity = @widget.find('select.mf-search-cities.default-select').val()

    stateObject = data.states.filter((state) -> state.id == parseInt(selectedState,10))
    stateParam = if typeof(stateObject[0]) != "undefined" then "&state=#{stateObject[0].name}" else ""

    cityObject = data.cities.filter((city) -> city.id == parseInt(selectedCity,10))
    cityParam = if typeof(cityObject[0]) != "undefined" then "&city=#{cityObject[0].name}" else ""

    queryString = "?page=1#{stateParam}#{cityParam}"
    window.location = "//#{window.location.host}#{@configs.corpSearchPage}#{queryString}"

class AlternateSearchSubmittal
  constructor: (data, @configs, @widget) ->
    selectedState = @widget.find('select.mf-search-states.alternate-select').val()
    selectedCity = @widget.find('select.mf-search-cities.alternate-select').val()

    stateObject = data.states.filter((state) -> state.id == parseInt(selectedState,10))
    stateParam = if typeof(stateObject[0]) != "undefined" then "&state=#{stateObject[0].name}" else ""

    cityObject = data.cities.filter((city) -> city.id == parseInt(selectedCity,10))
    cityParam = if typeof(cityObject[0]) != "undefined" then "&city=#{cityObject[0].name}" else ""

    queryString = "?page=1#{stateParam}#{cityParam}"

    window.location = "//#{window.location.host}#{@configs.externalSearchURL}#{queryString}"

    # resultsPageUrl = "#{configs.externalSearchURL}#{queryString}"
    # newWindow = window.open(resultsPageUrl, '_blank');
    # newWindow.focus();

G5.loadWidgetConfigs('.multifamily-mini-search-v1 .config', MultifamilyMiniSearchWidget)
