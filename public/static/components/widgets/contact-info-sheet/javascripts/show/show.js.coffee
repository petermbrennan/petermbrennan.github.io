class ContactInfoSheetWidget
  constructor: (@configs)->
    @widget = $("##{@configs.widgetId}")
    if typeof noStickyNavForIE9 != 'undefined'
      @widget.remove()
    else
      @widget.removeClass('hidden')
      @initialize()
      @runWidget()

  initialize: ->
    G5.fortAwesomeApi.registerWidget(@, 'fortAwesomeLoaded')
    @setDesktopPosition()
    @setToggleBehavior()
    @setClickBehavior()
    @setResizeBehavior()

    if @configs.showScroll == "yes"
      @setScreenScroll()

    if @configs.showHome == "yes"
      @setHomeUrl()

  runWidget: ->
    @phoneNumber = new PhoneNumber(@configs, "##{@configs.widgetId}")
    @setFadeDelay()
    @chatWindow()
    @setMobilePosition() unless @isDesktop()
    @resize()

  setDesktopPosition: ->
    if @configs.layout != "b-right" && @configs.layout != "b-left"
      content = @widget.find(".info-sheet-content")

      $("body").css "padding-bottom", 0
      screenHeight = $(window).height()
      defaultWidgetPosition = Math.round($("header[role=banner]").outerHeight() + 50)

      @widget.css("top", defaultWidgetPosition)

      content.css("max-height", Math.round(screenHeight - @widget.position().top))


  setToggleBehavior: ->
    @widget.on "click", ".info-sheet-toggle", (e)=>
      elem = $(e.currentTarget)

      if elem.hasClass('no-toggle')
        return true

      @widget.find(".info-sheet-toggle").removeClass "active"

      if elem.hasClass("info-sheet-phone-btn")
        if @widget.hasClass("showing-phone")
          @widget.removeClass "opened showing-phone"
        else
          @showPhone()
          elem.addClass "active"

      else
        if @widget.hasClass("showing-email")
          @widget.removeClass "opened showing-email"
        else
          @showEmail()
          elem.addClass "active"

      false

  setClickBehavior: ->
    @widget.on "click", "form", (e)=>
      e.stopPropagation()
    $("html").on "click", (e)=>
      @widget.removeClass("opened").find(".info-sheet-toggle").removeClass "active"

  setResizeBehavior: ->
    $(window).smartresize =>
      @resize()

  resize: ->
    if @isDesktop()
        if @widget.hasClass('mobile')
          @widget.removeClass('mobile')
          @initialize()
        else
          @setDesktopPosition()
      else
        @stopContactInfoSheet()

  setScreenScroll: ->
    screenHeight = $(window).height()

    @widget.on "click", ".info-sheet-page-up", ->
      scrollPosition = $(window).scrollTop()
      scrollAmount = scrollPosition - screenHeight
      $("html, body").animate
        scrollTop: scrollAmount
      , 500

    @widget.on "click", ".info-sheet-page-down", ->
      scrollPosition = $(window).scrollTop()
      scrollAmount = scrollPosition + screenHeight
      $("html, body").animate
        scrollTop: scrollAmount
      , 500

  setHomeUrl: ->
    if $("body").hasClass('web-page-template')
      @widget.find('.info-sheet-nav').addClass('has-home-btn');

    $(window).load ()=>
      homeUrl = $('#drop-target-logo .logo').attr('href')
      @widget.find('.info-sheet-home-btn').attr('href', homeUrl)

  setFadeDelay: ->
    delay = parseInt(@configs.fadeDelay) * 1000
    fadeSpeed = 420
    $(document).idle
      onIdle: =>
        @widget.fadeOut(fadeSpeed) unless @widget.hasClass('.opened')
      onActive: =>
        @widget.fadeIn(fadeSpeed) unless noStickyNavForIE9?
      idle: delay
      events: 'mousemove keypress mousedown scroll'

  chatWindow: ->
    if @configs.third_party_chat.length > 1
      chatMarkup =  """<a href="#{@configs.third_party_chat}" class="info-sheet-chat-btn info-sheet-icon cis-btn"><i class="fa fa-comment"></i><span>Chat</span></a>"""
      $(chatMarkup).insertAfter(@widget.find(".info-sheet-email-btn"))
      @widget.find('.info-sheet-chat-btn').click (e)=>
        openChatWindow = window.open(@configs.third_party_chat, 'Chat', """width=#{@configs.chat_width}, height=#{@configs.chat_height}, scrollbars=yes, resizable=yes""")
        false

  showPhone: ->
    @widget.removeClass "opened showing-email"
    @widget.find(".info-sheet-email").hide()
    @widget.find(".info-sheet-phone").show()
    @widget.addClass "opened showing-phone"

  showEmail: ->
    @widget.removeClass "opened showing-phone"
    @widget.find(".info-sheet-phone").hide()
    @widget.find(".info-sheet-email").show()
    @widget.addClass "opened showing-email"

  isDesktop: ->
    $(window).width() >= 737

  setMobilePosition: ->
    @widget.addClass('mobile')
    widgetHeight = @widget.outerHeight()
    $("body").css "padding-bottom", widgetHeight

  stopContactInfoSheet: ->
    @setMobilePosition()
    @widget.off("click", ".info-sheet-toggle").removeClass("opened showing-email showing-phone").removeAttr "style"
    @widget.off "click", ".info-sheet-page-up"
    @widget.off "click", ".info-sheet-page-down"


## @e have to use a different naming convention for the config class because
## there is a second config JSON embedded in the widget for the G5 Form Enhancer
G5.loadWidgetConfigs(".contact-info-sheet-config", ContactInfoSheetWidget)
