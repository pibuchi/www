let currentStep = 1;

function updateStepIndicator() {
    for (let i = 1; i <= 5; i++) {
        const stepElement = document.getElementById(`step${i}`);
        if (i < currentStep) {
            stepElement.className = 'step-number completed';
        } else if (i === currentStep) {
            stepElement.className = 'step-number active';
        } else {
            stepElement.className = 'step-number';
        }
    }
}

function showContent(step) {
    // 모든 콘텐츠 숨기기
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`content${i}`).classList.add('hidden');
        const result = document.getElementById(`result${i}`);
        if (result) result.classList.add('hidden');
    }
    document.getElementById('completion').classList.add('hidden');
    
    // 해당 단계 콘텐츠 보이기
    const content = document.getElementById(`content${step}`);
    if (content) content.classList.remove('hidden');
}

function nextStep(step) {
    if (step === 3) {
        // 상권 분석 단계에서 로딩 표시
        showLoading('상권 데이터를 분석중입니다...');
        setTimeout(() => {
            hideLoading();
            currentStep = step;
            updateStepIndicator();
            showContent(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 3000);
    } else if (step === 4) {
        // 아이템 최적화 단계에서 로딩 표시
        showLoading('아이템을 최적화하고 있습니다...');
        setTimeout(() => {
            hideLoading();
            currentStep = step;
            updateStepIndicator();
            showContent(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2500);
    } else if (step === 5) {
        // 지원사업 매칭 단계에서 로딩 표시
        showLoading('맞춤형 지원사업을 찾고 있습니다...');
        setTimeout(() => {
            hideLoading();
            currentStep = step;
            updateStepIndicator();
            showContent(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    } else {
        currentStep = step;
        updateStepIndicator();
        showContent(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevStep(step) {
    currentStep = step;
    updateStepIndicator();
    showContent(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function diagnose() {
    // 간단한 유효성 검사
    const businessIdea = document.getElementById('businessIdea').value;
    const experience = document.querySelector('input[name="experience"]:checked');
    const customer = document.querySelector('input[name="customer"]:checked');
    const location = document.getElementById('location').value;
    
    if (!businessIdea || !experience || !customer || !location) {
        alert('모든 항목을 입력해주세요.');
        return;
    }
    
    // 로딩 애니메이션 표시
    showLoading('창업자 역량을 분석중입니다...');
    
    setTimeout(() => {
        hideLoading();
        // 진단 결과 표시
        document.getElementById('content1').classList.add('hidden');
        document.getElementById('result1').classList.remove('hidden');
    }, 2000);
}

function showLoading(message) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 300px;">
                <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p style="font-size: 16px; color: #333;">${message}</p>
            </div>
        </div>
        <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        </style>
    `;
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

function showApplicationGuide() {
    // 지원사업 신청 가이드 표시
    document.getElementById('content5').classList.add('hidden');
    document.getElementById('applicationGuide').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showBusinessPlanForm(type) {
    // 사업계획서 작성 폼 표시
    document.getElementById('applicationGuide').classList.add('hidden');
    document.getElementById('businessPlanForm').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 지원사업 타입 저장
    window.currentBusinessPlanType = type;
}

function backToApplicationGuide() {
    // 지원사업 가이드로 돌아가기
    document.getElementById('businessPlanForm').classList.add('hidden');
    document.getElementById('applicationGuide').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateBusinessPlan() {
    // 필수 필드 검증
    const requiredFields = ['founderName', 'businessName', 'businessCategory', 'targetCustomer'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            missingFields.push(element.previousElementSibling.textContent);
        }
    });
    
    if (missingFields.length > 0) {
        alert(`다음 필드를 입력해주세요:\n${missingFields.join('\n')}`);
        return;
    }
    
    // AI 지원 사업계획서 작성 시작
    showLoading('AI가 분석 데이터를 활용하여 작성을 지원합니다...');
    
    setTimeout(() => {
        hideLoading();
        
        const type = window.currentBusinessPlanType;
        const templates = {
            'youth': '청년창업사관학교',
            'seoul': '서울시 청년창업지원', 
            'semas': '소상공인시장진흥공단'
        };
        
        // AI 지원 메시지 표시
        showAISupportMessage(type);
        
    }, 1500);
}

function showAISupportMessage(type) {
    const supportMessages = {
        'youth': {
            title: '🤖 AI 작성 지원 - 청년창업사관학교',
            content: `분석된 데이터를 바탕으로 AI가 다음과 같이 지원합니다:

📊 **데이터 기반 제안**
• 홍대 상권 내 25-32세 직장인 여성 타겟 밀도 68% 활용
• 기존 11개 카페 대비 '조용한 브런치' 포지셔닝 제안
• 월 2,800만원 매출 예측 근거 제시

✍️ **작성 가이드 제공**
• 사업계획서 각 섹션별 작성 팁
• 평가 기준별 강조 포인트 안내
• 차별화 전략 구체화 방법

💡 **실시간 피드백**
• 작성 중인 내용에 대한 즉시 피드백
• 개선점 및 보완 방안 제시
• 지원사업 맞춤 전략 제안`
        },
        'seoul': {
            title: '🤖 AI 작성 지원 - 서울시 청년창업지원',
            content: `분석된 데이터를 바탕으로 AI가 다음과 같이 지원합니다:

🏛️ **지역 기여도 강화**
• 홍대 예술문화와 브런치 카페의 시너지 효과
• 지역 청년층 고용 창출 계획 구체화
• 상권 활성화 기여 방안 제시

📝 **지원사업 맞춤 가이드**
• 서울시 청년창업지원 평가 기준별 작성법
• 지역 기여도 30점 만점 획득 전략
• 청년 고용 계획 25점 만점 획득 방안

🎯 **실시간 작성 지원**
• 각 섹션별 작성 진행도 체크
• 평가 기준별 점수 예측
• 개선점 및 보완 방안 제시`
        },
        'semas': {
            title: '🤖 AI 작성 지원 - 소상공인시장진흥공단',
            content: `분석된 데이터를 바탕으로 AI가 다음과 같이 지원합니다:

💰 **사업 타당성 강화**
• 상권분석 데이터 기반 사업 타당성 증명
• 경쟁업체 대비 우위 요소 구체화
• 보수적 매출 예측으로 신뢰성 확보

📋 **지원사업 맞춤 전략**
• 소상공인시장진흥공단 심사 기준별 작성법
• 사업 타당성 40점 만점 획득 전략
• 시장성 및 경쟁력 30점 만점 획득 방안

🤝 **실시간 멘토링**
• 작성 중인 내용에 대한 즉시 피드백
• 개선점 및 보완 방안 제시
• 지원사업별 맞춤 전략 제안`
        }
    };
    
    const message = supportMessages[type];
    
    // AI 지원 메시지 모달 표시
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.7); z-index: 1000; display: flex; 
        align-items: center; justify-content: center; padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 30px; max-width: 600px; 
                    max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #667eea;">${message.title}</h2>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
            </div>
            <div style="line-height: 1.8; color: #333;">
                ${message.content.replace(/\n/g, '<br>')}
            </div>
            <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                <button onclick="startAISupportedWriting('${type}')" 
                        style="background: #667eea; color: white; border: none; padding: 12px 24px; 
                               border-radius: 8px; cursor: pointer; font-weight: bold;">
                    AI 지원 작성 시작
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="background: #6c757d; color: white; border: none; padding: 12px 24px; 
                               border-radius: 8px; cursor: pointer;">
                    나중에 하기
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function startAISupportedWriting(type) {
    // 모달 닫기
    document.querySelector('div[style*="position: fixed"]').remove();
    
    // AI 지원 작성 모드 시작
    showLoading('AI 지원 작성 모드를 시작합니다...');
    
    setTimeout(() => {
        hideLoading();
        
        // 작성 지원 기능 활성화
        enableAIWritingSupport(type);
        
        alert(`AI 지원 작성 모드가 시작되었습니다!\n\n이제 사업계획서를 작성하시면 AI가 실시간으로 도움을 드립니다.\n\n작성 중 궁금한 점이 있으시면 "AI 도움 요청" 버튼을 클릭해주세요.`);
        
    }, 1000);
}

function enableAIWritingSupport(type) {
    // AI 도움 요청 버튼 추가
    const buttonGroup = document.querySelector('#businessPlanForm .button-group');
    const aiHelpButton = document.createElement('button');
    aiHelpButton.className = 'btn btn-secondary';
    aiHelpButton.style.marginRight = '10px';
    aiHelpButton.innerHTML = '🤖 AI 도움 요청';
    aiHelpButton.onclick = () => requestAIHelp(type);
    
    buttonGroup.insertBefore(aiHelpButton, buttonGroup.firstChild);
    
    // 작성 완료 버튼으로 변경
    const completeButton = buttonGroup.querySelector('.btn-primary');
    completeButton.innerHTML = '✅ 작성 완료';
    completeButton.onclick = () => completeBusinessPlanWriting();
    
    // 실시간 피드백 기능 활성화
    const formInputs = document.querySelectorAll('#businessPlanForm input, #businessPlanForm textarea, #businessPlanForm select');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            setTimeout(() => provideRealTimeFeedback(input, type), 500);
        });
    });
}

function requestAIHelp(type) {
    const helpMessages = {
        'youth': [
            '💡 사업계획서 1페이지에 "홍대 상권 내 25-32세 직장인 여성 타겟 밀도 68%"라는 구체적 데이터를 포함하세요.',
            '🎯 차별화 전략 섹션에서 "기존 11개 카페 대비 조용한 브런치 포지셔닝"을 강조하세요.',
            '📊 예상 매출 근거에서 "상권분석 기반 월 2,800만원"이라고 구체적으로 명시하세요.'
        ],
        'seoul': [
            '🏛️ 지역 기여도 섹션에서 "홍대 예술문화와 브런치 카페의 시너지"를 강조하세요.',
            '👥 청년 고용 계획에서 "타겟 고객층과 일치하는 직원 채용"을 구체적으로 제시하세요.',
            '🌆 상권 활성화 기여도에서 "독서존으로 체류시간 증가 → 주변 상권 긍정적 영향"을 설명하세요.'
        ],
        'semas': [
            '💰 사업 타당성에서 "상권분석 데이터 기반"이라는 구체적 근거를 제시하세요.',
            '📈 경쟁력 분석에서 "기존 카페 대비 차별화 요소"를 명확히 구분하세요.',
            '📊 매출 예측에서 "보수적 접근으로 신뢰성 확보"를 강조하세요.'
        ]
    };
    
    const randomHelp = helpMessages[type][Math.floor(Math.random() * helpMessages[type].length)];
    
    alert(`🤖 AI 도움말:\n\n${randomHelp}\n\n이 팁을 참고하여 작성해보세요!`);
}

function provideRealTimeFeedback(input, type) {
    const value = input.value.trim();
    if (!value) return;
    
    // 특정 필드에 대한 피드백 제공
    const feedbackMap = {
        'businessSummary': {
            'youth': '💡 사업 개요에 "데이터 기반 타겟 고객 분석"을 포함하면 좋겠습니다.',
            'seoul': '💡 지역 기여도와 청년 고용 계획을 언급하면 좋겠습니다.',
            'semas': '💡 사업 타당성과 차별화 요소를 강조하면 좋겠습니다.'
        },
        'targetCustomer': {
            'youth': '✅ 구체적인 타겟 고객층이 잘 정의되었습니다.',
            'seoul': '✅ 지역 청년층과 연관된 타겟이 잘 설정되었습니다.',
            'semas': '✅ 시장 분석 기반 타겟이 잘 정의되었습니다.'
        },
        'businessStrategy': {
            'youth': '💡 차별화 전략과 데이터 기반 근거를 더 구체화하면 좋겠습니다.',
            'seoul': '💡 지역 기여도와 청년 고용 계획을 더 상세히 설명하면 좋겠습니다.',
            'semas': '💡 사업 타당성과 경쟁력 요소를 더 강조하면 좋겠습니다.'
        }
    };
    
    const fieldFeedback = feedbackMap[input.id];
    if (fieldFeedback && fieldFeedback[type]) {
        // 실시간 피드백 표시 (선택적)
        if (Math.random() < 0.3) { // 30% 확률로 피드백 표시
            const feedbackDiv = document.createElement('div');
            feedbackDiv.style.cssText = `
                background: #e8f5e8; border-left: 4px solid #28a745; padding: 10px; 
                margin: 5px 0; border-radius: 4px; font-size: 14px; color: #2e7d32;
            `;
            feedbackDiv.innerHTML = `🤖 ${fieldFeedback[type]}`;
            
            input.parentNode.appendChild(feedbackDiv);
            
            // 5초 후 피드백 제거
            setTimeout(() => feedbackDiv.remove(), 5000);
        }
    }
}

function completeBusinessPlanWriting() {
    const type = window.currentBusinessPlanType;
    const templates = {
        'youth': '청년창업사관학교',
        'seoul': '서울시 청년창업지원', 
        'semas': '소상공인시장진흥공단'
    };
    
    // 작성 완료 메시지
    const completionMessage = `🎉 AI 지원 사업계획서 작성이 완료되었습니다!

📋 **작성된 내용 요약**
• 기본 정보 및 사업 개요
• 시장 분석 및 타겟 고객 분석  
• 사업 계획 및 재무 계획
• ${templates[type]} 지원사업 맞춤 전략

🤖 **AI 지원 내용**
• 분석된 데이터 기반 작성 가이드 제공
• 실시간 피드백 및 개선점 제시
• 지원사업별 맞춤 전략 제안

📄 **다음 단계**
• 작성된 내용을 검토하고 최종 완성
• 지원사업 신청서와 함께 제출 준비
• 필요시 전문가 검토 의뢰

실제 서비스에서는 작성된 내용을 PDF로 다운로드할 수 있습니다.`;
    
    alert(completionMessage);
    
    // 완료 화면으로 이동
    document.getElementById('businessPlanForm').classList.add('hidden');
    document.getElementById('completion').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDetailGuide(type) {
    const guides = {
        'youth': `청년창업사관학교 상세 가이드:
        
📋 필수 제출 서류
• 사업계획서 (20페이지 이내)
• 페르소나 분석 보고서
• 상권분석 자료
• 예상 매출 시뮬레이션

🎯 평가 기준 (100점 만점)
• 사업 아이디어 독창성 (25점)
• 시장분석 및 고객분석 (25점)
• 사업화 가능성 (25점)
• 팀 역량 (25점)

💡 합격 TIP
• 데이터 기반 근거 제시 필수
• 차별화 포인트 구체적 서술
• 3년간 사업 로드맵 상세 작성`,
        
        'seoul': `서울시 청년창업지원 상세 가이드:
        
📋 신청 자격
• 만 18~39세 서울시 거주자
• 창업 3년 이내 또는 예비창업자
• 서울시 내 사업장 소재

🎯 평가 기준
• 지역 기여도 (30점)
• 사업 계획 (25점)  
• 청년 고용 계획 (25점)
• 혁신성 (20점)

💡 합격 TIP
• 홍대 문화와 연계성 강조
• 지역 청년 고용 계획 구체화
• 상권 활성화 기여 방안 제시`,
        
        'semas': `소상공인시장진흥공단 상세 가이드:
        
📋 지원 내용
• 창업자금: 최대 1,000만원
• 교육 지원: 40시간 창업교육 필수
• 멘토링: 6개월간 전문가 지원

🎯 심사 기준
• 사업 타당성 (40점)
• 시장성 및 경쟁력 (30점)
• 운영 계획 (20점)
• 자금 계획 (10점)

💡 합격 TIP
• 상권분석 데이터 풍부하게 제시
• 경쟁업체 대비 우위 요소 명확화
• 보수적 매출 예측으로 신뢰성 확보`
    };
    
    alert(guides[type]);
}

function completePlan() {
    // 완료 화면 표시
    document.getElementById('applicationGuide').classList.add('hidden');
    document.getElementById('completion').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    updateStepIndicator();
    showContent(1);
    
    // 반응형 처리
    window.addEventListener('resize', function() {
        // 필요시 반응형 로직 추가
    });
}); 