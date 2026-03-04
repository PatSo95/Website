(function () {
  if (window.__danbeesInit) return;
  window.__danbeesInit = true;

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
    applyConsent(next);
  }

  function loadAnalytics() {
    if (document.querySelector('script[data-analytics="danbees"]')) return;
    const script = document.createElement("script");
    script.src = "assets/analytics-loader.js";
    script.defer = true;
    script.dataset.analytics = "danbees";
    document.head.appendChild(script);
  }
  function applyConsent(consent) { if (consent.analytics) loadAnalytics(); }

  function applyConsent(consent) {
    if (consent.analytics) loadAnalytics();
    document.dispatchEvent(new CustomEvent("consent-updated", { detail: consent }));
  }

  function connectBanner() {
    const banner = document.querySelector("[data-cookie-banner]");
    if (!banner) return;
    const consent = readConsent();
    if (consent) {
      banner.classList.add("hidden");
      applyConsent(consent);
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

  function connectMobileMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector("[data-site-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function connectSlider() {
    const root = document.querySelector("[data-slider]");
    const track = document.querySelector("[data-slider-track]");
    if (!root || !track) return;

    const slides = Array.from(track.children);
    if (!slides.length) return;

    let index = 0;
    const prev = root.querySelector("[data-slider-prev]");
    const next = root.querySelector("[data-slider-next]");

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    prev?.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      render();
    });

    next?.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      render();
    });
  }

  window.DanbeesConsent = { readConsent, saveConsent };
  connectBanner();
  connectSettingsForm();
  connectMobileMenu();
  connectSlider();
})();
