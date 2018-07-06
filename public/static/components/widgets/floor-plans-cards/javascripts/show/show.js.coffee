class FloorplansCardsWidget
  constructor: (@configs)->
    @widget = $("##{@configs.widgetId}")
    # This if/else block is a temporary patch to make sure the js is backwards compatible with single tenant CPAS apps.
    # Without it, live sites will break if deployed without first getting a widget update. Once conversion is complete,
    # we can remove the if/else block and just use the hardcoded g5-multi-family-inventory.herokuapp.com domain
    if @configs['locationUrn']
      dataFeed = "https://g5-multi-family-inventory.herokuapp.com/locations/#{@configs['locationUrn']}/floor_plans.json"
    else
      dataFeed = @configs['floorplanDataFeed']

    $.getJSON(dataFeed, (unitData) => @buildHTML(unitData)).then (response) =>
      new customizeUnitGrid(@configs, @widget)

  buildHTML: (unitData) ->
    unitsMarkup = ""
    if unitData.length
      target = if @configs.openFPinNewTab == "true" then "target='_blank'" else ""

      for index, floorplan of unitData
        title = $.trim floorplan["title"] || ""
        image_url = $.trim floorplan["image_url"] || ""
        beds = $.trim floorplan["beds"] || ""
        baths = $.trim floorplan["baths"] || ""
        size = $.trim floorplan["size"] || ""
        price = $.trim floorplan["price"] || ""
        price_url = $.trim floorplan["price_url"] || ""

        unitsMarkup += "<div class='floorplan-card'>
                          <div class='floorplan-card-title'>#{title}</div>
                          <a href='#{image_url}' #{target} class='floorplan-view-link'>
                            #{@svgIconMarkup(@configs["accentColor2"])}
                            <div>View<span></span></div>
                          </a>
                          <div class='unit-details'>
                            <div class='unit-beds'>#{@bedroomMarkup(beds)}</div>
                            <div class='unit-baths'><span>#{baths}</span> Bathroom</div>
                            #{@sizeMarkup(size)}
                            #{@priceMarkup(price)}
                          </div>
                          <a href='#{price_url}' class='unit-cta-button'>#{@configs["ctaText"]}</a>
                        </div>"

    @widget.append(unitsMarkup)

  bedroomMarkup: (bedrooms) ->
    if bedrooms > 0
      "<span>#{bedrooms}</span> Bedroom"
    else
      "<span>S</span> Studio"

  svgIconMarkup: (color) ->
    svgMarkup =  "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='77px' height='111px' viewBox='0 0 77 111' enable-background='new 0 0 77 111' xml:space='preserve'>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='1.5' y1='0' x2='1.5' y2='111'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='0' y1='109.5' x2='77' y2='109.5'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='75.564' y1='0' x2='75.436' y2='111'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='76.925' y1='1.5' x2='34.075' y2='1.5'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='17.934' y1='1.5' x2='0' y2='1.5'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='50' y1='0' x2='50' y2='22.997'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='50' y1='69.973' x2='50' y2='111'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='35.694' y1='1.5' x2='26.171' y2='17.721'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='50' y1='71.518' x2='29.774' y2='71.646'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='31.25' y1='71.518' x2='31.25' y2='95.842'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='0' y1='71.518' x2='17.934' y2='71.518'/>
                    <circle fill='#{color}' cx='16.519' cy='5.495' r='1.416'/>
                    <circle fill='#{color}' cx='18.578' cy='8.841' r='1.416'/>
                    <circle fill='#{color}' cx='20.578' cy='12.316' r='1.416'/>
                    <circle fill='#{color}' cx='23.409' cy='15.147' r='1.416'/>
                  </svg>"

  sizeMarkup: (size) ->
    if size.length > 0 then "<div class='unit-size'>#{size} Sq. Ft.</div>" else ""

  priceMarkup: (price) ->
    if price.length > 0 then "<div class='unit-rate'>From <span>$#{price}</span></div>" else ""

class customizeUnitGrid
  constructor: (@configs, @widget) ->
    @setHeadingColor @configs['headingColor']
    @setCtaColor @configs['ctaColor'], @configs['accentColor1']
    @setAccents1 @configs['accentColor1']
    @setAccents2 @configs['accentColor2']
    @setText @configs['textColor']
    unless @configs.openFPinNewTab == "true"
      @widget.find(".floorplan-view-link").fancybox()

  setHeadingColor: (color) ->
    @widget.find('.floorplan-card-title').css('background-color', color)

  setCtaColor: (color, hoverColor) ->
    ctaButtons = @widget.find('.unit-cta-button')
    ctaButtons.css('background-color', color)
    ctaButtons.hover(
      -> $(this).css('background-color', hoverColor),
      -> $(this).css('background-color', color)
    )

  setAccents1: (color) ->
    @widget.find('.floorplan-view-link span').css('background-color', color)

  setAccents2: (color) ->
    @widget.find('.unit-beds span, .unit-baths span, .floorplan-view-link div').css('background-color', color)

  setText: (color) ->
    @widget.find('.unit-beds, .unit-baths, .unit-size, .unit-rate').css('color', color)


G5.loadWidgetConfigs('.floorplans-cards .config', FloorplansCardsWidget)
