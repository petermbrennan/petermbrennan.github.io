class LocationsNavigationWidget
  constructor: (@configs) ->
    @widget = $("##{@configs.widgetId}")
    @title = @widget.find('.locations-navigation-title')
    @headers =  @widget.find('.locations-navigation-heading')
    @cities = @widget.find('.locations-navigation-city')
    @initTitle()
    @initHeaders()
    @initCities()
    @resize()
    $(window).on 'resize orientationchange', =>
      @resize()

  initTitle: ->
    @title.on 'click', ((e)=>
      @title.toggleClass('open')
      @title.next('ul').toggleClass('open')
    )

  initHeaders: ->
    @headers.on 'click', ((e)=>
      header = $(e.currentTarget)
      isOpen = header.hasClass('open')
      @headers.each (idx,elem)=>
        @closeHeader($(elem))
      if isOpen then @closeHeader(header) else @openHeader(header)
      return window.noEvent(e)
    )

  initCities: ->
    @cities.on 'click', ((e)=>
      window.location.href = $(e.currentTarget).find('> a').attr('href')
      return window.noEvent(e)
    )

  closeHeader: (header)->
    header.removeClass('open')
    list = @getHeaderList(header)
    list.removeClass('open')
    list.css({'max-height': 0})

  openHeader: (header)->
    header.addClass('open')
    list = @getHeaderList(header)
    list.addClass('open')
    lHeight = @getHeaderListHeight(list)
    list.css({'max-height': lHeight+100})

  getHeaderList: (header)->
    header.find('> .locations-navigation-list')

  getHeaderListHeight: (list)->
    lHeight = 0
    list.find('> li').each (idx,elem)=>
      lHeight += $(elem).height()
    lHeight

  resize: ->
    @title.next('ul').width(@title.outerWidth())

G5.loadWidgetConfigs('.locations-navigation .config', LocationsNavigationWidget)
