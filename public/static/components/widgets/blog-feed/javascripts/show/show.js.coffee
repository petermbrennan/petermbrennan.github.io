# Start Here: Get widget configs, build
# initial view, and set up click listener
# ******************************************
window.initialBlogPageLoad = true

class BlogFeedWidget
  constructor: (@configs)->
    G5.fortAwesomeApi.registerWidget(@, 'fortAwesomeLoaded')
    new BlogFeedInitializer(@configs)
    window.addEventListener('popstate', (e) =>
      new BlogFeedInitializer(@configs)
    )

    # This event gets fired by the News Tags Widget
    $(window).on('tagChange', (e) =>
      new BlogFeedInitializer(@configs)
    )

class BlogFeedInitializer
  constructor: (@configs) ->
    feedURL = @buildFeedURL()
    feedSource = new BlogFeedSource(feedURL)
    $(feedSource).bind("feedReady", (event) =>
      feed = feedSource.feed
      new MetaUpdater(feed)
      toggleListener = new ToggleListener(@configs, feed)
      toggleListener.clearAllPosts()

      selectedArticle = new QueryParameter("article").value()

      if selectedArticle
        singleArticleView = new SingleArticleView(selectedArticle, @configs, feed)
        singleArticleView.buildSelectedPost()
        toggleListener.paginationListener()

      else if @configs.uiType == "full-page"
        new BlogFeedBuilder(@configs, feed)
        toggleListener.fullViewListener()
        toggleListener.paginationListener()

      else
        new BlogFeedBuilder(@configs, feed)
        toggleListener.basicListener()
        toggleListener.paginationListener()
    )

    feedSource.getFeed()
    new BlogFeedWidthChecker(@configs)

  buildFeedURL: () ->
    selectedArticle = new QueryParameter("article").value()
    selectedTag = new QueryParameter("tag").value()
    window.currentTag = selectedTag if selectedTag
    selectedPage = new QueryParameter("page").value()

    if selectedArticle
      baseURL = "#{@configs.newsServiceDomain}/locations/#{@configs.locationURN}/posts/#{selectedArticle}.json"
      tag = if window.currentTag then window.currentTag else "all"
      fullURL = "#{baseURL}?tag=#{tag}"

    else
      baseURL = "#{@configs.newsServiceDomain}/locations/#{@configs.locationURN}/blog_feed.json"
      perPage = parseInt(@configs.numberOfPosts)
      perPage = 20 if isNaN(perPage)

      tag = if selectedTag then selectedTag else "all"
      page = if selectedPage then selectedPage else "1"

      fullURL = "#{baseURL}?tag=#{tag}&page=#{page}&per_page=#{perPage}"

# Build out markup for initial list of posts
# ******************************************

class BlogFeedBuilder
  constructor: (@configs, feed) ->
    @widget = $("##{@configs.widgetId}")
    @feed = feed.posts
    @populateFeed()
    @buildPaginationLinks(feed.meta)

  populateFeed: () ->
    markup = []

    for post, index in @feed
      markup.push( "<div class='news-feed-post'>
                      #{@toggleMarkup(post, index)}
                      #{@detailsMarkup(post)}
                      <div class='post-body'>#{post.text}</div>
                      #{@bottomToggles(post, index)}
                    </div>" )

    @widget.append(markup.join(''))

  pathForPost: (post)->
    new SharedBlogHelpers().pathForPost(post)

  toggleMarkup: (post, index) ->
    linkTag = "<a class='post-toggle' href='#{@pathForPost(post)}' data-post-slug='#{post.title_slug}' data-post-index='#{index}'>"
    toggle  = linkTag
    toggle += "  <img src='#{post.image}' #{CloudinaryHelper.responsiveImage(post.image)} />" unless post.image == "" || @configs.displayPhotos != "true"
    toggle += "</a>"
    toggle += linkTag
    toggle += "  <h1 class='post-title'>#{post.title}</h1>" unless post.title == ""
    toggle += "</a>"
    toggle


  bottomToggles: (post, index) ->
    toggles  = "<a class='post-toggle toggle-button post-expand' href='#{@pathForPost(post)}' data-post-index='#{index}' data-post-slug='#{post.title_slug}'>Read More</a>"
    toggles += "<a class='post-toggle toggle-button post-collapse' href='#'>Hide This</a>" if @configs.uiType != "full-page"
    toggles

  detailsMarkup: (post) ->
    details  = "<span class='post-date'>#{post.pretty_date}</span>" unless post.title == ""
    details += "<span>|</span><span class='post-author'>by #{post.author}</span>" unless post.author == ""
    details += "<div class='post-description'>#{post.description}</div>"
    details

  buildPaginationLinks: (meta) ->
    pageButtons = []

    if meta.total_pages > 1

      if meta.page != 1
        pageButtons.push("<a href='#' class='pagination-button pagination-text prev' data-page-number='#{meta.page - 1}' data-tag='#{meta.tag}'><i class='fa fa-chevron-left'></i> <span class='previous-next'>Previous Page</span></a>")

      for page in [1..meta.total_pages]
        active = if page == meta.page then "active-page" else ""
        lastPage = if page == (meta.total_pages) then "last" else ""
        pageButtons.push("<a href='#' class='pagination-button page-button #{active} #{lastPage}' data-page-number='#{page}' data-tag='#{meta.tag}'>#{page}</a>")

      if meta.page != meta.total_pages
        pageButtons.push("<a href='#' class='pagination-button pagination-text next' data-page-number='#{meta.page + 1}' data-tag='#{meta.tag}'><span class='previous-next'>Next Page</span> <i class='fa fa-chevron-right'></i></a>")

      paginationMarkup = "<div class='blog-pagination'>
                            #{pageButtons.join('')}
                          </div>"

      $('.news-feed-widget').append(paginationMarkup)
      $(paginationMarkup).insertAfter('#news-feed-top')


# Build markup for selected item
# ******************************************

class SingleArticleView
  constructor: (@slug, @configs, feed) ->
    @widget = $("##{@configs.widgetId}")
    @post = feed.post
    @next = @post.next
    @previous = @post.previous

  pathForPost: (post)->
    new SharedBlogHelpers().pathForPost(post)

  buildSelectedPost: () ->
    post = @post
    postMarkup = "<div class='news-feed-single-post'>
                    <div class='article-top'>#{@fullListLink(post)}</div>
                    #{@imageMarkup(post)}
                    <h1 class='post-title'>#{post.title}</h1>
                    <span class='post-date'>#{post.pretty_date}</span>
                    #{@authorMarkup(post)}
                    #{@tagsMarkup(post)}
                    <div class='post-body'>#{post.text}</div>
                    #{@addToAnyCode()}
                    <div class='posts-nav'>
                      #{@previousButton()}
                      <a href='#' class='all-posts'>See More News</a>
                      #{@nextButton()}
                    </div>
                  </div>"

    @widget.append(postMarkup)

    toggleListener = new ToggleListener(@configs, @feed)
    toggleListener.fullViewListener()
    toggleListener.listViewListener()
    toggleListener.tagButtonListener()

  nextButton: () ->
    if @next
      " <a href='#{@pathForPost(@next)}' data-post-slug='#{@next.title_slug}' class='post-toggle next-post'>
          <div class='post-nav-top'>
            <span>Next</span> <i class='fa fa-chevron-right'></i>
          </div>
          <div>
            #{@navImageMarkup(@next)}
            <div class='post-title'>#{@next.title}</div>
            <div class='post-date'>#{@next.pretty_date}</div>
            #{@authorMarkup(@next)}
          </div>
        </a> "
    else
        ""

  imageMarkup: (post) ->
    if @configs.displayPhotos == "true" && post.image != ""
      "<img src='#{post.image}' #{CloudinaryHelper.responsiveImage(post.image)} />"
    else
      ""

  authorMarkup: (post) ->
    if post.author != ""
      "<span class='author-divider'>|</span><span class='post-author'>by #{post.author}</span>"
    else
      ""

  tagsMarkup: (post) ->
    return "" unless post.tags.length
    currentPath = window.location.pathname
    markup = []
    markup.push("<div class='post-tags'>")
    markup.push("<a href='#' data-tag='all' class='article-tag'>All</a>")
    for tag, index in post.tags
      markup.push( "<a href='#' data-tag='#{tag.name}' class='article-tag'>#{@titleize(tag.name)}</a>" )
    markup.push("</div>")
    markup.join(' ')

  previousButton: () ->
    if @previous
      " <a href='#{@pathForPost(@previous)}' data-post-slug='#{@previous.title_slug}' class='post-toggle previous-post'>
          <div class='post-nav-top'>
            <i class='fa fa-chevron-left'></i> <span>Previous</span>
          </div>
          <div>
            #{@navImageMarkup(@previous)}
            <div class='post-title'>#{@previous.title}</div>
            <div class='post-date'>#{@previous.pretty_date}</div>
            #{@authorMarkup(@previous)}
          </div>
        </a> "
    else
      ""

  navImageMarkup: (post) ->
    markup = ""
    if @configs.displayPhotos == "true"
      image = post.image
      image = @configs.defaultImage if image == ""
      imageElement = "<img src='#{image}' #{CloudinaryHelper.responsiveImage(image)} />" if image != ""
      markup = "<div class='post-image-wrapper'><div>#{imageElement}</div></div>" if imageElement

    markup

  fullListLink: () ->
    currentTag = if window.currentTag then window.currentTag else "all"
    perPage = parseInt(@configs.numberOfPosts)
    perPage = 20 if isNaN(perPage)
    position = @post.index_in_feed / perPage
    pageForPost = Math.ceil(position)
    linkText = if @configs.returnToListText == "" then "Back To List" else @configs.returnToListText

    "<a href='#' class='pagination-button pagination-text prev' data-page-number='#{pageForPost}' data-tag='#{currentTag}'><i class='fa fa-chevron-left'></i> #{linkText}</a>"

  addToAnyCode: () ->
    if @configs.shareButtons == "true"
      " <div class='a2a_kit a2a_kit_size_32 a2a_default_style'>
          <a class='a2a_dd' href='https://www.addtoany.com/share'></a>
          <a class='a2a_button_facebook'></a>
          <a class='a2a_button_twitter'></a>
          <a class='a2a_button_google_plus'></a>
        </div>
        <script type='text/javascript' src='//static.addtoany.com/menu/page.js'></script> "
    else
      ""

  titleize: (string) ->
    words = string.split('-')
    formattedWords = []
    for word, index in words
      formattedWords.push(word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
    formattedWords.join(' ')

# Choose type of listener based on UI type
# ******************************************

class ToggleListener
  constructor: (@configs, @feed) ->
    @widget = $("##{@configs.widgetId}")

  basicListener: () ->
    @widget.find('.post-toggle').click (e)=>
      $(e.currentTarget).siblings(".post-description, .post-body").slideToggle()
      $(e.currentTarget).parent().toggleClass("active-post")
      @scrollToPost()
      window.noEvent(e)

  fullViewListener: () ->
    @widget.find('.post-toggle').click (e)=>
      postSlug = $(e.currentTarget).data("post-slug")
      @clearAllPosts()
      @updateUrl([["article", postSlug]])
      new BlogFeedInitializer(@configs)
      @scrollToPost()
      window.noEvent(e)

  listViewListener: () ->
    @widget.find('.all-posts').click (e)=>
      @updateUrl([[null,null]])
      new BlogFeedInitializer(@configs)
      # the tagChange event is used by the News Tags Widget
      $(window).trigger("tagChange")
      window.noEvent(e)

  tagButtonListener: () ->
    @widget.find('.article-tag').click (e)=>
      tag = $(e.currentTarget).data("tag")
      @updateUrl([["tag", tag]])
      new BlogFeedInitializer(@configs)
       # the tagChange event is used by the News Tags Widget
      $(window).trigger("tagChange")
      window.noEvent(e)

  paginationListener: () ->
    @widget.find('.pagination-button').click (e)=>
      btn = $(e.currentTarget)
      page = btn.data("page-number")
      tag = btn.data("tag")
      @updateUrl([["tag",tag], ["page",page]])
      new BlogFeedInitializer(@configs)
      window.noEvent(e)

  clearAllPosts: () ->
    if window.initialBlogPageLoad
      window.initialBlogPageLoad = false
      @widget.find('.blog-loading').remove()
    else
      @widget.find(".news-feed-single-post, .news-feed-post, .blog-pagination").remove()

  scrollToPost: () ->
    $('html, body').scrollTop(0)
    positionedHeader = $('header[role=banner]')
    fixedHeaderOffset = 0
    denaliCondition = !positionedHeader.hasClass("fixed-header")
    if positionedHeader.css('position') == 'fixed' && denaliCondition
      fixedHeaderLogoHeight = positionedHeader.find(".logo").outerHeight()
      positionedHeaderHeight = positionedHeader.outerHeight()
      fixedHeaderOffset = Math.max(fixedHeaderLogoHeight, positionedHeaderHeight)
    else
      positionedHeader.find('*').each ->
        $this = $(this)
        if $this.css('position') == 'fixed'
          fixedHeaderOffset = $this.outerHeight()
    $('html, body').animate({
      scrollTop: @widget.offset().top - fixedHeaderOffset
    }, 420)

  updateUrl: (params) ->
    currentPath = window.location.pathname
    queryParams = []
    for param, index in params
      queryParams.push("#{param[0]}=#{param[1]}") if param[0] && param[1]

    queryString = if queryParams.length then "?#{queryParams.join('&')}" else ""

    window.history.pushState({},"", "#{currentPath}#{queryString}")


# Get news feed from service or session storage
# *********************************************

class BlogFeedSource
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

# Helpers shared across multiple classes
# ******************************************

class SharedBlogHelpers
  pathForPost: (post) ->
    page_path = window.location.pathname
    "#{window.location.pathname}?article=#{post.title_slug}"


# Pseudo Media Query
# ******************************************

class BlogFeedWidthChecker
  constructor: (@configs) ->
    @widget = $("##{@configs.widgetId}")
    @applyWidthClasses()
    $(window).resize () =>
      @applyWidthClasses()

  applyWidthClasses: () ->
    if @widget.width() <= 460
      @widget.removeClass("wide").addClass("narrow")
    else
      @widget.removeClass("narrow").addClass("wide")

# Find a query param if it exists
# ******************************************

class QueryParameter
  constructor: (@param) ->

  value: () ->
    name = @param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
    regex = new RegExp("[\\?&]#{name}=([^&#]*)")
    results = regex.exec(location.search);
    if results == null
      false
    else
      decodeURIComponent(results[1].replace(/\+/g, " "))

# Update title, description and canonical
# tags to reflect currently selected post
# ******************************************
class MetaUpdater
  constructor: (@feed) ->
    @getOriginalTags()
    @setTitleTag()
    @setMetaDescription()
    @setCanonical()

  setTitleTag: () ->
    if @feed.post
      # NAE Service escapes HTML
      # Hack to print HTML characters correctly
      txt = document.createElement("textarea")
      txt.innerHTML = @feed.post.title
      title = txt.value
      document.title = title
    else
      document.title = @originalTitle

  setMetaDescription: () ->
    descriptionTag = $("meta[name='description']")
    if @feed.post
      descriptionTag.attr('content', @feed.post.description)
    else
      descriptionTag.attr('content', @originalDescription)

  setCanonical: () ->
    canonicalLink = $("link[rel='canonical']")
    if @feed.post
      urlForPost = "#{@originalCanonical}?article=#{@feed.post.title_slug}"
      canonicalLink.attr('href', urlForPost)
    else
      canonicalLink.attr('href', @originalCanonical)


  getOriginalTags: () ->
    unless window.originalTitle
      window.originalTitle = document.title
      window.originalDescription = $("meta[name='description']").attr('content')
      window.originalCanonical = $("link[rel='canonical']").attr('href')

    @originalTitle = window.originalTitle
    @originalDescription = window.originalDescription
    @originalCanonical = window.originalCanonical

G5.loadWidgetConfigs('.blog-feed .config', BlogFeedWidget)
