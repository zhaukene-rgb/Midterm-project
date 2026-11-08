
$(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reducedMotion ? 0 : 250;
  const $top = $('.to-top');
  let topVisible = false;

  function updateTopButton() {
    const shouldShow = $(window).scrollTop() > 300;
    if (shouldShow === topVisible) return;
    topVisible = shouldShow;

    if (shouldShow) $top.stop(true, true).fadeIn(duration);
    else $top.stop(true, true).fadeOut(duration);
  }
  $(window).on('scroll', updateTopButton);
  updateTopButton();


  $top.on('click', function () {
    $('html, body').stop(true).animate({ scrollTop: 0 }, duration * 2);
    document.getElementById('main').focus({ preventScroll: true });
  });

  $('a[href^="#"]').not('.skip-link').on('click', function (event) {
    const id = this.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    $('html, body').stop(true).animate({ scrollTop: $(target).offset().top - 24 }, duration * 2);
  });


  $('.acc-q').on('click', function () {
    const $button = $(this);
    const $panel = $('#' + $button.attr('aria-controls'));
    const wasOpen = $button.attr('aria-expanded') === 'true';

    $('.acc-q').attr('aria-expanded', 'false');
    $('.acc-a').not($panel).stop(true, true).slideUp(duration);
    $button.attr('aria-expanded', String(!wasOpen));

    if (wasOpen) $panel.stop(true, true).slideUp(duration);
    else $panel.stop(true, true).slideDown(duration);
  });
});
