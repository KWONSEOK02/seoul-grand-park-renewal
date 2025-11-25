// guide-subnav.js
// 공원가이드·동물원 등 상단 메뉴 아래에 들어가는 서브 내비게이션 공통 include

document.addEventListener('DOMContentLoaded', () => {
    const subnavContainer = document.getElementById('guide-subnav');
  
    // 이 페이지에 guide-subnav 영역이 없는 경우 바로 종료
    if (!subnavContainer) return;
  
    fetch('components/guide-subnav.html')
      .then((response) => response.text())
      .then((html) => {
        subnavContainer.innerHTML = html;
      })
      .catch((error) => {
        console.error('guide-subnav 로드 중 오류:', error);
      });
  });
  