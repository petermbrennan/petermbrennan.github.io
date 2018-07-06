$(function() {
  // if last row with dark background exists and is empty, make it narrower
  if ($('div.row.text-light:last-of-type .col-1').length > 0) {
    if ($('div.row.text-light:last-of-type .col-1').is(':empty')) {
      $('div.row.text-light:last-of-type').css('padding', '1em 0');
    }
  }
});
