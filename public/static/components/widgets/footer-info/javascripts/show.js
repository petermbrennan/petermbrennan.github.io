(function() {
  var localPath, widget;

  $(".footer-info").each(function(idx, elem){
    widget = $(elem);
    widget.find(".current-year").html(new Date().getFullYear());
  });

  if ($(".social-links.widget").length < 1) {
    localPath = window.location.href;
    if (window.location.hash) {
      localPath = localPath.replace(window.location.hash, '');
    }

    $.each($(".social-links use"), function() {
      if ($(this).attr("xlink:href").indexOf("http") != 0) {
        $(this).attr("xlink:href", localPath + $(this).attr("xlink:href"));
      }
    });
  }
}).call(this);
