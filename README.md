# Website

Private Website Project.

## Definition of Done (DoD) verification

Repeatable contributor verification steps are documented in [CONTRIBUTING.md](CONTRIBUTING.md).

Quick run sequence:

```bash
python3 scripts/check_links.py
python3 scripts/check_internal_links.py
./scripts/smoke_check.sh
./scripts/verify_release_readiness.sh
```
