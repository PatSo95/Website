# Contributing

This project includes a small Definition of Done (DoD) verification flow so every contributor can run the same checks locally.

## 1) Internal link check

Verify that Markdown internal links (relative files and heading anchors) are valid:

```bash
python3 scripts/check_internal_links.py
```

Expected result:

- `No broken internal Markdown links found.`

## 2) Local server startup + smoke check

Run a local server and verify the homepage responds:

```bash
./scripts/smoke_check.sh
```

Optional custom port:

```bash
./scripts/smoke_check.sh 8080
```

What this does:

- starts `python3 -m http.server` in the background,
- requests `http://127.0.0.1:<port>/` with `curl --fail`,
- exits non-zero if the server cannot be reached.

## 3) Release readiness checklist

Before marking a task/release as complete, ensure all changes are committed:

```bash
./scripts/verify_release_readiness.sh
```

Expected result:

- `Release readiness check passed: working tree is clean.`

If this fails, commit or stash local changes first.

## Recommended DoD sequence

Run these commands in order:

```bash
python3 scripts/check_internal_links.py
./scripts/smoke_check.sh
./scripts/verify_release_readiness.sh
```
