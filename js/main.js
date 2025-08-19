// =========================
// 메인 초기화 스크립트
// =========================

/**
 * 애플리케이션 초기화
 */
function initializeApp() {
    console.log('에스노그라피 플랫폼 초기화 중...');
    
    // 데이터 로드
    loadDataFromStorage();
    
    // UI 설정
    setupNavigation();
    setupTagInput();
    setupPhotoUpload();
    
    // 현재 시간 설정
    setCurrentTime();
    
    // 통계 및 목록 업데이트
    updateStats();
    updateAllLists();
    
    // 반응형 처리
    handleResize();
    
    console.log('초기화 완료');
}

/**
 * 페이지 로드 시 초기화
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeApp();
        showSaveStatus('에스노그라피 플랫폼이 준비되었습니다.');
    } catch (error) {
        console.error('초기화 중 오류:', error);
        showError('플랫폼 초기화 중 오류가 발생했습니다.');
    }
});

/**
 * 페이지 언로드 시 데이터 저장
 */
window.addEventListener('beforeunload', function() {
    saveDataToStorage();
});

/**
 * 전역 에러 처리
 */
window.addEventListener('error', function(e) {
    console.error('전역 에러:', e.error);
    showError('예상치 못한 오류가 발생했습니다.');
});

// 개발용 전역 함수들 (프로덕션에서는 제거)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugEthnography = {
        getData: () => researchData,
        clearData: clearAllData,
        exportData: exportAllData,
        importData: importData,
        generateSampleData: generateSampleData
    };
}

/**
 * 샘플 데이터 생성 (개발/테스트용)
 */
function generateSampleData() {
    const sampleData = {
        observations: [
            {
                notes: "사용자가 스마트폰을 자주 확인하는 행동을 관찰함. 약 3분마다 한 번씩 화면을 켜서 확인",
                location: "카페 A",
                time: "2024-01-15T10:30:00",
                tags: ["스마트폰", "반복행동", "주의분산"]
            }
        ],
        interviews: [
            {
                guide: "일상에서 기술 사용에 대해 어떻게 생각하시나요?",
                transcript: "음... 스마트폰 없이는 살 수 없을 것 같아요. 하루에도 몇 번씩 확인하게 되더라고요.",
                participant: "P001",
                themes: "기술 의존성, 습관적 사용"
            }
        ],
        ideas: [
            {
                title: "스마트폰 사용량 알림 기능",
                description: "사용자가 과도하게 스마트폰을 사용할 때 알림을 주는 기능",
                category: "개선 아이디어",
                priority: "높음"
            }
        ]
    };
    
    Object.keys(sampleData).forEach(type => {
        sampleData[type].forEach(item => {
            if (type === 'observations') addObservation(item);
            else if (type === 'interviews') addInterview(item);
            else if (type === 'ideas') addIdea(item);
        });
    });
    
    updateStats();
    updateAllLists();
    showSaveStatus('샘플 데이터가 생성되었습니다.');
}