/* Content stays visible until an entrance animation starts. */
if ('IntersectionObserver' in window && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('reveal-enter');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08 });

  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
}
