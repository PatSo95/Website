(function () {
  if (window.__dbsbInit) return;
  window.__dbsbInit = true;

  const KEY = "danbees-cookie-consent-v1";
  const defaults = { necessary: true, preferences: false, analytics: false, marketing: false };

  const IMG = {
    heroMain: {
      base: "https://images.pexels.com/photos/3142002/pexels-photo-3142002.jpeg",
      alt_en: "Seoul skyline at night",
      alt_ko: "서울 도심 야경",
    },
    meetupOne: {
      base: "https://images.pexels.com/photos/31826555/pexels-photo-31826555.jpeg",
      alt_en: "Garak Market meetup area in Seoul",
      alt_ko: "서울 가락시장 미팅 장소 주변",
    },
    onlineOne: {
      base: "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg",
      alt_en: "One-to-one online language session",
      alt_ko: "온라인 1:1 수업 장면",
    },
  };

  function getLocale() {
    if (location.pathname.includes("/ko/")) return "ko";
    if (location.pathname.includes("/en/")) return "en";
    return "en";
  }

  function pictureMarkup(key, locale, eager = false, cls = "card-media") {
    const item = IMG[key];
    if (!item) return "";
    const alt = locale === "ko" ? item.alt_ko : item.alt_en;
    const q = "?auto=compress&cs=tinysrgb&fit=crop&w=";
    const loadingAttr = eager ? "eager\" fetchpriority=\"high" : "lazy\" decoding=\"async";
    return `
      <source type="image/webp" srcset="${item.base}${q}480&fm=webp 480w, ${item.base}${q}768&fm=webp 768w, ${item.base}${q}1200&fm=webp 1200w, ${item.base}${q}1600&fm=webp 1600w" sizes="(max-width: 768px) 92vw, 380px" />
      <img class="${cls}" src="${item.base}${q}768&fm=jpg" srcset="${item.base}${q}480&fm=jpg 480w, ${item.base}${q}768&fm=jpg 768w, ${item.base}${q}1200&fm=jpg 1200w, ${item.base}${q}1600&fm=jpg 1600w" sizes="(max-width: 768px) 92vw, 380px" width="1200" height="900" loading="${loadingAttr}" alt="${alt}" />`;
  }

  function initImages() {
    const locale = getLocale();
    document.querySelectorAll("picture[data-img]").forEach((pic) => {
      if (pic.dataset.ready === "1") return;
      const key = pic.dataset.img;
      const eager = pic.dataset.eager === "1";
      const cls = pic.dataset.class || "card-media";
      pic.innerHTML = pictureMarkup(key, locale, eager, cls);
      pic.dataset.ready = "1";
    });
  }

  function readConsent() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!parsed) return null;
      return { ...defaults, ...parsed, necessary: true };
    } catch {
      return null;
    }
  }

  function loadAnalytics() {
    if (document.querySelector('script[data-analytics="danbees"]')) return;
    const script = document.createElement("script");
    script.src = location.pathname.includes("/en/") || location.pathname.includes("/ko/") ? "../assets/analytics-loader.js" : "assets/analytics-loader.js";
    script.defer = true;
    script.dataset.analytics = "danbees";
    document.head.appendChild(script);
  }

  function saveConsent(consent) {
    const next = { ...defaults, ...consent, necessary: true };
    localStorage.setItem(KEY, JSON.stringify(next));
    if (next.analytics) loadAnalytics();
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

  function initHeaderShadow() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const update = () => header.classList.toggle("scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-nav-links]");
    if (!toggle || !panel) return;

    let lastFocused = null;
    const open = () => {
      lastFocused = document.activeElement;
      panel.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      panel.querySelector("a,summary")?.focus();
    };

    const close = () => {
      panel.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      lastFocused?.focus?.();
      panel.querySelectorAll("details[open]").forEach((d) => (d.open = false));
    };

    toggle.addEventListener("click", () => (panel.classList.contains("open") ? close() : open()));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  function initLanguageSwitch() {
    const path = location.pathname;
    const locale = path.includes("/ko/") ? "ko" : path.includes("/en/") ? "en" : null;
    if (!locale) return;

    let file = path.split("/").pop();
    if (!file || !file.includes(".")) file = "index.html";

    const other = locale === "en" ? "ko" : "en";
    const otherHref = `../${other}/${file}`;

    document.querySelectorAll('[data-lang-switch="en"]').forEach((a) => {
      if (locale === "en") a.setAttribute("href", file === "index.html" ? "index.html" : file);
      else a.setAttribute("href", `../en/${file}`);
    });

    document.querySelectorAll('[data-lang-switch="ko"]').forEach((a) => {
      if (locale === "ko") a.setAttribute("href", file === "index.html" ? "index.html" : file);
      else a.setAttribute("href", `../ko/${file}`);
    });

    document.querySelectorAll('[data-lang-switch]').forEach((a)=>{
      if (a.dataset.langSwitch === other) a.setAttribute("href", otherHref);
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
      slider.querySelector("[data-slider-prev]")?.addEventListener("click", () => {
        idx = (idx - 1 + slides.length) % slides.length;
        render();
      });
      slider.querySelector("[data-slider-next]")?.addEventListener("click", () => {
        idx = (idx + 1) % slides.length;
        render();
      });
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
    items.forEach((item) => io.observe(item));
  }

  initImages();
  initConsentBanner();
  initSettingsForm();
  initMenu();
  initLanguageSwitch();
  initSlider();
  initReveal();
  initHeaderShadow();
})();
