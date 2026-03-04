(function () {
  const KEY = "danbees-cookie-consent-v1";
  const defaults = {
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
  };

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

  function applyConsent(consent) {
    if (consent.analytics) {
      loadAnalytics();
    }
    document.dispatchEvent(new CustomEvent("consent-updated", { detail: consent }));
  }

  function loadAnalytics() {
    if (document.querySelector('script[data-analytics="danbees"]')) return;
    const script = document.createElement("script");
    script.src = "/assets/analytics-loader.js";
    script.defer = true;
    script.dataset.analytics = "danbees";
    document.head.appendChild(script);
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
    for (const key of ["preferences", "analytics", "marketing"]) {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.checked = !!current[key];
    }

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

  window.DanbeesConsent = { readConsent, saveConsent };
  connectBanner();
  connectSettingsForm();
})();
