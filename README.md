# Website

Simple static demo site including a consent manager with category-level controls.

## Features

- Consent categories: `necessary`, `analytics`, and `marketing`
- Default non-analytics behavior on first visit
- Deferred analytics script injection until explicit analytics consent
- Persisted consent preferences using `localStorage`
- UI to review/update preferences and reset consent

## Run locally

Serve this directory with any static file server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
