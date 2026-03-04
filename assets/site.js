(function () {
  if (window.__dbsbInit) return;
  window.__dbsbInit = true;

  const KEY = "danbees-cookie-consent-v1";
  const defaults = { necessary: true, preferences: false, analytics: false, marketing: false };

  const IMG = {
    campusGangnam: {
      base: "https://images.pexels.com/photos/18935926/pexels-photo-18935926.jpeg",
      alt_en: "Gangnam district in Seoul",
      alt_ko: "서울 강남 거리 풍경",
    },
    campusHongdae: {
      base: "https://images.pexels.com/photos/2128042/pexels-photo-2128042.jpeg",
      alt_en: "Hongdae neon street at night",
      alt_ko: "홍대 네온 거리 야경",
    },
    campusBusan: {
      base: "https://images.pexels.com/photos/36046040/pexels-photo-36046040.jpeg",
      alt_en: "Aerial night skyline of Busan",
      alt_ko: "부산 야경 항공 전경",
    },
    programIntensive: {
      base: "https://images.pexels.com/photos/8199143/pexels-photo-8199143.jpeg",
      alt_en: "Students studying in a classroom",
      alt_ko: "교실에서 학습하는 수강생",
    },
    programStandard: {
      base: "https://images.pexels.com/photos/8197511/pexels-photo-8197511.jpeg",
      alt_en: "Learners in a structured class",
      alt_ko: "구조화된 수업을 듣는 학습자",
    },
    programOnline: {
      base: "https://images.pexels.com/photos/4260481/pexels-photo-4260481.jpeg",
      alt_en: "Online one-to-one learning",
      alt_ko: "온라인 1:1 학습 장면",
    },
    programConversation: {
      base: "https://images.pexels.com/photos/6829486/pexels-photo-6829486.jpeg",
      alt_en: "Conversation practice in a cafe",
      alt_ko: "카페에서 진행하는 회화 연습",
    },
    programBusiness: {
      base: "https://images.pexels.com/photos/18999265/pexels-photo-18999265.jpeg",
      alt_en: "Business meeting with laptops",
      alt_ko: "노트북을 활용한 비즈니스 미팅",
    },
    programExam: {
      base: "https://images.pexels.com/photos/6958541/pexels-photo-6958541.jpeg",
      alt_en: "Exam preparation with textbooks",
      alt_ko: "교재로 시험 준비를 하는 학습 장면",
    },
    storyOne: {
      base: "https://images.pexels.com/photos/31367494/pexels-photo-31367494.jpeg",
      alt_en: "Student holding books outdoors",
      alt_ko: "책을 들고 있는 학생",
    },
    storyTwo: {
      base: "https://images.pexels.com/photos/17070296/pexels-photo-17070296.jpeg",
      alt_en: "Student using a laptop in a cafe",
      alt_ko: "카페에서 노트북을 사용하는 학습자",
    },
    storyThree: {
      base: "https://images.pexels.com/photos/30424729/pexels-photo-30424729.jpeg",
      alt_en: "Smiling learner in class",
      alt_ko: "교실에서 미소 짓는 학습자",
    },
    heroMain: {
      base: "https://images.pexels.com/photos/3142002/pexels-photo-3142002.jpeg",
      alt_en: "Seoul skyline at night",
      alt_ko: "서울 도심 야경",
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
    script.src = location.hostname === "patso95.github.io" ? "/Website/assets/analytics-loader.js" : "/assets/analytics-loader.js";
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
