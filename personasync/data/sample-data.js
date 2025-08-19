// PersonaSync™ 샘플 데이터

const PersonaData = {
    // 페르소나 정보
    personas: {
        'early-adopter': {
            id: 'early-adopter',
            name: '김얼리',
            fullName: '김얼리 (얼리어답터)',
            avatar: '김',
            segment: '프리미엄 세그먼트',
            description: '신기술에 민감하고 트렌드를 선도하는 혁신 추구형 고객으로, 남들보다 먼저 경험하는 것에서 자부심을 느끼며 기술적 우위를 중시합니다.',
            demographics: {
                age: '25-35세',
                gender: '남성 62%, 여성 38%',
                occupation: 'IT/금융/마케팅 전문직',
                location: '서울/경기 78%',
                income: '연 5,000만원 이상'
            },
            lifestyle: ['액티브', '디지털 네이티브', '트렌드 세터', '커리어 중심', '얼리어답터'],
            metrics: {
                accuracy: 89.3,
                marketShare: 34,
                dataPoints: 2340,
                avgSpend: 1200000
            },
            motivations: {
                '기술 우위성': 85,
                '사회적 인정': 78,
                '혁신 경험': 72,
                '효율성 추구': 68
            },
            emotions: [
                {
                    type: '성취감',
                    icon: '🎯',
                    description: '남들보다 먼저 새로운 기술을 경험했을 때의 뿌듯함'
                },
                {
                    type: '우월감',
                    icon: '🏆',
                    description: '최신 기술로 더 효율적으로 일하는 자신에 대한 자부심'
                },
                {
                    type: '소속감',
                    icon: '🌟',
                    description: '혁신을 추구하는 커뮤니티의 일원이라는 소속감'
                }
            ],
            predictions: [
                {
                    timeframe: '즉시-1주',
                    action: '신제품 프리오더',
                    probability: 85,
                    description: '출시 발표 후 24시간 내 프리오더 참여'
                },
                {
                    timeframe: '1-2주',
                    action: '소셜 미디어 리뷰',
                    probability: 72,
                    description: '구매 후 언박싱 및 첫 인상 공유'
                },
                {
                    timeframe: '2-4주',
                    action: '액세서리 추가 구매',
                    probability: 58,
                    description: '케이스, 충전기 등 주변 기기 구매'
                },
                {
                    timeframe: '1-3개월',
                    action: '업그레이드 고려',
                    probability: 35,
                    description: '새로운 모델 출시 시 업그레이드 검토'
                }
            ],
            journey: [
                {
                    stage: '인지',
                    emotion: 7.2,
                    touchpoints: [
                        {
                            name: '소셜 미디어',
                            description: 'Instagram, YouTube에서 신제품 정보 최초 접촉',
                            impact: 'high',
                            icon: '📱'
                        },
                        {
                            name: '기술 블로그',
                            description: '상세 스펙과 기술적 혁신 포인트 확인',
                            impact: 'high',
                            icon: '🌐'
                        },
                        {
                            name: '커뮤니티',
                            description: '온라인 커뮤니티에서 의견 교환',
                            impact: 'medium',
                            icon: '👥'
                        }
                    ],
                    painPoints: [
                        '정보가 단편적이고 공식적이지 않음',
                        '출시일과 가격 정보의 불확실성'
                    ],
                    opportunities: [
                        '독점 프리뷰나 베타 테스트 기회',
                        '기술 전문가와의 직접 대화 채널'
                    ]
                },
                {
                    stage: '고려',
                    emotion: 6.8,
                    touchpoints: [
                        {
                            name: '오프라인 매장',
                            description: '실제 제품 체험 및 직원 상담',
                            impact: 'high',
                            icon: '🏪'
                        },
                        {
                            name: '비교 사이트',
                            description: '경쟁 제품과의 스펙 및 가격 비교',
                            impact: 'medium',
                            icon: '📊'
                        },
                        {
                            name: '리뷰 사이트',
                            description: '전문가 및 사용자 리뷰 검토',
                            impact: 'medium',
                            icon: '⭐'
                        }
                    ],
                    painPoints: [
                        '매장 직원의 제품 지식 부족',
                        '체험 시간의 제약',
                        '경쟁 제품 비교의 어려움'
                    ],
                    opportunities: [
                        '전문가 상담 서비스',
                        '충분한 체험 기회 제공',
                        '맞춤형 비교 자료 제공'
                    ]
                },
                {
                    stage: '구매',
                    emotion: 8.9,
                    touchpoints: [
                        {
                            name: '온라인 스토어',
                            description: '프리오더 또는 공식 출시일 구매',
                            impact: 'high',
                            icon: '💻'
                        },
                        {
                            name: '배송 서비스',
                            description: '프리미엄 배송 및 설치 서비스',
                            impact: 'medium',
                            icon: '🚚'
                        },
                        {
                            name: '언박싱 경험',
                            description: '프리미엄 패키징과 첫 사용 경험',
                            impact: 'high',
                            icon: '📦'
                        }
                    ],
                    painPoints: [
                        '결제 과정의 복잡성',
                        '배송 지연에 대한 불안'
                    ],
                    opportunities: [
                        'VIP 구매 프로세스',
                        '특별한 언박싱 경험',
                        '구매 후 즉시 커뮤니티 접근'
                    ]
                }
            ]
        },
        'practical': {
            id: 'practical',
            name: '박실용',
            fullName: '박실용 (실용주의자)',
            avatar: '박',
            segment: '메인스트림',
            description: '가성비를 중시하며 실용적인 기능에 집중하는 합리적 소비자로, 충분한 검토 후 신중하게 구매 결정을 내립니다.',
            demographics: {
                age: '30-45세',
                gender: '남성 55%, 여성 45%',
                occupation: '사무직/공무원/교육직',
                location: '전국 고르게 분포',
                income: '연 3,000-6,000만원'
            },
            lifestyle: ['신중함', '가성비 추구', '안정성 중시', '가족 중심', '실용성'],
            metrics: {
                accuracy: 91.2,
                marketShare: 52,
                dataPoints: 4156,
                avgSpend: 800000
            },
            motivations: {
                '가성비': 92,
                '실용성': 88,
                '안정성': 82,
                '가족 고려': 75
            }
        },
        'senior': {
            id: 'senior',
            name: '이시니어',
            fullName: '이시니어 (시니어)',
            avatar: '이',
            segment: '신규 타깃',
            description: '가족과의 소통을 중시하며 안전하고 간편한 기능을 선호하는 50대 이상 고객으로, 신뢰할 수 있는 브랜드를 선호합니다.',
            demographics: {
                age: '50-65세',
                gender: '남성 48%, 여성 52%',
                occupation: '관리직/자영업/은퇴자',
                location: '수도권 외 비중 높음',
                income: '연 4,000-8,000만원'
            },
            lifestyle: ['안전 중시', '가족 중심', '브랜드 신뢰', '오프라인 선호', '서비스 중시'],
            metrics: {
                accuracy: 76.4,
                marketShare: 14,
                dataPoints: 892,
                avgSpend: 650000
            },
            motivations: {
                '가족 소통': 85,
                '안전성': 82,
                '브랜드 신뢰': 78,
                '서비스 품질': 75
            }
        }
    },

    // 데이터 소스 정보
    dataSources: {
        internal: [
            {
                name: 'Samsung CRM',
                description: '고객 구매 이력 및 서비스 이용 패턴',
                quality: 'A+',
                count: 1247,
                icon: '💾'
            },
            {
                name: '온라인몰 DMP',
                description: '웹사이트 행동 데이터 및 구매 여정',
                quality: 'A',
                count: 3892,
                icon: '🛒'
            },
            {
                name: '고객센터 VOC',
                description: '고객 문의 및 피드백 데이터',
                quality: 'B+',
                count: 567,
                icon: '📞'
            }
        ],
        external: [
            {
                name: '에스노그라피 관찰',
                description: '실제 사용 환경에서의 행동 관찰',
                quality: 'A+',
                count: 234,
                icon: '🔍'
            },
            {
                name: '심층 인터뷰',
                description: '동기와 감정에 대한 질적 연구',
                quality: 'A+',
                count: 89,
                icon: '💬'
            },
            {
                name: '소셜 리스닝',
                description: '브랜드 및 제품 관련 소셜 미디어 분석',
                quality: 'B+',
                count: 15623,
                icon: '📱'
            }
        ]
    },

    // 시장 세그먼트 데이터
    marketSegments: [
        {
            name: '스마트폰 얼리어답터',
            observations: 1247,
            reliability: 94.2,
            description: '신제품 출시 초기 구매 패턴, 기술 혁신 반응성, 소셜 영향력 등을 실제 관찰한 데이터'
        },
        {
            name: '가성비 추구 그룹',
            observations: 2156,
            reliability: 91.8,
            description: '가격 대비 성능 중시, 리뷰 의존도, 할인 이벤트 반응 패턴 등의 실측 데이터'
        },
        {
            name: '패밀리 중심 사용자',
            observations: 892,
            reliability: 88.5,
            description: '가족 소통 중심 사용 패턴, 자녀 안전 기능 선호도, 가족 공유 행동 등'
        }
    ],

    // 경쟁사 비교 데이터
    competitiveAnalysis: {
        'PersonaSync': {
            dataBase: '실측 + CRM',
            accuracy: 87.3,
            updateCycle: '실시간',
            emotionAnalysis: '에스노그라피'
        },
        'A사': {
            dataBase: '설문 기반',
            accuracy: 72.1,
            updateCycle: '분기별',
            emotionAnalysis: '감정 키워드'
        },
        'B사': {
            dataBase: '가정 기반',
            accuracy: 68.9,
            updateCycle: '연 2회',
            emotionAnalysis: '만족도 점수'
        },
        '업계 평균': {
            dataBase: '혼합',
            accuracy: 74.2,
            updateCycle: '분기별',
            emotionAnalysis: '기본 분석'
        }
    },

    // 리포트 템플릿 데이터
    reportTemplates: [
        {
            id: 'executive',
            name: '임원진 요약 보고서',
            description: '핵심 인사이트와 비즈니스 임팩트 중심',
            pages: '4-6페이지',
            estimatedTime: '3분',
            icon: '👔'
        },
        {
            id: 'marketing',
            name: '마케팅 전략 리포트',
            description: '캠페인 최적화 및 타깃팅 전략',
            pages: '8-12페이지',
            estimatedTime: '5분',
            icon: '📈'
        },
        {
            id: 'persona-detail',
            name: '페르소나 상세 분석',
            description: '개별 페르소나의 깊이 있는 분석',
            pages: '6-8페이지',
            estimatedTime: '4분',
            icon: '👥'
        },
        {
            id: 'competitive',
            name: '경쟁사 비교 분석',
            description: '시장 포지셔닝 및 경쟁 우위 분석',
            pages: '10-15페이지',
            estimatedTime: '7분',
            icon: '⚔️'
        }
    ],

    // 샘플 리포트 목록
    sampleReports: [
        {
            id: 'executive-001',
            title: '갤럭시 S25 페르소나 분석 - 임원진 요약',
            type: 'executive',
            date: '2025.07.08 14:30',
            size: '4.2MB',
            status: 'generated',
            summary: '주요 타깃 3개 페르소나 분석 결과 및 프리오더 전략 권장사항 포함'
        },
        {
            id: 'marketing-002',
            title: 'MZ세대 타깃 마케팅 전략 리포트',
            type: 'marketing',
            date: '2025.07.07 09:15',
            size: '8.7MB',
            status: 'generated',
            summary: 'MZ세대 페르소나 기반 소셜 미디어 캠페인 전략 및 인플루언서 협업 방안'
        },
        {
            id: 'detailed-003',
            title: '시니어 세그먼트 상세 행동 분석',
            type: 'detailed',
            date: '2025.07.06 16:45',
            size: '12.1MB',
            status: 'processing',
            summary: '50대 이상 고객의 디지털 기기 사용 패턴 및 구매 결정 요인 심층 분석'
        },
        {
            id: 'marketing-004',
            title: 'Q2 캠페인 성과 분석 리포트',
            type: 'marketing',
            date: '2025.07.05 11:20',
            size: '6.3MB',
            status: 'generated',
            summary: 'Q2 마케팅 캠페인 페르소나별 반응률 분석 및 ROI 측정 결과'
        }
    ],

    // 정기 리포트 스케줄
    reportSchedules: [
        {
            id: 'monthly-exec',
            title: '월간 임원진 요약 리포트',
            frequency: '매월 첫째 주 월요일',
            time: '09:00',
            recipients: '김마케팅, 이임원, 박사장',
            nextGeneration: '2025.08.04 09:00',
            status: 'active'
        },
        {
            id: 'weekly-marketing',
            title: '주간 마케팅 성과 리포트',
            frequency: '매주 금요일',
            time: '17:00',
            recipients: '마케팅팀 전체',
            nextGeneration: '2025.07.11 17:00',
            status: 'active'
        },
        {
            id: 'quarterly-competitive',
            title: '분기별 경쟁사 분석 리포트',
            frequency: '분기별',
            time: '분기 마지막 주',
            recipients: '전략기획팀',
            nextGeneration: '일시정지됨',
            status: 'paused'
        }
    ],

    // 대시보드 메트릭
    dashboardMetrics: {
        dataAccuracy: 87.3,
        activePersonas: 12,
        successRate: 92.1,
        totalDataPoints: '2.3M',
        generatedInsights: 147,
        trend: {
            accuracy: '+2.3%',
            personas: '+3',
            insights: '+23'
        }
    },

    // 실행 권장사항
    recommendations: {
        urgent: [
            {
                title: '갤럭시 S25 프리오더 타깃팅 캠페인 즉시 시작',
                impact: '매출 +15%',
                priority: '긴급'
            },
            {
                title: '인스타그램 인플루언서 협업 컨택 시작',
                impact: '브랜드 인지도 +20%',
                priority: '긴급'
            },
            {
                title: '기술 혁신 포인트 강조 메시지 개발',
                impact: '구매 의향 +25%',
                priority: '긴급'
            }
        ],
        shortTerm: [
            {
                title: '오프라인 매장 체험존 강화',
                impact: '만족도 +12%',
                priority: '중요'
            },
            {
                title: '언박싱 경험 개선 프로젝트',
                impact: '재구매율 +18%',
                priority: '중요'
            },
            {
                title: '시니어 세그먼트 데이터 수집 계획',
                impact: '신규 시장 확보',
                priority: '중요'
            }
        ],
        longTerm: [
            {
                title: '지방 지역 마케팅 전략 수립',
                impact: '시장점유율 +8%',
                priority: '계획'
            },
            {
                title: '크로스 세그먼트 상품 개발',
                impact: '매출 다각화',
                priority: '계획'
            },
            {
                title: '글로벌 페르소나 확장 연구',
                impact: '해외 진출',
                priority: '계획'
            }
        ]
    },

    // 데이터 품질 지표
    dataQuality: {
        ethnography: {
            sessions: 2340,
            reliability: 94.2,
            bias: '±2.1%',
            grade: 'A+'
        },
        crm: {
            records: '2.3M',
            completeness: 89.7,
            freshness: '실시간',
            grade: 'A'
        },
        overall: {
            reliability: 94.2,
            lastUpdate: '2025.07.08 14:30',
            biasCheck: '±2.1% (양호)',
            representativeness: '높음'
        }
    }
};

// 유틸리티 함수들
const PersonaUtils = {
    // 페르소나 데이터 가져오기
    getPersona(id) {
        return PersonaData.personas[id] || PersonaData.personas['early-adopter'];
    },

    // 모든 페르소나 목록 가져오기
    getAllPersonas() {
        return Object.values(PersonaData.personas);
    },

    // 페르소나별 메트릭 업데이트
    updatePersonaMetrics(personaId, metrics) {
        if (PersonaData.personas[personaId]) {
            PersonaData.personas[personaId].metrics = {
                ...PersonaData.personas[personaId].metrics,
                ...metrics
            };
        }
    },

    // 리포트 템플릿 가져오기
    getReportTemplate(templateId) {
        return PersonaData.reportTemplates.find(t => t.id === templateId);
    },

    // 경쟁사 비교 데이터 가져오기
    getCompetitiveData() {
        return PersonaData.competitiveAnalysis;
    },

    // 추천사항 가져오기
    getRecommendations(priority = 'all') {
        if (priority === 'all') {
            return PersonaData.recommendations;
        }
        return PersonaData.recommendations[priority] || [];
    },

    // 데이터 소스 정보 가져오기
    getDataSources() {
        return PersonaData.dataSources;
    },

    // 대시보드 메트릭 가져오기
    getDashboardMetrics() {
        return PersonaData.dashboardMetrics;
    },

    // 시장 세그먼트 데이터 가져오기
    getMarketSegments() {
        return PersonaData.marketSegments;
    },

    // 데이터 품질 지표 가져오기
    getDataQuality() {
        return PersonaData.dataQuality;
    },

    // 페르소나 정확도 색상 가져오기
    getAccuracyColor(accuracy) {
        if (accuracy >= 85) return '#4CAF50';
        if (accuracy >= 70) return '#FF9800';
        return '#f44336';
    },

    // 확률에 따른 클래스 가져오기
    getProbabilityClass(probability) {
        if (probability >= 70) return 'high-probability';
        if (probability >= 50) return 'medium-probability';
        return 'low-probability';
    },

    // 감정 점수에 따른 이모지 가져오기
    getEmotionEmoji(score) {
        if (score >= 8) return '🎉';
        if (score >= 7) return '😊';
        if (score >= 6) return '🙂';
        if (score >= 5) return '😐';
        return '😞';
    },

    // 날짜 포맷팅
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // 숫자 포맷팅
    formatNumber(num) {
        if (typeof num === 'string') return num;
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // 파일 크기 포맷팅
    formatFileSize(sizeStr) {
        const size = parseFloat(sizeStr);
        if (size >= 1000) {
            return (size / 1000).toFixed(1) + 'GB';
        }
        return size.toFixed(1) + 'MB';
    },

    // 리포트 상태 배지 색상
    getStatusColor(status) {
        const colors = {
            'generated': '#4CAF50',
            'processing': '#FF9800',
            'error': '#f44336',
            'scheduled': '#2196F3'
        };
        return colors[status] || '#666';
    },

    // 우선순위에 따른 색상
    getPriorityColor(priority) {
        const colors = {
            '긴급': '#f44336',
            '중요': '#FF9800',
            '계획': '#2196F3'
        };
        return colors[priority] || '#666';
    }
};

// 모의 API 함수들
const MockAPI = {
    // 페르소나 생성 시뮬레이션
    async createPersona(personaData) {
        await this.delay(3000);
        
        const newPersona = {
            id: 'new-' + Date.now(),
            ...personaData,
            metrics: {
                accuracy: Math.random() * 10 + 80,
                marketShare: Math.random() * 30 + 10,
                dataPoints: Math.floor(Math.random() * 2000 + 1000),
                avgSpend: Math.floor(Math.random() * 500000 + 500000)
            }
        };
        
        return {
            success: true,
            data: newPersona
        };
    },

    // 분석 데이터 업데이트
    async updateAnalytics() {
        await this.delay(2000);
        
        const updatedMetrics = {
            dataAccuracy: PersonaData.dashboardMetrics.dataAccuracy + (Math.random() - 0.5) * 2,
            activePersonas: PersonaData.dashboardMetrics.activePersonas,
            successRate: PersonaData.dashboardMetrics.successRate + (Math.random() - 0.5) * 1,
            generatedInsights: PersonaData.dashboardMetrics.generatedInsights + Math.floor(Math.random() * 5)
        };
        
        return {
            success: true,
            data: updatedMetrics
        };
    },

    // 리포트 생성 시뮬레이션
    async generateReport(reportConfig) {
        await this.delay(5000);
        
        const newReport = {
            id: 'report-' + Date.now(),
            title: reportConfig.title || '새 리포트',
            type: reportConfig.type || 'custom',
            date: new Date().toLocaleString('ko-KR'),
            size: (Math.random() * 10 + 2).toFixed(1) + 'MB',
            status: 'generated',
            summary: 'AI가 자동 생성한 리포트입니다.'
        };
        
        return {
            success: true,
            data: newReport
        };
    },

    // 지연 함수
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// 전역에서 사용할 수 있도록 export
if (typeof window !== 'undefined') {
    window.PersonaData = PersonaData;
    window.PersonaUtils = PersonaUtils;
    window.MockAPI = MockAPI;
}

// Node.js 환경에서도 사용 가능하도록
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PersonaData,
        PersonaUtils,
        MockAPI
    };
}