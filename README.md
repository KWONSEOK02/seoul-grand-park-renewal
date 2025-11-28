# Project Description
This project is a web application that includes a main page with search functionality, facility information, and recommended courses UI. It utilizes reusable HTML sections (fragments) for consistent headers and footers. Animal data is stored in a JSON file for dynamic content.

## Folder Structure

```
프로젝트 루트/
│
├── index.html                 # 서울대공원 메인페이지
├── animals.html               # 서브페이지 1 (동물 정보)
├── tiger-details.html         # 서브페이지 2 (시베리아 호랑이 상세 정보)
├── facilities.html            # 서브페이지 3 (편의시설 - 8개의 하위 섹션 포함)
├── search.html                # 서브페이지 4 통합 검색 결과 페이지 
│
├── style.css                  # 공통 스타일 (헤더, GNB, 편의시설 탭 등 모든 스타일 포함)
├── main.js                    # 공통 JS (GNB 드롭다운, 검색 로직, 탭 전환 기능 통합)
├── guide-subnav.js            # 서브 내비게이션 로더 (각 페이지 상단 메뉴 로드용)
├── README.md
│
├── assets/
│   ├── data/
│   │   └── animals.json       # 동물 데이터 (검색 기능 연동용)
│   │
│   └── images/
│       ├── main/              # 메인 페이지용 (히어로 배경, 팝업 이미지 등)
│       ├── facilities/        # 편의시설용 (매점, 카페, 고객도움터 등 사진)
│       ├── animals/           # 동물 사진 (호랑이, 레서판다 등)
│       └── icons/             # 기타 아이콘
│
└── components/                # 재사용 HTML 컴포넌트 폴더
    ├── header.html            # 상단 헤더 (GNB 구조 포함)
    ├── footer.html            # 하단 푸터
    │
    ├── guide-subnav.html      # [공원가이드] 서브 메뉴
    ├── zoo-subnav.html        # [동물원] 서브 메뉴
    ├── plants-subnav.html     # [식물원·정원] 서브 메뉴
    ├── forest-subnav.html     # [산림휴양] 서브 메뉴
    ├── apply-subnav.html      # [신청·참여] 서브 메뉴 
    └── issue-subnav.html      # [대공원 다多이슈] 서브 메뉴

```

## Features

- **Main Page**: Integrated UI for search, facility information, and recommended courses.
- **Styling**: `style.css` defines the overall visual theme.
- **Interactivity**: `main.js` handles search and course linking.
- **Reusable Components**: `header.html` and `footer.html` provide modular UI elements.
- **Data Management**: `animals.json` stores animal information.
