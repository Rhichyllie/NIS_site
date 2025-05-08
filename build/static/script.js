document.addEventListener('DOMContentLoaded', () => {
  // Scroll suave para links internos
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
      }
    });
  });

  const header = document.getElementById('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navOverlay = document.getElementById('nav-overlay');
  const scrollTopBtn = document.querySelector('.scroll-top');

  // Efeito de scroll no header
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header scrolled
    header.classList.toggle('scrolled', scrollY > 50);

    // Scroll-top visibility
    if (scrollTopBtn) {
      scrollTopBtn.style.opacity = scrollY > 300 ? '1' : '0';
      scrollTopBtn.style.pointerEvents = scrollY > 300 ? 'auto' : 'none';
    }
  });

  // Toggle do menu mobile
  if (menuToggle && navOverlay) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
      menuToggle.setAttribute('aria-expanded', !expanded);
      navOverlay.classList.toggle('active');
    });
  }

  // Scroll suave para o topo
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});