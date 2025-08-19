// script.js - 개발환경용

// 전역 함수들 정의
function showTab(index) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.ui-panel').forEach(panel => panel.classList.remove('active'));
    
    document.querySelectorAll('.tab-btn')[index].classList.add('active');
    document.getElementById(`panel-${index}`).classList.add('active');
}

function selectPersona(personaId) {
    document.querySelectorAll('.persona-card').forEach(card => {
        card.classList.remove('active');
    });
    
    document.querySelectorAll('.scenario-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[data-persona="${personaId}"]`).classList.add('active');
    document.getElementById(`scenario-${personaId}`).classList.add('active');
}

function startAnalysis() {
    const country = document.getElementById('country').value;
    const product = document.getElementById('product').value;
    const targetAge = document.getElementById('target-age').value;
    const targetGender = document.getElementById('target-gender').value;
    
    if (!country || !product || !targetAge || !targetGender) {
        alert('모든 필수 정보를 입력해주세요!');
        return;
    }
    
    const btn = document.querySelector('.analyze-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>🔄 AI가 분석 중입니다...</span>';
    btn.style.opacity = '0.7';
    btn.disabled = true;
    
    setTimeout(() => {
        showTab(1);
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.disabled = false;
        
        // 결과 화면 애니메이션
        animateResults();
    }, 2500);
}

function downloadReport() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '📄 생성 중...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '✅ 다운로드 완료!';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            // 실제 환경에서는 PDF 생성 및 다운로드 로직
            console.log('PDF 리포트 다운로드 시작');
        }, 1500);
    }, 2000);
}

function animateResults() {
    // 원형 차트 애니메이션
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
        setTimeout(() => {
            const dashArray = circle.getAttribute('stroke-dasharray');
            circle.style.strokeDasharray = dashArray;
        }, index * 300);
    });
    
    // 프로그레스 바 애니메이션
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        }, index * 200);
    });
}

// DOMContentLoaded 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 EmotiExport 시스템 로드 시작...');

    // 페르소나 카드 클릭 이벤트
    document.querySelectorAll('.persona-card').forEach(card => {
        card.addEventListener('click', function() {
            const personaId = this.getAttribute('data-persona');
            selectPersona(personaId);
        });
    });

    // 폼 컨트롤 이벤트 리스너
    document.querySelectorAll('.form-control').forEach(element => {
        element.addEventListener('change', function() {
            this.style.borderColor = '#10b981';
            this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            
            // 체크 아이콘 효과
            if (this.value) {
                this.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%2310b981\'%3E%3Cpath d=\'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z\'/%3E%3C/svg%3E")';
                this.style.backgroundRepeat = 'no-repeat';
                this.style.backgroundPosition = 'right 12px center';
                this.style.backgroundSize = '16px';
            }
            
            setTimeout(() => {
                this.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                this.style.boxShadow = 'none';
                this.style.backgroundImage = 'none';
            }, 2000);
        });

        // 포커스 효과
        element.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });

        element.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // 카드 호버 효과
    document.querySelectorAll('.card, .insight-card-enhanced, .strategy-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) rotateX(2deg)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });

    // 순차적 애니메이션
    const animatedElements = document.querySelectorAll('.insight-card-enhanced, .strategy-item, .journey-step, .opportunity-card');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // 탭 클릭 시 스크롤 효과
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // 스크롤 시 헤더 효과
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.transform = 'scale(0.9)';
            header.style.opacity = '0.8';
        } else {
            header.style.transform = 'scale(1)';
            header.style.opacity = '1';
        }
    });

    // 키보드 네비게이션 지원
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    showTab(0);
                    break;
                case '2':
                    e.preventDefault();
                    showTab(1);
                    break;
                case '3':
                    e.preventDefault();
                    showTab(2);
                    break;
                case '4':
                    e.preventDefault();
                    showTab(3);
                    break;
            }
        }
    });

    // 마케팅 카드 클릭 시 상세 정보 토글
    document.querySelectorAll('.marketing-card').forEach(card => {
        card.addEventListener('click', function() {
            const details = this.querySelector('.reaction-details');
            if (details) {
                if (details.style.display === 'none') {
                    details.style.display = 'block';
                    details.style.animation = 'fadeIn 0.3s ease';
                } else {
                    details.style.display = 'none';
                }
            }
        });
    });

    // 툴팁 기능
    function createTooltip(element, text) {
        if (!element) return;
        
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.8rem;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        });

        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    }

    // 주요 요소들에 툴팁 추가
    const circularProgress = document.querySelector('.circular-progress');
    if (circularProgress) {
        createTooltip(circularProgress, '클릭하여 상세 분석 보기');
    }

    // 개발 모드 알림
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 개발 모드로 실행 중입니다.');
    }

    console.log('✅ EmotiExport 시스템이 성공적으로 로드되었습니다!');
    console.log('🎯 사용 가능한 단축키: Ctrl+1,2,3,4 (탭 전환)');
});