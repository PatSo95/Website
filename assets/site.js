(function () {
  if (window.__danbeesInit) return;
  window.__danbeesInit = true;

  const KEY = "danbees-cookie-consent-v1";
  const defaults = { necessary: true, preferences: false, analytics: false, marketing: false };

  const lockBody = (locked) => { document.body.style.overflow = locked ? "hidden" : ""; };

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
    applyConsent(next);
  }
  function loadAnalytics() {
    if (document.querySelector('script[data-analytics="danbees"]')) return;
    const script = document.createElement("script");
    script.src = location.hostname === "patso95.github.io" ? "/Website/assets/analytics-loader.js" : "/assets/analytics-loader.js";
    script.defer = true;
    script.dataset.analytics = "danbees";
    document.head.appendChild(script);
  }
  function applyConsent(consent) { if (consent.analytics) loadAnalytics(); }

  function connectBanner() {
    const banner = document.querySelector("[data-cookie-banner]");
    if (!banner || banner.dataset.bound === "1") return;
    banner.dataset.bound = "1";
    const consent = readConsent();
    if (consent) { banner.classList.add("hidden"); applyConsent(consent); return; }
    banner.classList.remove("hidden");
    banner.querySelector("[data-accept-all]")?.addEventListener("click", () => { saveConsent({ necessary: true, preferences: true, analytics: true, marketing: true }); banner.classList.add("hidden"); });
    banner.querySelector("[data-accept-necessary]")?.addEventListener("click", () => { saveConsent(defaults); banner.classList.add("hidden"); });
  }

  function connectSettingsForm() {
    const form = document.querySelector("[data-cookie-settings-form]");
    if (!form) return;
    const current = readConsent() || defaults;
    ["preferences", "analytics", "marketing"].forEach((key) => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.checked = Boolean(current[key]);
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveConsent({
        preferences: !!form.querySelector('[name="preferences"]')?.checked,
        analytics: !!form.querySelector('[name="analytics"]')?.checked,
        marketing: !!form.querySelector('[name="marketing"]')?.checked,
      });
      const status = document.querySelector("[data-settings-status]");
      if (status) status.textContent = form.dataset.savedMessage || "Saved.";
    });
  }

  function connectMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-nav-links]");
    if (!toggle || !panel) return;
    let lastFocused = null;
    const open = () => {
      lastFocused = document.activeElement;
      panel.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      lockBody(true);
      panel.querySelector("a,button")?.focus();
    };
    const close = () => {
      panel.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      lockBody(false);
      lastFocused?.focus?.();
    };
    toggle.addEventListener("click", () => panel.classList.contains("open") ? close() : open());
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  function connectSlider() {
    document.querySelectorAll("[data-slider]").forEach((root) => {
      const track = root.querySelector("[data-slider-track]");
      if (!track) return;
      const slides = Array.from(track.children);
      if (!slides.length) return;
      let i = 0;
      const render = () => { track.style.transform = `translateX(-${i * 100}%)`; };
      root.querySelector("[data-slider-prev]")?.addEventListener("click", () => { i = (i - 1 + slides.length) % slides.length; render(); });
      root.querySelector("[data-slider-next]")?.addEventListener("click", () => { i = (i + 1) % slides.length; render(); });
    });
  }

  function connectSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function connectLanguageSwitchMapping() {
    const path = location.pathname;
    const match = path.match(/\/(en|ko)\/(.*)$/);
    if (!match) return;
    const [, lang, rest] = match;
    const counterpart = lang === "en" ? "ko" : "en";
    document.querySelectorAll("[data-lang-switch]").forEach((a) => {
      const target = a.getAttribute("data-lang-switch");
      if (target !== counterpart) return;
      a.setAttribute("href", `/${counterpart}/${rest || ""}` || `/${counterpart}/`);
    });
  }

  function connectReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
    }), { threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  }

  window.DanbeesConsent = { readConsent, saveConsent };
  connectBanner();
  connectSettingsForm();
  connectMenu();
  connectSlider();
  connectSmoothScroll();
  connectLanguageSwitchMapping();
  connectReveal();
})();
