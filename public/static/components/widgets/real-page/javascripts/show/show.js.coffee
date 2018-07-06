class RealPageWidget
  constructor: (@configs)->
    @widget = $("##{@configs.widgetId}")
    @build()

  parseParams: ->
    @params = {}
    location.search.substr(1).split("&").forEach (item) =>
      @params[item.split("=")[0]] = item.split("=")[1]

  getParams: ->
    @parseParams()
    target_div_param = "&container=#{@configs.iframeId}"
    realpage_id = @params.siteId || @configs.realpage_id
    return unless realpage_id?.length
    realPageParams  = "siteId=#{realpage_id}#{target_div_param}"
    realPageParams  += "&css=https%3A#{@configs.realpage_stylesheet}" if @configs.realpage_stylesheet.length > 1
    realPageParams  += "&UnitId=#{@params.UnitId}" if @params.UnitId?.length
    realPageParams  += "&MoveInDate=#{@params.MoveInDate}" if @params.MoveInDate?.length
    realPageParams  += "&SearchUrl=#{@params.SearchUrl}" if @params.SearchUrl?.length
    realPageParams

  build: ->
    realPageParams = @getParams()
    if realPageParams?
      realPageJS = """<script language="javascript" src="https://property.onesite.realpage.com/oll/eol/widget?#{realPageParams}"></script>"""
      @widget.append(realPageJS)

G5.loadWidgetConfigs('.realpage .config', RealPageWidget)