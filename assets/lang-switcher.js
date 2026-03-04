(function () {
  const switcherHost = document.querySelector('[data-lang-switcher]');
  if (!switcherHost) return;

  const segments = window.location.pathname.split('/').filter(Boolean);
  const currentLocale = segments[0] === 'ko' ? 'ko' : 'en';
  const alternateLocale = currentLocale === 'en' ? 'ko' : 'en';

  const normalizedSlug = (() => {
    const slugParts = segments.slice(1);
    if (slugParts.length === 0) return '/';
    return `/${slugParts.join('/')}`;
  })();

  fetch('/assets/locale-routes.json')
    .then((response) => response.json())
    .then((routes) => {
      const routeEntry = routes[normalizedSlug];
      const target = routeEntry && routeEntry[alternateLocale];

      const link = document.createElement('a');
      link.textContent = alternateLocale === 'ko' ? '한국어' : 'English';

      if (target) {
        link.href = target;
        link.setAttribute('hreflang', alternateLocale);
        link.setAttribute('lang', alternateLocale);
      } else {
        link.href = '#';
        link.setAttribute('aria-disabled', 'true');
        link.style.pointerEvents = 'none';
        link.style.opacity = '0.5';
        link.title = 'No translated page available';
      }

      switcherHost.innerHTML = '';
      switcherHost.append('Language: ', link);
    })
    .catch(() => {
      switcherHost.textContent = 'Language switcher unavailable';
    });
})();
