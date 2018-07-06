class ComarketingWidget
  constructor: (@configs) ->
    @FULL_WIDTH = 910

    @addresses = @configs.addresses
    @panZoom = @configs.panZoom
    @mapType = @configs.mapType
    @cpnsUrl = @configs.cpnsUrl
    @clientUrn = @configs.clientUrn
    @widgetId = @configs.widgetId

    @widget = $("##{@widgetId}")
    @canvas = @widget.find('.canvas')
    @map = null
    @latLngBounds = null

    @setPhones()
    @setResize()
    G5.googleMapsApi.registerWidget(@, 'setComarketingMap')

  setComarketingMap: ->
    @setMap()
    @setAddresses()
    return

  setMap: ->
    mapOptions =
      scrollwheel: @panZoom
      draggable: @panZoom
      disableDefaultUI: !@panZoom
      disableDoubleClickZoom: !@panZoom
      zoom: 16
      mapTypeId: google.maps.MapTypeId[@mapType]
    @map = new (google.maps.Map)(@canvas[0], mapOptions)
    return

  setAddresses: ->
    @latLngBounds = new (google.maps.LatLngBounds)
    i = 0
    while i < @addresses.length
      address = @addresses[i]
      @setMapMarker address[0], address[1], i, @addresses.length
      i++
    return

  setMapMarker: (address, title, i, count) ->
    $.getJSON(G5.googleMapsApi.geocodeUrl(),
      address: address
      sensor: 'false'
    ).done (data) =>
      coordinates = data.results[0].geometry.location
      latlng = new (google.maps.LatLng)(coordinates.lat, coordinates.lng)
      locationMarker = new (google.maps.Marker)(
        position: latlng
        map: @map
        title: address)
      infowindow = new (google.maps.InfoWindow)(content: title)
      google.maps.event.addListener locationMarker, 'click', =>
        infowindow.open @map, locationMarker
        return
      @latLngBounds.extend latlng
      @map.fitBounds @latLngBounds
      return
    return

  setPhones: ->
    @phoneNumber = new PhoneNumber(@getPhoneConfigs())

  getPhoneConfigs: ->
    phoneConfigs =
      cpnsUrl: @cpnsUrl,
      clientUrn: @clientUrn,
      locationUrns: @locationUrns()

  locationUrns: ->
    @widget.find('.area-page-location').map (idx, elem)=>
      locUrn = $(elem).attr('data-location-urn')
      return { urn: locUrn, scope: "##{@widgetId} div[data-location-urn=#{locUrn}]" }

  setResize: ->
    $(window).on 'resize orientationchange', (e)=>
      @resize()
    @resize()

  resize: ->
    if @widget.width() <= @FULL_WIDTH
      @widget.addClass('small')
    else
      @widget.removeClass('small')


G5.loadWidgetConfigs('.comarketing .config', ComarketingWidget)
