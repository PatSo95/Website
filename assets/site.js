(function () {
  if (window.__dbsbInit) return;
  window.__dbsbInit = true;

  const KEY = "danbees-cookie-consent-v1";
  const defaults = { necessary: true, preferences: false, analytics: false, marketing: false };

  function readConsent() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!parsed) return null;
      return { ...defaults, ...parsed, necessary: true };
    } catch { return null; }
  }

  function saveConsent(consent) {
    const next = { ...defaults, ...consent, necessary: true };
    localStorage.setItem(KEY, JSON.stringify(next));
    if (next.analytics) loadAnalytics();
  }

  function loadAnalytics() {
    if (document.querySelector('script[data-analytics="danbees"]')) return;
    const script = document.createElement("script");
    script.src = location.hostname === "patso95.github.io" ? "/Website/assets/analytics-loader.js" : "/assets/analytics-loader.js";
    script.defer = true;
    script.dataset.analytics = "danbees";
    document.head.appendChild(script);
  }

  function initConsentBanner() {
    if (window.__dbsbConsentInit) return;
    window.__dbsbConsentInit = true;
    const banner = document.querySelector("[data-cookie-banner]");
    if (!banner) return;
    const consent = readConsent();
    if (consent) {
      banner.classList.add("hidden");
      if (consent.analytics) loadAnalytics();
      return;
    }
    banner.classList.remove("hidden");
    banner.querySelector("[data-accept-all]")?.addEventListener("click", () => {
      saveConsent({ necessary: true, preferences: true, analytics: true, marketing: true });
      banner.classList.add("hidden");
    });
    banner.querySelector("[data-accept-necessary]")?.addEventListener("click", () => {
      saveConsent(defaults);
      banner.classList.add("hidden");
    });
  }

  function initSettingsForm() {
    const form = document.querySelector("[data-cookie-settings-form]");
    if (!form) return;
    const current = readConsent() || defaults;
    ["preferences", "analytics", "marketing"].forEach((key) => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.checked = !!current[key];
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveConsent({
        preferences: !!form.querySelector('[name="preferences"]')?.checked,
        analytics: !!form.querySelector('[name="analytics"]')?.checked,
        marketing: !!form.querySelector('[name="marketing"]')?.checked,
      });
      const status = document.querySelector("[data-settings-status]");
      if (status) status.textContent = form.dataset.savedMessage || "Saved.";
    });
  }


  function initHeaderShadow() {
    const h = document.querySelector('.site-header');
    if (!h) return;
    const update = () => h.classList.toggle('scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-nav-links]");
    if (!toggle || !panel) return;
    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      panel.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      panel.querySelector("a")?.focus();
    };
    const close = () => {
      panel.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      lastFocus?.focus?.();
    };
    toggle.addEventListener("click", () => (panel.classList.contains("open") ? close() : open()));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  function initLanguageSwitch() {
    const path = location.pathname;
    const match = path.match(/\/(en|ko)\/(.*)$/);
    if (!match) return;
    const [, lang, restRaw] = match;
    const rest = restRaw || "";
    const other = lang === "en" ? "ko" : "en";
    document.querySelectorAll("[data-lang-switch]").forEach((a) => {
      const target = a.getAttribute("data-lang-switch");
      if (target !== other) return;
      a.setAttribute("href", `/${other}/${rest}`);
    });
  }

  function initSlider() {
    document.querySelectorAll("[data-slider]").forEach((slider) => {
      const track = slider.querySelector("[data-slider-track]");
      if (!track) return;
      const slides = Array.from(track.children);
      if (!slides.length) return;
      let idx = 0;
      const render = () => (track.style.transform = `translateX(-${idx * 100}%)`);
      slider.querySelector("[data-slider-prev]")?.addEventListener("click", () => { idx = (idx - 1 + slides.length) % slides.length; render(); });
      slider.querySelector("[data-slider-next]")?.addEventListener("click", () => { idx = (idx + 1) % slides.length; render(); });
    });
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  }

  initConsentBanner();
  initSettingsForm();
  initMenu();
  initLanguageSwitch();
  initSlider();
  initReveal();
  initHeaderShadow();
})();
