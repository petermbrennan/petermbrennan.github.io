class SSFeaturedUnitCategoriesWidget
  constructor: (@configs)->
    @widget = $("##{@configs.widgetId}")
    @ajaxSSFeaturedUnitCategories()

  ajaxSSFeaturedUnitCategories: ()->
    $.ajax
      url: "#{@configs.unit_service_host}/api/v1/storage_facilities/#{@configs.location_urn}/storage_units"
      dataType: 'json'
      success: (data) =>
        categories = data.storage_categories
        if typeof(categories) != "undefined" && categories.length > 0
          @buildMarkup(categories)

  buildMarkup: (categories)->
    categories.sort((a, b) -> return a.name - b.name)
    markupHash = []

    viewAllLink = "#{@configs.unit_page_url}/#/"
    allLinkSuffix = if @configs.destination_type == "ss_filtered" then "units?category=all" else "size"

    for category, index in categories
      markupHash.push(@buttonTemplate(category))

    allButton = " <div class='iui-size iui-view-all'>
                    <a class='btn' href='#{viewAllLink}#{allLinkSuffix}'>
                      View All
                    </a>
                  </div> "

    markupHash.push(allButton)
    @widget.find('.iui-container').html(markupHash.join(''))

  buttonTemplate: (category) ->
    cleanCatName = category.name.replace(/\+/g, "%2B").replace(/&/g, "%26").replace(/\s/g, "%20")
    if @configs.destination_type == "ss_iui_cards"
      "<div class='iui-size'><a class='btn' href='#{@configs.unit_page_url}/#/options?categoryId=#{category.id}'>#{category.name}</a></div>"
    else if @configs.destination_type == "ss_filtered"
      "<div class='iui-size'><a class='btn' href='#{@configs.unit_page_url}/#/units?category=#{cleanCatName}'>#{category.name}</a></div>"
    else
      "<div class='error'> Please Select Widget Destination</div>"

G5.loadWidgetConfigs('.ss-featured-unit-categories .config', SSFeaturedUnitCategoriesWidget)
