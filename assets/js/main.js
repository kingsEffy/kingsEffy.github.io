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


// ---- Typing effect for About paragraph ----
(function () {
  const el = document.getElementById('about-typing');
  if (!el) return;

  // Respect reduced-motion preference
  const prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const fullText = el.textContent.trim();
  el.textContent = '';           // start empty
  let i = 0;
  const speed = 25;              // ms per character

  function typeNext() {
    if (i > fullText.length) return;
    el.textContent = fullText.slice(0, i);
    i++;
    setTimeout(typeNext, speed);
  }

  // Optional: only start once About section comes into view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeNext();
        observer.disconnect();   // run once
      }
    });
  }, { threshold: 0.2 });

  observer.observe(el);
})();
// ---- Looping Typing Effect for About Paragraph ----
(function () {
  const el = document.getElementById('about-typing');
  if (!el) return;

  // Respect reduced-motion preference
  const prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const fullText = el.textContent.trim();
  const speed = 25;          // ms per character
  const pause = 1500;        // wait before restarting
  let i = 0;

  function typeLoop() {
    el.textContent = fullText.substring(0, i);

    if (i < fullText.length) {
      i++;
      setTimeout(typeLoop, speed);
    } else {
      // end reached → wait → reset → start again
      setTimeout(() => {
        el.textContent = "";
        i = 0;
        setTimeout(typeLoop, speed);
      }, pause);
    }
  }

  // Start typing when section is visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeLoop();
        // DO NOT disconnect → loop can restart forever
      }
    });
  }, { threshold: 0.2 });

  observer.observe(el);
})();
// ===== Looping typing effect for About text =====
(function () {
  const el = document.getElementById('about-typing');
  if (!el) return;

  // Respect reduced-motion preference
  const prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    el.textContent = el.getAttribute('data-fulltext') || '';
    return;
  }

  const fullText = el.getAttribute('data-fulltext') || '';
  const typeSpeed = 25;     // ms per character
  const pauseEnd = 1500;    // pause after finishing
  const pauseClear = 400;   // pause before re-typing

  let i = 0;
  let typingForward = true;

  function loop() {
    if (typingForward) {
      // typing forwards
      el.textContent = fullText.slice(0, i);
      if (i < fullText.length) {
        i++;
        setTimeout(loop, typeSpeed);
      } else {
        // finished typing, pause then start erasing
        typingForward = false;
        setTimeout(loop, pauseEnd);
      }
    } else {
      // erasing backwards
      el.textContent = fullText.slice(0, i);
      if (i > 0) {
        i--;
        setTimeout(loop, typeSpeed);
      } else {
        // fully erased, pause then start typing again
        typingForward = true;
        setTimeout(loop, pauseClear);
      }
    }
  }

  // start loop
  loop();
})();
