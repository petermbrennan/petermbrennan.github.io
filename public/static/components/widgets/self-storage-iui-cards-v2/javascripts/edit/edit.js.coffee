class EditSelfStorageIUICardsV2
  constructor: ()->
    @topWindow       = window.top
    @advancedOptions = @topWindow.$('.advanced-options')
    @container       = @topWindow.$(".modal-body")
    @link            = @topWindow.$('a#show_hide_advanced_options')
    @advancedOptions.hide()
    @setupToggleEvent()

  setupToggleEvent: () ->
    @link.on 'click', =>
      @advancedOptions.toggle()
      @container.scrollTop(
        @link.offset().top - @container.offset().top + @container.scrollTop()
      )  


        
new EditSelfStorageIUICardsV2