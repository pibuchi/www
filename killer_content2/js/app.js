// 네비게이션 기능
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const progressSteps = document.querySelectorAll('.progress-step');
const progressDividers = document.querySelectorAll('.progress-divider');

// 초기 로드 시 1단계 표시
document.addEventListener('DOMContentLoaded', () => {
    console.log('i know you AI 앱 시작...');
    showSection('item-selection');
    initAllModules();
    console.log('모든 모듈 초기화 완료');
});

navItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 활성 상태 변경
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // 해당 섹션 표시
        const targetSection = item.getAttribute('data-section');
        showSection(targetSection);
        
        // 진행 단계 업데이트
        updateProgressSteps(targetSection);
    });
});

function updateNavigation(activeSectionId) {
    // 모든 네비게이션 아이템 비활성화
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 활성화된 섹션에 해당하는 네비게이션 아이템 활성화
    const activeNavItem = document.querySelector(`[data-section="${activeSectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // 진행 단계 업데이트
    updateProgressSteps(activeSectionId);
}

function updateProgressSteps(activeSectionId) {
    const sections = [
        'item-selection',
        'market-analysis', 
        'competition-analysis',
        'trend-analysis',
        'target-selection',
        'positioning',
        'marketing-strategy',
        'implementation'
    ];
    
    const currentStep = sections.indexOf(activeSectionId) + 1;
    
    // 모든 진행 단계 초기화
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('current', 'completed');
        if (index + 1 < currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('current');
        }
    });

    progressDividers.forEach((divider, index) => {
        divider.classList.remove('completed');
        if (index < currentStep - 1) { // 현재 단계 이전까지 완료로 표시
            divider.classList.add('completed');
        }
    });
}

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

// 네비게이션 초기화
function initNavigation() {
    console.log('네비게이션 초기화');
    // 네비게이션은 이미 DOMContentLoaded에서 설정됨
}

// 진행 단계 초기화
function initProgress() {
    console.log('진행 단계 초기화');
    // 초기 진행 단계 설정
    updateProgressSteps('item-selection');
}

// 사용자 액션 버튼 기능
function initUserActions() {
    const mypageBtn = document.querySelector('.user-action-btn.mypage');
    const logoutBtn = document.querySelector('.user-action-btn.logout');
    
    if (mypageBtn) {
        mypageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('마이페이지로 이동합니다.');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('정말 로그아웃 하시겠습니까?')) {
                alert('로그아웃되었습니다.');
            }
        });
    }
}

// 애니메이션 효과
function initAnimations() {
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

// 모든 모듈 초기화
function initAllModules() {
    console.log('모든 모듈 초기화 시작');
    
    initNavigation();
    initProgress();
    initUserActions();
    initAnimations();
    initSidebarToggle();
    initMobileMenu();
    
    // 각 단계별 모듈 초기화
    initItemSelection();
    initMarketAnalysis();
    initCompetitionAnalysis();
    initTrendAnalysis();
    initTargetSelection();
    initPositioning();
    initMarketingStrategy();
    initImplementation();
    
    console.log('모든 모듈 초기화 완료');
}

// 1단계: 아이템 선정 및 기본 분석
function initItemSelection() {
    console.log('1단계 모듈 초기화');
    
    // 분석 시작하기 버튼
    const startAnalysisBtn = document.querySelector('#startAnalysisBtn');
    if (startAnalysisBtn) {
        startAnalysisBtn.addEventListener('click', () => {
            startItemAnalysis();
        });
    }
    
    // 유사 창업아이템 검색 버튼
    const searchSimilarItemsBtn = document.querySelector('#searchSimilarItems');
    if (searchSimilarItemsBtn) {
        searchSimilarItemsBtn.addEventListener('click', () => {
            searchSimilarStartupItems();
        });
    }
    
    // AI 추천 선택 버튼들
    const selectBtns = document.querySelectorAll('#item-selection .select-btn');
    selectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectRecommendation(btn);
        });
    });
    
    // 분석 카드들에 클릭 이벤트 추가
    const analysisCards = document.querySelectorAll('#item-selection .analysis-card');
    analysisCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showItemAnalysisStep(index);
        });
    });
    
    // 폼 입력값 변경 감지
    const startupItemInput = document.querySelector('#startupItem');
    
    if (startupItemInput) {
        startupItemInput.addEventListener('input', updateProjectInfo);
        
        // 포커스 이벤트 추가
        startupItemInput.addEventListener('focus', function() {
            if (this.value === '') {
                this.style.borderColor = '#4285f4';
                this.style.boxShadow = '0 0 0 3px rgba(66, 133, 244, 0.1)';
            }
        });
        
        // 블러 이벤트 추가
        startupItemInput.addEventListener('blur', function() {
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
            
            // 입력값이 없으면 경고 표시
            if (this.value.trim() === '') {
                this.style.borderColor = '#ea4335';
                this.style.boxShadow = '0 0 0 3px rgba(234, 67, 53, 0.1)';
            }
        });
        
        // 키보드 이벤트 추가 (Enter 키로 검색 실행)
        startupItemInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchSimilarStartupItems();
            }
        });
    }
}

function searchSimilarStartupItems() {
    const startupItem = document.querySelector('#startupItem').value;
    
    if (!startupItem.trim()) {
        alert('창업 아이템을 입력해주세요.');
        return;
    }
    
    // 로딩 상태 표시
    const searchBtn = document.querySelector('#searchSimilarItems');
    const originalText = searchBtn.innerHTML;
    searchBtn.innerHTML = '<span class="search-icon">⏳</span> 검색 중...';
    searchBtn.disabled = true;
    
    // AI 검색 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
        showAIRecommendations();
        searchBtn.innerHTML = originalText;
        searchBtn.disabled = false;
    }, 2000);
}

function showAIRecommendations() {
    const aiRecommendations = document.querySelector('#aiRecommendations');
    if (aiRecommendations) {
        aiRecommendations.style.display = 'block';
        aiRecommendations.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function selectRecommendation(btn) {
    const category = btn.getAttribute('data-category');
    const score = btn.getAttribute('data-score');
    
    // 모든 선택 버튼 초기화
    document.querySelectorAll('#item-selection .select-btn').forEach(b => {
        b.classList.remove('selected');
        b.textContent = '선택';
    });
    
    // 선택된 버튼 활성화
    btn.classList.add('selected');
    btn.textContent = '선택됨';
    
    // 창업 아이템 업데이트
    const startupItemInput = document.querySelector('#startupItem');
    if (startupItemInput) {
        startupItemInput.value = category;
    }
    
    // 선택된 카테고리에 따른 아이템 기본 정보 업데이트 및 표시
    updateItemBasicInfo(category);
    
    // 성공 메시지
    alert(`"${category}" 카테고리가 선택되었습니다!\n\n유사도: ${score}\n\n이제 해당 카테고리로 시장 분석을 진행할 수 있습니다.`);
    
    // 아이템 기본 정보 섹션으로 스크롤
    const itemBasicInfo = document.querySelector('#itemBasicInfo');
    if (itemBasicInfo) {
        itemBasicInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function updateItemBasicInfo(selectedCategory) {
    const itemBasicInfo = document.querySelector('#itemBasicInfo');
    const marketChartsSection = document.querySelector('#marketChartsSection');
    
    if (!itemBasicInfo || !marketChartsSection) return;
    
    // 카테고리별 정보 매핑
    const categoryInfo = {
        'AI 피부 분석기': {
            productName: 'AI 스마트 피부 분석기 + 홈케어 디바이스',
            category: '뷰티테크 / 홈케어 디바이스',
            target: '20-30대 여성 (주요: 25-35세)',
            price: '15만원 ~ 35만원',
            features: 'AI 피부 분석, 맞춤형 케어 추천, 홈케어 디바이스 연동'
        },
        '홈케어 로봇': {
            productName: 'AI 홈케어 로봇 + 스마트 관리 시스템',
            category: 'IoT / 스마트홈 / 로봇',
            target: '30-50대 가족 (주요: 35-45세)',
            price: '50만원 ~ 150만원',
            features: '자동 청소, 환경 모니터링, AI 기반 최적화, 모바일 앱 연동'
        },
        '건강 모니터링': {
            productName: '웨어러블 건강 모니터링 디바이스',
            category: '헬스케어 / 웨어러블 / IoT',
            target: '20-60대 건강관심층 (주요: 30-50세)',
            price: '8만원 ~ 25만원',
            features: '생체신호 측정, AI 건강 분석, 개인화 케어 추천, 클라우드 연동'
        }
    };
    
    // 선택된 카테고리의 정보 가져오기
    const info = categoryInfo[selectedCategory] || categoryInfo['AI 피부 분석기'];
    
    // 정보 업데이트
    document.querySelector('#selectedProductName').textContent = info.productName;
    document.querySelector('#selectedCategory').textContent = info.category;
    document.querySelector('#selectedTarget').textContent = info.target;
    document.querySelector('#selectedPrice').textContent = info.price;
    document.querySelector('#selectedFeatures').textContent = info.features;
    
    // 아이템 기본 정보 섹션 표시
    itemBasicInfo.style.display = 'block';
    
    // 시장 분석 차트 섹션 표시
    marketChartsSection.style.display = 'block';
    
    // 애니메이션 효과 추가
    itemBasicInfo.style.opacity = '0';
    itemBasicInfo.style.transform = 'translateY(20px)';
    marketChartsSection.style.opacity = '0';
    marketChartsSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        itemBasicInfo.style.transition = 'all 0.5s ease';
        itemBasicInfo.style.opacity = '1';
        itemBasicInfo.style.transform = 'translateY(0)';
        
        marketChartsSection.style.transition = 'all 0.5s ease';
        marketChartsSection.style.opacity = '1';
        marketChartsSection.style.transform = 'translateY(0)';
    }, 100);
    
    // 차트 애니메이션 추가
    setTimeout(() => {
        animateCharts();
    }, 600);
}

function animateCharts() {
    // 타겟 분석 차트 애니메이션
    const targetBars = document.querySelectorAll('.chart-bar-fill');
    targetBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.width = bar.style.width;
        }, index * 200);
    });
    
    // 가격대 차트 애니메이션
    const priceFills = document.querySelectorAll('.price-fill');
    priceFills.forEach((fill, index) => {
        setTimeout(() => {
            fill.style.width = fill.style.width;
        }, index * 150);
    });
    
    // 시장 규모 차트 애니메이션
    const sizeFills = document.querySelectorAll('.size-fill');
    sizeFills.forEach((fill, index) => {
        setTimeout(() => {
            fill.style.width = fill.style.width;
        }, index * 300);
    });
    
    // 경쟁사 차트 애니메이션
    const competitorFills = document.querySelectorAll('.competitor-fill');
    competitorFills.forEach((fill, index) => {
        setTimeout(() => {
            fill.style.width = fill.style.width;
        }, index * 200);
    });
}

function updateProjectInfo() {
    const startupItem = document.querySelector('#startupItem').value;
    
    // 프로젝트 정보를 로컬 스토리지에 저장
    const projectInfo = {
        startupItem,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('startupProjectInfo', JSON.stringify(projectInfo));
    
    // 실시간 유효성 검사
    validateProjectInfo();
}

function validateProjectInfo() {
    const startupItem = document.querySelector('#startupItem').value;
    
    let isValid = true;
    
    if (!startupItem.trim()) {
        isValid = false;
    }
    
    // 검색 버튼 활성화/비활성화
    const searchBtn = document.querySelector('#searchSimilarItems');
    if (searchBtn) {
        searchBtn.disabled = !isValid;
        searchBtn.style.opacity = isValid ? '1' : '0.6';
    }
    
    return isValid;
}

function startItemAnalysis() {
    if (!validateProjectInfo()) {
        alert('창업 아이템을 입력해주세요.');
        return;
    }
    
    const startupItem = document.querySelector('#startupItem').value;
    alert(`"${startupItem}" 아이템으로 AI 분석을 시작합니다!\n\n다음 단계로 진행하시겠습니까?`);
    
    // 다음 단계로 이동
    const nextSection = document.querySelector('#market-analysis');
    if (nextSection) {
        // 현재 단계 비활성화
        document.querySelector('#item-selection').classList.remove('active');
        // 다음 단계 활성화
        nextSection.classList.add('active');
        
        // 네비게이션 업데이트
        updateNavigation('market-analysis');
        
        // 스크롤
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showItemAnalysisStep(stepIndex) {
    const stepTitles = ['아이템 정보 입력', '시장 기본 정보', '초기 데이터 수집'];
    alert(`${stepTitles[stepIndex]} 상세 내용을 표시합니다...`);
}

// 2단계: 시장 환경 분석
function initMarketAnalysis() {
    console.log('2단계 모듈 초기화');
    
    const actionButton = document.querySelector('#market-analysis .action-button');
    if (actionButton) {
        actionButton.addEventListener('click', () => {
            showMarketData();
        });
    }

    // 상세분석 카드 클릭 이벤트
    const gptCards = document.querySelectorAll('#market-analysis .gpt-card');
    
    gptCards.forEach(card => {
        const targetId = card.getAttribute('data-target');
        if (targetId) {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                showMarketAnalysisDetails(targetId);
            });
        }
    });
}

function showMarketData() {
    alert('시장 데이터를 분석 중입니다...');
}

function showMarketAnalysisDetails(targetId) {
    const targetCard = document.getElementById(targetId);
    if (targetCard) {
        targetCard.classList.add('active');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// 3단계: 경쟁 환경 분석
function initCompetitionAnalysis() {
    console.log('3단계 모듈 초기화');
    
    const actionButton = document.querySelector('#competition-analysis .action-button');
    if (actionButton) {
        actionButton.addEventListener('click', () => {
            showCompetitorAnalysis();
        });
    }

    // 상세분석 카드 클릭 이벤트
    const gptCards = document.querySelectorAll('#competition-analysis .gpt-card');
    
    gptCards.forEach(card => {
        const targetId = card.getAttribute('data-target');
        if (targetId) {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                showCompetitionAnalysisDetails(targetId);
            });
        }
    });
}

function showCompetitorAnalysis() {
    alert('경쟁사 분석 데이터를 불러오는 중입니다...');
}

function showCompetitionAnalysisDetails(targetId) {
    const targetCard = document.getElementById(targetId);
    if (targetCard) {
        targetCard.classList.add('active');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// 4단계: 트렌드 및 기회 분석
function initTrendAnalysis() {
    console.log('4단계 모듈 초기화');
    
    const actionButton = document.querySelector('#trend-analysis .action-button');
    if (actionButton) {
        actionButton.addEventListener('click', () => {
            showTrendData();
        });
    }

    // 상세분석 카드 클릭 이벤트
    const gptCards = document.querySelectorAll('#trend-analysis .gpt-card');
    
    gptCards.forEach(card => {
        const targetId = card.getAttribute('data-target');
        if (targetId) {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                showTrendAnalysisDetails(targetId);
            });
        }
    });
}

function showTrendData() {
    alert('트렌드 분석 데이터를 불러오는 중입니다...');
}

function showTrendAnalysisDetails(targetId) {
    const targetCard = document.getElementById(targetId);
    if (targetCard) {
        targetCard.classList.add('active');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// 5단계: 타겟 시장 선정 초기화
function initTargetSelection() {
    console.log('타겟 시장 선정 초기화');
    
    // gpt-card 클릭 이벤트 추가
    const targetCards = document.querySelectorAll('#target-selection .gpt-card[data-target]');
    console.log('타겟 카드 개수:', targetCards.length);
    
    targetCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            console.log('클릭된 카드:', targetId);
            showTargetSelectionDetails(targetId);
        });
    });

    // 닫기 버튼 이벤트 추가
    const closeButtons = document.querySelectorAll('#target-selection .close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-close-target');
            console.log('닫기 버튼 클릭:', targetId);
            closeCard(targetId);
        });
    });
}

// 타겟 시장 선정 상세분석 표시
function showTargetSelectionDetails(targetId) {
    console.log('상세분석 표시:', targetId);
    
    // 모든 expanded-card 숨기기
    const allCards = document.querySelectorAll('#target-selection .expanded-card');
    console.log('확장 카드 개수:', allCards.length);
    
    allCards.forEach(card => {
        console.log('확장 카드 ID:', card.id);
        card.classList.remove('active');
        console.log('카드 숨김:', card.id);
    });
    
    // 선택된 카드만 표시
    const targetCard = document.getElementById(targetId);
    if (targetCard) {
        targetCard.classList.add('active');
        console.log('카드 표시:', targetId);
        
        // 애니메이션 효과 추가
        setTimeout(() => {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    } else {
        console.error('타겟 카드를 찾을 수 없음:', targetId);
        console.log('사용 가능한 카드들:');
        allCards.forEach(card => {
            console.log('-', card.id);
        });
    }
}

// 6단계: 포지셔닝 전략
function initPositioning() {
    console.log('6단계 모듈 초기화');
    
    // 포지셔닝 전략 버튼
    const showPositioningDetailsBtn = document.querySelector('#showPositioningDetails');
    if (showPositioningDetailsBtn) {
        showPositioningDetailsBtn.addEventListener('click', () => {
            showPositioningDetails();
        });
    }
    
    // 카드 클릭 이벤트
    const gptCards = document.querySelectorAll('#positioning .gpt-card');
    gptCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const target = card.getAttribute('data-target');
            
            // 모든 확장 카드 닫기
            document.querySelectorAll('#positioning .expanded-card').forEach(expandedCard => {
                expandedCard.classList.remove('active');
            });
            
            // 클릭된 카드만 열기
            const targetCard = document.getElementById(target);
            if (targetCard) {
                targetCard.classList.add('active');
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
    
    // 닫기 버튼 이벤트
    document.querySelectorAll('#positioning .close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cardId = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
            closeCard(cardId);
        });
    });
}

function showPositioningDetails() {
    alert('포지셔닝 전략 상세 내용을 확인하세요!\n\n각 카드를 클릭하면 상세 분석을 볼 수 있습니다.');
}

function closeCard(cardId) {
    console.log('카드 닫기:', cardId);
    const card = document.getElementById(cardId);
    if (card) {
        card.classList.remove('active');
        console.log('카드 닫힘:', cardId);
    } else {
        console.error('닫을 카드를 찾을 수 없음:', cardId);
    }
}

// 7단계: 통합 마케팅 전략
function initMarketingStrategy() {
    console.log('7단계 모듈 초기화');
    
    const actionButton = document.querySelector('#marketing-strategy .action-button');
    if (actionButton) {
        actionButton.addEventListener('click', () => {
            showMarketingStrategy();
        });
    }
}

function showMarketingStrategy() {
    alert('마케팅 전략을 분석 중입니다...');
}

// 8단계: 실행 계획 및 성과 지표
function initImplementation() {
    console.log('8단계 모듈 초기화');
    
    const analysisCards = document.querySelectorAll('#implementation .analysis-card');
    analysisCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showImplementationDetails(index);
        });
    });
}

function showImplementationDetails(cardIndex) {
    const cardTitles = ['실행 로드맵', '성과 지표 (KPI)', '리스크 관리'];
    alert(`${cardTitles[cardIndex]} 상세 내용을 표시합니다...`);
}

// 사이드바 토글 초기화
function initSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    // 사이드바 토글 버튼 클릭 시
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        
        // 로컬 스토리지에 상태 저장
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    });
    
    // 페이지 로드 시 이전 상태 복원
    const wasCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (wasCollapsed) {
        sidebar.classList.add('collapsed');
    }
}

// 모바일 메뉴 초기화
function initMobileMenu() {
    const mobileHamburger = document.getElementById('mobileHamburger');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-sections a[data-section]');

    // 모바일 햄버거 아이콘 클릭 시 메뉴 열기
    mobileHamburger.addEventListener('click', function() {
        openMobileMenu();
    });

    // 닫기 버튼 클릭 시 메뉴 닫기
    closeMobileMenuBtn.addEventListener('click', function() {
        closeMobileMenu();
    });

    // 오버레이 클릭 시 메뉴 닫기
    mobileMenuOverlay.addEventListener('click', function(e) {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });

    // ESC 키로 메뉴 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // 모바일 메뉴 링크 클릭 시 해당 섹션으로 이동하고 메뉴 닫기
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            if (targetSection) {
                showSection(targetSection);
                closeMobileMenu();
            }
        });
    });
}

// 모바일 메뉴 열기
function openMobileMenu() {
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
}

// 모바일 메뉴 닫기
function closeMobileMenu() {
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // 스크롤 복원
}
