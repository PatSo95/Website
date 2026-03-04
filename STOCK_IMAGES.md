# STOCK_IMAGES

Source for all assets: **Pexels** (royalty-free, attribution not required by Pexels license; confirm policy before commercial final release).

## Image registry

| Key | Pexels page URL | Usage | Alt EN | Alt KO |
|---|---|---|---|---|
| heroSeoul | https://www.pexels.com/photo/city-buildings-near-body-of-water-1119723/ | EN/KO home hero | Seoul skyline with river at dusk | 강변이 보이는 서울 스카이라인 |
| meetupGarak | https://www.pexels.com/photo/man-taking-photo-of-buildings-near-road-31826555/ | EN/KO program card (in-person meetup), support/advantages visuals | Garak Market meetup area in Seoul | 서울 가락시장 인근 밋업 장소 |
| onlineOneToOne | https://www.pexels.com/photo/woman-in-red-long-sleeve-shirt-sitting-on-chair-5905709/ | EN/KO program card (online 1:1) | One-to-one online learning session | 온라인 1:1 학습 장면 |
| storyOne | https://www.pexels.com/photo/college-student-holding-books-outdoors-on-campus-31367494/ | EN/KO stories card 1 | Student holding books outdoors | 책을 들고 있는 학습자 |
| storyTwo | https://www.pexels.com/photo/young-man-sitting-in-a-restaurant-and-using-a-laptop-17070296/ | EN/KO stories card 2 | Learner using a laptop in a cafe | 카페에서 노트북으로 공부하는 학습자 |
| storyThree | https://www.pexels.com/photo/young-woman-smiling-in-classroom-setting-30424729/ | EN/KO stories card 3 | Smiling learner in class | 교실에서 미소 짓는 학습자 |

## Variant policy

All responsive images use `<picture>` with WebP first and JPG fallback, using these query parameters:
- `?auto=compress&cs=tinysrgb&fit=crop&w=480&fm=webp|jpg`
- `?auto=compress&cs=tinysrgb&fit=crop&w=768&fm=webp|jpg`
- `?auto=compress&cs=tinysrgb&fit=crop&w=1200&fm=webp|jpg`
- `?auto=compress&cs=tinysrgb&fit=crop&w=1600&fm=webp|jpg`
