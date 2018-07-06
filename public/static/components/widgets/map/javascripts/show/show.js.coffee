window.getMapCoords = ->
  getMapConfig()
  unless window.widgetMapConfig
    console.log "ERROR: Widget Map Config Not Found"
    return

  $.getJSON("//maps.googleapis.com/maps/api/geocode/json",
    address: window.widgetMapConfig.address
    sensor: "false"
  ).done (data) ->
    coordinates = data.results[0].geometry.location
    setMap(coordinates)

setMap = (coordinates) ->
  lat = coordinates.lat
  lng = coordinates.lng
  latLng = new google.maps.LatLng(lat, lng)
  config = window.widgetMapConfig

  mapOptions =
    scrollwheel: config.panZoom
    draggable: config.panZoom
    disableDefaultUI: not config.panZoom
    disableDoubleClickZoom: not config.panZoom
    zoom: 16
    center: new google.maps.LatLng(lat, lng)
    mapTypeId: google.maps.MapTypeId[config.mapType]

  markerOptions = position: latLng
  marker = new google.maps.Marker(markerOptions)
  map = new google.maps.Map($(".map .canvas")[0], mapOptions)
  marker.setMap map

getMapConfig = ->
  return window.widgetMapConfig if window.widgetMapConfig
  mapConfig = $('.map .config:first')
  window.widgetMapConfig = if mapConfig.length then JSON.parse(mapConfig.html()) else null

