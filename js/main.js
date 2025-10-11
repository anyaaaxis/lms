(function () {
  // --- Make saving images via right-click/drag harder (client-side only) ---
  document.addEventListener('contextmenu', function (e) {
    if (e.target && e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
  // make images non-draggable by default
  document.querySelectorAll('img').forEach((img) => img.setAttribute('draggable', 'false'));

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // If body has .no-select, prevent selecting/copying across the page except for form controls
  if (document.body.classList.contains('no-select')) {
    document.addEventListener('selectstart', function (e) {
      const tag = e.target && e.target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') e.preventDefault();
    });
    document.addEventListener('copy', function (e) {
      const tag = e.target && e.target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') e.preventDefault();
    });
  }

  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // Close menu when tapping outside (works for touch) and when tapping a link
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
    // Close when a nav link is tapped (improves mobile UX)
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener(
        'click',
        () => {
          if (navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
          }
        },
        { passive: true }
      );
    });
  }

  const sectionIds = ['section1', 'section2', 'section3'];
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a'));
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  function onScroll() {
    const scrollPos = window.scrollY + 120;
    for (let sec of sections) {
      if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
        navLinks.forEach((l) => l.classList.remove('active'));
        const active = navLinks.find((l) => l.getAttribute('href') === `#${sec.id}`);
        if (active) active.classList.add('active');
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* Scroll-snap carousel controller (mobile) */
(function () {
  const CAROUSEL_SELECTOR = '.teachers-grid.teachers-plain .carousel';
  const MOBILE_MAX = 640;
  let interval = null;
  let autoplayDelay = 3000;

  function initCarousel() {
    const root = document.querySelector(CAROUSEL_SELECTOR);
    if (!root) return;

    // Only initialize carousel on mobile viewports. If desktop, ensure any
    // previously-created dots are cleared and skip setup.
    if (window.innerWidth > MOBILE_MAX) {
      // remove previous init marker and clear dots so desktop shows grid
      root.removeAttribute('data-carousel-inited');
      const existingDots = root.querySelector('.carousel__dots');
      if (existingDots) existingDots.innerHTML = '';
      return;
    }

    // prevent double initialization
    if (root.dataset.carouselInited) return;
    const viewport = root.querySelector('.carousel__viewport');
    const track = root.querySelector('.carousel__track');
    const slides = Array.from(track.children);

    // helper: compute slide left positions relative to viewport content
    function computePositions() {
      return slides.map((s) => s.offsetLeft - track.offsetLeft);
    }
    let positions = computePositions();

    // create dots
    const dotsContainer = root.querySelector('.carousel__dots');
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carousel-dot';
      btn.dataset.index = i;
      btn.addEventListener('click', () => {
        const left = positions[i] || i * viewport.clientWidth;
        viewport.scrollTo({ left, behavior: 'smooth' });
        updateDots(dotsContainer, i);
        pauseAutoplay();
      });
      dotsContainer.appendChild(btn);
    });

    function updateDots(container, activeIndex) {
      container.querySelectorAll('.carousel-dot').forEach((d) => d.classList.remove('active'));
      const btn = container.querySelector(`.carousel-dot[data-index="${activeIndex}"]`);
      if (btn) btn.classList.add('active');
    }

    // find nearest slide index for current scrollLeft
    function getCurrentIndex() {
      const left = viewport.scrollLeft;
      let idx = 0;
      let min = Infinity;
      positions.forEach((pos, i) => {
        const d = Math.abs(pos - left);
        if (d < min) {
          min = d;
          idx = i;
        }
      });
      return idx;
    }

    // sync dots on scroll (debounced)
    let scrollDebounce = null;
    viewport.addEventListener(
      'scroll',
      () => {
        clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(() => {
          const idx = getCurrentIndex();
          updateDots(dotsContainer, idx);
        }, 120);
      },
      { passive: true }
    );

    function next() {
      const idx = getCurrentIndex();
      let nextIdx = idx + 1;
      if (nextIdx >= slides.length) nextIdx = 0;
      const left = positions[nextIdx] || nextIdx * viewport.clientWidth;
      viewport.scrollTo({ left, behavior: 'smooth' });
      updateDots(dotsContainer, nextIdx);
    }

    function startAutoplay() {
      stopAutoplay();
      interval = setInterval(next, autoplayDelay);
    }
    function stopAutoplay() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }
    function pauseAutoplay() {
      stopAutoplay();
      setTimeout(startAutoplay, autoplayDelay * 2);
    }

    // Pause on pointer interactions
    viewport.addEventListener('pointerenter', stopAutoplay);
    viewport.addEventListener('pointerleave', startAutoplay);
    viewport.addEventListener(
      'touchstart',
      () => {
        stopAutoplay();
      },
      { passive: true }
    );
    viewport.addEventListener('touchend', () => {
      startAutoplay();
    });

    // only run autoplay on narrow viewports
    function enableIfMobile() {
      if (window.innerWidth <= MOBILE_MAX) {
        startAutoplay();
      } else {
        stopAutoplay();
        // reset dots
        updateDots(dotsContainer, 0);
      }
    }

    window.addEventListener('resize', () => {
      // recompute positions and reset the scroll to nearest slide
      positions = computePositions();
      setTimeout(() => {
        const idx = getCurrentIndex();
        viewport.scrollTo({ left: positions[idx] || 0 });
        updateDots(dotsContainer, idx);
      }, 120);
      enableIfMobile();
    });

    // initialize state
    updateDots(dotsContainer, 0);
    enableIfMobile();

    // mark as initialized so repeated calls are no-ops
    root.dataset.carouselInited = '1';
  }

  // initialize on DOM ready
  document.addEventListener('DOMContentLoaded', initCarousel);
  initCarousel();
})();
