class PromotedReviewsWidget
  constructor: (@configs)->
    @widget = $("##{@configs.widgetId}")
    @review_api_url = "https://reputation.g5search.com/api/promoted_reviews/stores/#{@configs.apiUrlId}.json"
    @feedSource = new ReviewFeedSource(@review_api_url)

    if @configs.review_type == 'full'
      $(@feedSource).bind("feedReady", (event) =>
        new ReviewTemplater(@configs.branded_name, @widget).update(@feedSource.feed))

    else if @configs.review_type == 'hcard'
      targetElement = if @configs.insert_review_schema == "" then ".contact-info" else @configs.insert_review_schema
      $(@feedSource).bind("feedReady", (event) =>
        new BusinessSchemaUpdater(targetElement, @configs.review_page_url, @widget).update(@feedSource.feed))

    @feedSource.getFeed()

class ReviewFeedSource
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

class BusinessSchemaUpdater
  # Looks for specifed element (usually .contact-info), and inserts a link to the reviews page
  constructor: (@insert_review_schema, @review_page_url, @widget) ->

  update: (feed) ->
    $(@insert_review_schema).append(@schemaTemplate(feed.location)) if feed.location.review_count > 0

  schemaTemplate: (location) ->
    """
    <div class="ratings-summary-outer">
      <div class="rating ratings-summary">
        <span class="average-rating"></span>
        <a href="#{@review_page_url}" class="total-reviews">
          <span>(#{location.review_count} reviews)</span>
        </a>
        <span class="gold-stars" style="width:#{Math.round(location.average_rating * 16)}px;"></span>
      </div>
    </div>
    """

class ReviewTemplater
  # Generates the full review markup
  constructor: (@branded_name, @widget) ->

  update: (feed) ->
    @widget.find('.promoted-reviews-content').append(@reviewTemplate(feed.location, review)) for review in feed.reviews

  reviewTemplate: (location, review) ->
    if review.review_link?.length
      fullReviewLink = "<a href=\"#{review.review_link}\" target=\"_blank\">Read More &gt;</a>"
    else
      fullReviewLink = ""

    """
    <div class="review">
      <div class="review-body">#{review.excerpt}#{fullReviewLink}</div>
      <div class="location-name notranslate">#{@branded_name}</div>
      <div class="author">
        Written by: <span class="notranslate">#{review.author}</span>
        <span class="#{@classifyReputationSiteName(review.reputation_site_name)} via">
          via #{review.reputation_site_name}
        </span>
      </div>
      <div class="date">
        <meta content="#{review.date}">Date published: #{review.date}
      </div>
      <div class="rating">
        <meta content="1"><span>#{review.rating}</span> / <span>#{location.out_of}</span> stars
        <span class="gold-stars" style="width:#{Math.round(review.rating * 16)}px;"></span>
      </div>
    </div>
    """

  classifyReputationSiteName: (name) ->
    @lowercaseFirstChar(name).replace(/[^0-9a-z]/i, '')

  lowercaseFirstChar: (string) ->
    string.charAt(0).toLowerCase() + string.slice(1);


G5.loadWidgetConfigs('.promoted-reviews .config', PromotedReviewsWidget)
