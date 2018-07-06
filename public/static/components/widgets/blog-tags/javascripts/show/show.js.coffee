# Start Here: Get widget configs, build
# initial view, and set up click listeners
# ******************************************

class BlogTagsWidget
  constructor: (@configs)->
    @widget = $("##{@configs.widgetId}")
    new BlogTagsInitializer(@configs, @widget)
    window.addEventListener('popstate', (e) =>
      new BlogTagsInitializer(@configs, @widget)
    )

    $(window).on('tagChange', (e) =>
      new ActiveTagClassChanger(@widget)
    )

class BlogTagsInitializer
  constructor: (@configs, @widget) ->
    feedURL = "#{@configs.newsServiceDomain}/locations/#{@configs.locationURN}/tags.json"
    feedSource = new BlogTagFeedSource(feedURL)
    $(feedSource).bind("feedReady", (event) =>
      tags = feedSource.feed.tags
      new BlogTagsBuilder(tags, @widget)
    )
    feedSource.getFeed()


# Build Tags Markup
# *******************************************
class BlogTagsBuilder
  constructor: (@tags, @widget) ->
    @buildMarkup()
    @clickListeners()

  buildMarkup: () ->
    @widget.find(".tag-link").remove()
    markup = []
    markup.push( "<a href='#' class='tag-link' data-tag='all'>All</a>" )
    for tag, index in @tags
      markup.push( "<a href='#' class='tag-link' data-tag='#{tag.name}'>#{@titleize(tag.name)}</a>" )

    @widget.append(markup.join(''))
    new ActiveTagClassChanger(@widget)

  clickListeners: () ->
    that = this
    @widget.on('click', '.tag-link', ->
      tag = $(this).data("tag")
      that.updateUrl("tag", tag)
      $(window).trigger("tagChange")
      false
    )

  updateUrl: (param, slug) ->
    currentPath = window.location.pathname
    if param && slug
      queryString = "?#{param}=#{slug}"
    else
      queryString = ""
    window.history.pushState({},"", "#{currentPath}#{queryString}")

  titleize: (string) ->
    words = string.split('-')
    formattedWords = []
    for word, index in words
      formattedWords.push(word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
    formattedWords.join(' ')


# Get news feed from service or session storage
# *********************************************

class BlogTagFeedSource
  constructor: (@url) ->

  getFeed: ->
    if @feedFromStorage()
      $(this).trigger("feedReady")
    else
      @fetch()

  fetch: ->
    $.ajax
      url: @url
      dataType: 'json'
      success: (data, status, xhr) =>
        @feed = data
        @storeFeed()
        $(this).trigger("feedReady")
      error: (xhr, status, error) =>

  feedFromStorage: ->
    try
      @feed = JSON.parse(sessionStorage.getItem(@url))
    catch
      null

  storeFeed: ->
    try
      sessionStorage.setItem(@url, JSON.stringify(@feed))
    catch
      null

# Swap some classes when the selected tag changes
# ******************************************

class ActiveTagClassChanger
  constructor: (@widget)->
    @widget.find('.tag-link').removeClass("active-tag")

    urlParam = new GetQueryParameter("tag").value()
    sessionStore = sessionStorage.getItem('currentTag')

    activeTag = if urlParam then urlParam else sessionStore

    if activeTag
      @widget.find(".tag-link[data-tag='#{activeTag}']").addClass("active-tag")

    else
      @widget.find(".tag-link[data-tag='all']").addClass("active-tag")

# Find a query param if it exists
# ******************************************

class GetQueryParameter
  constructor: (@param) ->

  value: () ->
    name = @param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
    regex = new RegExp("[\\?&]#{name}=([^&#]*)")
    results = regex.exec(location.search);
    if results == null
      false
    else
      decodeURIComponent(results[1].replace(/\+/g, " "))


G5.loadWidgetConfigs('.blog-tags .config', BlogTagsWidget)
