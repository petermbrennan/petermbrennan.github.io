class WalkscoreWidget
  constructor: (@configs) ->
    @widget = $("##{@configs.widgetId}")
    @getPage()

  getPage: ->
    $.ajax
      url: "//g5-social-feed-service.herokuapp.com/walkscore-params/#{@configs.walkscore_location}.json?address=#{@configs.address}&city=#{@configs.city}&state=#{@configs.state}&lat=#{@configs.latitude}&lon=#{@configs.longitude}"
      dataType: 'json'
      success: (data) =>
        @build(data) if data != null

  build: (dataFeed) ->
    if dataFeed != []
      walkscoreBlock = """<a href="#{dataFeed.ws_link}" target="_blank">
                           <img src="#{dataFeed.logo_url}" alt="Walkscore Logo"/>
                             <span>#{dataFeed.walkscore}</span>
                          </a>
                      """
      @widget.find('.walkscore-listing').append(walkscoreBlock)

G5.loadWidgetConfigs('.walkscore .config', WalkscoreWidget)