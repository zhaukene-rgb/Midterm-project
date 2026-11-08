document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('pickupForm');
  const fieldIds = ['nm', 'ph', 'em', 'wt', 'ad', 'dt', 'ok'];
  const success = document.getElementById('formSuccess');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reducedMotion ? 0 : 250;


  function getToday() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return now.getFullYear() + '-' + month + '-' + day;
  }
  document.getElementById('dt').min = getToday();

  
  function getError(id) {
    const input = document.getElementById(id);
    const value = input.value.trim();

    if (id === 'ok') return input.checked ? '' : 'Please read and accept the demo pickup rules.';
    if (value === '') return 'Please complete this field.';

    if (id === 'nm') {
      const letters = value.match(/[A-Za-zА-Яа-яЁёӘәІіҢңҒғҮүҰұҚқӨөҺһ]/g) || [];
      if (letters.length < 2) return 'Enter a name with at least 2 letters.';
      if (!/^[A-Za-zА-Яа-яЁёӘәІіҢңҒғҮүҰұҚқӨөҺһ\s'-]+$/.test(value)) return 'Use letters, spaces, hyphens or apostrophes only.';
    }
    if (id === 'ph') {
    
      const phone = value.replace(/[\s()-]/g, '');
      if (!/^(\+7|8)\d{10}$/.test(phone)) return 'Use +7 701 234 56 78 or 8 701 234 56 78.';
    }
    if (id === 'em' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Enter an email such as name@example.com.';
    if (id === 'ad' && value.length < 5) return 'Enter a street and house number (at least 5 characters).';
    if (id === 'dt') {
      input.min = getToday();
      if (input.validity.badInput || value < getToday()) return 'Choose today or a later date.';
    }
    return '';
  }

  function checkField(id) {
    const input = document.getElementById(id);
    const error = getError(id);
    document.getElementById(id + '-error').textContent = error;
    input.classList.toggle('is-invalid', error !== '');
    input.setAttribute('aria-invalid', String(error !== ''));
    return error === '';
  }

  fieldIds.forEach(function (id) {
    const input = document.getElementById(id);
    const eventName = input.tagName === 'SELECT' || input.type === 'checkbox' || input.type === 'date' ? 'change' : 'input';
    input.addEventListener(eventName, function () { checkField(id); });
    input.addEventListener('blur', function () { checkField(id); });
  });

  const prices = { small: 2000, medium: 4000, large: 7000 };
  function estimate() {
    const size = form.querySelector('input[name="size"]:checked').value;
    const service = form.querySelector('input[name="serviceType"]:checked').value;
    let total = prices[size];
    if (service === 'express') total = total * 1.5;
    document.getElementById('estimate').textContent = total.toLocaleString('en-US');
    return total;
  }
  form.querySelectorAll('input[type="radio"]').forEach(function (radio) {
    radio.addEventListener('change', estimate);
  });

  
  form.addEventListener('reset', function () {
    $(success).stop(true, true).hide();
    setTimeout(function () {
      fieldIds.forEach(function (id) {
        const input = document.getElementById(id);
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        document.getElementById(id + '-error').textContent = '';
      });
      estimate();
    }, 0);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    $(success).stop(true, true).hide();
    let valid = true;
    fieldIds.forEach(function (id) {
      if (!checkField(id)) valid = false;
    });
    if (!valid) {
      form.querySelector('.is-invalid').focus();
      return;
    }

    const name = document.getElementById('nm').value.trim().split(/\s+/)[0];
    const total = estimate();
    form.reset();


    $(success).text('Thank you, ' + name + '! Demo request validated. Your estimate was ' + total.toLocaleString('en-US') + ' KZT. Nothing was sent and no courier was booked.')
      .stop(true, true).hide().slideDown(duration, function () {
        success.focus({ preventScroll: true });
        $('html, body').stop(true).animate({ scrollTop: $(success).offset().top - 24 }, duration);
      });
  });
  estimate();
});
