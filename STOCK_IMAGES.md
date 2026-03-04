# STOCK_IMAGES

Source for all assets: **Pexels** (royalty-free stock photo platform).

## Image registry

| Key | Base URL | Usage | Alt EN | Alt KO |
|---|---|---|---|---|
| hero-seoul-skyline | https://images.pexels.com/photos/1119723/pexels-photo-1119723.jpeg | EN/KO one-on-one social proof card, optional skyline visual | Seoul skyline by the river | 한강과 서울 스카이라인 |
| garak-hero | https://images.pexels.com/photos/31826555/pexels-photo-31826555.jpeg | EN/KO one-on-one hero, meetup context cards | Garak Market neighborhood street in Seoul | 서울 가락시장 인근 거리 |
| seoul-market-street | https://images.pexels.com/photos/31720216/pexels-photo-31720216.jpeg | EN/KO one-on-one in-person format block | Seoul market street scene near meetup area | 서울 시장 골목 풍경 |
| online-one-to-one | https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg | EN/KO one-on-one online format block and cards | Online one-to-one tutoring session | 온라인 1:1 수업 장면 |
| teacher-detail | https://images.pexels.com/photos/5905562/pexels-photo-5905562.jpeg | EN/KO one-on-one social proof card | Teacher writing notes | 교사가 노트를 작성하는 장면 |

## Variant policy

All responsive images use `<picture>` with WebP first and JPG fallback:
- `?auto=compress&cs=tinysrgb&fit=crop&w=480&fm=webp|jpg`
- `?auto=compress&cs=tinysrgb&fit=crop&w=768&fm=webp|jpg`
- `?auto=compress&cs=tinysrgb&fit=crop&w=1200&fm=webp|jpg`
- `?auto=compress&cs=tinysrgb&fit=crop&w=1600&fm=webp|jpg`

Hero images use `loading="eager"` + `fetchpriority="high"`; below-the-fold images use `loading="lazy" decoding="async"`.
