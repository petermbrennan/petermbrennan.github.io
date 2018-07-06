CKEDITOR.editorConfig = function(config) {
  config.toolbarGroups = [{
    name: "document",
    groups: ["mode"]
  }, {
    name: "clipboard"
  }, {
    name: "basicstyles"
  }, {
    name: "paragraph",
    groups: ["list", "align"]
  }, {
    name: "links"
  }, {
    name: "insert"
  }, {
    name: "styles"
  }],
  config.disableNativeSpellChecker = false,
  config.scayt_autoStartup = true,
  config.scayt_maxSuggestions = 3,
  config.extraPlugins = ["justify", "font"],
  config.removeButtons = "Anchor,Underline,Strike,Subscript,Superscript,Copy,Cut,Styles,Flash,Table,Smiley,SpecialChar,PageBreak,Iframe,Save,NewPage,Preview,Print",
  config.removeDialogTabs = "link:advanced",
  config.dialog_backgroundCoverColor = "transparent",
  config.extraAllowedContent = "span;br;ul;ol;li;blockquote;div[*];",
  config.extraAllowedContent += "style[*];script[*];link[*];iframe[*];form[*];input[*];textarea[*];button[*];",
  config.extraAllowedContent += "table[*];tr[*];td[*];th[*];thead[*];tbody[*];tfoot[*];",
  config.extraAllowedContent += "*[id];*(*);*{*};"
}, CKEDITOR.config.removeButtons += $("body").hasClass("g5-user") ? "" : ",Source";
