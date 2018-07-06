class EventsWidget
  constructor: (@configs) ->
    @widget = $("##{@configs.widgetId}")
    @feedURL = "#{@configs.newsServiceDomain}/locations/#{@configs.locationURN}/calendar_feed.json"
    @feedSource = new EventsFeedSource(@feedURL)

    $(@feedSource).bind("feedReady", (event) =>
      new EventsFeedBuilder(@configs, @feedSource.feed, @widget)
    )
    @feedSource.getFeed()


# Generate markup for event cards
# **********************************************

class EventsFeedBuilder
  constructor: (@configs, @feed, @widget) ->
    @locationName = if @configs.locationName.length then @configs.locationName else "another time."
    @buildMarkup()
    @createListeners()

  buildMarkup: () ->
    eventCount = parseInt(@configs.numberOfPosts)
    eventCount = 10 if isNaN(eventCount)

    events = @feed[0...eventCount]
    markup = []

    for calendarEvent, index in events
      markup.push( "<div class='event-summary summary-closed'>
                      <div class='event-title'>#{calendarEvent.title}</div>
                      <div class='event-image'>#{@imageMarkup(calendarEvent.image)}</div>
                      <div class='event-time-summary'>
                        <div class='event-month'>#{calendarEvent.month}</div>
                        <div class='event-day'>#{calendarEvent.day}</div>
                        <div class='event-time'>#{calendarEvent.time || ""}</div>
                      </div>
                      <a href='#' class='event-details-button'>View Details <span>></span></a>
                    </div>
                    <div class='event-details hidden-details'>
                      <div class='event-specific-details'>
                        <div class='event-date-details'>#{calendarEvent.date_details}</div>
                        <div class='event-time-details'>#{calendarEvent.time_details  || ""}</div>
                        <div class='event-location'>#{calendarEvent.event_location}</div>
                      </div>
                      <div class='event-body'>#{calendarEvent.text}</div>
                    </div>" )

    if markup.length == 0
      markup.push("<div class='no-events'>Please check back for events at #{@locationName}</div>")

    @widget.append(markup.join(''))

  imageMarkup: (image) ->
    imgSrc = if image == "" then @configs.defaultImage else image

    if imgSrc != ""
      "<img src='#{imgSrc}' #{CloudinaryHelper.responsiveImage(imgSrc)} />"
    else
      ""
  createListeners: () ->
    @widget.find('a.event-details-button').click (e)=>
      elem = $(e.currentTarget)
      elem.parent().next('.event-details').toggleClass("hidden-details expanded-details")
      elem.parent().toggleClass("summary-closed summary-open")

      if elem.text() == "View Details >"
        @widget.find('.event-summary').hide()
        elem.parent().show()
        newText = "Close Details <span><</span>"
      else
        setTimeout ( () => @widget.find('.event-summary').show() ), 500
        newText = "View Details <span>></span>"

      elem.html(newText)
      false


# Get event feed from service or session storage
# **********************************************

class EventsFeedSource
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


G5.loadWidgetConfigs('.events .config', EventsWidget)
