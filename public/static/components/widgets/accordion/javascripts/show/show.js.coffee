class AccordionWidget
  constructor: (@configs)->
    @widget = $("##{@configs.widgetId}")
    @setupAccordion()

  setupAccordion: ->
    if @configs['start_open'] == "true"
      accTitle = @widget.find('.accordion-section-title').first()
      accTitle.addClass('active').next('.accordion-section-content').slideDown(300).addClass('open')

    @widget.find('.accordion-section-title').click (e)=>
      elem = $(e.currentTarget)
      targetSection = elem.attr('href')

      if elem.is('.active')
        elem.removeClass('active')
        @widget.find(targetSection).slideUp(300).removeClass('open')
      else
        elem.addClass('active')
        @widget.find(targetSection).slideDown(300).addClass('open')
      false

G5.loadWidgetConfigs('.accordion .config', AccordionWidget)