class PhotoRandomizerWidget
  constructor: (@config)->
    @widget = $("##{@config.widgetId}")
    @photos = @config.photos
    @cleanPhotoArray()
    @buildWidget(@randomPhoto())

  cleanPhotoArray: ->
    @cleanArray = []
    @photos.forEach (arrayItem) =>
      if arrayItem.url.length > 1
        @cleanArray.push arrayItem

  randomPhoto: ->
    @cleanArray[Math.floor(Math.random()*@cleanArray.length)] if @cleanArray.length

  buildWidget: (photo)  ->
    if photo?
      photoRandomizerMarkup = """<img class="u-photo" src="#{photo.url}" alt="#{photo.alt}" srcset='#{@buildSrcset(photo.url)}'>"""
      @widget.find('.photo-wrapper').append(photoRandomizerMarkup)

  buildSrcset: (imageUrl) ->
    return imageUrl unless imageUrl.includes?('cloudinary')
    srcset = []
    breakPoints = []
    originalWidthParam = imageUrl.match(/w_\d{3,4}/)[0]
    originalHeightParam = imageUrl.match(/h_\d{3,4}/)[0]

    maxWidth = parseInt(originalWidthParam.match(/\d{3,4}/)[0])
    maxHeight = parseInt(originalHeightParam.match(/\d{3,4}/)[0])
    return imageUrl unless maxWidth > 500 && maxHeight > 200
    for i in [2, 3, 4, 5, 6, 7, 8, 9, 10]
      srcsetOption = imageUrl.replace("#{originalHeightParam},#{originalWidthParam}/", "#{originalHeightParam},#{originalWidthParam}/c_scale,w_#{1/i},h_#{1/i}/")
      srcset.push(srcsetOption + " #{parseInt(maxHeight*(1/i))}w")
    srcset.join(",")


G5.loadWidgetConfigs('.photo-randomizer .config', PhotoRandomizerWidget)
