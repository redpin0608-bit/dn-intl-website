window.I18N = (function () {
  var dict = window.I18N_DICT || {};
  var supported = ['ko', 'zh', 'en'];
  var current = localStorage.getItem('daeun-lang') || 'ko';
  if (supported.indexOf(current) === -1) current = 'ko';

  function get(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function t(key) {
    var val = get(dict[current], key);
    if (val === undefined) val = get(dict.ko, key);
    return val === undefined ? key : val;
  }

  function apply() {
    document.documentElement.setAttribute('lang', current);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key);
      if (Array.isArray(val)) {
        el.innerHTML = val.map(function (line) { return '<span>' + line + '</span>'; }).join('');
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('.lang-switch button').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === current);
    });
  }

  function setLang(lang) {
    if (supported.indexOf(lang) === -1) return;
    current = lang;
    localStorage.setItem('daeun-lang', lang);
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply();
    document.querySelectorAll('.lang-switch button').forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang')); });
    });
  });

  return { t: t, setLang: setLang, apply: apply, get current() { return current; } };
})();
