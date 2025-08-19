// 진행 단계 관리 모듈
export function initProgress() {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressDividers = document.querySelectorAll('.progress-divider');
    
    // 섹션 변경 이벤트 리스너
    document.addEventListener('sectionChanged', (e) => {
        updateProgressSteps(e.detail.index);
    });
    
    function updateProgressSteps(currentIndex) {
        progressSteps.forEach((step, index) => {
            step.classList.remove('completed', 'current');
            if (index < currentIndex) {
                step.classList.add('completed');
            } else if (index === currentIndex) {
                step.classList.add('current');
            }
        });

        progressDividers.forEach((divider, index) => {
            divider.classList.remove('completed');
            if (index < currentIndex) {
                divider.classList.add('completed');
            }
        });
    }
}
