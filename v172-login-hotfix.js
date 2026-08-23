'use strict';

/*
  Dijital Makinacı V17.2 — Login Transition Stability Hotfix
  Amaç:
  - Tam ekran loginTransition katmanının takılı kalmasını engellemek.
  - Giriş akışını engellemeyen, non-blocking davranış.
  - Masaüstü + mobil aynı şekilde çalışır.
*/
(function () {
  function forceHideLoginTransition() {
    const el = document.getElementById('loginTransition');
    if (!el) return;
    el.classList.add('hide');
    el.setAttribute('aria-hidden', 'true');
    el.style.pointerEvents = 'none';
  }

  // Mevcut bloklayıcı animasyonu güvenli/no-op hale getir.
  window.playLoginTransition = async function () {
    forceHideLoginTransition();
  };

  // Eski cache / BFCache / görünürlük geri dönüşlerinde de overlay kalmasın.
  window.addEventListener('pageshow', forceHideLoginTransition);
  window.addEventListener('load', () => {
    forceHideLoginTransition();
    setTimeout(forceHideLoginTransition, 250);
    setTimeout(forceHideLoginTransition, 1200);
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) setTimeout(forceHideLoginTransition, 0);
  });

  // Script daha geç enjekte edilse bile anında temizle.
  forceHideLoginTransition();
})();
