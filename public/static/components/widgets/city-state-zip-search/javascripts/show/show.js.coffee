class CityStateZipSearchWidget
  constructor: (@configs)->
    @widget = $("##{@configs.widgetId}")
    G5.googleMapsApi.registerWidget(@, 'initializeZipSearch')

  initializeZipSearch: ->
    # Grab settings from index.html
    zipSearchConfigs = new ZipSearchConfigs(@configs)
    # Classes for different container widths
    new PseudoMediaQuery(zipSearchConfigs, @widget)
    # Set up listener for Search Button
    new SearchButtonListener(zipSearchConfigs, @widget)

    # Get search results from Geo Service only after GeoCoding call is complete
    $(window).bind("geoCodingComplete", (event) =>
      new ZipSearchAjaxRequest(zipSearchConfigs, @widget)
    )

class ZipSearchAjaxRequest
  constructor: (zipSearchConfigs, @widget) ->
    if zipSearchConfigs.searchURL()
      $.ajax
        url: zipSearchConfigs.searchURL()
        dataType: 'json'
        success: (data) =>
          new SearchResultsList(zipSearchConfigs, data, @widget)
          new SearchResultsMap(zipSearchConfigs, data, @widget)
          new ViewAllLink(zipSearchConfigs, data, @widget)

class SearchResultsMap
  constructor: (@zipSearchConfigs, @data, @widget) ->
    unless @widget.find('.zip-search-map').length
      @widget.append("<div class='zip-search-map'></div>")

    @mapCanvas = @widget.find('.zip-search-map')[0]
    @bounds = new google.maps.LatLngBounds()
    @markers = []
    @infowindows = []
    @currentInfoWindow = null

    mapOptions = {}

    @map = new google.maps.Map(@mapCanvas, mapOptions)

    google.maps.event.addListener(@map, 'zoom_changed', =>
      @map.setZoom(17) if @map.getZoom() > 17
    )

    @setMarkers(@data.locations)

    @map.fitBounds(@bounds)


  setMarkers: (locations) ->
    markers=[]
    infowindows=[]

    for location, index in locations
      lat = location.latitude
      long = location.longitude

      # Markers
      coordinates = new google.maps.LatLng(lat,long)
      marker = new google.maps.Marker({
        position: coordinates
        map: @map
        index: index
      })
      markers.push(marker)
      @bounds.extend(marker.position)

      # Info Windows
      infowindow = new google.maps.InfoWindow({ content: @infoWindowContent(location) })
      infowindows.push(infowindow)

      # Event listener needs access to both versions of this
      that = this
      google.maps.event.addListener(markers[index],'click', ->
        that.currentInfoWindow.close() if that.currentInfoWindow?
        that.currentInfoWindow = infowindows[this.index]
        infowindows[this.index].open(@map, markers[this.index])
      )

  infoWindowContent: (location) ->
    " <div class='location-search-info-window notranslate'>
        <a href='#{location.home_page_url}'>
          <h2>#{location.name}</h2>
        </a>
        <p>
          #{location.street_address_1}<br />
          #{location.city}, #{location.state} #{location.postal_code}
        </p>
      </div "

class SearchResultsList
  constructor: (@zipSearchConfigs, @data, @widget) ->
    @populateResults()
    @getPhoneNumbers()

  populateResults: () ->
    markupHash = []

    if @zipSearchConfigs.search == "all"
      summaryMessage =  "Please see our full list of locations below:"
    else if @data.success
      summaryMessage = "We have #{@data.locations.length} locations near #{ @zipSearchConfigs.searchArea() }, within #{@zipSearchConfigs.radius} miles:"
    else
      summaryMessage = "Sorry, we don't have any locations in that area. Please try a different search, or see our full list of locations below:"

    markupHash.push("<p class='zip-search-summary'>#{summaryMessage}</p>")

    for location, index in @data.locations
      markupHash.push("<div class='zip-search-location' data-location-urn='#{location.urn}'>")
      markupHash.push( "<img src='#{location.thumbnail}' />
                        <div class='location-address notranslate'>
                          <a href='#{location.home_page_url}'><span class='branded-name'>#{location.name}<span></a>
                          <span class='street'>#{location.street_address_1}</span>
                          <span class='city'>#{location.city}, #{location.state} #{location.postal_code}</span>
                          <span class='phone'>
                            <a class='number' href='tel:#{location.phone_number}'>
                              <span class='p-tel tel'>#{location.phone_number}</span>
                            </a>
                          </span>
                        </div>
                        <a class='zip-search-location-link' href='#{location.home_page_url}'>Visit Location</a> ")
      markupHash.push("</div>")

    @widget.find('.zip-search-results').html(markupHash.join(''))

  getPhoneNumbers: () ->
    locUrns = @widget.find(".zip-search-location").map =>
      locUrn = $(this).attr('data-location-urn')
      return { urn: locUrn, scope: "##{@widget.attr('id')} $(.zip-search-location[data-location-urn=#{locUrn}]" }

    phoneConfigs =
      cpnsUrl: "#{@zipSearchConfigs.configs.phoneServiceURL}"
      clientUrn: "#{@zipSearchConfigs.configs.clientURN}"
      locationUrns: locUrns

    new PhoneNumber(phoneConfigs)


class ZipSearchConfigs
  constructor: (@configs) ->
    @search = @getParameter('search')

    @lat = null
    @lon = null
    new AjaxRequestForLatLon(this)

    @radius = @radius()
    @serviceURL = if @configs.serviceURL == "" then "//g5-hub.herokuapp.com" else @configs.serviceURL

  getParameter: (name) ->
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
    regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
    results = regex.exec(location.search)
    value = if results == null then "" else decodeURIComponent(results[1].replace(/\+/g, " "))

  radius: () ->
    if @getParameter("radius")
      rad = @getParameter("radius")
    else if @configs.searchRadius
      rad = @configs.searchRadius
    else
      rad = 20

  searchURL: () ->
    if @search == ""
      searchURL = null
    else
      filterOR = switch
        when @search is "or" then true
        when @search is "OR" then true
      if filterOR is true
        @search = "Oregon"
      searchURL = "#{@serviceURL}/clients/#{@configs.clientURN}/location_search.json?"
      unless @search == "all"
        searchURL += "search=#{@search}"
        searchURL += "&radius=#{@radius}" if @radius?
        searchURL += "&lat=#{@lat}&lon=#{@lon}" if @lat && @lon

    searchURL

  searchArea: () ->
    if @search
      @search.toUpperCase()
    else
      ""

class SearchButtonListener
  constructor: (zipSearchConfigs, @widget) ->
    searchButton = @widget.find('.zip-search-button')

    if zipSearchConfigs.configs.searchResultsPage == ""
      # No searchResultsPage means we stay here on submit
      searchButton.click( (event) =>
        event.preventDefault()
        @renderResultsInline(zipSearchConfigs) )
    else
      # If searchResultsPage is populated, submit to that page
      searchButton.click( (event) =>
        event.preventDefault()
        @bumpToSearchPage(zipSearchConfigs) )

  userInput: () ->
    search = @widget.find('.zip-search-form input[name=search]').val()
    if search == ""
      "blank"
    else
      search

  renderResultsInline: (zipSearchConfigs) ->
    zipSearchConfigs.search = @userInput()
    new AjaxRequestForLatLon(zipSearchConfigs)

  bumpToSearchPage: (zipSearchConfigs) ->
    radius = zipSearchConfigs.radius
    search = if @userInput() == "" then "blank" else @userInput()
    searchURL = zipSearchConfigs.configs.searchResultsPage
    searchURL += "?search=#{search}"
    searchURL += "&radius=#{radius}" if radius?
    window.location = searchURL

class ViewAllLink
  constructor: (zipSearchConfigs, data, @widget) ->
    if data.success
      linkMarkup = "<a href='#' class='view-all-link'>View All Locations</a>"
      @widget.find('.zip-search-results').append(linkMarkup)

      @createButtonListener(zipSearchConfigs)

  createButtonListener: (zipSearchConfigs) ->
    @widget.find('.view-all-link').click( (event) =>
      event.preventDefault()
      zipSearchConfigs.search = "all"
      new ZipSearchAjaxRequest(zipSearchConfigs) )

class PseudoMediaQuery
  constructor: (@zipSearchConfigs, @widget) ->
    width = @getWidth()
    @setClass(width)

    $(window).smartresize () =>
      width = @getWidth()
      @setClass(width)

  setClass: (width) ->
    if width > 750
      @widget.removeClass("narrow")
      @widget.addClass("wide")
    else
      @widget.removeClass("wide")
      @widget.addClass("narrow")

  getWidth: () ->
    @widget.width()

# Get Lat/Lon for a given search on the client side so as to preserve our API Quota on the server side
class AjaxRequestForLatLon
  constructor: (searchObject) ->
    # make the call to the google geocoding API
    geocoder = new google.maps.Geocoder()
    geocoder.geocode({'address':"#{searchObject.search}"}, (results, status) =>
      if status == google.maps.GeocoderStatus.OK
        # Lookup was a success. Pass Lat/Lon to Geo Service
        @setLatLong(searchObject, results)
        $(window).trigger("geoCodingComplete")
      else
        # Lookup failed. Lets send the request to the geo service anyway so we get a location list back
        searchObject.lat = null
        searchObject.lon = null
        $(window).trigger("geoCodingComplete")
    )

  setLatLong: (searchObject, results) ->
    searchObject.lat = results[0]['geometry']['location'].lat()
    searchObject.lon = results[0]['geometry']['location'].lng()

G5.loadWidgetConfigs('.city-state-zip-search .config', CityStateZipSearchWidget)
