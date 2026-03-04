(function () {
  const KEY = "danbees-cookie-consent-v1";
  const defaults = { necessary: true, preferences: false, analytics: false, marketing: false };

  function readConsent() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!parsed) return null;
      return { ...defaults, ...parsed, necessary: true };
    } catch {
      return null;
    }
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
    const links = document.querySelector("[data-nav-links]");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => {
      const next = !links.classList.contains("open");
      links.classList.toggle("open", next);
      toggle.setAttribute("aria-expanded", String(next));
    });
  }

  function connectSlider() {
    document.querySelectorAll("[data-slider]").forEach((slider) => {
      const track = slider.querySelector("[data-slider-track]");
      if (!track) return;
      const slides = Array.from(track.children);
      if (!slides.length) return;
      let index = 0;
      const render = () => { track.style.transform = `translateX(-${index * 100}%)`; };
      slider.querySelector("[data-slider-prev]")?.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        render();
      });
      slider.querySelector("[data-slider-next]")?.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        render();
      });
    });
  }

  function connectReveal() {
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

  window.DanbeesConsent = { readConsent, saveConsent };
  connectBanner();
  connectSettingsForm();
  connectMobileMenu();
  connectSlider();
  connectReveal();
})();
