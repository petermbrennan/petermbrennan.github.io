(function(){var t,n;$(document).ready(function(){var i;return i=new n,$.each(i.configs,function(n,i){return new t(i)})}),n=function(){function t(){var t;t=$(".photo-group-config"),this.configs=$.map(t,function(t){return JSON.parse($(t).html())})}return t}(),t=function(){function t(t){this.widget=$("#"+t.widgetId),this.filter=this.widget.find(".filter"),this.lazyImg=this.widget.find("img.lazy-load"),this.lazyLoad()}return t.prototype.lazyLoad=function(){return this.lazyImg.unveil()},t}()}).call(this);