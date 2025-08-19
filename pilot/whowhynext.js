/*
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                              PersonaSync JavaScript Engine                            ║
║                                                                                        ║
║  🎯 핵심 기능:                                                                         ║
║    • 네비게이션 시스템                                                                ║
║    • 인터랙티브 기능 (페르소나/시장분석/디자인/AI)                                     ║
║    • 이스터에그 & 숨겨진 기능                                                         ║
║    • 미니게임 시스템                                                                  ║
║                                                                                        ║
║  🎮 숨겨진 기능 가이드:                                                               ║
║    1. 로고 5회 클릭 → 개발자 모드                                                     ║
║    2. 로고 더블클릭 → 영감 메시지                                                     ║
║    3. 코나미 코드 → 비밀 모드                                                         ║
║    4. F12 콘솔 → 특별 명령어                                                          ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
*/

// ===== GLOBAL VARIABLES =====
let currentPersona = null;
let analysisProgress = 0;
let activeFeature = null;

// ===== NAVIGATION SYSTEM =====
function showDashboard() {
    hideAllSections();
    const dashboard = document.getElementById('dashboard');
    dashboard.style.display = 'block';
    dashboard.classList.add('active');
    updateActiveNav(0);
}

function showPersonaBuilder() {
    hideAllSections();
    const personaBuilder = document.getElementById('persona-builder');
    personaBuilder.style.display = 'block';
    personaBuilder.classList.add('active');
    updateActiveNav(1);
}

function showMarketAnalysis() {
    hideAllSections();
    const marketAnalysis = document.getElementById('market-analysis');
    marketAnalysis.style.display = 'block';
    marketAnalysis.classList.add('active');
    updateActiveNav(2);
}

function showDesignDecision() {
    hideAllSections();
    const designDecision = document.getElementById('design-decision');
    designDecision.style.display = 'block';
    designDecision.classList.add('active');
    updateActiveNav(3);
}

function showAIInsights() {
    hideAllSections();
    const aiInsights = document.getElementById('ai-insights');
    aiInsights.style.display = 'block';
    aiInsights.classList.add('active');
    updateActiveNav(4);
}

function showReporting() {
    alert('실시간 리포트 생성 기능이 준비 중입니다.');
}

function showIntegration() {
    alert('Figma, Adobe, Sketch 연동 기능이 준비 중입니다.');
}

function hideAllSections() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
}

function updateActiveNav(index) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    if (navItems[index]) {
        navItems[index].classList.add('active');
    }
}

// ===== MAIN FEATURES =====
function activateFeature(featureName) {
    // Remove active class from all cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to clicked card
    event.target.closest('.feature-card').classList.add('active');
    
    // Navigate to specific feature
    switch(featureName) {
        case 'persona-builder':
            showPersonaBuilder();
            break;
        case 'market-analysis':
            showMarketAnalysis();
            break;
        case 'design-decision':
            showDesignDecision();
            break;
        case 'ai-insights':
            showAIInsights();
            break;
    }
}

// ===== PERSONA BUILDER SYSTEM =====
let currentPersonaData = null;
let selectedInterests = [];

// Interest Tag Management
function toggleInterest(element) {
    const interest = element.getAttribute('data-interest');
    
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        selectedInterests = selectedInterests.filter(i => i !== interest);
    } else {
        element.classList.add('selected');
        selectedInterests.push(interest);
    }
    
    console.log('Selected interests:', selectedInterests);
}

// Form Management
function clearPersonaForm() {
    document.getElementById('persona-name').value = '';
    document.getElementById('persona-age').value = '';
    document.getElementById('persona-job').value = '';
    document.getElementById('persona-income').value = '';
    document.getElementById('persona-pain-points').value = '';
    
    // Clear interest selections
    document.querySelectorAll('.interest-tag').forEach(tag => {
        tag.classList.remove('selected');
    });
    selectedInterests = [];
    
    // Hide output
    document.getElementById('persona-output').style.display = 'none';
    
    showNotification('폼 초기화', '입력 폼이 초기화되었습니다.');
}

// AI Persona Generation
function generateAIPersona() {
    const formData = collectFormData();
    
    if (!validateFormData(formData)) {
        showNotification('입력 오류', '필수 정보를 모두 입력해주세요.');
        return;
    }
    
    showNotification('AI 분석 중', '페르소나를 생성하고 있습니다...');
    
    // Simulate AI processing time
    setTimeout(() => {
        currentPersonaData = generatePersonaData(formData);
        displayGeneratedPersona(currentPersonaData);
        showNotification('생성 완료', 'AI 페르소나가 성공적으로 생성되었습니다!');
    }, 2000);
}

function collectFormData() {
    return {
        name: document.getElementById('persona-name').value.trim(),
        age: document.getElementById('persona-age').value,
        job: document.getElementById('persona-job').value.trim(),
        income: document.getElementById('persona-income').value,
        interests: [...selectedInterests],
        painPoints: document.getElementById('persona-pain-points').value.trim()
    };
}

function validateFormData(data) {
    return data.name && data.age && data.job && data.income && data.interests.length > 0;
}

function generatePersonaData(formData) {
    const aiPersona = {
        basic: {
            name: formData.name,
            age: formData.age,
            job: formData.job,
            income: getIncomeLabel(formData.income),
            avatar: getAvatarIcon(formData),
            lifestyle: generateLifestyle(formData)
        },
        behaviors: generateBehaviorAnalysis(formData),
        insights: generateAIInsights(formData),
        recommendations: generateProductRecommendations(formData),
        tags: generatePersonaTags(formData)
    };
    
    return aiPersona;
}

function getIncomeLabel(income) {
    const labels = {
        'low': '3,000만원 이하',
        'mid': '3,000-5,000만원',
        'high': '5,000-8,000만원',
        'premium': '8,000만원 이상'
    };
    return labels[income] || income;
}

function getAvatarIcon(formData) {
    const icons = {
        'tech': '👨‍💻',
        'fitness': '💪',
        'travel': '✈️',
        'food': '👨‍🍳',
        'culture': '🎭',
        'fashion': '👔',
        'gaming': '🎮',
        'reading': '📚'
    };
    
    // Return icon based on primary interest
    return formData.interests.length > 0 ? icons[formData.interests[0]] || '👤' : '👤';
}

function generateLifestyle(formData) {
    const lifestyles = {
        'tech': '디지털 네이티브',
        'fitness': '액티브 라이프',
        'travel': '글로벌 마인드',
        'food': '푸디 라이프',
        'culture': '문화 애호가',
        'fashion': '트렌드 세터',
        'gaming': '디지털 엔터테이너',
        'reading': '지식 추구형'
    };
    
    const primary = formData.interests[0];
    return lifestyles[primary] || '균형 추구형';
}

function generateBehaviorAnalysis(formData) {
    const behaviors = [];
    
    // Income-based behavior
    if (formData.income === 'premium') {
        behaviors.push({
            title: '프리미엄 지향성',
            desc: '고품질 제품을 선호하며 브랜드 가치를 중시합니다.'
        });
    } else if (formData.income === 'low') {
        behaviors.push({
            title: '가성비 중시',
            desc: '합리적인 가격대에서 최고의 가치를 추구합니다.'
        });
    }
    
    // Interest-based behaviors
    formData.interests.forEach(interest => {
        const behaviorMap = {
            'tech': { title: '기술 얼리어답터', desc: '새로운 기술과 혁신에 빠르게 반응합니다.' },
            'fitness': { title: '건강 중심 라이프스타일', desc: '웰니스와 건강한 생활을 우선시합니다.' },
            'travel': { title: '경험 수집가', desc: '새로운 경험과 모험을 적극적으로 추구합니다.' },
            'fashion': { title: '트렌드 민감성', desc: '최신 패션 트렌드에 민감하게 반응합니다.' }
        };
        
        if (behaviorMap[interest]) {
            behaviors.push(behaviorMap[interest]);
        }
    });
    
    return behaviors.slice(0, 4); // Max 4 behaviors
}

function generateAIInsights(formData) {
    const insights = [];
    
    // Age-based insights
    const ageGroup = formData.age.split('-')[0];
    if (parseInt(ageGroup) <= 30) {
        insights.push({
            title: '디지털 네이티브 특성',
            desc: '모바일 우선 사고방식을 가지고 있으며, 소셜 미디어를 통한 정보 습득을 선호합니다.'
        });
    } else {
        insights.push({
            title: '신중한 의사결정',
            desc: '구매 전 충분한 검토와 비교분석을 통해 신중하게 결정을 내립니다.'
        });
    }
    
    // Job-based insights
    if (formData.job.includes('개발') || formData.job.includes('엔지니어')) {
        insights.push({
            title: '논리적 사고 패턴',
            desc: '체계적이고 분석적인 접근을 선호하며, 기능과 성능을 중시합니다.'
        });
    } else if (formData.job.includes('디자인') || formData.job.includes('마케팅')) {
        insights.push({
            title: '심미적 감각 중시',
            desc: '시각적 아름다움과 창의적 표현을 중요하게 생각합니다.'
        });
    }
    
    // Pain points based insights
    if (formData.painPoints) {
        insights.push({
            title: '니즈 기반 솔루션 추구',
            desc: `"${formData.painPoints}"와 같은 문제를 해결하는 실용적 솔루션을 찾고 있습니다.`
        });
    }
    
    return insights;
}

function generateProductRecommendations(formData) {
    const recommendations = [];
    
    // Tech interest recommendations
    if (formData.interests.includes('tech')) {
        recommendations.push({
            icon: '📱',
            name: '스마트 기기 액세서리',
            desc: '최신 기술을 활용한 혁신적인 스마트 액세서리',
            match: '95% 매치'
        });
    }
    
    // Fitness interest recommendations
    if (formData.interests.includes('fitness')) {
        recommendations.push({
            icon: '⌚',
            name: '피트니스 트래커',
            desc: '건강 관리와 운동 효율을 높이는 웨어러블 기기',
            match: '92% 매치'
        });
    }
    
    // Fashion interest recommendations
    if (formData.interests.includes('fashion')) {
        recommendations.push({
            icon: '👜',
            name: '스타일리시 액세서리',
            desc: '개성을 표현할 수 있는 패셔너블한 디자인 제품',
            match: '89% 매치'
        });
    }
    
    // Travel interest recommendations
    if (formData.interests.includes('travel')) {
        recommendations.push({
            icon: '🎒',
            name: '여행용 멀티 기기',
            desc: '여행 중 편의성을 높이는 컴팩트한 다기능 제품',
            match: '87% 매치'
        });
    }
    
    return recommendations.slice(0, 3); // Max 3 recommendations
}

function generatePersonaTags(formData) {
    const tags = [];
    
    // Age tag
    tags.push(formData.age + '세');
    
    // Income tag
    if (formData.income === 'premium') {
        tags.push('프리미엄');
    } else if (formData.income === 'high') {
        tags.push('고소득');
    }
    
    // Interest tags
    const interestLabels = {
        'tech': '테크',
        'fitness': '피트니스',
        'travel': '여행',
        'food': '푸드',
        'culture': '문화',
        'fashion': '패션',
        'gaming': '게임',
        'reading': '독서'
    };
    
    formData.interests.slice(0, 3).forEach(interest => {
        if (interestLabels[interest]) {
            tags.push(interestLabels[interest]);
        }
    });
    
    return tags;
}

// Display Generated Persona
function displayGeneratedPersona(personaData) {
    // Update basic info
    document.getElementById('persona-avatar').textContent = personaData.basic.avatar;
    document.getElementById('persona-display-name').textContent = personaData.basic.name;
    document.getElementById('persona-display-title').textContent = personaData.basic.job;
    
    // Update tags
    const tagsContainer = document.getElementById('persona-display-tags');
    tagsContainer.innerHTML = '';
    personaData.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'persona-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // Update detail grid
    document.getElementById('detail-age').textContent = personaData.basic.age;
    document.getElementById('detail-job').textContent = personaData.basic.job;
    document.getElementById('detail-income').textContent = personaData.basic.income;
    document.getElementById('detail-lifestyle').textContent = personaData.basic.lifestyle;
    
    // Update behavior analysis
    const behaviorContainer = document.getElementById('behavior-analysis');
    behaviorContainer.innerHTML = '';
    personaData.behaviors.forEach(behavior => {
        const behaviorDiv = document.createElement('div');
        behaviorDiv.className = 'behavior-item';
        behaviorDiv.innerHTML = `
            <div class="behavior-title">${behavior.title}</div>
            <div class="behavior-desc">${behavior.desc}</div>
        `;
        behaviorContainer.appendChild(behaviorDiv);
    });
    
    // Update AI insights
    const insightsContainer = document.getElementById('ai-insights');
    insightsContainer.innerHTML = '';
    personaData.insights.forEach(insight => {
        const insightDiv = document.createElement('div');
        insightDiv.className = 'insight-item';
        insightDiv.innerHTML = `
            <div class="insight-title">${insight.title}</div>
            <div class="insight-desc">${insight.desc}</div>
        `;
        insightsContainer.appendChild(insightDiv);
    });
    
    // Update product recommendations
    const recommendationsContainer = document.getElementById('product-recommendations');
    recommendationsContainer.innerHTML = '';
    personaData.recommendations.forEach(rec => {
        const recDiv = document.createElement('div');
        recDiv.className = 'product-card';
        recDiv.innerHTML = `
            <div class="product-header">
                <div class="product-icon">${rec.icon}</div>
                <div class="product-name">${rec.name}</div>
            </div>
            <div class="product-desc">${rec.desc}</div>
            <div class="product-match">${rec.match}</div>
        `;
        recommendationsContainer.appendChild(recDiv);
    });
    
    // Show the output with animation
    const output = document.getElementById('persona-output');
    output.style.display = 'block';
    output.style.opacity = '0';
    output.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        output.style.transition = 'all 0.5s ease';
        output.style.opacity = '1';
        output.style.transform = 'translateY(0)';
    }, 100);
}

// Template Management
function loadPersonaTemplate(templateType) {
    const templates = {
        'tech-professional': {
            name: '김테크',
            age: '31-35',
            job: '소프트웨어 개발자',
            income: 'high',
            interests: ['tech', 'gaming', 'reading'],
            painPoints: '최신 기술 트렌드를 따라가기 위한 효율적인 학습 도구와 업무 생산성 향상 솔루션이 필요함'
        },
        'creative-millennial': {
            name: '박크리에이터',
            age: '26-30',
            job: '브랜드 디자이너',
            income: 'mid',
            interests: ['fashion', 'culture', 'travel'],
            painPoints: '창작 영감을 얻고 개성을 표현할 수 있는 도구, 작업 효율성을 높이는 창의적 솔루션 필요'
        },
        'busy-parent': {
            name: '이맘워킹',
            age: '36-40',
            job: '마케팅 매니저',
            income: 'high',
            interests: ['fitness', 'food', 'reading'],
            painPoints: '육아와 업무를 효율적으로 병행할 수 있는 시간 관리 솔루션과 가족 중심의 라이프스타일 지원 도구 필요'
        },
        'gen-z-student': {
            name: '최젠지',
            age: '20-25',
            job: '대학생',
            income: 'low',
            interests: ['gaming', 'fashion', 'tech'],
            painPoints: '합리적인 가격의 트렌디한 제품, 학업과 취업 준비에 도움이 되는 실용적 도구 필요'
        }
    };
    
    const template = templates[templateType];
    if (!template) return;
    
    // Fill form with template data
    document.getElementById('persona-name').value = template.name;
    document.getElementById('persona-age').value = template.age;
    document.getElementById('persona-job').value = template.job;
    document.getElementById('persona-income').value = template.income;
    document.getElementById('persona-pain-points').value = template.painPoints;
    
    // Clear and set interests
    document.querySelectorAll('.interest-tag').forEach(tag => {
        tag.classList.remove('selected');
    });
    selectedInterests = [];
    
    template.interests.forEach(interest => {
        const tag = document.querySelector(`[data-interest="${interest}"]`);
        if (tag) {
            tag.classList.add('selected');
            selectedInterests.push(interest);
        }
    });
    
    showNotification('템플릿 로드', `${template.name} 템플릿이 로드되었습니다.`);
}

// Export and Analysis Functions
function exportPersona() {
    if (!currentPersonaData) {
        showNotification('내보내기 오류', '생성된 페르소나가 없습니다.');
        return;
    }
    
    const exportData = {
        timestamp: new Date().toISOString(),
        persona: currentPersonaData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `persona_${currentPersonaData.basic.name}_${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('내보내기 완료', '페르소나 데이터가 다운로드되었습니다.');
}

function analyzePersonaMarket() {
    if (!currentPersonaData) {
        showNotification('분석 오류', '생성된 페르소나가 없습니다.');
        return;
    }
    
    // Convert persona to market analysis format
    let personaType = 'premium-camera'; // default
    
    if (currentPersonaData.basic.interests && currentPersonaData.basic.interests.includes('tech')) {
        personaType = 'tech-enthusiast';
    } else if (currentPersonaData.basic.interests && currentPersonaData.basic.interests.includes('fashion')) {
        personaType = 'style-first';
    }
    
    // Navigate to market analysis
    showMarketAnalysis();
    
    // Auto-select the matching persona after a short delay
    setTimeout(() => {
        selectPersonaForAnalysis(personaType);
    }, 1000);
    
    showNotification('분석 시작', '생성된 페르소나를 바탕으로 시장 분석을 시작합니다.');
}

// ===== DATA CREDIBILITY SYSTEM =====
let executiveMode = false;

function toggleExecutiveMode() {
    executiveMode = !executiveMode;
    const toggle = document.querySelector('.executive-mode-toggle');
    
    if (executiveMode) {
        toggle.classList.add('active');
        showNotification('Executive Mode', '임원진 보고용 고신뢰도 데이터만 표시됩니다.');
        applyExecutiveMode();
    } else {
        toggle.classList.remove('active');
        showNotification('Standard Mode', '모든 데이터가 표시됩니다.');
        applyStandardMode();
    }
}

function applyExecutiveMode() {
    // Hide Tier 3 data sources
    document.querySelectorAll('.credibility-tier3').forEach(element => {
        element.closest('.feature-card').style.opacity = '0.5';
    });
    
    // Highlight Tier 1 data sources
    document.querySelectorAll('.credibility-tier1').forEach(element => {
        element.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.4)';
    });
}

function applyStandardMode() {
    // Show all data sources
    document.querySelectorAll('.feature-card').forEach(element => {
        element.style.opacity = '1';
    });
    
    // Remove highlights
    document.querySelectorAll('.credibility-tier1').forEach(element => {
        element.style.boxShadow = '';
    });
}

function showDataModal(dataType) {
    const modal = document.getElementById('data-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    
    const dataInfo = getDataSourceInfo(dataType);
    
    title.textContent = dataInfo.title;
    body.innerHTML = generateModalContent(dataInfo);
    
    modal.classList.add('show');
}

function closeDataModal() {
    document.getElementById('data-modal').classList.remove('show');
}

function getDataSourceInfo(dataType) {
    const dataSourceMap = {
        'consumption-radar': {
            title: '소비 성향 레이더 차트',
            source: 'Samsung Consumer Behavior Lab',
            tier: 1,
            reliability: 93,
            methodology: '소비자 행동 패턴 + 구매 의사결정 + 라이프스타일 분석',
            sampleSize: 'Samsung Members 25,000명',
            updateFreq: '일일',
            collection: '앱 사용 패턴 + 구매 이력 + 설문 조사',
            limitations: 'Samsung 생태계 사용자 중심, 지역별 소비 문화 차이 존재'
        },
        'trend-chart': {
            title: '페르소나 트렌드 차트 데이터',
            source: 'Samsung Knox Research Panel',
            tier: 1,
            reliability: 96,
            methodology: '실시간 사용자 행동 분석',
            sampleSize: '50,000+ 사용자',
            updateFreq: '실시간',
            collection: 'Knox 텔레메트리 + 사용자 동의 기반 행동 로그',
            limitations: 'Samsung 기기 사용자에 한정, 개인정보 보호를 위한 익명화 처리'
        },
        'market-size': {
            title: '시장 규모 & 성장률 데이터',
            source: 'Counterpoint Research + IDC',
            tier: 2,
            reliability: 92,
            methodology: '글로벌 리테일 패널 + 제조사 출하량 분석',
            sampleSize: '450개 리테일 체인, 15개국',
            updateFreq: '주간',
            collection: '판매 데이터 + 시장 조사 + 제조사 인터뷰',
            limitations: '±3% 마진 오브 에러, 중국 시장 일부 추정치 포함'
        },
        'regional-data': {
            title: '지역별 페르소나 분포',
            source: 'GfK Consumer Panel (Global)',
            tier: 2,
            reliability: 89,
            methodology: '소비자 패널 조사 + 구매 의도 분석',
            sampleSize: '12,847명 (글로벌)',
            updateFreq: '일일',
            collection: '온라인 설문 + 포커스 그룹 + 구매 이력 분석',
            limitations: '국가별 샘플 편차 존재, 온라인 응답자 편향 가능성'
        },
        'competitive-matrix': {
            title: '경쟁사 포지셔닝 매트릭스',
            source: 'Canalys + Strategy Analytics',
            tier: 2,
            reliability: 91,
            methodology: '시장점유율 + 브랜드 인지도 + 가격 경쟁력 분석',
            sampleSize: '업계 전문가 150명 + 소비자 8,500명',
            updateFreq: '주간',
            collection: '판매 데이터 + 전문가 인터뷰 + 소비자 조사',
            limitations: '지역별 브랜드 인식 차이, 신제품 출시 시 지연 반영'
        },
        'design-attributes': {
            title: '디자인 속성 선호도',
            source: 'Samsung Design Research Lab',
            tier: 1,
            reliability: 95,
            methodology: 'A/B 테스트 + 사용자 피드백 + 디자인 선호도 분석',
            sampleSize: 'Samsung Members 30,000명',
            updateFreq: '실시간',
            collection: '앱 내 피드백 + 디자인 평가 + 사용 패턴 분석',
            limitations: 'Samsung 생태계 사용자 중심, 문화적 선호도 차이 존재'
        },
        'design-recommendations': {
            title: '디자인 추천 시스템',
            source: 'Samsung AI Design Engine',
            tier: 1,
            reliability: 94,
            methodology: '머신러닝 + 트렌드 분석 + 사용자 행동 예측',
            sampleSize: '100만+ 디자인 패턴 학습',
            updateFreq: '실시간',
            collection: 'AI 모델 + 디자인 히스토리 + 사용자 반응 데이터',
            limitations: 'AI 편향 가능성, 창의적 혁신보다는 데이터 기반 안정성 중시'
        }
    };
    
    return dataSourceMap[dataType] || dataSourceMap['trend-chart'];
}

function generateModalContent(dataInfo) {
    const tierLabel = ['', 'Samsung 내부', '글로벌 기관', '소셜/트렌드'][dataInfo.tier];
    const tierClass = `credibility-tier${dataInfo.tier}`;
    
    return `
        <div class="data-detail-section">
            <div class="data-detail-title">
                <span>📊</span>
                <span>데이터 출처 & 신뢰도</span>
            </div>
            <div class="source-reliability">
                <div class="reliability-score">${dataInfo.reliability}%</div>
                <div>
                    <div class="reliability-label">신뢰도 점수</div>
                    <div class="credibility-badge ${tierClass}">
                        <span>${dataInfo.tier === 1 ? '🛡️' : dataInfo.tier === 2 ? '📊' : '📱'}</span>
                        <span>${tierLabel} 데이터</span>
                    </div>
                </div>
            </div>
            <div class="data-detail-content">
                <strong>출처:</strong> ${dataInfo.source}<br/>
                <strong>수집 방법:</strong> ${dataInfo.collection}
            </div>
        </div>
        
        <div class="data-detail-section">
            <div class="data-detail-title">
                <span>🔬</span>
                <span>수집 방법론</span>
            </div>
            <div class="methodology-grid">
                <div class="methodology-item">
                    <div class="methodology-label">분석 방법</div>
                    <div class="methodology-value">${dataInfo.methodology}</div>
                </div>
                <div class="methodology-item">
                    <div class="methodology-label">샘플 크기</div>
                    <div class="methodology-value">${dataInfo.sampleSize}</div>
                </div>
                <div class="methodology-item">
                    <div class="methodology-label">업데이트 주기</div>
                    <div class="methodology-value">${dataInfo.updateFreq}</div>
                </div>
                <div class="methodology-item">
                    <div class="methodology-label">데이터 품질</div>
                    <div class="methodology-value">${dataInfo.reliability}% 신뢰도</div>
                </div>
            </div>
        </div>
        
        <div class="data-detail-section">
            <div class="data-detail-title">
                <span>⚠️</span>
                <span>한계 및 주의사항</span>
            </div>
            <div class="data-detail-content">
                ${dataInfo.limitations}
                <br/><br/>
                <strong>권장사항:</strong> 중요한 의사결정 시에는 여러 데이터 출처를 종합적으로 검토하시기 바랍니다.
            </div>
        </div>
        
        <div class="data-detail-section">
            <div class="data-detail-title">
                <span>📋</span>
                <span>임원진 보고 시 참고사항</span>
            </div>
            <div class="data-detail-content">
                ${dataInfo.tier === 1 ? 
                    '✅ <strong>임원진 보고용 적합:</strong> Samsung 내부 데이터로 높은 신뢰성을 가지며, 대외 발표에 활용 가능합니다.' :
                    dataInfo.tier === 2 ?
                    '⚠️ <strong>보조 자료로 활용:</strong> 신뢰할 수 있는 외부 기관 데이터이나, 삼성 내부 데이터와 교차 검증 권장합니다.' :
                    '🔍 <strong>참고용 데이터:</strong> 트렌드 파악용으로만 활용하고, 핵심 의사결정에는 추가 검증이 필요합니다.'
                }
            </div>
        </div>
    `;
}

// ===== RADAR CHART SYSTEM =====
let radarCanvas = null;
let radarCtx = null;

function initializeRadarChart() {
    radarCanvas = document.getElementById('radarCanvas');
    if (!radarCanvas) return;
    
    radarCtx = radarCanvas.getContext('2d');
    drawRadarChart([50, 50, 50, 50, 50]); // Default neutral values
}

function drawRadarChart(values, avgValues = [50, 50, 50, 50, 50]) {
    if (!radarCtx) return;
    
    const center = { x: 150, y: 150 };
    const radius = 100;
    const labels = ['유행 민감도', '소비 욕구', '가치 인식도', '실질 만족도', '주목적 이용동기'];
    const angles = [];
    
    // Calculate angles for each point (5 points, starting from top)
    for (let i = 0; i < 5; i++) {
        angles.push((i * 2 * Math.PI / 5) - Math.PI / 2);
    }
    
    // Clear canvas
    radarCtx.clearRect(0, 0, 300, 300);
    
    // Draw background circles and grid
    radarCtx.strokeStyle = '#E0E0E0';
    radarCtx.lineWidth = 1;
    for (let r = 20; r <= radius; r += 20) {
        radarCtx.beginPath();
        radarCtx.arc(center.x, center.y, r, 0, 2 * Math.PI);
        radarCtx.stroke();
    }
    
    // Draw axis lines
    radarCtx.strokeStyle = '#E0E0E0';
    radarCtx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        const x = center.x + Math.cos(angles[i]) * radius;
        const y = center.y + Math.sin(angles[i]) * radius;
        
        radarCtx.beginPath();
        radarCtx.moveTo(center.x, center.y);
        radarCtx.lineTo(x, y);
        radarCtx.stroke();
    }
    
    // Draw average baseline (gray)
    radarCtx.strokeStyle = '#BDBDBD';
    radarCtx.fillStyle = 'rgba(189, 189, 189, 0.1)';
    radarCtx.lineWidth = 2;
    radarCtx.beginPath();
    for (let i = 0; i < 5; i++) {
        const value = avgValues[i] / 100;
        const x = center.x + Math.cos(angles[i]) * radius * value;
        const y = center.y + Math.sin(angles[i]) * radius * value;
        
        if (i === 0) {
            radarCtx.moveTo(x, y);
        } else {
            radarCtx.lineTo(x, y);
        }
    }
    radarCtx.closePath();
    radarCtx.fill();
    radarCtx.stroke();
    
    // Draw persona data (blue)
    radarCtx.strokeStyle = '#1C7BF6';
    radarCtx.fillStyle = 'rgba(28, 123, 246, 0.15)';
    radarCtx.lineWidth = 3;
    radarCtx.beginPath();
    for (let i = 0; i < 5; i++) {
        const value = values[i] / 100;
        const x = center.x + Math.cos(angles[i]) * radius * value;
        const y = center.y + Math.sin(angles[i]) * radius * value;
        
        if (i === 0) {
            radarCtx.moveTo(x, y);
        } else {
            radarCtx.lineTo(x, y);
        }
    }
    radarCtx.closePath();
    radarCtx.fill();
    radarCtx.stroke();
    
    // Draw data points
    radarCtx.fillStyle = '#1C7BF6';
    for (let i = 0; i < 5; i++) {
        const value = values[i] / 100;
        const x = center.x + Math.cos(angles[i]) * radius * value;
        const y = center.y + Math.sin(angles[i]) * radius * value;
        
        radarCtx.beginPath();
        radarCtx.arc(x, y, 4, 0, 2 * Math.PI);
        radarCtx.fill();
    }
    
    // Draw labels
    radarCtx.fillStyle = '#424242';
    radarCtx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    radarCtx.textAlign = 'center';
    radarCtx.textBaseline = 'middle';
    
    const labelRadius = radius + 25;
    for (let i = 0; i < 5; i++) {
        const x = center.x + Math.cos(angles[i]) * labelRadius;
        const y = center.y + Math.sin(angles[i]) * labelRadius;
        
        // Adjust text alignment for better positioning
        if (x < center.x - 10) {
            radarCtx.textAlign = 'right';
        } else if (x > center.x + 10) {
            radarCtx.textAlign = 'left';
        } else {
            radarCtx.textAlign = 'center';
        }
        
        radarCtx.fillText(labels[i], x, y);
    }
}

function updateConsumptionTraits(personaType) {
    const traitData = getConsumptionData(personaType);
    
    // Update radar chart
    drawRadarChart(traitData.values);
    
    // Update trait bars
    const traitsContainer = document.getElementById('consumption-traits');
    traitsContainer.innerHTML = '';
    
    traitData.traits.forEach((trait, index) => {
        const traitElement = document.createElement('div');
        traitElement.className = 'consumption-trait';
        traitElement.innerHTML = `
            <div class="trait-name">${trait.name}</div>
            <div class="trait-score">
                <div class="trait-value">${trait.score}</div>
                <div class="trait-bar">
                    <div class="trait-fill" style="width: ${trait.score}%;"></div>
                </div>
            </div>
        `;
        traitsContainer.appendChild(traitElement);
    });
    
    // Update comparison
    updatePersonaComparison(personaType);
}

function getConsumptionData(personaType) {
    const consumptionMap = {
        'tech-enthusiast': {
            values: [85, 75, 90, 80, 85],
            traits: [
                { name: '유행 민감도', score: 85 },
                { name: '소비 욕구', score: 75 },
                { name: '가치 인식도', score: 90 },
                { name: '실질 만족도', score: 80 },
                { name: '주목적 이용동기', score: 85 }
            ]
        },
        'style-first': {
            values: [95, 85, 70, 75, 80],
            traits: [
                { name: '유행 민감도', score: 95 },
                { name: '소비 욕구', score: 85 },
                { name: '가치 인식도', score: 70 },
                { name: '실질 만족도', score: 75 },
                { name: '주목적 이용동기', score: 80 }
            ]
        },
        'premium-camera': {
            values: [70, 60, 85, 90, 75],
            traits: [
                { name: '유행 민감도', score: 70 },
                { name: '소비 욕구', score: 60 },
                { name: '가치 인식도', score: 85 },
                { name: '실질 만족도', score: 90 },
                { name: '주목적 이용동기', score: 75 }
            ]
        },
        'eco-conscious': {
            values: [55, 45, 95, 85, 90],
            traits: [
                { name: '유행 민감도', score: 55 },
                { name: '소비 욕구', score: 45 },
                { name: '가치 인식도', score: 95 },
                { name: '실질 만족도', score: 85 },
                { name: '주목적 이용동기', score: 90 }
            ]
        }
    };
    
    return consumptionMap[personaType] || consumptionMap['tech-enthusiast'];
}

function updatePersonaComparison(currentPersona) {
    const comparisonContainer = document.getElementById('persona-comparison');
    const allPersonas = ['tech-enthusiast', 'style-first', 'premium-camera', 'eco-conscious'];
    const personaNames = {
        'tech-enthusiast': '기술 애호가',
        'style-first': '스타일 중심',
        'premium-camera': '프리미엄 카메라',
        'eco-conscious': '친환경 의식'
    };
    
    const currentData = getConsumptionData(currentPersona);
    const currentAvg = currentData.values.reduce((a, b) => a + b, 0) / 5;
    
    comparisonContainer.innerHTML = '';
    
    allPersonas.forEach(persona => {
        if (persona === currentPersona) return;
        
        const otherData = getConsumptionData(persona);
        const otherAvg = otherData.values.reduce((a, b) => a + b, 0) / 5;
        const diff = Math.round(currentAvg - otherAvg);
        
        const comparisonElement = document.createElement('div');
        comparisonElement.className = 'comparison-item';
        
        let diffClass = 'comparison-similar';
        let diffText = '유사함';
        
        if (diff > 5) {
            diffClass = 'comparison-higher';
            diffText = `+${diff}% 높음`;
        } else if (diff < -5) {
            diffClass = 'comparison-lower';
            diffText = `${diff}% 낮음`;
        }
        
        comparisonElement.innerHTML = `
            <span class="comparison-persona">${personaNames[persona]}</span>
            <span class="comparison-diff ${diffClass}">${diffText}</span>
        `;
        
        comparisonContainer.appendChild(comparisonElement);
    });
}

// ===== ADVANCED MARKET ANALYSIS SYSTEM =====
let selectedPersona = null;
let currentChart = 'preference';
let chartCanvas = null;
let chartContext = null;

// Notification System
function showNotification(title, message) {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-header">
            <div class="notification-icon">🔔</div>
            <div class="notification-title">${title}</div>
        </div>
        <div class="notification-content">${message}</div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 3000);
}

// Market Analysis Functions
function selectPersonaForAnalysis(personaType) {
    console.log('Selecting persona:', personaType);
    
    // Show loading state
    showNotification('페르소나 분석', '데이터를 로딩 중입니다...');
    
    // Update UI immediately - remove previous selection
    document.querySelectorAll('.persona-selector').forEach(selector => {
        selector.classList.remove('selected');
    });
    
    // Add selected state to clicked persona
    const clickedSelector = document.querySelector(`[data-persona="${personaType}"]`);
    if (clickedSelector) {
        clickedSelector.classList.add('selected');
        console.log('Persona selector found and selected');
    } else {
        console.error('Persona selector not found for:', personaType);
    }
    
    selectedPersona = personaType;
    
    // Show analysis dashboard with animation
    setTimeout(() => {
        document.getElementById('analysis-dashboard').style.display = 'block';
        document.getElementById('analysis-dashboard').style.opacity = '0';
        document.getElementById('analysis-dashboard').style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.getElementById('analysis-dashboard').style.transition = 'all 0.5s ease';
            document.getElementById('analysis-dashboard').style.opacity = '1';
            document.getElementById('analysis-dashboard').style.transform = 'translateY(0)';
        }, 100);
        
        // Load persona-specific data
        loadPersonaAnalysis(personaType);
        
        showNotification('분석 완료', `${getPersonaDisplayName(personaType)} 시장 분석을 시작합니다!`);
    }, 800);
}

function getPersonaDisplayName(personaType) {
    const names = {
        'premium-camera': '프리미엄 카메라 중심형',
        'style-first': '스타일 우선형',
        'tech-enthusiast': '기술 얼리어답터'
    };
    return names[personaType] || personaType;
}

function loadPersonaAnalysis(personaType) {
    const personaData = getPersonaMarketData(personaType);
    
    // Update market metrics with animation
    animateMetricUpdate('market-size', personaData.marketSize);
    animateMetricUpdate('growth-rate', personaData.growthRate);
    animateMetricUpdate('opportunity-score', personaData.opportunityScore);
    
    // Update radar chart and consumption traits
    setTimeout(() => updateConsumptionTraits(personaType), 200);
    
    // Update regional data with staggered animation
    setTimeout(() => updateRegionalData(personaData.regional), 300);
    
    // Update competitive matrix
    setTimeout(() => updateCompetitiveMatrix(personaData.competitive), 600);
    
    // Update design attributes
    setTimeout(() => updateDesignAttributes(personaData.attributes), 900);
    
    // Update recommendations
    setTimeout(() => updateDesignRecommendations(personaData.recommendations), 1200);
    
    // Initialize charts
    setTimeout(() => {
        initializeRadarChart();
        initializeChart();
    }, 400);
    
    // Update insights
    setTimeout(() => updateMarketInsights(personaData), 1500);
}

function animateMetricUpdate(elementId, finalValue) {
    const element = document.getElementById(elementId);
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0.5';
    
    setTimeout(() => {
        element.style.transition = 'all 0.4s ease';
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
        element.textContent = finalValue;
    }, 200);
}

function getPersonaMarketData(personaType) {
    const data = {
        'premium-camera': {
            marketSize: '$2.8B', growthRate: '+18.5%', opportunityScore: '8.7/10',
            regional: { korea: { value: 34, label: '34%' }, usa: { value: 28, label: '28%' }, 
                      europe: { value: 22, label: '22%' }, china: { value: 16, label: '16%' } },
            competitive: { samsung: { x: 65, y: 78, share: '23%' }, apple: { x: 85, y: 45, share: '34%' },
                         google: { x: 45, y: 62, share: '12%' }, xiaomi: { x: 72, y: 38, share: '31%' } },
            attributes: {
                colors: [{ name: '매트 블랙', preference: 89, level: 'high' }, { name: '프로 실버', preference: 76, level: 'high' }],
                materials: [{ name: '프리미엄 알루미늄', preference: 92, level: 'high' }, { name: '세라믹', preference: 67, level: 'medium' }],
                forms: [{ name: '각진 모서리', preference: 83, level: 'high' }, { name: '슬림 프로파일', preference: 91, level: 'high' }]
            },
            recommendations: [{
                title: '프로급 카메라 모듈 강조', content: '카메라 영역을 시각적으로 강조하여 전문성을 어필하는 디자인',
                data: { confidence: '94%', impact: '+15%', feasibility: '높음' }
            }],
            chartData: { preference: [65, 72, 78, 84, 89, 92], purchase: [23, 28, 34, 41, 38, 45], satisfaction: [72, 75, 79, 82, 85, 88] }
        },
        'style-first': {
            marketSize: '$1.9B', growthRate: '+24.3%', opportunityScore: '9.2/10',
            regional: { korea: { value: 42, label: '42%' }, usa: { value: 31, label: '31%' }, 
                      europe: { value: 19, label: '19%' }, china: { value: 8, label: '8%' } },
            competitive: { samsung: { x: 45, y: 89, share: '31%' }, apple: { x: 78, y: 52, share: '28%' },
                         google: { x: 32, y: 41, share: '8%' }, xiaomi: { x: 65, y: 73, share: '33%' } },
            attributes: {
                colors: [{ name: '파스텔 그린', preference: 94, level: 'high' }, { name: '라벤더', preference: 87, level: 'high' }],
                materials: [{ name: '광택 마감', preference: 85, level: 'high' }, { name: '실리콘', preference: 72, level: 'medium' }],
                forms: [{ name: '라운드 엣지', preference: 92, level: 'high' }, { name: '슬림형', preference: 88, level: 'high' }]
            },
            recommendations: [{
                title: '트렌디 컬러 팔레트', content: '파스텔 톤과 그라데이션을 활용한 감성적 디자인',
                data: { confidence: '96%', impact: '+22%', feasibility: '높음' }
            }],
            chartData: { preference: [45, 58, 67, 78, 86, 94], purchase: [18, 25, 31, 39, 44, 52], satisfaction: [68, 71, 75, 80, 84, 89] }
        },
        'tech-enthusiast': {
            marketSize: '$3.2B', growthRate: '+15.7%', opportunityScore: '7.8/10',
            regional: { korea: { value: 38, label: '38%' }, usa: { value: 35, label: '35%' }, 
                      europe: { value: 18, label: '18%' }, china: { value: 9, label: '9%' } },
            competitive: { samsung: { x: 72, y: 85, share: '28%' }, apple: { x: 88, y: 62, share: '31%' },
                         google: { x: 65, y: 78, share: '15%' }, xiaomi: { x: 45, y: 52, share: '26%' } },
            attributes: {
                colors: [{ name: '스페이스 그레이', preference: 91, level: 'high' }, { name: '매트 블랙', preference: 86, level: 'high' }],
                materials: [{ name: '티타늄', preference: 89, level: 'high' }, { name: '카본 파이버', preference: 76, level: 'high' }],
                forms: [{ name: '각진 디자인', preference: 87, level: 'high' }, { name: '모듈러', preference: 82, level: 'high' }]
            },
            recommendations: [{
                title: '첨단 소재 활용', content: '티타늄과 카본 파이버로 기술적 우수성 표현',
                data: { confidence: '92%', impact: '+19%', feasibility: '중간' }
            }],
            chartData: { preference: [72, 76, 81, 85, 87, 91], purchase: [28, 32, 35, 38, 41, 45], satisfaction: [75, 78, 82, 85, 87, 90] }
        }
    };
    return data[personaType] || data['premium-camera'];
}

// Regional Data Update with Animation
function updateRegionalData(regional) {
    Object.keys(regional).forEach((region, index) => {
        const fillElement = document.getElementById(`${region}-fill`);
        const valueElement = document.getElementById(`${region}-value`);
        
        setTimeout(() => {
            fillElement.style.width = regional[region].value + '%';
            valueElement.textContent = regional[region].label;
            valueElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                valueElement.style.transition = 'transform 0.3s ease';
                valueElement.style.transform = 'scale(1)';
            }, 200);
        }, index * 200);
    });
}

// Competitive Matrix Update
function updateCompetitiveMatrix(competitive) {
    const matrix = document.querySelector('.competitive-matrix');
    const dotsContainer = matrix.querySelector('.competitor-dots') || document.createElement('div');
    dotsContainer.className = 'competitor-dots';
    dotsContainer.innerHTML = '';
    
    Object.keys(competitive).forEach((competitor, index) => {
        setTimeout(() => {
            const dot = document.createElement('div');
            dot.className = `competitor-dot ${competitor}`;
            dot.style.left = competitive[competitor].x + '%';
            dot.style.top = (100 - competitive[competitor].y) + '%';
            dot.title = `${competitor}: ${competitive[competitor].share} 점유율`;
            
            dot.addEventListener('click', () => {
                showNotification('경쟁사 정보', `${competitor}: 시장점유율 ${competitive[competitor].share}`);
            });
            
            dotsContainer.appendChild(dot);
        }, index * 150);
    });
    
    if (!matrix.querySelector('.competitor-dots')) {
        matrix.appendChild(dotsContainer);
    }
}

// Design Attributes Update
function updateDesignAttributes(attributes) {
    Object.keys(attributes).forEach((attributeType, groupIndex) => {
        const container = document.getElementById(`${attributeType.replace('s', '')}-preferences`);
        if (!container) return;
        container.innerHTML = '';
        
        attributes[attributeType].forEach((item, index) => {
            setTimeout(() => {
                const tag = document.createElement('div');
                tag.className = `preference-tag ${item.level}`;
                tag.innerHTML = `${item.name}<span class="preference-percentage">${item.preference}%</span>`;
                
                tag.style.opacity = '0';
                tag.style.transform = 'scale(0.8)';
                container.appendChild(tag);
                
                setTimeout(() => {
                    tag.style.transition = 'all 0.4s ease';
                    tag.style.opacity = '1';
                    tag.style.transform = 'scale(1)';
                }, 100);
            }, (groupIndex * 400) + (index * 150));
        });
    });
}

// Design Recommendations Update
function updateDesignRecommendations(recommendations) {
    const container = document.getElementById('design-recommendations');
    if (!container) return;
    container.innerHTML = '';
    
    recommendations.forEach((rec, index) => {
        setTimeout(() => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            card.innerHTML = `
                <div class="recommendation-header">
                    <div class="recommendation-icon">${['🎨', '💎', '⚡'][index] || '💡'}</div>
                    <div class="recommendation-title">${rec.title}</div>
                </div>
                <div class="recommendation-content">${rec.content}</div>
                <div class="recommendation-data">
                    <div class="data-point">
                        <div class="data-value">${rec.data.confidence}</div>
                        <div class="data-label">신뢰도</div>
                    </div>
                    <div class="data-point">
                        <div class="data-value">${rec.data.impact}</div>
                        <div class="data-label">예상 효과</div>
                    </div>
                    <div class="data-point">
                        <div class="data-value">${rec.data.feasibility}</div>
                        <div class="data-label">실현 가능성</div>
                    </div>
                </div>
            `;
            
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            container.appendChild(card);
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

// Chart System Functions
function initializeChart() {
    chartCanvas = document.getElementById('trendCanvas');
    if (!chartCanvas) return;
    
    chartContext = chartCanvas.getContext('2d');
    showChart('preference');
}

function showChart(chartType) {
    if (!chartContext || !selectedPersona) {
        console.log('Chart context or persona not ready:', {chartContext, selectedPersona});
        return;
    }
    
    // Update button states
    document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
    // Find and activate the correct button
    const targetButton = document.querySelector(`[onclick*="${chartType}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    currentChart = chartType;
    const data = getPersonaMarketData(selectedPersona);
    
    // Clear canvas
    chartContext.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    
    // Draw chart with animation
    drawAnimatedChart(data.chartData[chartType], chartType);
    
    showNotification('차트 업데이트', `${getChartTypeLabel(chartType)} 데이터로 차트가 업데이트되었습니다.`);
}

function getChartTypeLabel(type) {
    const labels = {
        'preference': '선호도 변화',
        'purchase': '구매 패턴',
        'satisfaction': '만족도 지수'
    };
    return labels[type] || type;
}

function drawAnimatedChart(data, type) {
    const width = chartCanvas.width;
    const height = chartCanvas.height;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    // Background
    chartContext.fillStyle = '#0A0A0A';
    chartContext.fillRect(0, 0, width, height);
    
    // Grid lines
    chartContext.strokeStyle = '#333';
    chartContext.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i * chartHeight / 5);
        chartContext.beginPath();
        chartContext.moveTo(padding, y);
        chartContext.lineTo(width - padding, y);
        chartContext.stroke();
    }
    
    // Data points
    const maxValue = Math.max(...data);
    const points = data.map((value, index) => ({
        x: padding + (index * chartWidth / (data.length - 1)),
        y: padding + chartHeight - (value / maxValue * chartHeight)
    }));
    
    // Animate line drawing
    let animationProgress = 0;
    function animateChart() {
        animationProgress += 0.02;
        if (animationProgress > 1) animationProgress = 1;
        
        // Clear and redraw
        chartContext.clearRect(0, 0, width, height);
        
        // Background
        chartContext.fillStyle = '#0A0A0A';
        chartContext.fillRect(0, 0, width, height);
        
        // Grid
        chartContext.strokeStyle = '#333';
        chartContext.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i * chartHeight / 5);
            chartContext.beginPath();
            chartContext.moveTo(padding, y);
            chartContext.lineTo(width - padding, y);
            chartContext.stroke();
        }
        
        // Draw line
        chartContext.strokeStyle = '#1C7BF6';
        chartContext.lineWidth = 3;
        chartContext.beginPath();
        
        const visiblePoints = Math.floor(points.length * animationProgress);
        for (let i = 0; i < visiblePoints; i++) {
            if (i === 0) {
                chartContext.moveTo(points[i].x, points[i].y);
            } else {
                chartContext.lineTo(points[i].x, points[i].y);
            }
        }
        chartContext.stroke();
        
        // Draw points
        chartContext.fillStyle = '#1C7BF6';
        for (let i = 0; i < visiblePoints; i++) {
            chartContext.beginPath();
            chartContext.arc(points[i].x, points[i].y, 4, 0, Math.PI * 2);
            chartContext.fill();
        }
        
        if (animationProgress < 1) {
            requestAnimationFrame(animateChart);
        }
    }
    
    animateChart();
}

// Market Insights Update
function updateMarketInsights(personaData) {
    const insights = document.getElementById('market-insights');
    if (!insights) return;
    
    insights.innerHTML = `
        <div class="result-header">
            <div class="result-icon">🎯</div>
            <div class="result-title">${getPersonaDisplayName(selectedPersona)} 시장 분석 완료</div>
        </div>
        <div class="result-content">
            <p><strong>핵심 인사이트:</strong></p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>시장 규모 ${personaData.marketSize}, 연간 성장률 ${personaData.growthRate}</li>
                <li>기회 점수 ${personaData.opportunityScore}로 매우 긍정적</li>
                <li>주요 경쟁사 대비 차별화 포인트 식별</li>
                <li>디자인 속성별 선호도 데이터 확보</li>
            </ul>
            <p style="margin-top: 15px; color: var(--text-accent);">
                💡 <strong>추천 액션:</strong> ${personaData.recommendations[0].title}을 우선 적용하여 
                ${personaData.recommendations[0].data.impact} 개선 효과 기대
            </p>
        </div>
    `;
    
    // Add fade-in animation
    insights.style.opacity = '0';
    insights.style.transform = 'translateY(20px)';
    setTimeout(() => {
        insights.style.transition = 'all 0.5s ease';
        insights.style.opacity = '1';
        insights.style.transform = 'translateY(0)';
    }, 100);
}

function makeDesignDecision() {
    const decisions = [
        {
            category: '색상 전략',
            recommendation: '파스텔 톤 컬러 라인업 확대 권장 (트렌드 부합도: 94%)'
        },
        {
            category: '소재 선택',
            recommendation: '프리미엄 알루미늄 + 세라믹 조합 권장 (사용자 선호도: 87%)'
        },
        {
            category: '폼팩터',
            recommendation: '슬림 프로파일 + 곡선형 엣지 권장 (시장 반응: 91%)'
        }
    ];
    
    const randomDecision = decisions[Math.floor(Math.random() * decisions.length)];
    
    document.getElementById('decision-content').innerHTML = `
        <strong>${randomDecision.category}</strong><br/>
        ${randomDecision.recommendation}<br/><br/>
        <strong>AI 신뢰도:</strong> 92% | <strong>예상 효과:</strong> 매출 +15% 증가
    `;
    document.getElementById('decision-result').style.display = 'block';
}

function runAIAnalysis() {
    const insights = [
        {
            type: '행동 패턴 분석',
            finding: '오후 2-4시 카메라 사용률 최고 (43%), 주말 야외 촬영 78% 증가'
        },
        {
            type: '트렌드 예측',
            finding: '파스텔 컬러 선호도 +68% 증가 예상, 친환경 소재 관심도 급상승'
        },
        {
            type: '기회 발견',
            finding: '애플워치 미개척 영역: 소프트 텍스처 마감, Z세대 타겟 홀로그램 효과'
        }
    ];
    
    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    
    document.getElementById('ai-content').innerHTML = `
        <strong>${randomInsight.type}</strong><br/>
        ${randomInsight.finding}<br/><br/>
        <strong>Galaxy AI 분석 완료:</strong> 새로운 패턴이 발견되었습니다.
    `;
    document.getElementById('ai-result').style.display = 'block';
}

// ===== HIDDEN FEATURES & EASTER EGGS =====
let clickCount = 0;
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let secretModeActive = false;

// Logo Click Counter (Easter Egg #1)
function handleLogoClick() {
    clickCount++;
    
    if (clickCount === 5) {
        document.querySelector('.logo-text').textContent = 'DevMode 😎';
        alert('🎉 개발자 모드가 활성화되었습니다! F12를 눌러 콘솔을 확인해보세요.');
        console.log('🚀 PersonaSync Dev Mode Activated!');
        console.log('🎯 Hidden Commands:');
        console.log('  - showAllSections(): 모든 섹션 동시 표시');
        console.log('  - generateMegaPersona(): 슈퍼 페르소나 생성');
        console.log('  - activateRainbowMode(): 무지개 모드');
        console.log('  - showDevStats(): 개발 통계');
        
        // Dev mode functions
        window.showAllSections = function() {
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'block';
                section.style.marginBottom = '50px';
            });
            alert('🔧 모든 섹션이 표시되었습니다!');
        };
        
        window.generateMegaPersona = function() {
            document.getElementById('persona-content').innerHTML = `
                <strong style="color: #ff6b6b;">🚀 MEGA PERSONA: 미래 디자이너</strong><br/>
                <span style="color: #4ecdc4;">시공간을 초월한 디자인 마스터로, AI와 인간의 경계를 허무는 창조자입니다.</span><br/><br/>
                <strong style="color: #45b7d1;">슈퍼 인사이트:</strong><br/>
                • 🌌 차원간 디자인 트렌드 예측 능력<br/>
                • 🎭 감정을 색깔로 변환하는 시너지<br/>
                • 🔮 미래 50년 후 디자인 패턴 분석
            `;
            document.getElementById('persona-result').style.display = 'block';
            showPersonaBuilder();
        };
        
        window.activateRainbowMode = function() {
            document.documentElement.style.setProperty('--primary', '#ff6b6b');
            setTimeout(() => document.documentElement.style.setProperty('--primary', '#4ecdc4'), 500);
            setTimeout(() => document.documentElement.style.setProperty('--primary', '#45b7d1'), 1000);
            setTimeout(() => document.documentElement.style.setProperty('--primary', '#f9ca24'), 1500);
            setTimeout(() => document.documentElement.style.setProperty('--primary', '#6c5ce7'), 2000);
            setTimeout(() => document.documentElement.style.setProperty('--primary', '#1C7BF6'), 2500);
            alert('🌈 무지개 모드 활성화!');
        };
        
        window.showDevStats = function() {
            alert(`📊 PersonaSync 개발 통계:
            
🏗️ 총 코드 라인: 700+
🎨 CSS 변수: 20개
⚡ JavaScript 함수: 15개
🧩 숨겨진 기능: 4개
🎯 이스터에그: 발견됨!
            
제작자: AI Assistant & Human Developer`);
        };
        
        clickCount = 0; // Reset
    } else if (clickCount === 3) {
        document.querySelector('.logo-icon').textContent = '🔥';
        setTimeout(() => {
            document.querySelector('.logo-icon').textContent = '🧠';
        }, 1000);
    }
}

// Konami Code (Easter Egg #2)
function handleKonamiCode(event) {
    konamiCode.push(event.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        if (!secretModeActive) {
            secretModeActive = true;
            document.body.style.background = 'linear-gradient(45deg, #1e3c72, #2a5298)';
            document.querySelector('.logo-text').textContent = 'PersonaSync 🚀';
            
            // Add secret menu item
            const secretNav = document.createElement('div');
            secretNav.className = 'nav-item';
            secretNav.innerHTML = '<div class="nav-icon">🎮</div>비밀 모드';
            secretNav.onclick = () => showSecretFeature();
            document.querySelector('.nav-section').appendChild(secretNav);
            
            alert('🎮 코나미 코드 발견! 비밀 모드가 활성화되었습니다!');
            konamiCode = [];
        }
    }
}

// Secret Feature (Easter Egg #3)
function showSecretFeature() {
    const secretHTML = `
        <div class="feature-card" style="border: 2px solid #ff6b6b; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div class="feature-header">
                <div class="feature-icon">🎮</div>
                <div class="feature-title" style="color: white;">비밀 기능 발견!</div>
            </div>
            <p style="color: #f8f9fa;">축하합니다! 숨겨진 개발자 도구를 발견했습니다.</p>
            <button onclick="launchSecretGame()" style="margin-top: 20px; padding: 10px 20px; background: #ff6b6b; color: white; border: none; border-radius: 8px; cursor: pointer;">
                🕹️ 미니 게임 시작
            </button>
        </div>
    `;
    
    document.querySelector('#dashboard .content-body').innerHTML = secretHTML;
    showDashboard();
}

// Mini Game (Easter Egg #4)
function launchSecretGame() {
    let score = 0;
    let gameActive = true;
    
    const gameModal = document.createElement('div');
    gameModal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); display: flex; align-items: center;
        justify-content: center; z-index: 9999; color: white; text-align: center;
    `;
    
    gameModal.innerHTML = `
        <div style="background: var(--surface-secondary); padding: 40px; border-radius: 20px; border: 2px solid var(--primary);">
            <h2>🎯 PersonaSync 클릭 게임</h2>
            <p>10초 안에 최대한 많은 아이콘을 클릭하세요!</p>
            <div id="game-score" style="font-size: 24px; margin: 20px 0;">점수: 0</div>
            <div id="game-timer" style="font-size: 20px; margin-bottom: 20px;">시간: 10초</div>
            <button id="game-target" style="font-size: 60px; background: none; border: 2px solid var(--primary); border-radius: 50%; width: 120px; height: 120px; cursor: pointer; margin: 20px;">
                🎯
            </button><br/>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px; padding: 10px 20px; background: var(--error); color: white; border: none; border-radius: 8px;">게임 종료</button>
        </div>
    `;
    
    document.body.appendChild(gameModal);
    
    let timeLeft = 10;
    const gameTarget = gameModal.querySelector('#game-target');
    const gameScore = gameModal.querySelector('#game-score');
    const gameTimer = gameModal.querySelector('#game-timer');
    
    gameTarget.onclick = () => {
        if (gameActive) {
            score++;
            gameScore.textContent = `점수: ${score}`;
            gameTarget.textContent = ['🎯', '⭐', '💎', '🚀', '⚡'][Math.floor(Math.random() * 5)];
        }
    };
    
    const timer = setInterval(() => {
        timeLeft--;
        gameTimer.textContent = `시간: ${timeLeft}초`;
        
        if (timeLeft <= 0) {
            gameActive = false;
            clearInterval(timer);
            gameTarget.textContent = '🏁';
            gameTarget.onclick = null;
            
            setTimeout(() => {
                alert(`🎉 게임 종료! 최종 점수: ${score}점\n${score >= 20 ? '👑 디자인 마스터!' : score >= 10 ? '🎨 디자인 전문가!' : '🎯 디자인 입문자!'}`);
                gameModal.remove();
            }, 1000);
        }
    }, 1000);
}

// Double Click Logo (Easter Egg #5)
function handleLogoDoubleClick() {
    const messages = [
        '🎨 디자인은 문제 해결이다!',
        '🚀 혁신은 경계를 허무는 것!',
        '💡 창의성은 제약에서 나온다!',
        '🎯 사용자 중심 디자인이 최고!',
        '🌟 PersonaSync와 함께 미래를 디자인하세요!'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create floating message
    const floatingMsg = document.createElement('div');
    floatingMsg.textContent = randomMessage;
    floatingMsg.style.cssText = `
        position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
        background: var(--primary); color: white; padding: 15px 25px;
        border-radius: 25px; z-index: 1000; font-weight: 600;
        animation: fadeInOut 3s ease-in-out forwards;
    `;
    
    // Add CSS animation
    if (!document.querySelector('#floating-animation')) {
        const style = document.createElement('style');
        style.id = 'floating-animation';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(floatingMsg);
    setTimeout(() => floatingMsg.remove(), 3000);
}

// ===== INITIALIZATION & EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('PersonaSync 시작');
    
    // Show dashboard by default
    showDashboard();
    
    // Add event listeners for hidden features
    document.querySelector('.logo').addEventListener('click', handleLogoClick);
    document.querySelector('.logo').addEventListener('dblclick', handleLogoDoubleClick);
    document.addEventListener('keydown', handleKonamiCode);
    
    // Add some initial animations
    setTimeout(() => {
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
    
    // Hidden console message
    console.log(`
🎨 PersonaSync 개발자 도구에 오신 것을 환영합니다!

🔍 숨겨진 기능들:
1. 로고를 5번 클릭하면 개발자 모드 활성화
2. 로고를 더블클릭하면 영감을 주는 메시지 표시
3. 코나미 코드 (↑↑↓↓←→←→BA)로 비밀 모드 활성화
4. 비밀 모드에서 미니 게임 플레이 가능

💡 콘솔에서 이런 명령어들을 시도해보세요:
- showAllSections()
- generateMegaPersona()
- activateRainbowMode()
- showDevStats()

제작: AI Assistant 🤖
    `);
});

// ===== END OF PERSONASYNC JAVASCRIPT ENGINE =====
/* 
 * 🎉 PersonaSync Interactive Demo 완료!
 * 
 * 이 파일은 다음을 포함합니다:
 * - 완전한 반응형 웹 애플리케이션
 * - 4개의 주요 인터랙티브 기능
 * - 5개의 숨겨진 이스터에그
 * - 미니게임 시스템
 * - 개발자 도구
 * 
 * 즐겁게 탐험해보세요! 🚀
 */
