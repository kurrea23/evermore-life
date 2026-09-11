(() => {
  const note = document.querySelector('.copy-note');
  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        if (note) note.textContent = `${value} copied to clipboard.`;
      } catch {
        if (note) note.textContent = `Color value: ${value}`;
      }
    });
  });

  const links = [...document.querySelectorAll('.brand-toc a')];
  const sections = links.map((link) => document.querySelector(link.hash)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => link.toggleAttribute('aria-current', link.hash === `#${visible.target.id}`));
    }, { rootMargin: '-28% 0px -62% 0px', threshold: [0, .25, .6] });
    sections.forEach((section) => observer.observe(section));
  }
})();
