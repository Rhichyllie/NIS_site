document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.getElementById('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navOverlay = document.getElementById('nav-overlay');
  const scrollTopButton = document.querySelector('.scroll-top');
  const pageLinks = document.querySelectorAll('.nav-links a, .nav-overlay a');
  const desktopBreakpoint = window.matchMedia('(min-width: 781px)');

  let scrollFrame = null;

  const getHeaderOffset = () => {
    const offset = parseFloat(getComputedStyle(root).getPropertyValue('--header-height'));
    return Number.isFinite(offset) ? offset : 72;
  };

  const normalizePath = (pathname = '') => {
    if (!pathname || pathname === '/') {
      return '/index.html';
    }

    return pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  };

  const setMenuState = (isOpen) => {
    if (!menuToggle || !navOverlay) {
      return;
    }

    body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    navOverlay.classList.toggle('active', isOpen);
    navOverlay.setAttribute('aria-hidden', String(!isOpen));
  };

  const closeMenu = () => setMenuState(false);

  const markCurrentPage = () => {
    const currentPath = normalizePath(window.location.pathname);

    pageLinks.forEach((link) => {
      const linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
      const isCurrent = linkPath === currentPath;

      link.toggleAttribute('aria-current', isCurrent);
    });
  };

  const scrollToHashTarget = (selector) => {
    if (!selector || selector === '#') {
      return false;
    }

    const target = document.querySelector(selector);

    if (!target) {
      return false;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 24;
    window.scrollTo({ top, behavior: 'smooth' });
    return true;
  };

  const syncScrolledState = () => {
    if (scrollFrame) {
      return;
    }

    scrollFrame = window.requestAnimationFrame(() => {
      const scrolled = window.scrollY > 16;
      const showScrollTop = window.scrollY > 320;

      header?.classList.toggle('scrolled', scrolled);
      scrollTopButton?.classList.toggle('is-visible', showScrollTop);

      scrollFrame = null;
    });
  };

  const bindMediaQuery = (query, listener) => {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', listener);
      return;
    }

    if (typeof query.addListener === 'function') {
      query.addListener(listener);
    }
  };

  document.addEventListener('click', (event) => {
    const toggleButton = event.target.closest('.menu-toggle');

    if (toggleButton) {
      event.preventDefault();
      setMenuState(!body.classList.contains('menu-open'));
      return;
    }

    if (navOverlay && event.target === navOverlay) {
      closeMenu();
      return;
    }

    const hashLink = event.target.closest('a[href^="#"]:not([href="#"])');

    if (hashLink) {
      if (scrollToHashTarget(hashLink.getAttribute('href'))) {
        event.preventDefault();
        closeMenu();
      }

      return;
    }

    if (body.classList.contains('menu-open') && event.target.closest('.nav-overlay a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('scroll', syncScrolledState, { passive: true });

  bindMediaQuery(desktopBreakpoint, (event) => {
    if (event.matches) {
      closeMenu();
    }
  });

  scrollTopButton?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  markCurrentPage();
  closeMenu();
  syncScrolledState();
});
