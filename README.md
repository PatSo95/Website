# Website

Bilingual static website structure with mirrored locale routes under `/en` and `/ko`.

## Locale structure

Every English route has a Korean counterpart and vice versa.

## Language switcher

Each page renders a shared language switcher via `assets/lang-switcher.js`.
The switcher:

- detects the current locale and slug from `window.location.pathname`
- maps to the opposite locale with `assets/locale-routes.json`
- disables the link if a counterpart route is missing

## Validation

Run the locale parity check:

```bash
python3 scripts/validate_locale_links.py
```

This command fails if any `/en/...` route is missing in `/ko/...` or vice versa.
