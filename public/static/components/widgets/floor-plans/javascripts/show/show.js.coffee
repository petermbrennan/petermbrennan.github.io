class FloorplansWidget
  constructor: (@configs)->
    @widget = $("##{@configs.widgetId}")
    @setupFloorplans()

  setupFloorplans: (pricingOptions) ->
    # Set up pricing service and location URNs
    heroku_app_name_max_length = 30
    cpas_urn = pricingOptions["clientUrn"].replace(/-c-/, "-cpas-")
    cpas_urn = cpas_urn.substring(0, heroku_app_name_max_length)
    cpas_urn = cpas_urn.slice(0, -1) if cpas_urn[cpas_urn.length-1] == '-'
    location_urn = pricingOptions["locationUrn"]

    # If pricing URN and location URN exists, get the data
    if cpas_urn && location_urn
      @getPricing(cpas_urn, location_urn)

    @widget.find(".floorplan-btn").fancybox()
    $(window).smartresize ->
      @resetPricingHeight()

  getPricing: (cpas_urn, location_urn) ->
    pricingURL = "https://" + cpas_urn + ".herokuapp.com/locations/" + location_urn + '/widget'
    loader = '<div id="loading-floorplans"><div class="loader">Loading&hellip;</div>Loading Pricing &amp; Availibility Information&hellip;</div>'

    $.ajax
      type: "GET"
      url: pricingURL

    .done (data)->
      @appendFloorplans(data, loader)
      @setupFilters()

  appendFloorplans: (data, loader) ->
    # Hide container and add loading div
    @widget.hide()
    $("[role=main]").append loader

    # Add data from pricing service to the page
    $data = $(data)
    floorplanList = $data.find(".e-content")
    @widget.append(floorplanList).fadeIn()

    # Remove loading div
    $("#loading-floorplans").fadeOut().remove()

    # When floorplan images are loaded, Fix the height of the widget
    images = @widget.find('img')
    loadCounter = 0
    $.each images, (i, item)=>
      $(item).load =>
        loadCounter++
        if loadCounter == images.length
          @setPricingHeight()

  setPricingHeight: ->
    # Sets height of floorplan container so browser doesn't jump when filtering
    floorplansHeight = @widget.outerHeight()
    @widget.css('height', floorplansHeight)

  resetPricingHeight: ->
    @widget.css('height', 'auto')
    @setPricingHeight()

  setupFilters: ->
    floorplans = @widget.find(".floorplan")

    # Disables filters that are not needed
    @widget.find('.filters input[type=radio]').each ->
      klass = $(this).attr 'id'
      unless floorplans.hasClass(klass) or klass.match(/^\w+-all/)
        $(this).prop("disabled", true).next().addClass 'disabled'

    # Filtering script
    @widget.find(".filters input").on "change", (e) ->

      # Set up filter and item variables
      bedFilter = $("#beds-filter input:checked").val()
      bathFilter = $("#baths-filter input:checked").val()
      bedSelector = ""
      bathSelector = ""

      # If All is selected, show everything
      if bedFilter is "beds-all" and bathFilter is "baths-all"
        floorplans.fadeIn()
      else
        bedSelector = "." + bedFilter  if bedFilter isnt "beds-all"
        bathSelector = "." + bathFilter  if bathFilter isnt "baths-all"
        floorplans.fadeOut()
        $(bedSelector + bathSelector).fadeIn "fast"


G5.loadWidgetConfigs('.floorplans .config', FloorplansWidget)
