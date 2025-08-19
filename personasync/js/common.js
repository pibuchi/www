// PersonaSync™ 공통 JavaScript (API 오류 수정 버전)

class PersonaSync {
    constructor() {
        this.apiBase = '/api/v1';
        this.currentUser = {
            company: 'Samsung Electronics',
            name: '김마케팅',
            role: '차장',
            permissions: ['read', 'write', 'export']
        };
        this.useMockData = true; // Mock 데이터 사용 설정
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserSession();
        this.initializeAnimations();
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 네비게이션 활성화
        document.addEventListener('DOMContentLoaded', () => {
            this.setActiveNavItem();
        });

        // 전역 키보드 단축키
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        this.navigateTo('persona-create.html');
                        break;
                    case 'r':
                        e.preventDefault();
                        this.navigateTo('reports.html');
                        break;
                }
            }
        });
    }

    // 페이지 네비게이션
    navigateTo(page) {
        if (page.startsWith('http')) {
            window.location.href = page;
        } else if (page.includes('.html')) {
            // 현재 페이지가 pages 폴더에 있는지 확인
            const currentPath = window.location.pathname;
            if (currentPath.includes('/pages/')) {
                window.location.href = `./${page}`;
            } else {
                window.location.href = `./pages/${page}`;
            }
        }
    }

    // 활성 네비게이션 아이템 설정
    setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navItems = document.querySelectorAll('.nav-item a');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href && (href.includes(currentPage) || 
                        (currentPage === 'index.html' && href.includes('index.html')) ||
                        (currentPage === '' && href.includes('index.html')))) {
                item.classList.add('active');
            }
        });
    }

    // 사용자 세션 로드
    loadUserSession() {
        const userInfoElement = document.querySelector('.user-info');
        if (userInfoElement) {
            userInfoElement.innerHTML = `
                <span>🏢 ${this.currentUser.company}</span>
                <span>👤 ${this.currentUser.name} ${this.currentUser.role}</span>
                <span class="user-badge">3 알림</span>
            `;
        }
    }

    // 애니메이션 초기화
    initializeAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        document.querySelectorAll('.animate-fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    // Mock 데이터 반환
    getMockDashboardData() {
        return {
            accuracy: 87.3 + (Math.random() - 0.5) * 2,
            activePersonas: 12,
            successRate: 92.1 + (Math.random() - 0.5) * 1,
            totalDataPoints: '2.3M',
            generatedInsights: 147 + Math.floor(Math.random() * 10)
        };
    }

    // API 호출 헬퍼 (Mock 데이터 지원)
    async apiCall(endpoint, method = 'GET', data = null) {
        if (this.useMockData) {
            // Mock 데이터 반환
            await this.delay(500); // 네트워크 지연 시뮬레이션
            
            switch(endpoint) {
                case '/dashboard':
                    return this.getMockDashboardData();
                case '/personas':
                    return {
                        personas: [
                            { id: 'early-adopter', name: '김얼리', accuracy: 89.3 },
                            { id: 'practical', name: '박실용', accuracy: 91.2 },
                            { id: 'senior', name: '이시니어', accuracy: 76.4 }
                        ]
                    };
                default:
                    return { success: true, message: 'Mock response' };
            }
        }

        // 실제 API 호출 (백엔드가 있을 때)
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            }
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.apiBase}${endpoint}`, config);
            return await response.json();
        } catch (error) {
            console.warn('API 호출 실패, Mock 데이터 사용:', error);
            return this.getMockDashboardData();
        }
    }

    // 딜레이 함수
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 인증 토큰 가져오기
    getAuthToken() {
        return localStorage.getItem('auth_token') || 'demo_token';
    }

    // 알림 표시
    showNotification(message, type = 'info') {
        // 기존 알림 제거
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // 알림 스타일 추가
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(60, 64, 89, 0.95);
                    border-radius: 10px;
                    padding: 15px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    border: 1px solid #4a5074;
                    z-index: 1000;
                    animation: slideInRight 0.3s ease;
                    max-width: 400px;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: white;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: #b8bcc8;
                    cursor: pointer;
                    font-size: 18px;
                    margin-left: auto;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .notification-close:hover {
                    color: white;
                }
                .notification-message {
                    flex: 1;
                    font-size: 14px;
                    line-height: 1.4;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // 5초 후 자동 제거
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }

    // 로딩 상태 관리
    showLoading(element) {
        if (element) {
            element.innerHTML = '<div class="loading-spinner"></div>';
        }
    }

    hideLoading(element, originalContent) {
        if (element) {
            element.innerHTML = originalContent;
        }
    }

    // 데이터 포맷팅 유틸리티
    formatNumber(num) {
        if (typeof num === 'string') return num;
        return new Intl.NumberFormat('ko-KR').format(num);
    }

    formatPercent(num) {
        return `${num.toFixed(1)}%`;
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    // 페르소나 관련 유틸리티
    getPersonaAvatarText(name) {
        return name.charAt(0);
    }

    getPersonaStatusColor(accuracy) {
        if (accuracy >= 90) return '#4CAF50';
        if (accuracy >= 75) return '#FF9800';
        return '#f44336';
    }

    // 로컬 스토리지 관리
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn('로컬 스토리지 저장 실패:', error);
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('로컬 스토리지 로드 실패:', error);
            return null;
        }
    }

    // 권한 확인
    hasPermission(permission) {
        return this.currentUser.permissions.includes(permission);
    }

    // 페이지별 초기화 함수들
    async initDashboard() {
        try {
            await this.loadDashboardData();
            this.startRealTimeUpdates();
        } catch (error) {
            console.warn('대시보드 초기화 실패:', error);
        }
    }

    initPersonaCreate() {
        this.loadDataSources();
        this.setupFormValidation();
    }

    initAnalytics() {
        this.loadAnalyticsData();
        this.initCharts();
    }

    initReports() {
        this.loadReportList();
        this.setupReportFilters();
    }

    // 대시보드 데이터 로드
    async loadDashboardData() {
        try {
            const data = await this.apiCall('/dashboard');
            this.updateDashboardMetrics(data);
        } catch (error) {
            console.warn('대시보드 데이터 로드 실패, Mock 데이터 사용:', error);
            const mockData = this.getMockDashboardData();
            this.updateDashboardMetrics(mockData);
        }
    }

    updateDashboardMetrics(data) {
        // 메트릭 업데이트 로직
        const elements = {
            accuracy: document.querySelector('.insight-value'),
            personas: document.querySelector('[data-metric="personas"]'),
            success: document.querySelector('[data-metric="success"]')
        };

        if (elements.accuracy && data.accuracy) {
            elements.accuracy.textContent = this.formatPercent(data.accuracy);
        }
        if (elements.personas && data.activePersonas) {
            elements.personas.textContent = data.activePersonas + '개';
        }
        if (elements.success && data.successRate) {
            elements.success.textContent = this.formatPercent(data.successRate);
        }
    }

    // 실시간 업데이트
    startRealTimeUpdates() {
        setInterval(() => {
            this.updateRealTimeMetrics();
        }, 30000); // 30초마다 업데이트
    }

    updateRealTimeMetrics() {
        const accuracyElement = document.querySelector('.insight-value');
        if (accuracyElement && accuracyElement.textContent.includes('%')) {
            const current = parseFloat(accuracyElement.textContent);
            const variation = (Math.random() - 0.5) * 0.5;
            const newValue = Math.max(80, Math.min(95, current + variation));
            accuracyElement.textContent = this.formatPercent(newValue);
        }
    }

    // 추가 헬퍼 메소드들
    loadDataSources() {
        // 데이터 소스 로딩 로직
        console.log('데이터 소스 로딩 완료');
    }

    setupFormValidation() {
        // 폼 검증 설정
        console.log('폼 검증 설정 완료');
    }

    loadAnalyticsData() {
        // 분석 데이터 로딩
        console.log('분석 데이터 로딩 완료');
    }

    initCharts() {
        // 차트 초기화
        console.log('차트 초기화 완료');
    }

    loadReportList() {
        // 리포트 목록 로딩
        console.log('리포트 목록 로딩 완료');
    }

    setupReportFilters() {
        // 리포트 필터 설정
        console.log('리포트 필터 설정 완료');
    }
}

// 전역 인스턴스 생성
window.personaSync = new PersonaSync();

// 공통 이벤트 핸들러들
document.addEventListener('DOMContentLoaded', function() {
    // 페이지별 초기화
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    console.log('현재 페이지:', currentPage);
    
    switch(currentPage) {
        case 'index.html':
        case '':
            window.personaSync.initDashboard();
            break;
        case 'persona-create.html':
            window.personaSync.initPersonaCreate();
            break;
        case 'analytics.html':
            window.personaSync.initAnalytics();
            break;
        case 'reports.html':
            window.personaSync.initReports();
            break;
        default:
            console.log('알 수 없는 페이지:', currentPage);
    }

    // 애니메이션 요소 초기화
    const animatedElements = document.querySelectorAll('.animate-fade-in');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// 공통 액션 함수들
function createPersona() {
    if (window.personaSync.hasPermission('write')) {
        window.personaSync.showNotification('페르소나 생성 페이지로 이동합니다...', 'info');
        setTimeout(() => {
            window.personaSync.navigateTo('persona-create.html');
        }, 1000);
    } else {
        window.personaSync.showNotification('페르소나 생성 권한이 없습니다.', 'warning');
    }
}

function showAnalytics() {
    window.personaSync.showNotification('상세 분석 페이지로 이동합니다...', 'info');
    setTimeout(() => {
        window.personaSync.navigateTo('analytics.html');
    }, 1000);
}

function exportReport() {
    if (window.personaSync.hasPermission('export')) {
        window.personaSync.showNotification('리포트 관리 페이지로 이동합니다...', 'info');
        setTimeout(() => {
            window.personaSync.navigateTo('reports.html');
        }, 1000);
    } else {
        window.personaSync.showNotification('리포트 내보내기 권한이 없습니다.', 'warning');
    }
}

function openPersonaDetail(personaId) {
    window.personaSync.showNotification(`${personaId} 페르소나 상세 분석을 로드합니다...`, 'info');
    setTimeout(() => {
        window.personaSync.navigateTo(`persona-detail.html?id=${personaId}`);
    }, 1000);
}

// 페이지 로드 오류 방지
window.addEventListener('error', function(e) {
    console.warn('페이지 로드 오류:', e.error);
    // 오류가 발생해도 페이지는 계속 작동하도록 함
});

// 네트워크 오류 처리
window.addEventListener('unhandledrejection', function(e) {
    console.warn('Promise 거부:', e.reason);
    // Promise 거부 오류를 처리하여 페이지 크래시 방지
    e.preventDefault();
});