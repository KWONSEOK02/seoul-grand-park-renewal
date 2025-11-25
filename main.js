// =========================================================
// 1. GNB 드롭다운 로직 (Header 로드 후 실행됨)
// =========================================================
const initGnbDropdown = () => {
    const gnbMenuList = document.getElementById('gnb-menu-list');
    const dropdownWrap = document.getElementById('gnb-dropdown-wrap');
    const dropdownContent = document.getElementById('gnb-dropdown-content');

    if (!gnbMenuList || !dropdownWrap || !dropdownContent) return;

    // 파일 매핑
    const sectionToFileMap = {
        guide: 'guide-subnav.html',
        zoo: 'zoo-subnav.html',
        plants: 'plants-subnav.html',
        forest: 'forest-subnav.html',
        apply: 'apply-subnav.html',
        issue: 'issue-subnav.html',
    };

    let hideTimer = null;

    const loadMenuContent = (menuId) => {
        const fileName = sectionToFileMap[menuId];
        if (!fileName) return;
        const url = `components/${fileName}`;
        
        fetch(url)
            .then(response => response.text())
            .then(html => dropdownContent.innerHTML = html)
            .catch(error => console.error(`Menu Load Error: ${fileName}`, error));
    };

    const showDropdown = (menuId, menuItem) => {
        clearTimeout(hideTimer);
        gnbMenuList.querySelectorAll('a').forEach(a => a.classList.remove('is-active'));
        menuItem.querySelector('a')?.classList.add('is-active');
        loadMenuContent(menuId);
        dropdownWrap.classList.add('is-active');
    };

    const hideDropdown = () => {
        hideTimer = setTimeout(() => {
            dropdownWrap.classList.remove('is-active');
            gnbMenuList.querySelectorAll('a').forEach(a => a.classList.remove('is-active'));
        }, 100); 
    };

    // 이벤트 리스너 연결
    gnbMenuList.addEventListener('mouseenter', (e) => {
        const menuItem = e.target.closest('[data-menu-id]');
        if (menuItem) showDropdown(menuItem.dataset.menuId, menuItem);
    }, true);

    gnbMenuList.addEventListener('mouseleave', hideDropdown);
    dropdownWrap.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    dropdownWrap.addEventListener('mouseleave', hideDropdown);
};


// =========================================================
// 2. 검색 기능 로직 (검색어 처리 및 결과 렌더링)
// =========================================================
const initSearchLogic = () => {

    // 2-1. 검색창 동작 (헤더 및 검색 페이지 내부 검색창 모두 대응)
    const searchInputs = document.querySelectorAll('input[type="text"]');
    

    searchInputs.forEach(input => {
        // 엔터키 이벤트
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const keyword = input.value.trim();
                if (keyword) {
                    window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
                } else {
                    alert('검색어를 입력해주세요.');
                }
            }
        });
        
        // 버튼 클릭 이벤트 (형제 요소 중 button 찾기)
        const btn = input.parentElement.querySelector('button');
        if (btn) {
            btn.addEventListener('click', () => {
                const keyword = input.value.trim();
                if (keyword) {
                    window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
                } else {
                    alert('검색어를 입력해주세요.');
                }
            });
        }
    });

    // 2-2. 검색 결과 페이지 로직 (search.html 에서만 동작)
    const resultContainer = document.querySelector('.animals-result-list');
    if (resultContainer) {
        
        // URL에서 검색어 가져오기 (?q=호랑이)
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        
        // 검색창에 검색어 유지시키기
        const totalSearchInput = document.getElementById('total-search-input');
        if(totalSearchInput && query) totalSearchInput.value = query;

        const resultCount = document.querySelector('.result-count');

        if (query) {
            // 데이터 불러오기 및 필터링
            fetch('assets/data/animals.json')
                .then(res => res.json())
                .then(data => {
                    const results = data.filter(animal => 
                        animal.name.includes(query) || animal.category.includes(query)
                    );

                    // 결과 개수 업데이트
                    if(resultCount) resultCount.textContent = results.length;

                    // ★ HTML 렌더링 (타겟 디자인에 맞춰 구조 변경)
                    if (results.length > 0) {
                        resultContainer.innerHTML = results.map(animal => {
                            // 검색어 하이라이트 처리 (이름, 설명)
                            const highlight = (text) => {
                                if(!text) return "";
                                const regex = new RegExp(query, 'gi');
                                return text.replace(regex, `<span class="keyword-highlight">${query}</span>`);
                            };

                            return `
                            <div class="search-result-item">
                                <div class="res-path">
                                    ${animal.category} ↗
                                </div>
                                
                                <a href="#" class="res-title">
                                    ${highlight(animal.name)}
                                </a>
                                
                                <p class="res-desc">
                                    ${highlight(animal.description)}
                                </p>
                                
                                <ul class="res-meta">
                                    <li>등록일 &nbsp; ${animal.date}</li>
                                </ul>
                            </div>
                            `;
                        }).join('');
                    } else {
                        // 결과 없음
                        resultContainer.innerHTML = `<div style="text-align:center; padding: 80px 0; color:#666;">검색 결과가 없습니다.</div>`;
                    }
                })
                .catch(err => console.error('데이터 로드 실패:', err));
        }
    }
};


// =========================================================
// 3. 페이지 로드 시 실행 (메인 실행부)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js loaded');

    // Header Load
    const headerContainer = document.getElementById('site-header');
    if (headerContainer) {
        fetch('components/header.html')
            .then(res => res.text())
            .then(html => {
                headerContainer.innerHTML = html;
                initGnbDropdown(); // 헤더 로드 후 GNB 실행
                initSearchLogic(); // 헤더 로드 후 검색바 이벤트 연결 (헤더에 검색창이 있을 수 있으므로)
            });
    } else {
        initGnbDropdown();
        initSearchLogic();
    }

    // Footer Load
    const footerContainer = document.getElementById('site-footer');
    if (footerContainer) {
        fetch('components/footer.html')
            .then(res => res.text())
            .then(html => footerContainer.innerHTML = html);
    }
    
    // Guide Subnav Load (메인페이지가 아닌 곳에서만)
    const guideSubnav = document.getElementById('guide-subnav');
    if (guideSubnav) {
        fetch('components/guide-subnav.html')
            .then(res => res.text())
            .then(html => guideSubnav.innerHTML = html);
    }

    // 기타 JS (투어 코스 탭 등)
    initTourTabs(); // ★ 투어 탭 로직 실행 추가
});

// =========================================================
// 4. 편의시설 탭 전환 함수
// =========================================================
function openTab(tabName) {
    // 1. 모든 탭 버튼 비활성화
    const tabButtons = document.querySelectorAll('.facility-tab-item');
    tabButtons.forEach(btn => btn.classList.remove('is-active'));
    // 2. 클릭된 버튼 활성화 (event.currentTarget 사용)
    // (HTML에서 onclick으로 호출할 때 this를 넘기지 않았으므로, 
    // 여기서 클릭된 요소를 찾거나 간단히 event 객체 활용)
    const clickedBtn = event.currentTarget;
    clickedBtn.classList.add('is-active');
    // 3. 모든 탭 내용 숨김
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => pane.classList.remove('is-active'));
    // 4. 선택된 탭 내용 보이기
    const activePane = document.getElementById(tabName);
    if (activePane) {
        activePane.classList.add('is-active');
    }
}

// =========================================================
// 5. 투어 코스 탭 전환 로직 (텍스트 + 시간 + 지도이미지 변경)
// =========================================================
const initTourTabs = () => {
    const tourItems = document.querySelectorAll('.tour-course-item');
    
    // 변경할 DOM 요소들
    const cardTitle = document.querySelector('#tour-info-card .info-title');
    const cardDesc = document.querySelector('#tour-info-card .info-desc');
    const cardTime = document.querySelector('#tour-info-card .info-time span');
    const mapImage = document.querySelector('.tour-map-area .map-image');
    // 코스별 데이터 (제목, 시간, 설명, 이미지경로)
    // ★ imgUrl 부분의 파일명을 실제 파일명으로 꼭 맞춰주세요!
    const tourData = [
        {
            title: "01. 동물원 인기관람",
            time: "2시간 소요",
            desc: "동물원에서 가장 인기있는 동물사들로 관람해보세요~!<br>서울대공원 필수코스~! 관람객분들의 사랑을 가장 많이 받고 있는 동물사 코스로 구성~!",
            imgUrl: "assets/images/main/course_01.jpg"
        },
        {
            title: "02. 식물원 집중탐구",
            time: "1시간 30분 소요",
            desc: "공립수목원인 서울대공원 식물원을 관람해보세요!<br>식물과 꽃을 좋아하는 분들에게 강력추천~!",
            imgUrl: "assets/images/main/course_02.jpg"
        },
        {
            title: "03. 연인과 함께 오붓한 영화촬영지",
            time: "2시간 30분 소요",
            desc: "영화촬영지도 보고, 오붓하게 즐길 수 있는 대공원 관람코스입니다.",
            imgUrl: "assets/images/main/course_03.jpg"
        },
        {
            title: "04. 호수길 산책 & 미술관 관람",
            time: "1시간 소요",
            desc: "호수길 따라 산책하고 미술관까지 들르는 이런 데이트는 어떠세요?",
            imgUrl: "assets/images/main/course_04.jpg"
        },
        {
            title: "05. 꽃·동물 한번에 다! 대공원 한바퀴",
            time: "3시간 소요",
            desc: "꽃, 동물 하나 빠지는 것 없이 이곳저곳 꼼꼼하게 둘러보는 한바퀴 코스입니다.",
            imgUrl: "assets/images/main/course_05.jpg"
        },
        {
            title: "06. 아이가 있다면 동물과 함께",
            time: "2시간 소요",
            desc: "동물원에서 가장 인기있는 동물사들로 관람해보세요~!<br>아이와 함께하는 가족들에게 안성맞춤입니다!",
            imgUrl: "assets/images/main/course_06.jpg"
        }
    ];
    if (!tourItems || !cardTitle || !cardDesc || !mapImage) return;
    tourItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 1. 활성화 스타일 변경
            tourItems.forEach(el => el.classList.remove('is-active'));
            item.classList.add('is-active');
            // 2. 데이터 가져와서 화면 업데이트
            const data = tourData[index];
            if (data) {
                cardTitle.textContent = data.title;
                cardDesc.innerHTML = data.desc;
                if(cardTime) cardTime.textContent = data.time;
                
                // 지도 이미지 변경
                mapImage.src = data.imgUrl;
                mapImage.alt = data.title + " 지도";
            }
        });
    });
};