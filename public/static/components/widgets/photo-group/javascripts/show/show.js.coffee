$(document).ready ->
  mapConfigs = new PhotoGroupWidgetConfigs
  $.each mapConfigs.configs, (idx, config)->
    new PhotoGroupWidget(config)

class PhotoGroupWidgetConfigs
  constructor: () ->
    photoConfigs = $('.photo-group-config')
    @configs = $.map photoConfigs, (config)->
      JSON.parse($(config).html())

class PhotoGroupWidget
  constructor: (config) ->
    @widget = $("##{config.widgetId}")
    @filter = @widget.find('.filter')
    @lazyImg = @widget.find('img.lazy-load')
    @lazyLoad()

  lazyLoad: () ->
    @lazyImg.unveil()