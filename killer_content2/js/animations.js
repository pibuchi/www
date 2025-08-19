// 애니메이션 효과 모듈
export function initAnimations() {
    // 카드 호버 효과
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.analysis-card, .gpt-card')) {
            const card = e.target.closest('.analysis-card, .gpt-card');
            card.style.transform = 'translateY(-2px)';
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.analysis-card, .gpt-card')) {
            const card = e.target.closest('.analysis-card, .gpt-card');
            card.style.transform = 'translateY(0)';
        }
    });
}
