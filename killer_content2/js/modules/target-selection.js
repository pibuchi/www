// 5단계: 타겟 시장 선정 모듈
export function initTargetSelection() {
    console.log('5단계 모듈 초기화');
    
    const actionButton = document.querySelector('#target-selection .action-button');
    if (actionButton) {
        actionButton.addEventListener('click', () => {
            showTargetAnalysis();
        });
    }
}

function showTargetAnalysis() {
    alert('타겟 분석 데이터를 불러오는 중입니다...');
}
