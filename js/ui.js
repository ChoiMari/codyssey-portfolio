(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const themeButton = document.querySelector('.theme-toggle');
  const topButton = document.querySelector('.back-to-top');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const renderTheme = () => {
    document.documentElement.dataset.theme = STATE.theme;
    const isDark = STATE.theme === 'dark';
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
    themeButton.querySelector('.theme-icon').textContent = isDark ? '☀' : '☾';
    themeButton.querySelector('.theme-label').textContent = isDark ? 'Light' : 'Dark';
  };

  const renderMenu = () => {
    navLinks.classList.toggle('active', STATE.menuOpen);
    menuButton.setAttribute('aria-expanded', String(STATE.menuOpen));
    menuButton.setAttribute('aria-label', STATE.menuOpen ? '메뉴 닫기' : '메뉴 열기');
  };

  const renderScroll = () => {
    header.classList.toggle('scrolled', window.scrollY >= 60);
    topButton.classList.toggle('visible', window.scrollY >= 300);
  };

  try {
    STATE.theme = localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    STATE.theme = 'light';
  }
  renderTheme();
  renderMenu();
  renderScroll();

  themeButton.addEventListener('click', () => {
    STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
    renderTheme();
    try { localStorage.setItem('portfolio-theme', STATE.theme); } catch { /* 저장이 차단되어도 토글은 동작합니다. */ }
  });

  menuButton.addEventListener('click', () => {
    STATE.menuOpen = !STATE.menuOpen;
    renderMenu();
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth' });
      STATE.menuOpen = false;
      renderMenu();
      history.replaceState(null, '', link.getAttribute('href'));
    });
  });

  topButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
  });
  window.addEventListener('scroll', renderScroll, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }
})();
