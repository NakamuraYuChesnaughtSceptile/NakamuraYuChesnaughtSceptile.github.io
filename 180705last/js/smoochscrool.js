$(function () {
  var offsetY = -30;
  var time = 1000;
  $('a[href^="#"]').click(function () {
    var target = $(this.hash);
    if (!target.length) return;
    var targetY = target.offset().top + offsetY;
    $('html,body').animate({ scrollTop: targetY }, time, 'swing');
    window.history.pushState(null, null, this.hash);
    return false;
  });
});