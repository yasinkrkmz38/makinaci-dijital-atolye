'use strict';

/*
  Dijital Makinacı V17.2 — Login/Boot Overlay Hard Fix
*/
(function () {
  function killOverlays() {
    for (const id of ['loginTransition', 'bootSplash']) {
      const el = document.getElementById(id);
      if (!el) continue;
      el.classList.add('hide', 'out');
      el.setAttribute('aria-hidden', 'true');
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
    }
  }

  const style = document.createElement('style');
  style.id = 'dm-login-overlay-hard-fix';
  style.textContent = `
    #loginTransition,#bootSplash{
      display:none!important;
      visibility:hidden!important;
      opacity:0!important;
      pointer-events:none!important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  try {
    playLoginTransition = async function () {
      killOverlays();
      return;
    };
  } catch (_) {
    window.playLoginTransition = async function () {
      killOverlays();
    };
  }

  try {
    finishBootSplash = function () {
      killOverlays();
    };
  } catch (_) {
    window.finishBootSplash = killOverlays;
  }

  killOverlays();
  document.addEventListener('DOMContentLoaded', killOverlays, {once:true});
  window.addEventListener('load', killOverlays);
  window.addEventListener('pageshow', killOverlays);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) killOverlays();
  });

  const observer = new MutationObserver(killOverlays);
  observer.observe(document.documentElement, {childList:true, subtree:true});

  [0,250,1000,3000].forEach(ms => setTimeout(killOverlays, ms));
})();
