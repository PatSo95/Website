# STOCK_IMAGES

Source: **Pexels** (royalty-free stock usage).

## Image registry by key

| IMG key | Pexels page URL | Usage (page/section) | Alt EN | Alt KO |
|---|---|---|---|---|
| heroMain | https://www.pexels.com/photo/bright-lights-over-river-and-city-buildings-at-night-3142002/ | EN/KO hero backgrounds (home and feature pages) | Seoul skyline at night | 서울 야경 스카이라인 |
| campusGangnam | https://www.pexels.com/photo/teenage-girls-on-the-gangnam-square-seoul-south-korea-18935926/ | EN/KO campus cards (Gangnam) | Gangnam district in Seoul | 서울 강남 거리 풍경 |
| campusHongdae | https://www.pexels.com/photo/assorted-color-signages-2128042/ | EN/KO campus cards (Hongdae) | Hongdae neon street at night | 홍대 네온 거리 야경 |
| campusBusan | https://www.pexels.com/photo/aerial-view-of-busan-at-night-with-illuminated-skyline-36046040/ | EN/KO campus cards (Busan) | Aerial night skyline of Busan | 부산 야경 항공 전경 |
| programIntensive | https://www.pexels.com/photo/students-studying-in-the-classroom-8199143/ | EN/KO program card (Korean Intensive) | Students studying in a classroom | 교실에서 학습하는 수강생 |
| programStandard | https://www.pexels.com/photo/students-studying-in-classroom-8197511/ | EN/KO program card (Korean Standard) | Learners in a structured class | 구조화된 수업을 듣는 학습자 |
| programOnline | https://www.pexels.com/photo/little-girl-doing-her-homework-4260481/ | EN/KO program card (Online 1:1) | Online one-to-one learning | 온라인 1:1 학습 장면 |
| programConversation | https://www.pexels.com/photo/people-having-a-conversation-in-a-cafe-6829486/ | EN/KO program card (English Conversation) | Conversation practice in a cafe | 카페에서 진행하는 회화 연습 |
| programBusiness | https://www.pexels.com/photo/a-group-of-people-sitting-with-laptops-at-a-meeting-18999265/ | EN/KO program card (Business Korean) | Business meeting with laptops | 노트북을 활용한 비즈니스 미팅 |
| programExam | https://www.pexels.com/photo/close-up-of-person-sitting-at-desk-studying-with-textbooks-6958541/ | EN/KO program card (Exam Preparation) | Exam preparation with textbooks | 교재로 시험 준비를 하는 학습 장면 |
| storyOne | https://www.pexels.com/photo/college-student-holding-books-outdoors-on-campus-31367494/ | EN/KO stories card 1 | Student holding books outdoors | 책을 들고 있는 학생 |
| storyTwo | https://www.pexels.com/photo/young-man-sitting-in-a-restaurant-and-using-a-laptop-17070296/ | EN/KO stories card 2 | Student using a laptop in a cafe | 카페에서 노트북을 사용하는 학습자 |
| storyThree | https://www.pexels.com/photo/young-woman-smiling-in-classroom-setting-30424729/ | EN/KO stories card 3 | Smiling learner in class | 교실에서 미소 짓는 학습자 |

## Responsive variant policy

Every `picture[data-img]` is rendered by JS with:
- webp first, jpg fallback
- `auto=compress&cs=tinysrgb&fit=crop`
- width variants: `w=480`, `w=768`, `w=1200`, `w=1600`
- `sizes="(max-width: 768px) 92vw, 380px"`
