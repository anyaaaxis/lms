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
