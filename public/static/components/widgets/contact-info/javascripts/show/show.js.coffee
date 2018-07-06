class ContactInfoWidget
  constructor: (config) ->
    @widgetId = config.widgetId
    @widget = $('#'+@widgetId)
    @phoneOptions = config
    @phoneNumber = new PhoneNumber(@phoneOptions, '#'+@widgetId)
    @initChat()
    @initSocialLinks()

  initChat: ()->
    @widget.find('.contact-info-chat').click (e)=>
      window.open(@phoneOptions.chatUrl, 'Chat', """width=600, height=480, scrollbars=yes, resizable=yes""")
      e.preventDefault()

  initSocialLinks: ()->
    if $(".social-links.widget").length < 1
      localPath = window.location.href

      if window.location.hash
        localPath = localPath.replace(window.location.hash, '')

      for element in $(".social-links use")
        if $(element).attr("xlink:href").indexOf("http") != 0
          $(element).attr("xlink:href", localPath + $(element).attr("xlink:href"))

G5.loadWidgetConfigs('.contact-info .config', ContactInfoWidget)
