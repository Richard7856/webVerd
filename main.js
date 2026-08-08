/* VERDFRUT — interacciones mínimas */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fondo de video del hero: si el navegador bloquea el autoplay,
// se cae al póster estático en lugar de dejar un hueco.
const heroVideo = document.querySelector('.hero-video');

if (heroVideo) {
  const useStatic = () => heroVideo.closest('.hero-bg')?.classList.add('is-static');
  heroVideo.addEventListener('error', useStatic);

  // El video también corre en móvil, así que ahora sí importa el costo:
  // con "ahorro de datos" o en una conexión lenta se queda el póster en vez
  // de bajar 2.1 MB por datos móviles.
  const red = navigator.connection;
  const conexionLimitada = !!red &&
    (red.saveData === true || /^(slow-2g|2g)$/.test(red.effectiveType || ''));

  if (conexionLimitada || reduceMotion) {
    useStatic();
  } else {
    const intento = heroVideo.play();
    if (intento && typeof intento.catch === 'function') intento.catch(useStatic);

    // Se pausa al salir de pantalla: no tiene sentido decodificar video
    // mientras el usuario lee el resto de la página.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) heroVideo.play().catch(() => {});
        else heroVideo.pause();
      }, { threshold: 0 }).observe(heroVideo.closest('.hero'));
    }
  }
}

// Menú móvil
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');

// El hero mide 100svh menos el header: se sincroniza la altura real,
// que cambia con el ancho (el logo y el tagline reflowean).
const syncHeaderHeight = () =>
  document.documentElement.style.setProperty(
    '--header-h', header.getBoundingClientRect().height + 'px');
syncHeaderHeight();
addEventListener('resize', syncHeaderHeight);

toggle?.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach(a => {
  a.addEventListener('click', () => {
    header.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

/* ── Revelado al hacer scroll ──────────────────────────────
   Los bloques se declaran aquí, no con atributos repartidos por el HTML.
   `data-reveal` = un bloque; `data-reveal-group` = hijos escalonados. */
const REVEAL_SINGLE = [
  '.hero-copy', '.section .eyebrow', '.section h2', '.h2-accent',
  '.tech-col > p', '.ph-wide', '.coverage-map', '.lead-sm', '.coverage-ask',
  '.cta-bubble', '.cta-copy', '.cta-actions', '.ph-cta',
];
const REVEAL_GROUP = [
  '.hero-chips', '.hero-actions', '.pillars', '.cards-4', '.process',
  '.why-list', '.check-list', '.clients', '.stats', '.legend', '.footer-grid',
];

if (!reduceMotion && 'IntersectionObserver' in window) {
  REVEAL_SINGLE.forEach(sel =>
    document.querySelectorAll(sel).forEach(el => el.setAttribute('data-reveal', '')));

  REVEAL_GROUP.forEach(sel =>
    document.querySelectorAll(sel).forEach(group => {
      group.setAttribute('data-reveal-group', '');
      [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
    }));

  const revealer = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      obs.unobserve(e.target);          // una sola vez: no reaparece al subir
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  document.querySelectorAll('[data-reveal],[data-reveal-group]')
    .forEach(el => revealer.observe(el));
}

/* ── Frutas que se asoman ──────────────────────────────────
   Solo se animan mientras la sección está en pantalla: fuera de vista
   no gastan CPU ni batería. */
const peekers = document.querySelector('.peekers');

if (peekers && !reduceMotion && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    entries.forEach(e => peekers.classList.toggle('is-live', e.isIntersecting));
  }, { threshold: 0 }).observe(peekers.closest('section'));
}

/* ── Conteo de las cifras ──────────────────────────────────
   Arranca cuando la tarjeta entra en pantalla. */
const counters = document.querySelectorAll('.stat-value');

if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
  counters.forEach(el => { el.textContent = '0'; });

  const countUp = el => {
    const target = Number(el.dataset.count);
    const DUR = 1100;
    let start;
    const tick = now => {
      start ??= now;
      const p = Math.min((now - start) / DUR, 1);
      const eased = 1 - Math.pow(1 - p, 3);           // easeOutCubic
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countUp(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.6 });

  counters.forEach(el => counterObs.observe(el));
}

// Marca el enlace activo según la sección visible
const links = [...document.querySelectorAll('.main-nav a')];
const sections = links
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const setActive = id => {
  links.forEach(a => {
    const on = a.getAttribute('href') === '#' + id;
    a.classList.toggle('is-active', on);
    // Lectores de pantalla: comunica cuál es la sección actual
    if (on) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
};

const observer = new IntersectionObserver(entries => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActive(visible.target.id);
}, { rootMargin: '-45% 0px -50% 0px', threshold: [0, .25, .5, 1] });

sections.forEach(s => observer.observe(s));
