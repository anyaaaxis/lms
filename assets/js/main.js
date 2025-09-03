// Basic interactivity for template
(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll active link highlight
  const sectionIds = ['section1', 'section2', 'section3'];
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a'));
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  function onScroll() {
    const scrollPos = window.scrollY + 120; // offset for sticky header
    for (let sec of sections) {
      if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
        navLinks.forEach((l) => l.classList.remove('active'));
        const active = navLinks.find((l) => l.getAttribute('href') === `#${sec.id}`);
        if (active) active.classList.add('active');
      }
    }
  }
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  // (Contact form dihapus; tidak ada lagi form validation)
})();
