// Dark mode toggle with localStorage
(function(){
  const btn = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);

  function setTheme(mode){
    if (mode === 'dark'){ root.setAttribute('data-theme', 'dark'); }
    else { root.removeAttribute('data-theme'); }
    localStorage.setItem('theme', mode);
  }
  btn?.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  });

  // Smooth scroll for internal nav
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el){
        e.preventDefault();
        el.scrollIntoView({behavior: 'smooth', block: 'start'});
        history.pushState(null, '', '#' + id);
      }
    });
  });
})();


// --- Avatar toggle (click to swap between two photos) ---
(function () {
  const img = document.getElementById('avatar');
  if (!img) return;

  // optional: remember last choice
  const remembered = localStorage.getItem('avatar_state'); // 'main' | 'alt'
  if (remembered === 'alt') {
    const alt = img.getAttribute('data-alt');
    if (alt) img.src = alt, img.setAttribute('aria-pressed', 'true');
  }

  // smooth fade
  img.style.transition = 'opacity 160ms ease';

  function swap() {
    const main = img.getAttribute('data-main') || img.getAttribute('src');
    const alt  = img.getAttribute('data-alt');
    if (!alt) return;

    const isAlt = img.getAttribute('aria-pressed') === 'true';
    const nextSrc = isAlt ? main : alt;

    // fade-out, swap, fade-in
    img.style.opacity = '0.3';
    setTimeout(() => {
      img.src = nextSrc;
      img.setAttribute('aria-pressed', (!isAlt).toString());
      localStorage.setItem('avatar_state', (!isAlt) ? 'alt' : 'main');
      img.style.opacity = '1';
    }, 120);
  }

  // remember original main src (in case HTML src changes later)
  img.setAttribute('data-main', img.getAttribute('src'));

  // click + keyboard (Enter/Space)
  img.addEventListener('click', swap);
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); swap(); }
  });

  // optional: preload alt image to avoid first-swap flash
  const alt = img.getAttribute('data-alt');
  if (alt) { const pre = new Image(); pre.src = alt; }
})();
