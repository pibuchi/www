// 1단계: 아이템 선정 및 기본 분석 모듈
export function initItemSelection() {
    console.log('1단계 모듈 초기화');
    
    // 아이템 선정 관련 기능들
    const actionButton = document.querySelector('#item-selection .action-button');
    
    if (actionButton) {
        actionButton.addEventListener('click', () => {
            // 감성 · 경험 데이터 보기 기능
            showEmotionalData();
        });
    }
    
    // GPT 카드 클릭 이벤트
    const gptCards = document.querySelectorAll('#item-selection .gpt-card');
    gptCards.forEach(card => {
        card.addEventListener('click', () => {
            const link = card.querySelector('.gpt-link');
            if (link) {
                showExpertData(link.textContent);
            }
        });
    });
}

function showEmotionalData() {
    // 감성 · 경험 데이터 표시 로직
    alert('감성 · 경험 데이터를 분석 중입니다...');
}

function showExpertData(dataType) {
    // 전문가료 표시 로직
    alert(`${dataType} 전문가료를 불러오는 중입니다...`);
}
