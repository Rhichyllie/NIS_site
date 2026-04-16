document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.getElementById('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navOverlay = document.getElementById('nav-overlay');
  const scrollTopButton = document.querySelector('.scroll-top');
  const pageLinks = document.querySelectorAll('.nav-links a, .nav-overlay-list a');
  const desktopBreakpoint = window.matchMedia('(min-width: 781px)');
  const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const topThreshold = 8;
  const scrollThreshold = 16;
  const hideStart = 120;
  const directionThreshold = 6;

  let scrollFrame = null;
  let lastScrollY = window.scrollY;
  let scrollDirection = 0;
  let topZoneActive = false;

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

    if (isOpen) {
      header?.classList.remove('is-hidden');
      header?.classList.add('is-hovered');
      return;
    }

    if (!topZoneActive) {
      header?.classList.remove('is-hovered');
    }
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

  const getRevealZoneHeight = () => Math.max(getHeaderOffset() + 18, 104);

  const revealHeader = (isInteractive = false) => {
    if (!header) {
      return;
    }

    header.classList.remove('is-hidden');
    header.classList.toggle('is-hovered', isInteractive);
  };

  const concealHeader = () => {
    if (
      !header ||
      body.classList.contains('menu-open') ||
      topZoneActive ||
      window.scrollY <= hideStart ||
      header.contains(document.activeElement)
    ) {
      return;
    }

    header.classList.remove('is-hovered');
    header.classList.add('is-hidden');
  };

  const syncScrolledState = () => {
    if (scrollFrame) {
      return;
    }

    scrollFrame = window.requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      const isAtTop = currentY <= topThreshold;
      const scrolled = currentY > scrollThreshold;
      const showScrollTop = currentY > 320;

      header?.classList.toggle('scrolled', scrolled);

      if (isAtTop) {
        topZoneActive = false;
        revealHeader(false);
      } else if (body.classList.contains('menu-open')) {
        revealHeader(true);
      } else if (topZoneActive) {
        revealHeader(true);
      } else if (delta > directionThreshold && currentY > hideStart) {
        concealHeader();
      } else if (delta < -directionThreshold) {
        revealHeader(false);
      }

      scrollTopButton?.classList.toggle('is-visible', showScrollTop);
      scrollDirection = delta === 0 ? scrollDirection : delta > 0 ? 1 : -1;
      lastScrollY = currentY;

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

  if (header) {
    header.addEventListener('focusin', () => {
      revealHeader(true);
    });

    header.addEventListener('focusout', () => {
      window.requestAnimationFrame(() => {
        if (!header.contains(document.activeElement) && !topZoneActive && !body.classList.contains('menu-open')) {
          header.classList.remove('is-hovered');

          if (window.scrollY > hideStart && scrollDirection >= 0) {
            concealHeader();
          }
        }
      });
    });
  }

  window.addEventListener('scroll', syncScrolledState, { passive: true });

  document.addEventListener('mousemove', (event) => {
    if (!header || !pointerFine.matches || body.classList.contains('menu-open')) {
      return;
    }

    if (window.scrollY <= topThreshold) {
      topZoneActive = false;
      return;
    }

    const withinRevealZone = event.clientY <= getRevealZoneHeight();

    if (withinRevealZone) {
      topZoneActive = true;
      revealHeader(true);
      return;
    }

    if (topZoneActive) {
      topZoneActive = false;
      header.classList.remove('is-hovered');

      if (window.scrollY > hideStart && scrollDirection >= 0) {
        concealHeader();
      }
    }
  });

  bindMediaQuery(desktopBreakpoint, (event) => {
    if (event.matches) {
      closeMenu();
    }
  });

  bindMediaQuery(pointerFine, (event) => {
    if (!event.matches) {
      topZoneActive = false;
      header?.classList.remove('is-hovered');
    }
  });

  scrollTopButton?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  markCurrentPage();
  closeMenu();
  syncScrolledState();
});
