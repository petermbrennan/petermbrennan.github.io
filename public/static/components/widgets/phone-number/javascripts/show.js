(function(){var e;e=function(){function e(e){var n;return this.configs=e,"true"===this.configs.appendPhone&&$(this.phoneMarkup()).insertAfter(""+this.configs.appendElements),"true"===this.configs.prependPhone&&$(this.phoneMarkup()).insertBefore(""+this.configs.appendElements),"true"===this.configs.appendPhone||"true"===this.configs.prependPhone?(n=$(""+this.configs.appendElements).parents("div"),n.addClass("phone-widget-wrapper"),this.phoneNum=new PhoneNumber(this.configs,".phone-widget-wrapper .appended-phone"),$(window).trigger("appendedPhoneNumberReady","#"+this.configs.widgetId)):"true"===this.configs.displayPhone&&(this.phoneNum=new PhoneNumber(this.configs,"#"+this.configs.widgetId)),this.phoneNum}return e.prototype.phoneMarkup=function(){return" <a href='tel://"+this.configs.defaultPhoneNumber+"' id='appended-phone-"+this.configs.widgetId+"' class='appended-phone "+this.configs.widgetId+" number h-c-ret v-c-ret h-card vcard'> <span style='visibility:hidden;' class='p-tel tel'>"+this.configs.defaultPhoneNumber+"</span> </a> "},G5.loadWidgetConfigs(".phone .config",e),e}()}).call(this);