# Repository Policy Requirements (Normative)

These rules are mandatory for all contributors working in this repository. The keywords **MUST**, **MUST NOT**, **SHOULD**, and **SHOULD NOT** are to be interpreted as normative requirements.

## 1) Real implementation artifacts
- Contributors **MUST** implement everything as real files and working deliverables.
- Contributors **MUST NOT** use placeholders.
- Contributors **MUST NOT** use lorem ipsum text.
- This policy requirement is exact: “Implement everything as real files, no placeholders, no lorem ipsum”.

## 2) Bilingual structure parity and language switching
- Contributors **MUST** create `/en` and `/ko` content trees.
- Contributors **MUST** maintain a **1:1 page mapping** between `/en` and `/ko`; every page in one language **MUST** have a corresponding page in the other language.
- Contributors **MUST** implement a working language switcher on all applicable pages.
- The language switcher **MUST** navigate users to the corresponding mapped page in the other language.
- This policy requirement is exact: “Create /en and /ko with 1:1 pages and working language switcher”.

## 3) Cookie consent and analytics gating
- Contributors **MUST** implement cookie consent with explicit categories (at minimum: necessary, analytics).
- Analytics scripts/tags/events **MUST** be blocked by default until analytics consent is granted.
- Analytics **MUST NOT** load or fire before consent for analytics is explicitly provided.
- This policy requirement is exact: “Implement cookie consent categories and block analytics until consent”.

## 4) Stock image sourcing documentation
- Contributors **MUST** use royalty-free stock images when stock photography is included.
- Contributors **MUST** create and maintain `STOCK_IMAGES.md` documenting image sources, licenses/usage terms, and attribution requirements (if any).
- This policy requirement is exact: “Use royalty-free stock images and create STOCK_IMAGES.md”.

## 5) SEO and indexing requirements on every page
- Contributors **MUST** provide a valid `sitemap.xml`.
- Contributors **MUST** provide a valid `robots.txt`.
- Every page **MUST** include correct `hreflang` annotations for language variants.
- Every page **MUST** include a canonical link.
- This policy requirement is exact: “Create sitemap.xml, robots.txt, hreflang and canonical on every page”.

## 6) Definition of Done (DoD)
A change is complete only when all of the following are true:
- There are **no broken links** across the site.
- The **local server works** and the site is runnable locally.
- **Everything is committed** to version control.
- This policy requirement is exact: “Definition of done: no broken links, local server works, everything committed”.

## 7) Enforcement guidance
- If any requirement above conflicts with implementation convenience, contributors **MUST** follow these requirements.
- Contributors **SHOULD** add automated checks where feasible to enforce these rules.
- Pull requests **MUST** explain how each applicable requirement was satisfied.
