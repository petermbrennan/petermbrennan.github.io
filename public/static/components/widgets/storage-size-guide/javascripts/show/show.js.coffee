class StorageSizeGuideWidget
  constructor: (@configs) ->
    @widget = $("##{@configs.widgetId}")
    @generateTabsMarkup()
    @initialize()

  initialize: ->
    @widget.find('.storage-size').easyResponsiveTabs
      type: 'default'
      width: 'auto'
      fit: true
      tabidentify: 'hor_1'
      inactive_bg: 'transparent'
      activate: (event) =>
        tab = $(event.currentTarget)
        info = @widget.find('#nested-tabInfo')
        name = $('span', info)
        name.text tab.text()
        info.show()
        return
    return

  generateTabsMarkup: () ->
    tabTitles = []
    tabContent = []

    for tab, index in @configs.tabContent
      tabTitle = tab.storageSize
      tabTitle = @configs.tabDefaults[index].storageSize if tabTitle == ""

      tabText = tab.storageDescription
      tabText = @configs.tabDefaults[index].storageDescription if tabText == ""

      tabImage = @imageForTab(tab, index)

      tabImageAltText = tab.storageImageAltTag
      tabImageAltText = @configs.tabDefaults[index].storageImageAltTag if tabImageAltText == ""

      tabTitles.push("<li>#{tabTitle}</li>")

      contentMarkup = " <div>
                          <div class='description'>#{tabText}</div>
                          <figure class='photo photo-ret storage-image h-media'><img src='#{tabImage}' class='unit-image' alt='#{tabImageAltText}' /></figure>
                        </div>"
      tabContent.push(contentMarkup)

    @widget.find('.size-guide-content .resp-tabs-list').append(tabTitles.join(""))
    @widget.find('.size-guide-content .resp-tabs-container').append(tabContent.join(""))

  imageForTab: (tab, index) ->
    defaultImageType = @configs.storageImageType

    image = "https://placehold.it/600x400&text=IMAGE"

    if defaultImageType == 'storage-unit-overview'
      image = @configs.tabDefaults[index].storageImageOverview
    else if defaultImageType == 'man-in-box'
      image = @configs.tabDefaults[index].storageImageManInBox
    else if defaultImageType == '3d-view'
      image = @configs.tabDefaults[index].storageImage3dView
    else if defaultImageType == 'custom' && tab.storageImageCustom != ""
      image = tab.storageImageCustom


G5.loadWidgetConfigs('.storage-size-guide .config', StorageSizeGuideWidget)
