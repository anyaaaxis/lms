// Form submission handler moved from inline script
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const namaEl = document.getElementById('nama');
    const kelasEl = document.getElementById('kelas');
    if (namaEl && namaEl.value.trim()) localStorage.setItem('userName', namaEl.value.trim());
    if (kelasEl && kelasEl.value.trim()) localStorage.setItem('userClass', kelasEl.value.trim());
    window.location.href = 'opening.html';
  });

  // Prevent selecting/copying text/images within the form container
  const formContainer = document.querySelector('.form-container');
  if (formContainer) {
    formContainer.addEventListener('selectstart', function (e) {
      const tag = e.target && e.target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
      }
    });
    formContainer.addEventListener('copy', function (e) {
      const tag = e.target && e.target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
      }
    });
    // Also make images inside the form non-draggable and block right-click on them
    const imgs = formContainer.querySelectorAll('img');
    imgs.forEach((img) => {
      try {
        img.setAttribute('draggable', 'false');
      } catch (err) {}
      img.addEventListener('contextmenu', (ev) => ev.preventDefault());
      img.addEventListener('dragstart', (ev) => ev.preventDefault());
    });
  }
});
