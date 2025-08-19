// AINOYU Business Workspace JavaScript

// 전역 변수
let currentOpportunity = null;
let analysisData = {};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Business Workspace initialized');
    loadInitialData();
    setupEventListeners();
});

// 초기 데이터 로드
function loadInitialData() {
    console.log('📊 Loading initial business data...');
    
    // 실시간 데이터 시뮬레이션
    updateTrendData();
    updateKPIData();
    
    // 주기적 업데이트 (5분마다)
    setInterval(updateTrendData, 300000);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 's':
                    e.preventDefault();
                    saveWorkspace();
                    break;
                case 'e':
                    e.preventDefault();
                    exportData();
                    break;
            }
        }
    });
}

// 트렌드 데이터 업데이트
function updateTrendData() {
    const trendCards = document.querySelectorAll('.trend-card');
    
    // 성장률 업데이트
    const growthRate = (Math.random() * 10 + 10).toFixed(1);
    const growthCard = trendCards[0];
    if (growthCard) {
        growthCard.querySelector('.trend-value').textContent = `+${growthRate}%`;
    }
    
    // 시장 규모 업데이트
    const marketSize = (Math.random() * 0.5 + 2.5).toFixed(1);
    const sizeCard = trendCards[1];
    if (sizeCard) {
        sizeCard.querySelector('.trend-value').textContent = `${marketSize}조원`;
    }
    
    console.log('📈 Trend data updated');
}

// KPI 데이터 업데이트
function updateKPIData() {
    const kpiItems = document.querySelectorAll('.kpi-item');
    
    // ROI 예측
    const roi = (Math.random() * 50 + 130).toFixed(0);
    if (kpiItems[0]) {
        kpiItems[0].querySelector('.kpi-value').textContent = `${roi}%`;
    }
    
    // 투자 회수 기간
    const payback = (Math.random() * 3 + 6).toFixed(1);
    if (kpiItems[1]) {
        kpiItems[1].querySelector('.kpi-value').textContent = `${payback}개월`;
    }
    
    // 시장 적합성
    const fit = (Math.random() * 1 + 4).toFixed(1);
    if (kpiItems[2]) {
        kpiItems[2].querySelector('.kpi-value').textContent = `${fit}/5`;
    }
    
    console.log('📊 KPI data updated');
}

// 기회 분석
function analyzeOpportunity() {
    console.log('🔍 Analyzing business opportunities...');
    
    showLoadingState();
    
    // AI 분석 시뮬레이션
    setTimeout(() => {
        const insights = generateAIInsights();
        updateInsightsPanel(insights);
        hideLoadingState();
        showNotification('기회 분석이 완료되었습니다.', 'success');
    }, 2000);
}

// AI 인사이트 생성
function generateAIInsights() {
    const insights = [
        {
            icon: '🚀',
            title: '새로운 기회 발견',
            description: 'Z세대 타겟의 지속가능성 관심도가 급증하여 새로운 시장 진입점 발견'
        },
        {
            icon: '💎',
            title: '프리미엄 시장',
            description: '고품질 친환경 제품에 대한 프리미엄 지불 의향 67% 증가'
        },
        {
            icon: '⚡',
            title: '빠른 성장',
            description: '온라인 채널을 통한 직접 판매 모델의 성장 잠재력 확인'
        }
    ];
    
    return insights;
}

// 인사이트 패널 업데이트
function updateInsightsPanel(insights) {
    const insightsList = document.querySelector('.insights-list');
    if (!insightsList) return;
    
    insightsList.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-content">
                <strong>${insight.title}</strong>
                <p>${insight.description}</p>
            </div>
        </div>
    `).join('');
}

// 기회 상세 탐색
function exploreOpportunity(opportunityId) {
    console.log('🔍 Exploring opportunity:', opportunityId);
    
    currentOpportunity = opportunityId;
    
    const opportunityData = getOpportunityData(opportunityId);
    showOpportunityModal(opportunityData);
}

// 기회 데이터 가져오기
function getOpportunityData(id) {
    const data = {
        'eco-packaging': {
            title: '친환경 패키징 솔루션',
            description: '지속가능한 패키징 솔루션으로 환경 친화적 시장을 선도',
            marketSize: '1.2조원',
            growthRate: '+23.5%',
            competition: '중간',
            timeline: '12-18개월',
            investment: '5-8억원',
            risks: ['규제 변화', '원자재 가격 변동', '경쟁사 진입'],
            opportunities: ['정부 지원 정책', '소비자 인식 변화', '글로벌 트렌드'],
            nextSteps: [
                '시장 조사 및 고객 인터뷰',
                '프로토타입 개발',
                '파일럿 테스트 진행',
                '투자자 미팅'
            ]
        },
        'smart-accessories': {
            title: '스마트 홈 액세서리',
            description: 'IoT 기술을 활용한 차세대 라이프스타일 제품',
            marketSize: '0.8조원',
            growthRate: '+18.2%',
            competition: '높음',
            timeline: '18-24개월',
            investment: '10-15억원',
            risks: ['기술적 복잡성', '높은 개발비용', '시장 포화'],
            opportunities: ['5G 인프라 확산', '스마트홈 시장 성장', '기술 혁신'],
            nextSteps: [
                '기술 파트너십 구축',
                'MVP 개발',
                '베타 테스트',
                '양산 준비'
            ]
        },
        'personalization': {
            title: '개인화 서비스',
            description: '개인 맞춤형 경험을 제공하는 혁신적 서비스 모델',
            marketSize: '0.4조원',
            growthRate: '+12.8%',
            competition: '낮음',
            timeline: '6-12개월',
            investment: '2-4억원',
            risks: ['개인정보 보호', '확장성 문제', '수익화 어려움'],
            opportunities: ['데이터 활용 기술', '개인화 트렌드', '플랫폼 경제'],
            nextSteps: [
                '서비스 모델 정의',
                '플랫폼 개발',
                '사용자 테스트',
                '마케팅 전략'
            ]
        }
    };
    
    return data[id] || data['eco-packaging'];
}

// 기회 모달 표시
function showOpportunityModal(data) {
    const modal = document.getElementById('detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    modalTitle.textContent = data.title;
    
    modalContent.innerHTML = `
        <div class="opportunity-detail">
            <div class="detail-overview">
                <h4>📋 개요</h4>
                <p>${data.description}</p>
            </div>
            
            <div class="detail-metrics">
                <h4>📊 주요 지표</h4>
                <div class="metrics-grid">
                    <div class="metric-item">
                        <span class="metric-label">시장 규모</span>
                        <span class="metric-value">${data.marketSize}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">성장률</span>
                        <span class="metric-value">${data.growthRate}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">경쟁 수준</span>
                        <span class="metric-value">${data.competition}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">개발 기간</span>
                        <span class="metric-value">${data.timeline}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">초기 투자</span>
                        <span class="metric-value">${data.investment}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-analysis">
                <div class="analysis-section">
                    <h4>⚠️ 주요 리스크</h4>
                    <ul>
                        ${data.risks.map(risk => `<li>${risk}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="analysis-section">
                    <h4>🚀 기회 요인</h4>
                    <ul>
                        ${data.opportunities.map(opp => `<li>${opp}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="detail-roadmap">
                <h4>🗺️ 추진 로드맵</h4>
                <div class="roadmap-steps">
                    ${data.nextSteps.map((step, index) => `
                        <div class="roadmap-step">
                            <span class="step-number">${index + 1}</span>
                            <span class="step-content">${step}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="detail-actions">
                <button class="action-btn primary" onclick="startProject('${currentOpportunity}')">
                    🚀 프로젝트 시작
                </button>
                <button class="action-btn secondary" onclick="saveOpportunity('${currentOpportunity}')">
                    💾 즐겨찾기 추가
                </button>
                <button class="action-btn secondary" onclick="shareOpportunity('${currentOpportunity}')">
                    📤 공유하기
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 리포트 생성
function generateReport() {
    console.log('📋 Generating business report...');
    
    showLoadingState();
    
    setTimeout(() => {
        const reportData = generateReportData();
        downloadReport(reportData);
        hideLoadingState();
        showNotification('리포트가 생성되었습니다.', 'success');
    }, 1500);
}

// 리포트 데이터 생성
function generateReportData() {
    const currentDate = new Date().toLocaleDateString('ko-KR');
    
    return {
        title: 'AINOYU 비즈니스 분석 리포트',
        date: currentDate,
        summary: {
            totalOpportunities: 3,
            highPriorityOpportunities: 1,
            estimatedROI: '156%',
            recommendedInvestment: '5-8억원'
        },
        opportunities: [
            {
                name: '친환경 패키징 솔루션',
                priority: '높음',
                score: 92,
                marketSize: '1.2조원',
                timeline: '12-18개월'
            },
            {
                name: '스마트 홈 액세서리',
                priority: '보통',
                score: 78,
                marketSize: '0.8조원',
                timeline: '18-24개월'
            },
            {
                name: '개인화 서비스',
                priority: '낮음',
                score: 65,
                marketSize: '0.4조원',
                timeline: '6-12개월'
            }
        ],
        insights: [
            '친환경 트렌드의 지속적 성장 예상',
            '정부 정책 지원으로 시장 진입 장벽 완화',
            'Z세대 고객층의 프리미엄 지불 의향 증가'
        ],
        recommendations: [
            '친환경 패키징 솔루션 우선 추진 권장',
            '파일럿 프로젝트를 통한 시장 검증 필요',
            '전략적 파트너십 구축을 통한 리스크 분산'
        ]
    };
}

// 리포트 다운로드
function downloadReport(data) {
    const reportContent = `
# ${data.title}
생성일: ${data.date}

## 📊 요약
- 총 기회 수: ${data.summary.totalOpportunities}개
- 고우선순위 기회: ${data.summary.highPriorityOpportunities}개  
- 예상 ROI: ${data.summary.estimatedROI}
- 권장 투자액: ${data.summary.recommendedInvestment}

## 🎯 기회 분석
${data.opportunities.map(opp => `
### ${opp.name}
- 우선순위: ${opp.priority}
- 점수: ${opp.score}점
- 시장 규모: ${opp.marketSize}
- 개발 기간: ${opp.timeline}
`).join('')}

## 💡 주요 인사이트
${data.insights.map(insight => `- ${insight}`).join('\n')}

## 🚀 권장사항
${data.recommendations.map(rec => `- ${rec}`).join('\n')}

---
생성: AINOYU Business Workspace
    `;
    
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AINOYU_Business_Report_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 프로젝트 시작
function startProject(opportunityId) {
    console.log('🚀 Starting project for:', opportunityId);
    closeModal();
    showNotification(`${opportunityId} 프로젝트가 시작되었습니다.`, 'success');
    
    // 실제 구현에서는 프로젝트 관리 시스템으로 연동
}

// 기회 저장
function saveOpportunity(opportunityId) {
    console.log('💾 Saving opportunity:', opportunityId);
    
    // 로컬 스토리지에 저장
    const savedOpportunities = JSON.parse(localStorage.getItem('savedOpportunities') || '[]');
    if (!savedOpportunities.includes(opportunityId)) {
        savedOpportunities.push(opportunityId);
        localStorage.setItem('savedOpportunities', JSON.stringify(savedOpportunities));
        showNotification('즐겨찾기에 추가되었습니다.', 'success');
    } else {
        showNotification('이미 즐겨찾기에 추가된 항목입니다.', 'info');
    }
}

// 기회 공유
function shareOpportunity(opportunityId) {
    console.log('📤 Sharing opportunity:', opportunityId);
    
    const data = getOpportunityData(opportunityId);
    const shareText = `AINOYU에서 발견한 비즈니스 기회: ${data.title}\n시장 규모: ${data.marketSize}, 성장률: ${data.growthRate}`;
    
    if (navigator.share) {
        navigator.share({
            title: data.title,
            text: shareText,
            url: window.location.href
        });
    } else {
        // 클립보드에 복사
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('클립보드에 복사되었습니다.', 'success');
        });
    }
}

// 데이터 내보내기
function exportData() {
    console.log('📊 Exporting workspace data...');
    
    const workspaceData = {
        timestamp: new Date().toISOString(),
        trends: extractTrendData(),
        opportunities: extractOpportunityData(),
        insights: extractInsightData(),
        kpis: extractKPIData()
    };
    
    const blob = new Blob([JSON.stringify(workspaceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ainoyu_workspace_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('데이터가 내보내졌습니다.', 'success');
}

// 설정 표시
function showSettings() {
    console.log('⚙️ Showing settings...');
    showNotification('설정 기능은 개발 중입니다.', 'info');
}

// 워크스페이스 저장
function saveWorkspace() {
    console.log('💾 Saving workspace...');
    
    const workspaceState = {
        timestamp: new Date().toISOString(),
        currentView: 'business',
        preferences: {
            theme: 'dark',
            autoUpdate: true,
            notifications: true
        }
    };
    
    localStorage.setItem('ainoyu_workspace', JSON.stringify(workspaceState));
    showNotification('워크스페이스가 저장되었습니다.', 'success');
}

// 유틸리티 함수들
function extractTrendData() {
    const trendCards = document.querySelectorAll('.trend-card');
    return Array.from(trendCards).map(card => ({
        label: card.querySelector('.trend-label').textContent,
        value: card.querySelector('.trend-value').textContent,
        description: card.querySelector('.trend-desc').textContent
    }));
}

function extractOpportunityData() {
    const oppCards = document.querySelectorAll('.opportunity-card');
    return Array.from(oppCards).map(card => ({
        title: card.querySelector('h4').textContent,
        priority: card.querySelector('.opp-priority').textContent,
        score: card.querySelector('.opp-score').textContent,
        description: card.querySelector('p').textContent
    }));
}

function extractInsightData() {
    const insights = document.querySelectorAll('.insight-item');
    return Array.from(insights).map(insight => ({
        title: insight.querySelector('strong').textContent,
        description: insight.querySelector('p').textContent,
        icon: insight.querySelector('.insight-icon').textContent
    }));
}

function extractKPIData() {
    const kpis = document.querySelectorAll('.kpi-item');
    return Array.from(kpis).map(kpi => ({
        value: kpi.querySelector('.kpi-value').textContent,
        label: kpi.querySelector('.kpi-label').textContent
    }));
}

function showLoadingState() {
    document.body.classList.add('loading');
}

function hideLoadingState() {
    document.body.classList.remove('loading');
}

function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // 간단한 토스트 알림
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 모달 외부 클릭시 닫기
document.addEventListener('click', function(e) {
    const modal = document.getElementById('detail-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// 전역 함수 노출
window.analyzeOpportunity = analyzeOpportunity;
window.generateReport = generateReport;
window.exploreOpportunity = exploreOpportunity;
window.closeModal = closeModal;
window.startProject = startProject;
window.saveOpportunity = saveOpportunity;
window.shareOpportunity = shareOpportunity;
window.exportData = exportData;
window.showSettings = showSettings;

console.log('✅ Business Workspace JavaScript loaded successfully');
