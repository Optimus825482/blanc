/* Content stays visible until an entrance animation starts; supports client-side navigation and reduced motion. */
(() => {
  if (!('IntersectionObserver' in window) || !matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    return;
  }

  document.documentElement.classList.add('bb-anim-ready');

  const reveal = (el, index) => {
    if (el.classList.contains('reveal-enter')) return;
    if (index > 0) {
      el.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
    }
    el.classList.add('reveal-enter');
  };

  const observer = new IntersectionObserver((entries) => {
    let batchIndex = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting && entry.boundingClientRect.top >= window.innerHeight) continue;
      reveal(entry.target, batchIndex++);
      observer.unobserve(entry.target);
    }
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -4% 0px',
  });

  const observeTargets = (root = document) => {
    root.querySelectorAll('[data-reveal]:not(.reveal-enter)').forEach((el) => {
      if (el.dataset.revealObserved === '1') return;
      el.dataset.revealObserved = '1';
      observer.observe(el);
    });
  };

  observeTargets();

  if ('MutationObserver' in window) {
    const main = document.getElementById('icerik') || document.body;
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches?.('[data-reveal]')) observeTargets(node.parentElement || document);
          else if (node.querySelector?.('[data-reveal]')) observeTargets(node);
        }
      }
    });
    mo.observe(main, { childList: true, subtree: true });
  }
})();
