class PhoneNumberWidget
  constructor: (@configs)->
    if @configs.appendPhone == 'true'
      $(@phoneMarkup()).insertAfter("#{@configs.appendElements}")

    if @configs.prependPhone == 'true'
      $(@phoneMarkup()).insertBefore("#{@configs.appendElements}")

    if @configs.appendPhone == 'true' || @configs.prependPhone == 'true'
      elemParent = $("#{@configs.appendElements}").parents('div')
      elemParent.addClass('phone-widget-wrapper')

      @phoneNum = new PhoneNumber(@configs, ".phone-widget-wrapper .appended-phone")
      $(window).trigger('appendedPhoneNumberReady', "##{@configs.widgetId}")
    else if @configs.displayPhone == 'true'
      @phoneNum = new PhoneNumber(@configs, "##{@configs.widgetId}")
    return @phoneNum

  phoneMarkup: ->
    " <a href='tel://#{@configs.defaultPhoneNumber}' id='appended-phone-#{@configs.widgetId}' class='appended-phone #{@configs.widgetId} number h-c-ret v-c-ret h-card vcard'>
        <span style='visibility:hidden;' class='p-tel tel'>#{@configs.defaultPhoneNumber}</span>
      </a> "

  G5.loadWidgetConfigs('.phone .config', PhoneNumberWidget)
