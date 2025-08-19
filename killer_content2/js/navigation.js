// 네비게이션 모듈
export function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    // 초기 로드 시 1단계 표시
    showSection('item-selection');
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 활성 상태 변경
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // 해당 섹션 표시
            const targetSection = item.getAttribute('data-section');
            showSection(targetSection);
            
            // 진행 단계 업데이트 이벤트 발생
            const event = new CustomEvent('sectionChanged', { 
                detail: { index, sectionName: targetSection } 
            });
            document.dispatchEvent(event);
        });
    });
    
    // 섹션 표시 함수
    function showSection(sectionName) {
        // 모든 섹션 숨기기
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // 해당 섹션만 표시
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
}
