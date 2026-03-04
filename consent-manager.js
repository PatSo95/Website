(function initConsentManager(window, document) {
  const STORAGE_KEY = 'website-consent-preferences-v1';
  const DEFAULT_CONSENT = {
    necessary: true,
    analytics: false,
    marketing: false,
    hasSetPreferences: false,
  };

  let analyticsScriptLoaded = false;

  function cloneState(state) {
    return {
      necessary: true,
      analytics: Boolean(state.analytics),
      marketing: Boolean(state.marketing),
      hasSetPreferences: Boolean(state.hasSetPreferences),
    };
  }

  function getStoredState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return cloneState(DEFAULT_CONSENT);
      }
      return cloneState(JSON.parse(raw));
    } catch (error) {
      return cloneState(DEFAULT_CONSENT);
    }
  }

  function saveState(state) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cloneState(state)));
  }

  function dispatchConsentUpdate(state) {
    window.dispatchEvent(
      new CustomEvent('consent:updated', {
        detail: cloneState(state),
      }),
    );
  }

  function injectAnalyticsTag() {
    if (analyticsScriptLoaded || window.__analyticsInitialized) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'deferred-analytics-tag';
    script.src = './mock-analytics.js';
    script.async = true;

    document.head.appendChild(script);
    analyticsScriptLoaded = true;
  }

  function applyConsent(state) {
    if (state.analytics) {
      injectAnalyticsTag();
    }

    dispatchConsentUpdate(state);
  }

  function setConsentState(partialState) {
    const nextState = cloneState({
      ...getStoredState(),
      ...partialState,
      hasSetPreferences: true,
    });

    saveState(nextState);
    applyConsent(nextState);
    updateUI(nextState);
  }

  function resetConsentState() {
    const resetState = cloneState(DEFAULT_CONSENT);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resetState));

    // Explicit reset must return to non-analytics state.
    updateUI(resetState);
    dispatchConsentUpdate(resetState);
  }

  function openSettingsPanel() {
    document.getElementById('consent-panel').classList.remove('hidden');
  }

  function closeSettingsPanel() {
    document.getElementById('consent-panel').classList.add('hidden');
  }

  function showBannerIfNeeded(state) {
    const banner = document.getElementById('consent-banner');
    const shouldShow = !state.hasSetPreferences;
    banner.classList.toggle('hidden', !shouldShow);
  }

  function updateUI(state) {
    const analyticsInput = document.getElementById('pref-analytics');
    const marketingInput = document.getElementById('pref-marketing');

    analyticsInput.checked = state.analytics;
    marketingInput.checked = state.marketing;

    showBannerIfNeeded(state);
  }

  function bindEvents() {
    document.getElementById('accept-all').addEventListener('click', function onAcceptAll() {
      setConsentState({ analytics: true, marketing: true });
    });

    document.getElementById('reject-optional').addEventListener('click', function onReject() {
      setConsentState({ analytics: false, marketing: false });
    });

    document
      .getElementById('customize-consent')
      .addEventListener('click', function onCustomize() {
        openSettingsPanel();
      });

    document
      .getElementById('open-consent-settings')
      .addEventListener('click', function onOpenSettings() {
        openSettingsPanel();
      });

    document.getElementById('close-consent-panel').addEventListener('click', closeSettingsPanel);

    document.getElementById('save-consent').addEventListener('click', function onSave() {
      const analytics = document.getElementById('pref-analytics').checked;
      const marketing = document.getElementById('pref-marketing').checked;
      setConsentState({ analytics, marketing });
      closeSettingsPanel();
    });

    document.getElementById('reset-consent').addEventListener('click', function onResetConsent() {
      resetConsentState();
    });
  }

  function boot() {
    const state = getStoredState();
    updateUI(state);

    // First visit or reset defaults to non-analytics.
    if (state.analytics) {
      injectAnalyticsTag();
    }

    dispatchConsentUpdate(state);
    bindEvents();
  }

  window.ConsentManager = {
    getConsentState: getStoredState,
    setConsentState: setConsentState,
    resetConsentState: resetConsentState,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window, document);
