class LogoWidget
  constructor: (@configs)->
    logoUrl = new HomeUrl(@configs)


G5.loadWidgetConfigs('.logo .config', LogoWidget)
