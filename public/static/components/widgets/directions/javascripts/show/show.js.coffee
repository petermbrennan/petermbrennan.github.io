class DirectionsWidget
  config: null
  wideWidth: 960
  smallWidth: 480
  storeCoords: null
  lat: null
  lng: null
  directionsDisplay: null

  constructor: (options) ->
    @config = options
    @widget = $('.directions')
    @initWidgetComponents()
    @override = @config.overrides
    @resize()
    @submit.on 'click', =>
      @calcRoute()
    $(window).on 'resize orientationchange', =>
      @resize()
    G5.googleMapsApi.registerWidget(@, 'getDirectionsCoords')

  initWidgetComponents: ->
    @input = @widget.find('.directions-start')
    @wrapper = @input.parent('.text')
    @submit = @wrapper.find('.directions-submit')
    @canvas = @widget.find('.canvas')
    @panel = @widget.find('.panel')
    @error = @widget.find('.directions-error')

  getDirectionsCoords: ->
    @getClientCoords()
    @getStoreCoords()

  resize: ->
    if @widget.parents('div').width() >= @wideWidth then @widget.addClass('wide') else @widget.removeClass('wide')
    if @widget.parents('div').width() < @smallWidth then @widget.addClass('small') else @widget.removeClass('small')
    @input.css({width: @wrapper.width() - @submit.outerWidth(true) - 15})

  setupMap: ->
    @directionsDisplay = new google.maps.DirectionsRenderer()
    mapOptions =
      zoom: 15
      mapTypeId: google.maps.MapTypeId.ROADMAP
      center: @storeCoords

    map = new google.maps.Map(@canvas[0], mapOptions)
    @directionsDisplay.setMap map
    @directionsDisplay.setPanel @panel[0]

    if @override.suppress_info_windows is "true"
      @directionsDisplay.setOptions({
        suppressInfoWindows: true
      })

    mapMarkerOptions =
      position: @storeCoords
      map: map
      title: @config.address
    marker = new google.maps.Marker(mapMarkerOptions)

  getStoreCoordsLatLng: ->
    @storeCoords = new google.maps.LatLng(parseFloat(@config.lat), parseFloat(@config.lon))
    @setupMap()

  getStoreCoordsAddress: ->
    address = @config.address
    geocoder = new google.maps.Geocoder()
    geocoder.geocode
      address: address,
      (results, status) =>
        if status is google.maps.GeocoderStatus.OK
          @storeCoords = results[0].geometry.location
          @storeAddress = results[0].formatted_address
          @setupMap()
        else
          @invalidStoreAddressError()

  getStoreCoordsGeocode: ->
    $.getJSON(G5.googleMapsApi.geocodeUrl(),
      address: @config.address
      sensor: "false"
    ).done (data) =>
      if data.results.length
        @lat = data.results[0].geometry.location.lat
        @lng = data.results[0].geometry.location.lng
        @storeCoords = new google.maps.LatLng(this.lat, this.lng)
        @setupMap()
      else
        @invalidStoreAddressError()

  getStoreCoords: ->
    # Using hardcodeLatLon/true naming conventions because override options were previously a t/f bullion
    if @override.hardcodeLatLon is "true"
      @getStoreCoordsLatLng()
    else if @override.hardcodeLatLon is "address"
      @getStoreCoordsAddress()
    else
      @getStoreCoordsGeocode()

  getClientCoords: ->
    watchID = undefined
    nav = window.navigator
    if nav?
      geoloc = nav.geolocation
      watchID = geoloc.getCurrentPosition \
        ((position) => @successCallback(position)), \
        ((error) =>
          if error.message.indexOf("Only secure origins are allowed") == 0 || error.message.indexOf("User denied Geolocation") == 0
            @nonSecureError(error)
          else
            @errorCallback(error))

  successCallback: (position) ->
    coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    @populateStartAddress coords

  errorCallback: (error) ->
    @showErrorMessage "Physical location for the starting address not found"
    console.log "error detecting physical location"

  # Chrome 50 & Safari 9.0.2 Hack for non-secure sites: Removes Error Message in browser
  nonSecureError: (error) ->
    @showErrorMessage ""
    console.log "google maps only secure origins are allowed"

  showErrorMessage: (message) ->
    @error.html(message).addClass('show') if message.length

  hideErrorMessage: ->
    @error.removeClass 'show'

  populateStartAddress: (latLng) ->
    address = undefined
    geocoder = new google.maps.Geocoder()
    geocoder.geocode
      latLng: latLng,
      (results, status) =>
        if status is google.maps.GeocoderStatus.OK
          address = results[0].formatted_address
          @input.attr "value", address
          @calcRoute();

  calcRoute: ->
    return @invalidStoreAddressError() unless @storeCoords
    @hideErrorMessage()
    @submit.addClass('disabled').prop('disabled',true)
    directionsService = new google.maps.DirectionsService()
    start = @input.val()
    if @override.hardcodeLatLon is "address"
      end = @storeAddress
    else
      end = @storeCoords

    request =
      origin: start
      destination: end
      travelMode: google.maps.TravelMode.DRIVING

    directionsService.route request, (result, status) =>
      if status is google.maps.DirectionsStatus.OK
        @directionsDisplay.setDirections result
      else
        @showErrorMessage "No directions found. Try a different address."
      @submit.removeClass('disabled').prop('disabled',false)

  invalidStoreAddressError: ->
    @showErrorMessage "The Store address for this Directions Widget is not set up correctly"
    @submit.addClass('disabled').prop('disabled',true)
    @canvas.hide()
    @panel.hide()

G5.loadWidgetConfigs('.directions .config', DirectionsWidget)

