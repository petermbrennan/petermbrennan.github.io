$(function() {
  if ($('.corporate-navigation').length < 1 && $('#drop-target-btn .button').length < 1) {
    $('header[role=banner]').addClass('simple-header');
  }
});