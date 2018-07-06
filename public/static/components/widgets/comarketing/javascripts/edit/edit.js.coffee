class EditComarketing
  locationSelects: null
  alert: null

  constructor: ()->
    @topModal = window.top.$('#modal')
    @locationSelects = @topModal.find('.location-select select')
    @alert = @topModal.find(".alert")
    @locationSelects.on 'change', =>
      @validateUniqueLocations()
    @validateUniqueLocations()

  validateUniqueLocations: ()->
    if @hasAllUniqueLocations()
      @alert.hide()
    else
      @alert.show()

  hasAllUniqueLocations: ()->
    unique = true
    $.each @locationSelects, (idx1, elem1)=>
      val1 = $(elem1).val()
      if val1.length
        $.each @locationSelects, (idx2, elem2)=>
          if idx2 > idx1
            val2 = $(elem2).val()
            unique = false if val2.length && val1 == val2
    return unique

new EditComarketing