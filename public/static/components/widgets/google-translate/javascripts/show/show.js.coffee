$ ->
  googleTranslateConfig = $('#google-translate-config')
  if googleTranslateConfig.length
    configs = JSON.parse(googleTranslateConfig.html())

    translateMarkup = $("#google_translate_element")

    if configs.appendOptions == 'append_true'
      translateMarkup.insertAfter(configs.appendElement)

    else if configs.appendOptions == 'prepend_true'
      translateMarkup.insertBefore(configs.appendElement)