class EditCorporateLocationsMap
  searchSelect: null
  target: null
  topWindow: null

  constructor: ()->
    @topWindow = window.top
    @searchSelect = @topWindow.$('.select-search-widget select')
    @searchSelect.on 'change', =>
      @setTargetSearchWidget()
    @setTargetSearchWidget()

  setTargetSearchWidget: ()->
    changed = !!(@target && @searchSelect.val() != @target)
    @target = @searchSelect.val()
    notAreaFields = @topWindow.$('.corp-search-field')
    cityStateZipFields = @topWindow.$('.city-state-zip-search-field')
    corpSearchFields = @topWindow.$('.corp-search-field:not(.city-state-zip-search-field)')
    if @target == 'area-page'
      @hideAndClear(notAreaFields)
    else if @target == 'city-state-zip-search'
      @hideAndClear(corpSearchFields)
      cityStateZipFields.show()
      @topWindow.$('.corp-search-page input').attr('placeholder', 'locations/') if changed
    else if @target == 'corp-search'
      cityStateZipFields.show()
      corpSearchFields.show()
      @topWindow.$('.corp-search-page input').attr('placeholder', 'apartment-search/') if changed
    return

  hideAndClear: (fields)->
    fields.hide()
    fields.find('input[type=text]').val("")
    fields.find('input[type=checkbox]').prop("checked", false)

new EditCorporateLocationsMap