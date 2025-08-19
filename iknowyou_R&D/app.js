// 스텝 관리 함수들
function updateStepIndicator() {
    for(let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step${i}`);
        const content = document.getElementById(`content${i}`);
        
        step.classList.remove('active', 'completed');
        content.classList.remove('active');
        
        if(i < currentStep) {
            step.classList.add('completed');
        } else if(i === currentStep) {
            step.classList.add('active');
            content.classList.add('active');
        }
    }
}

function nextStep() {
    if(currentStep < 4) {
        currentStep++;
        updateStepIndicator();
    }
}

function prevStep() {
    if(currentStep > 1) {
        currentStep--;
        updateStepIndicator();
    }
}

// 분석 시작 함수
function startAnalysis() {
    // 기존 분석 로직
    const loadingSection = document.getElementById('loadingSection');
    const personaResults = document.getElementById('personaResults');
    
    if (loadingSection) loadingSection.style.display = 'block';
    if (personaResults) personaResults.style.display = 'none';
    
    // 사용자 정의 페르소나 데이터 수집
    const enableCustom = document.getElementById('enableCustomPersona');
    if (enableCustom && enableCustom.checked) {
        generateCustomPersonaFromForm();
    }
    
    // 진행률 애니메이션
    let progress = 0;
    const progressFill = document.getElementById('progressFill');
    const loadingTexts = [
        '입력정보 기반 페르소나 매칭 중...',
        '시장 데이터 분석 중...',
        '소비자 행동 패턴 분석 중...',
        '맞춤형 전략 수립 중...'
    ];
    let textIndex = 0;
    
    const interval = setInterval(() => {
        progress += 2;
        if (progressFill) progressFill.style.width = progress + '%';
        
        if (progress % 25 === 0 && textIndex < loadingTexts.length) {
            const loadingText = document.getElementById('loadingText');
            if (loadingText) loadingText.textContent = loadingTexts[textIndex];
            textIndex++;
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (loadingSection) loadingSection.style.display = 'none';
                if (personaResults) personaResults.style.display = 'block';
                
                // 사용자 정의 페르소나 카드 표시
                const enableCustom = document.getElementById('enableCustomPersona');
                const customCard = document.getElementById('customPersonaCard');
                if (enableCustom && enableCustom.checked && customCard && customPersonaData) {
                    customCard.style.display = 'block';
                    updateCustomPersonaDisplay();
                }
                
                nextStep();
            }, 500);
        }
    }, 50);
}

// 페르소나 선택 함수
function selectPersona(personaId) {
    // 다른 페르소나 카드들 선택 해제
    document.querySelectorAll('.persona-card').forEach(card => {
        card.classList.remove('selected');
        const details = card.querySelector('.persona-details');
        if (details) {
            details.classList.remove('active');
        }
    });
    
    // 사용자 정의 페르소나 처리
    if (personaId === 'custom') {
        const customCard = document.getElementById('customPersonaCard');
        if (customCard) {
            customCard.classList.add('selected');
        }
        const details = document.getElementById('persona-custom');
        if (details) {
            details.classList.add('active');
        }
        return;
    }
    
    // 기본 페르소나 처리
    const selectedCard = document.querySelector('.persona-card:nth-child(' + (personaId + 1) + ')');
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    const details = document.getElementById('persona' + personaId);
    if (details) {
        details.classList.add('active');
    }
    
    selectedPersona = personaId;
}

// 탭 전환 함수
function switchTab(personaId, tabType) {
    // 사용자 정의 페르소나 처리
    if (personaId === 'custom') {
        const tabButtons = document.querySelectorAll('#persona-custom .tab-button');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const tabContents = document.querySelectorAll('#persona-custom .tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        const targetContent = document.getElementById(`persona-custom-${tabType}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        return;
    }
    
    // 기본 페르소나 처리
    const tabButtons = document.querySelectorAll(`#persona${personaId} .tab-button`);
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 탭 컨텐츠 업데이트
    const tabContents = document.querySelectorAll(`#persona${personaId} .tab-content`);
    tabContents.forEach(content => content.classList.remove('active'));
    const targetContent = document.getElementById(`persona${personaId}-${tabType}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// 전략 선택 함수
function selectStrategy(personaId, strategy) {
    // 라디오 버튼 업데이트
    const options = document.querySelectorAll(`input[name="persona${personaId}-strategy"]`);
    options.forEach(option => {
        const label = option.closest('.strategy-option');
        if (option.value === strategy) {
            option.checked = true;
            label.classList.add('active');
        } else {
            option.checked = false;
            label.classList.remove('active');
        }
    });
    
    // 전략에 따른 데이터 업데이트
    updatePersonaData(personaId, strategy);
}

// 페르소나 데이터 업데이트 함수
function updatePersonaData(personaId, strategy) {
    const data = strategyData[`persona${personaId}`][strategy];
    
    // 성공 패턴 업데이트
    document.getElementById(`persona${personaId}-success-pattern`).textContent = data.successPattern;
    
    // 시장분석 데이터 업데이트
    const marketMetrics = document.getElementById(`persona${personaId}-market-metrics`);
    marketMetrics.innerHTML = `
        <div class="metric-item">
            <div class="metric-value">${data.market.size}</div>
            <div class="metric-label">${data.market.label}</div>
        </div>
        <div class="metric-item">
            <div class="metric-value">${data.market.growth}</div>
            <div class="metric-label">연평균 성장률</div>
        </div>
        <div class="metric-item">
            <div class="metric-value">${data.market.barrier}</div>
            <div class="metric-label">진입 장벽</div>
        </div>
    `;
    
    // 소비자분석 데이터 업데이트
    const consumerMetrics = document.getElementById(`persona${personaId}-consumer-metrics`);
    consumerMetrics.innerHTML = `
        <div class="metric-item">
            <div class="metric-value">${data.consumer.motivation}</div>
            <div class="metric-label">핵심 구매 동기</div>
        </div>
        <div class="metric-item">
            <div class="metric-value">${data.consumer.premium}</div>
            <div class="metric-label">프리미엄 지불 의향</div>
        </div>
        <div class="metric-item">
            <div class="metric-value">${data.consumer.focus}</div>
            <div class="metric-label">핵심 관심사</div>
        </div>
    `;
    
    // 숨겨진 기회 업데이트
    document.getElementById(`persona${personaId}-hidden-opportunity`).innerHTML = data.opportunity;
}

// 피드백 제공 함수
function provideFeedback(type) {
    // 버튼 상태 업데이트
    document.querySelectorAll('.feedback-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // 피드백 텍스트 영역 표시
    const feedbackText = document.getElementById('feedbackText');
    const evolutionMessage = document.getElementById('evolutionMessage');
    
    if (type === 'different') {
        feedbackText.style.display = 'block';
        feedbackText.placeholder = "어떤 점이 다른지 구체적으로 알려주세요. 더 정확한 분석을 위해 활용하겠습니다.";
    } else if (type === 'partial') {
        feedbackText.style.display = 'block';
        feedbackText.placeholder = "어떤 부분이 맞고 어떤 부분이 다른지 알려주세요.";
    } else {
        feedbackText.style.display = 'none';
    }
    
    // 진화 메시지 표시
    setTimeout(() => {
        evolutionMessage.style.display = 'flex';
        setTimeout(() => {
            evolutionMessage.innerHTML = `
                <span class="icon">✅</span>
                <span>피드백이 반영되었습니다. 회원가입 후 개인화된 2차 분석 결과를 확인하세요!</span>
            `;
        }, 2000);
    }, 1000);
}

// 상세 리포트 표시 함수 (핵심 함수)
function showDetailReport(personaId, type) {
    // 사용자 정의 페르소나 처리
    if (personaId === 'persona-custom') {
        if (type === 'market') {
            const content = generateCustomMarketReport();
            showDetailReportModal(content, '📊 맞춤형 시장 분석 리포트');
        } else if (type === 'consumer') {
            const content = generateCustomConsumerReport();
            showDetailReportModal(content, '👥 맞춤형 소비자 분석 리포트');
        }
        return;
    }
    
    // 기본 페르소나 처리
    const persona = personaData[personaId];
    const modal = document.getElementById('reportModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalBody = document.getElementById('modalBody');
    
    if (type === 'market') {
        modalTitle.textContent = `📊 ${persona.market.title}`;
        modalSubtitle.textContent = `${persona.name} 타겟 시장 심화 분석`;
        modalBody.innerHTML = generateMarketReport(persona);
    } else {
        modalTitle.textContent = `👥 ${persona.consumer.title}`;
        modalSubtitle.textContent = `${persona.name} 소비자 행동 심화 분석`;
        modalBody.innerHTML = generateConsumerReport(persona);
    }
    
    modal.style.display = 'block';
}

// 시장 리포트 생성 함수
function generateMarketReport(persona) {
    return `
        <div class="report-section">
            <div class="persona-profile">
                <div class="persona-avatar">
                    <div class="avatar-circle">${persona.icon}</div>
                    <h3>${persona.name}</h3>
                </div>
                <div class="persona-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">시장 규모</div>
                            <div class="info-value">${persona.market.marketSize}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">성장률</div>
                            <div class="info-value">${persona.market.growth}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">경쟁 강도</div>
                            <div class="info-value">${persona.market.competition}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">진입 난이도</div>
                            <div class="info-value">중간</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="report-section">
            <div class="report-title">📈 시장 규모 및 성장 전망</div>
            <div class="infographic">
                <div class="chart-container">
                    <div class="bar-chart">
                        <div class="bar" style="height: 60%;">
                            2022<div class="bar-label">1,520억</div>
                        </div>
                        <div class="bar" style="height: 80%;">
                            2023<div class="bar-label">1,650억</div>
                        </div>
                        <div class="bar" style="height: 100%;">
                            2024<div class="bar-label">1,800억</div>
                        </div>
                        <div class="bar" style="height: 120%; background: linear-gradient(to top, #10b981, #059669);">
                            2025<div class="bar-label">2,130억(예상)</div>
                        </div>
                    </div>
                </div>
                <div class="insight-box">
                    <div class="insight-title">💡 핵심 인사이트</div>
                    <p>친환경 뷰티 시장은 코로나19 이후 급격한 성장세를 보이며, 특히 2030 여성층의 관심이 폭발적으로 증가하고 있습니다. MZ세대의 환경 의식 확산과 함께 지속 가능한 뷰티 제품에 대한 수요가 연 18.5% 성장하고 있습니다.</p>
                </div>
            </div>
        </div>

        <div class="report-section">
            <div class="report-title">🎯 경쟁 구조 분석</div>
            <div class="infographic">
                <div class="chart-container">
                    <div class="pie-chart"></div>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: #4f46e5;"></div>
                            <span>대기업 브랜드 (33%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #7c3aed;"></div>
                            <span>중소 브랜드 (22%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #06b6d4;"></div>
                            <span>스타트업 (28%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #10b981;"></div>
                            <span>해외 브랜드 (17%)</span>
                        </div>
                    </div>
                </div>
                <div class="insight-box">
                    <div class="insight-title">🔍 경쟁사 분석</div>
                    <p><strong>기회요인:</strong> 대기업들의 늦은 진입으로 스타트업에게 유리한 경쟁 환경<br>
                    <strong>위험요인:</strong> 해외 브랜드들의 국내 진출 가속화<br>
                    <strong>차별화 포인트:</strong> 한국 소비자 맞춤형 친환경 디자인</p>
                </div>
            </div>
        </div>

        <div class="report-section">
            <div class="report-title">💰 수익성 분석</div>
            <div class="infographic">
                <div class="info-grid">
                    <div class="info-item" style="text-align: center;">
                        <div class="info-label">평균 마진율</div>
                        <div class="info-value" style="font-size: 2rem; color: #10b981;">45%</div>
                    </div>
                    <div class="info-item" style="text-align: center;">
                        <div class="info-label">시장 진입 비용</div>
                        <div class="info-value" style="font-size: 2rem; color: #f59e0b;">2.5억원</div>
                    </div>
                    <div class="info-item" style="text-align: center;">
                        <div class="info-label">손익분기점</div>
                        <div class="info-value" style="font-size: 2rem; color: #4f46e5;">18개월</div>
                    </div>
                    <div class="info-item" style="text-align: center;">
                        <div class="info-label">성공 확률</div>
                        <div class="info-value" style="font-size: 2rem; color: #dc2626;">78%</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 소비자 리포트 생성 함수
function generateConsumerReport(persona) {
    return `
        <div class="report-section">
            <div class="persona-profile">
                <div class="persona-avatar">
                    <div class="avatar-circle">${persona.icon}</div>
                    <h3>${persona.name}</h3>
                </div>
                <div class="persona-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">핵심 동기</div>
                            <div class="info-value">${persona.consumer.motivation}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">프리미엄 지불 의향</div>
                            <div class="info-value">${persona.consumer.premium}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">정보 채널</div>
                            <div class="info-value">${persona.consumer.channel}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">구매 빈도</div>
                            <div class="info-value">월 2-3회</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="report-section">
            <div class="report-title">🧠 소비자 심리 분석</div>
            <div class="infographic">
                <div class="chart-container">
                    <div class="bar-chart">
                        <div class="bar" style="height: 90%;">
                            환경보호<div class="bar-label">90%</div>
                        </div>
                        <div class="bar" style="height: 75%;">
                            건강<div class="bar-label">75%</div>
                        </div>
                        <div class="bar" style="height: 60%;">
                            트렌드<div class="bar-label">60%</div>
                        </div>
                        <div class="bar" style="height: 45%;">
                            가격<div class="bar-label">45%</div>
                        </div>
                    </div>
                </div>
                <div class="insight-box">
                    <div class="insight-title">💭 구매 결정 요인</div>
                    <p>이 페르소나는 <strong>환경보호 가치</strong>를 최우선으로 고려하며, 가격보다는 제품의 <strong>지속가능성</strong>을 중시합니다. 브랜드의 환경 철학과 투명한 성분 공개가 구매 결정에 가장 큰 영향을 미칩니다.</p>
                </div>
            </div>
        </div>

        <div class="report-section">
            <div class="report-title">📱 디지털 행동 패턴</div>
            <div class="infographic">
                <div class="info-grid">
                    <div class="info-item" style="text-align: center;">
                        <div class="info-label">주요 플랫폼</div>
                        <div class="info-value">인스타그램<br>네이버 블로그</div>
                    </div>
                    <div class="info-item" style="text-align: center;">
                        <div class="info-label">콘텐츠 선호도</div>
                        <div class="info-value">리뷰 영상<br>성분 분석</div>
                    </div>
                    <div class="info-item" style="text-align: center;">
                        <div class="info-label">구매 경로</div>
                        <div class="info-value">온라인 직구<br>브랜드 공식몰</div>
                    </div>
                    <div class="info-item" style="text-align: center;">
                        <div class="info-label">영향력 있는 채널</div>
                        <div class="info-value">친환경 인플루언서<br>전문가 리뷰</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="report-section">
            <div class="report-title">🎯 마케팅 전략 제안</div>
            <div class="infographic">
                <div class="insight-box">
                    <div class="insight-title">📢 핵심 메시지</div>
                    <p><strong>"지구를 생각하는 아름다움"</strong><br>
                    환경 보호와 뷰티의 완벽한 조화를 강조하는 메시지가 가장 효과적입니다.</p>
                </div>
                <div class="insight-box">
                    <div class="insight-title">📍 최적 채널</div>
                    <p><strong>인스타그램 스토리 광고</strong> + <strong>친환경 블로거 협업</strong><br>
                    시각적 임팩트와 신뢰성 있는 리뷰를 결합한 전략이 효과적입니다.</p>
                </div>
                <div class="insight-box">
                    <div class="insight-title">⏰ 최적 타이밍</div>
                    <p><strong>환경의 날 (6월)</strong>, <strong>지구의 날 (4월)</strong><br>
                    환경 관련 이슈가 주목받는 시기에 런칭하면 자연스러운 화제성 확보가 가능합니다.</p>
                </div>
            </div>
        </div>
    `;
}

// 모달 닫기 함수
function closeReport() {
    document.getElementById('reportModal').style.display = 'none';
}

// 회원가입 관련 함수들
function showSignup() {
    alert('🎉 회원가입 페이지로 이동합니다!\n\n프리미엄 서비스 혜택:\n• 상세 시장 분석 보고서\n• 맞춤형 지원서 작성 가이드\n• 1:1 전문가 컨설팅\n• 성공 사례 데이터베이스 접근');
    nextStep();
}

function continueAsGuest() {
    alert('체험 모드로 계속 진행합니다.\n일부 기능이 제한될 수 있습니다.');
}

function completeSignup() {
    alert('🎊 회원가입이 완료되었습니다!\n\n이제 모든 프리미엄 기능을 이용하실 수 있습니다:\n• 무제한 분석 서비스\n• 전문가 컨설팅\n• 맞춤형 지원서 템플릿\n• 성공 전략 가이드');
}

// PDF 출력 함수
function exportToPDF(personaId, type) {
    const persona = personaData[personaId];
    let content = '';
    let title = '';
    
    if (type === 'market') {
        title = `${persona.name} - 시장분석 리포트`;
        content = generateMarketReportForPDF(persona);
    } else {
        title = `${persona.name} - 소비자분석 리포트`;
        content = generateConsumerReportForPDF(persona);
    }
    
    // PDF 생성
    const element = document.createElement('div');
    element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4f46e5; padding-bottom: 20px;">
                <h1 style="color: #4f46e5; margin: 0;">${title}</h1>
                <p style="color: #64748b; margin: 10px 0 0 0;">아이노유 지원도움 AI - 디자인진흥원 연계 서비스</p>
                <p style="color: #64748b; margin: 5px 0 0 0;">생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
            </div>
            ${content}
        </div>
    `;
    
    // html2pdf 라이브러리 사용
    if (typeof html2pdf !== 'undefined') {
        const opt = {
            margin: 1,
            filename: `${persona.name}_${type === 'market' ? '시장분석' : '소비자분석'}_리포트.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save();
    } else {
        // html2pdf가 없는 경우 기본 다운로드
        const blob = new Blob([element.innerHTML], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${persona.name}_${type === 'market' ? '시장분석' : '소비자분석'}_리포트.html`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// PDF용 시장 리포트 생성 함수
function generateMarketReportForPDF(persona) {
    return `
        <div style="margin-bottom: 30px;">
            <h2 style="color: #1e293b; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">📊 페르소나 프로필</h2>
            <div style="display: flex; align-items: center; margin: 20px 0;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #7c3aed); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; margin-right: 20px;">
                    ${persona.icon}
                </div>
                <div>
                    <h3 style="margin: 0 0 10px 0; color: #1e293b;">${persona.name}</h3>
                    <p style="margin: 0; color: #64748b;">환경을 생각하는 소비 습관을 가진 2030 여성으로, 제품의 지속가능성을 중요하게 여깁니다.</p>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <h2 style="color: #1e293b; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">📈 시장 규모 및 성장 전망</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <h3 style="margin: 0 0 15px 0; color: #0369a1;">시장 현황</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #10b981;">${persona.market.marketSize}</div>
                        <div style="font-size: 0.9rem; color: #64748b;">시장 규모</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #f59e0b;">${persona.market.growth}</div>
                        <div style="font-size: 0.9rem; color: #64748b;">연평균 성장률</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #4f46e5;">${persona.market.competition}</div>
                        <div style="font-size: 0.9rem; color: #64748b;">경쟁 강도</div>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <h2 style="color: #1e293b; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">🎯 경쟁 구조 분석</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <h3 style="margin: 0 0 15px 0; color: #0369a1;">시장 점유율</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                    <li><strong>대기업 브랜드:</strong> 33% - 안정적인 품질과 브랜드 인지도</li>
                    <li><strong>중소 브랜드:</strong> 22% - 차별화된 제품과 서비스</li>
                    <li><strong>스타트업:</strong> 28% - 혁신적인 접근과 빠른 대응</li>
                    <li><strong>해외 브랜드:</strong> 17% - 글로벌 트렌드와 프리미엄 이미지</li>
                </ul>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <h2 style="color: #1e293b; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">💰 수익성 분석</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #10b981;">45%</div>
                        <div style="font-size: 0.9rem; color: #64748b;">평균 마진율</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #f59e0b;">2.5억원</div>
                        <div style="font-size: 0.9rem; color: #64748b;">시장 진입 비용</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #4f46e5;">18개월</div>
                        <div style="font-size: 0.9rem; color: #64748b;">손익분기점</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #dc2626;">78%</div>
                        <div style="font-size: 0.9rem; color: #64748b;">성공 확률</div>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <h2 style="color: #1e293b; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">💡 핵심 인사이트</h2>
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 15px 0;">
                <p style="margin: 0; color: #78350f; line-height: 1.6;">
                    친환경 뷰티 시장은 코로나19 이후 급격한 성장세를 보이며, 특히 2030 여성층의 관심이 폭발적으로 증가하고 있습니다. 
                    MZ세대의 환경 의식 확산과 함께 지속 가능한 뷰티 제품에 대한 수요가 연 18.5% 성장하고 있습니다.
                </p>
            </div>
        </div>
    `;
}

// PDF용 소비자 리포트 생성 함수
function generateConsumerReportForPDF(persona) {
    return `
        <div style="margin-bottom: 30px;">
            <h2 style="color: #1e293b; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">👥 페르소나 프로필</h2>
            <div style="display: flex; align-items: center; margin: 20px 0;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #7c3aed); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; margin-right: 20px;">
                    ${persona.icon}
                </div>
                <div>
                    <h3 style="margin: 0 0 10px 0; color: #1e293b;">${persona.name}</h3>
                    <p style="margin: 0; color: #64748b;">환경을 생각하는 소비 습관을 가진 2030 여성으로, 제품의 지속가능성을 중요하게 여깁니다.</p>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <h2 style="color: #1e293b; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">🧠 소비자 심리 분석</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <h3 style="margin: 0 0 15px 0; color: #0369a1;">구매 결정 요인</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #10b981;">90%</div>
                        <div style="font-size: 0.9rem; color: #64748b;">환경보호</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #f59e0b;">75%</div>
                        <div style="font-size: 0.9rem; color: #64748b;">건강</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #4f46e5;">60%</div>
                        <div style="font-size: 0.9rem; color: #64748b;">트렌드</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #dc2626;">45%</div>
                        <div style="font-size: 0.9rem; color: #64748b;">가격</div>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <h2 style="color: #1e293b; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">📱 디지털 행동 패턴</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-weight: bold; color: #1e293b;">인스타그램<br>네이버 블로그</div>
                        <div style="font-size: 0.9rem; color: #64748b;">주요 플랫폼</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-weight: bold; color: #1e293b;">리뷰 영상<br>성분 분석</div>
                        <div style="font-size: 0.9rem; color: #64748b;">콘텐츠 선호도</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-weight: bold; color: #1e293b;">온라인 직구<br>브랜드 공식몰</div>
                        <div style="font-size: 0.9rem; color: #64748b;">구매 경로</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                        <div style="font-weight: bold; color: #1e293b;">친환경 인플루언서<br>전문가 리뷰</div>
                        <div style="font-size: 0.9rem; color: #64748b;">영향력 있는 채널</div>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <h2 style="color: #1e293b; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">🎯 마케팅 전략 제안</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #0369a1;">📢 핵심 메시지</h3>
                    <p style="margin: 0; color: #374151; line-height: 1.6;">
                        <strong>"지구를 생각하는 아름다움"</strong><br>
                        환경 보호와 뷰티의 완벽한 조화를 강조하는 메시지가 가장 효과적입니다.
                    </p>
                </div>
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #0369a1;">📍 최적 채널</h3>
                    <p style="margin: 0; color: #374151; line-height: 1.6;">
                        <strong>인스타그램 스토리 광고</strong> + <strong>친환경 블로거 협업</strong><br>
                        시각적 임팩트와 신뢰성 있는 리뷰를 결합한 전략이 효과적입니다.
                    </p>
                </div>
                <div>
                    <h3 style="margin: 0 0 10px 0; color: #0369a1;">⏰ 최적 타이밍</h3>
                    <p style="margin: 0; color: #374151; line-height: 1.6;">
                        <strong>환경의 날 (6월)</strong>, <strong>지구의 날 (4월)</strong><br>
                        환경 관련 이슈가 주목받는 시기에 런칭하면 자연스러운 화제성 확보가 가능합니다.
                    </p>
                </div>
            </div>
        </div>
    `;
}

// 모달 외부 클릭시 닫기
window.onclick = function(event) {
    const reportModal = document.getElementById('reportModal');
    const evaluationModal = document.getElementById('evaluationModal');
    
    if (event.target === reportModal) {
        closeReport();
    }
    
    if (event.target === evaluationModal) {
        closeEvaluation();
    }
}

// 사용자 정의 페르소나 폼 토글 기능
document.addEventListener('DOMContentLoaded', function() {
    const enableCustomPersona = document.getElementById('enableCustomPersona');
    const customPersonaForm = document.getElementById('customPersonaForm');
    
    if (enableCustomPersona && customPersonaForm) {
        enableCustomPersona.addEventListener('change', function() {
            if (this.checked) {
                customPersonaForm.style.display = 'block';
            } else {
                customPersonaForm.style.display = 'none';
            }
        });
    }
});



// 폼 데이터로부터 사용자 정의 페르소나 생성
function generateCustomPersonaFromForm() {
    const formData = {
        targetAge: document.getElementById('customTargetAge')?.value || '20대',
        targetGender: document.getElementById('customTargetGender')?.value || '여성',
        priceRange: document.getElementById('customPriceRange')?.value || '1-3만원',
        purchaseChannel: document.getElementById('customPurchaseChannel')?.value || '온라인 쇼핑몰',
        decisionFactor: document.getElementById('customDecisionFactor')?.value || '디자인/외관',
        lifestyle: document.getElementById('customLifestyle')?.value || '트렌디/패션',
        marketSize: document.getElementById('customMarketSize')?.value || '500억원',
        growthRate: document.getElementById('customGrowthRate')?.value || '15%',
        customerInfo: document.getElementById('customCustomerInfo')?.value || ''
    };
    
    customPersonaData = generateCustomPersona(formData);
    updateCustomPersonaDisplay();
}

// 사용자 정의 페르소나 표시 업데이트
function updateCustomPersonaDisplay() {
    if (!customPersonaData) return;
    
    // 페르소나 이름과 설명 업데이트
    const nameElement = document.getElementById('customPersonaName');
    const descriptionElement = document.getElementById('customPersonaDescription');
    
    if (nameElement) {
        nameElement.textContent = customPersonaData.name;
    }
    
    if (descriptionElement) {
        descriptionElement.textContent = generateCustomPersonaDescription();
    }
    
    // 시장 분석 메트릭 업데이트
    updateCustomMarketMetrics();
    
    // 소비자 분석 메트릭 업데이트
    updateCustomConsumerMetrics();
    
    // 맞춤 기회 업데이트
    updateCustomOpportunity();
}

// 사용자 정의 페르소나 설명 생성
function generateCustomPersonaDescription() {
    const age = customPersonaData.targetAge;
    const gender = customPersonaData.targetGender;
    const lifestyle = customPersonaData.lifestyle;
    const priceRange = customPersonaData.priceRange;
    
    const lifestyleDescriptions = {
        "트렌디/패션": "트렌드를 중시하며",
        "실용적/절약": "실용성을 우선시하며",
        "프리미엄/고급": "품질과 브랜드 가치를 중시하며",
        "친환경/윤리적": "환경과 윤리를 고려하며",
        "독창적/개성": "독특하고 개성 있는 제품을 선호하며"
    };
    
    const lifestyleDesc = lifestyleDescriptions[lifestyle] || "트렌드를 중시하며";
    
    return `${age} ${gender} 타겟으로, ${lifestyleDesc} ${priceRange} 가격대의 제품을 선호하는 소비층입니다.`;
}

// 사용자 정의 시장 분석 메트릭 업데이트
function updateCustomMarketMetrics() {
    const metricsContainer = document.getElementById('persona-custom-market-metrics');
    if (!metricsContainer || !customPersonaData) return;
    
    metricsContainer.innerHTML = `
        <div class="metric-item">
            <div class="metric-value">${customPersonaData.market.marketSize}</div>
            <div class="metric-label">맞춤형 시장 규모</div>
        </div>
        <div class="metric-item">
            <div class="metric-value">${customPersonaData.market.growth}</div>
            <div class="metric-label">연평균 성장률</div>
        </div>
        <div class="metric-item">
            <div class="metric-value">${customPersonaData.market.competition}</div>
            <div class="metric-label">경쟁 강도</div>
        </div>
    `;
}

// 사용자 정의 소비자 분석 메트릭 업데이트
function updateCustomConsumerMetrics() {
    const metricsContainer = document.getElementById('persona-custom-consumer-metrics');
    if (!metricsContainer || !customPersonaData) return;
    
    metricsContainer.innerHTML = `
        <div class="metric-item">
            <div class="metric-value">${customPersonaData.consumer.motivation}</div>
            <div class="metric-label">핵심 구매 동기</div>
        </div>
        <div class="metric-item">
            <div class="metric-value">${customPersonaData.consumer.premium}</div>
            <div class="metric-label">프리미엄 지불 의향</div>
        </div>
        <div class="metric-item">
            <div class="metric-value">${customPersonaData.consumer.channel}</div>
            <div class="metric-label">주요 구매 채널</div>
        </div>
    `;
}

// 사용자 정의 맞춤 기회 업데이트
function updateCustomOpportunity() {
    const opportunityElement = document.getElementById('persona-custom-hidden-opportunity');
    const executionPointsElement = document.getElementById('persona-custom-execution-points');
    
    if (!opportunityElement || !executionPointsElement || !customPersonaData) return;
    
    const opportunity = generateCustomOpportunity();
    const executionPoints = generateCustomExecutionPoints();
    
    opportunityElement.innerHTML = opportunity;
    executionPointsElement.innerHTML = executionPoints;
}

// 사용자 정의 기회 생성
function generateCustomOpportunity() {
    const lifestyle = customPersonaData.lifestyle;
    const decisionFactor = customPersonaData.decisionFactor;
    
    const opportunities = {
        "트렌디/패션": "트렌드 민감도가 높은 타겟으로, 시즌별 컬렉션과 한정판 전략이 효과적입니다.",
        "실용적/절약": "가성비를 중시하는 타겟으로, 기능성과 내구성을 강조한 제품이 선호됩니다.",
        "프리미엄/고급": "브랜드 가치를 중시하는 타겟으로, 스토리텔링과 고급스러운 디자인이 중요합니다.",
        "친환경/윤리적": "환경 가치를 중시하는 타겟으로, 지속가능성과 윤리적 생산 과정이 핵심입니다.",
        "독창적/개성": "개성을 중시하는 타겟으로, 독특하고 차별화된 디자인이 필수입니다."
    };
    
    return opportunities[lifestyle] || "타겟 고객의 특성을 고려한 맞춤형 전략이 필요합니다.";
}

// 사용자 정의 실행 포인트 생성
function generateCustomExecutionPoints() {
    const lifestyle = customPersonaData.lifestyle;
    const channel = customPersonaData.purchaseChannel;
    
    const points = {
        "트렌디/패션": [
            "시즌별 트렌드 컬렉션 기획",
            "SNS 마케팅과 인플루언서 협업",
            "패스트 패션과 차별화된 품질"
        ],
        "실용적/절약": [
            "기능성 중심의 제품 설계",
            "가격 경쟁력 확보",
            "내구성과 사용 편의성 강조"
        ],
        "프리미엄/고급": [
            "브랜드 스토리텔링 강화",
            "고급 소재와 정교한 디자인",
            "한정판과 VIP 서비스 제공"
        ],
        "친환경/윤리적": [
            "친환경 소재 사용",
            "윤리적 생산 과정 투명성",
            "환경 보호 활동 연계"
        ],
        "독창적/개성": [
            "독특한 디자인 아이덴티티",
            "개인화 옵션 제공",
            "아티스트 콜라보레이션"
        ]
    };
    
    const basePoints = points[lifestyle] || [
        "타겟 고객 특성에 맞는 제품 개발",
        "적절한 마케팅 채널 활용",
        "지속적인 고객 피드백 수집"
    ];
    
    return basePoints.map(point => `<li>${point}</li>`).join('');
}



// 사용자 정의 페르소나 시장 리포트 생성 함수
function generateCustomMarketReport() {
    if (!customPersonaData) return '<p>사용자 정의 페르소나 데이터가 없습니다.</p>';
    
    return `
        <div class="report-section">
            <div class="persona-profile">
                <div class="persona-avatar">
                    <div class="avatar-circle">${customPersonaData.icon}</div>
                    <h3>${customPersonaData.name}</h3>
                </div>
                <div class="persona-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">시장 규모</div>
                            <div class="info-value">${customPersonaData.market.marketSize}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">성장률</div>
                            <div class="info-value">${customPersonaData.market.growth}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">경쟁 강도</div>
                            <div class="info-value">${customPersonaData.market.competition}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">타겟 연령대</div>
                            <div class="info-value">${customPersonaData.targetAge}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="report-section">
            <div class="report-title">📈 맞춤형 시장 분석</div>
            <div class="infographic">
                <div class="insight-box">
                    <div class="insight-title">💡 핵심 인사이트</div>
                    <p>입력하신 정보를 바탕으로 분석한 결과, ${customPersonaData.targetAge} ${customPersonaData.targetGender} 타겟 시장에서 ${customPersonaData.market.growth}의 성장률을 보이고 있습니다. ${customPersonaData.lifestyle} 라이프스타일을 가진 소비자들이 주요 고객층으로 나타났습니다.</p>
                </div>
            </div>
        </div>

        <div class="report-section">
            <div class="report-title">🎯 시장 기회 분석</div>
            <div class="opportunity-analysis">
                <div class="opportunity-item">
                    <div class="opportunity-icon">💡</div>
                    <div class="opportunity-content">
                        <h4>주요 기회 요인</h4>
                        <p>${customPersonaData.targetAge} ${customPersonaData.targetGender} 소비자들의 ${customPersonaData.decisionFactor} 중심 구매 패턴</p>
                    </div>
                </div>
                <div class="opportunity-item">
                    <div class="opportunity-icon">📈</div>
                    <div class="opportunity-content">
                        <h4>성장 전망</h4>
                        <p>${customPersonaData.market.growth} 성장률로 안정적인 시장 확장 예상</p>
                    </div>
                </div>
                <div class="opportunity-item">
                    <div class="opportunity-icon">🎯</div>
                    <div class="opportunity-content">
                        <h4>차별화 포인트</h4>
                        <p>${customPersonaData.purchaseChannel} 채널을 통한 접근과 ${customPersonaData.lifestyle} 라이프스타일 맞춤 전략</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 사용자 정의 페르소나 소비자 리포트 생성 함수
function generateCustomConsumerReport() {
    if (!customPersonaData) return '<p>사용자 정의 페르소나 데이터가 없습니다.</p>';
    
    return `
        <div class="report-section">
            <div class="persona-profile">
                <div class="persona-avatar">
                    <div class="avatar-circle">${customPersonaData.icon}</div>
                    <h3>${customPersonaData.name}</h3>
                </div>
                <div class="persona-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">주요 구매 동기</div>
                            <div class="info-value">${customPersonaData.consumer.motivation}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">프리미엄 지불 의향</div>
                            <div class="info-value">${customPersonaData.consumer.premium}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">주요 구매 채널</div>
                            <div class="info-value">${customPersonaData.consumer.channel}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">선호 가격대</div>
                            <div class="info-value">${customPersonaData.priceRange}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="report-section">
            <div class="report-title">👥 맞춤형 소비자 행동 분석</div>
            <div class="consumer-behavior">
                <div class="behavior-item">
                    <div class="behavior-icon">🛒</div>
                    <div class="behavior-content">
                        <h4>구매 패턴</h4>
                        <p>${customPersonaData.purchaseChannel}를 주요 구매 채널로 활용하며, ${customPersonaData.decisionFactor}를 가장 중요한 구매 결정 요인으로 고려합니다.</p>
                    </div>
                </div>
                <div class="behavior-item">
                    <div class="behavior-icon">💰</div>
                    <div class="behavior-content">
                        <h4>가격 민감도</h4>
                        <p>${customPersonaData.priceRange} 가격대를 선호하며, ${customPersonaData.consumer.premium}의 프리미엄 지불 의향을 보입니다.</p>
                    </div>
                </div>
                <div class="behavior-item">
                    <div class="behavior-icon">🎯</div>
                    <div class="behavior-content">
                        <h4>라이프스타일</h4>
                        <p>${customPersonaData.lifestyle} 라이프스타일을 가진 소비자로, 이에 맞는 제품과 서비스를 선호합니다.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="report-section">
            <div class="report-title">💡 마케팅 전략 제안</div>
            <div class="strategy-suggestions">
                <div class="strategy-item">
                    <h4>📱 채널 전략</h4>
                    <p>${customPersonaData.purchaseChannel} 중심의 마케팅 채널 구축</p>
                </div>
                <div class="strategy-item">
                    <h4>🎨 메시지 전략</h4>
                    <p>${customPersonaData.decisionFactor}를 강조한 브랜드 메시지 개발</p>
                </div>
                <div class="strategy-item">
                    <h4>💰 가격 전략</h4>
                    <p>${customPersonaData.priceRange} 가격대에 최적화된 제품 라인업 구성</p>
                </div>
            </div>
        </div>
    `;
}

// 상세 리포트 모달 표시 함수 (사용자 정의 페르소나용)
function showDetailReportModal(content, title) {
    const modal = document.getElementById('reportModal');
    const modalTitle = document.querySelector('#reportModal .modal-header h2');
    const modalBody = document.querySelector('#reportModal .modal-body');
    
    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.style.display = 'block';
    }
}



// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    updateStepIndicator();
});

// 사업 적합도 평가 함수
function evaluateBusinessSuitability() {
    // 폼 데이터 수집 - 지원자 정보 단계의 select 요소들을 정확히 찾기
    const selects = document.querySelectorAll('#content2 select');
    const region = selects[0] ? selects[0].value : '서울';
    const item = selects[1] ? selects[1].value : '화장품/뷰티';
    const capability = selects[2] ? selects[2].value : '디자인 전공/경력 있음';
    const stage = selects[3] ? selects[3].value : '아이디어 단계';
    
    // 평가 점수 계산
    const evaluation = calculateEvaluation(region, item, capability, stage);
    
    // 모달에 결과 표시
    showEvaluationResult(evaluation);
}

// 평가 점수 계산 함수
function calculateEvaluation(region, item, capability, stage) {
    const regionData = evaluationData.regions[region] || evaluationData.regions['서울'];
    const itemData = evaluationData.items[item] || evaluationData.items['화장품/뷰티'];
    const capabilityScore = evaluationData.capabilities[capability] || 50;
    const stageScore = evaluationData.stages[stage] || 30;
    
    // 지역 적합도 (25점)
    const regionScore = Math.round((regionData.marketSize + regionData.customerDensity - regionData.competition) / 3);
    
    // 아이템 적합도 (25점)
    const itemScore = Math.round((itemData.growth + itemData.profitability - itemData.barrier) / 3);
    
    // 개인 역량 적합도 (30점)
    const capabilityScoreFinal = Math.round(capabilityScore * 0.3);
    
    // 시장 타이밍 (20점)
    const timingScore = Math.round(stageScore * 0.2);
    
    const totalScore = regionScore + itemScore + capabilityScoreFinal + timingScore;
    
    return {
        totalScore: Math.min(100, Math.max(0, totalScore)),
        regionScore: regionScore,
        itemScore: itemScore,
        capabilityScore: capabilityScoreFinal,
        timingScore: timingScore,
        region: region,
        item: item,
        capability: capability,
        stage: stage,
        grade: getGrade(totalScore),
        details: {
            region: regionData,
            item: itemData
        }
    };
}

// 등급 계산 함수
function getGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    return 'C';
}

// 평가 결과 표시 함수
function showEvaluationResult(evaluation) {
    const modal = document.getElementById('evaluationModal');
    const body = document.getElementById('evaluationBody');
    
    const gradeColor = {
        'A+': '#10b981',
        'A': '#059669',
        'B+': '#f59e0b',
        'B': '#d97706',
        'C': '#dc2626'
    };
    
    const gradeText = {
        'A+': '매우 적합 - 즉시 사업 시작 권장',
        'A': '적합 - 사업 시작 가능',
        'B+': '보통 적합 - 추가 준비 필요',
        'B': '낮은 적합도 - 전략 수정 필요',
        'C': '부적합 - 다른 아이템 고려 권장'
    };
    
    body.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 4rem; margin-bottom: 10px;">📊</div>
            <div style="font-size: 3rem; font-weight: bold; color: ${gradeColor[evaluation.grade]}; margin-bottom: 10px;">
                ${evaluation.totalScore}점
            </div>
            <div style="font-size: 1.5rem; font-weight: bold; color: ${gradeColor[evaluation.grade]}; margin-bottom: 5px;">
                ${evaluation.grade} 등급
            </div>
            <div style="color: #64748b; font-size: 1rem;">
                ${gradeText[evaluation.grade]}
            </div>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b;">📋 평가 세부사항</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #4f46e5;">${evaluation.regionScore}</div>
                    <div style="font-size: 0.9rem; color: #64748b;">지역 적합도</div>
                    <div style="font-size: 0.8rem; color: #64748b;">${evaluation.region}</div>
                </div>
                <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #10b981;">${evaluation.itemScore}</div>
                    <div style="font-size: 0.9rem; color: #64748b;">아이템 적합도</div>
                    <div style="font-size: 0.8rem; color: #64748b;">${evaluation.item}</div>
                </div>
                <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #f59e0b;">${evaluation.capabilityScore}</div>
                    <div style="font-size: 0.9rem; color: #64748b;">개인 역량</div>
                    <div style="font-size: 0.8rem; color: #64748b;">${evaluation.capability}</div>
                </div>
                <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #dc2626;">${evaluation.timingScore}</div>
                    <div style="font-size: 0.9rem; color: #64748b;">시장 타이밍</div>
                    <div style="font-size: 0.8rem; color: #64748b;">${evaluation.stage}</div>
                </div>
            </div>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b;">💡 개선 제안</h3>
            ${generateImprovementSuggestions(evaluation)}
        </div>

        <div style="text-align: center;">
            <button class="btn" onclick="exportEvaluationToPDF()" style="margin-right: 10px;">
                📄 PDF 다운로드
            </button>
            <button class="btn-secondary" onclick="closeEvaluation()">
                닫기
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// 개선 제안 생성 함수
function generateImprovementSuggestions(evaluation) {
    let suggestions = '';
    
    if (evaluation.regionScore < 20) {
        suggestions += '<p style="margin: 0 0 10px 0; color: #374151;"><strong>📍 지역 전략:</strong> 경쟁이 치열한 지역입니다. 틈새시장 공략이나 차별화 전략을 고려해보세요.</p>';
    }
    
    if (evaluation.itemScore < 20) {
        suggestions += '<p style="margin: 0 0 10px 0; color: #374151;"><strong>🎨 아이템 전략:</strong> 진입장벽이 높은 분야입니다. 기술적 차별화나 협업 전략을 검토해보세요.</p>';
    }
    
    if (evaluation.capabilityScore < 20) {
        suggestions += '<p style="margin: 0 0 10px 0; color: #374151;"><strong>👤 역량 강화:</strong> 관련 분야 경험을 쌓거나 전문가와의 협업을 고려해보세요.</p>';
    }
    
    if (evaluation.timingScore < 15) {
        suggestions += '<p style="margin: 0 0 10px 0; color: #374151;"><strong>⏰ 타이밍:</strong> 사업 준비 단계가 초기입니다. 체계적인 사업계획 수립이 필요합니다.</p>';
    }
    
    if (evaluation.totalScore >= 80) {
        suggestions += '<p style="margin: 0 0 10px 0; color: #10b981;"><strong>🎉 우수한 적합도:</strong> 현재 조건에서 사업 시작이 가능합니다. 신속한 실행을 권장합니다.</p>';
    }
    
    return suggestions || '<p style="margin: 0; color: #64748b;">현재 조건에서 적절한 적합도를 보입니다. 지속적인 개선을 통해 더 나은 결과를 만들어보세요.</p>';
}

// 평가 모달 닫기 함수
function closeEvaluation() {
    document.getElementById('evaluationModal').style.display = 'none';
}

// 평가 결과 PDF 내보내기 함수
function exportEvaluationToPDF() {
    const evaluationBody = document.getElementById('evaluationBody');
    const content = evaluationBody.innerHTML;
    
    const pdfContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
            <h1 style="color: #1e293b; text-align: center; margin-bottom: 30px;">📊 사업 적합도 평가 리포트</h1>
            ${content}
            <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 0.9rem;">
                <p>생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
                <p>아이노유 지원도움 AI - 디자인진흥원 연계 서비스</p>
            </div>
        </div>
    `;
    
    const element = document.createElement('div');
    element.innerHTML = pdfContent;
    document.body.appendChild(element);
    
    const opt = {
        margin: 1,
        filename: '사업적합도평가_리포트.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element);
    });
} 