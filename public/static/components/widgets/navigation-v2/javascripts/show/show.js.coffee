class NavigationWidget
  constructor: ->
    @dropTarget = $("#drop-target-nav")
    @corporateMenu = @dropTarget.find(".corporate-navigation")
    @locationMenu = @dropTarget.find(".navigation")
    @path = location.pathname.match(/([^\/]*)\/*$/)[1]
    @setupMenus()

    if @dropTarget.find(".has-subnav").length > 0
      $("body").on "click", (e) =>
        @resetSubNav()
        return

    $(window).smartresize =>
      @setMenuHeights()

    $(this).trigger("navigationReady")

  setActiveMenu: (menu) ->
    menu.find("a[href$=\"/" + @path + "\"]").addClass "active"

  setMenuHeights: ->
    @setMenuHeight @corporateMenu if @corporateMenu.length > 0
    @setMenuHeight @locationMenu if @locationMenu.length > 0

  setMenuHeight: (menu) ->
    menu.css maxHeight: $(window).height() - $("header[role=banner] .collapsable-btn").outerHeight(true) + "px"

  setupMenus: ->
    @setupMenu @corporateMenu if @corporateMenu.length > 0
    @setupMenu @locationMenu if @locationMenu.length > 0

  setupMenu: (menu) ->
    @setActiveMenu menu
    @setMenuHeight menu
    @setupSubNav menu if menu.find(".has-subnav").length > 0

  setupSubNav: (menu) ->
    menu.find(".has-subnav > a").on "click", (e) =>
      elem = $(e.currentTarget)
      @closeSubNav @corporateMenu.find(".subnav").not(elem.next())
      @closeSubNav @locationMenu.find(".subnav").not(elem.next())
      @toggleSubNav elem.next()
      window.noEvent(e)

  closeSubNav: (subnav) ->
    subnav.removeClass "show-subnav"
    subnav.parent().removeClass "subnav-open"

  toggleSubNav: (subnav) ->
    subnav.toggleClass "show-subnav"
    subnav.parent().toggleClass "subnav-open"

  resetSubNav: ->
    @closeSubNav @corporateMenu.find(".subnav")
    @closeSubNav @locationMenu.find(".subnav")


NAVIGATION = new NavigationWidget
