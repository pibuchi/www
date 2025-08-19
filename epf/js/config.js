// 애플리케이션 설정 및 상수
const APP_CONFIG = {
  // 애플리케이션 정보
  name: 'Enterprise Persona Platform',
  version: '1.0.0',
  
  // 기본 설정
  defaults: {
    autoSaveInterval: 30000, // 30초
    maxProjectsPerUser: 10,
    sessionTimeout: 3600000, // 1시간
  },
  
  // 애니메이션 설정
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    easing: 'ease-out'
  },
  
  // 키보드 단축키
  shortcuts: {
    dashboard: 'ctrl+1',
    projects: 'ctrl+2', 
    settings: 'ctrl+3',
    save: 'ctrl+s',
    help: 'f1'
  },
  
  // API 엔드포인트 (향후 백엔드 연동시 사용)
  api: {
    baseUrl: '/api/v1',
    endpoints: {
      projects: '/projects',
      personas: '/personas',
      analytics: '/analytics',
      settings: '/settings'
    }
  },
  
  // 로컬 스토리지 키
  storage: {
    project: 'enterprisePersonaProject',
    settings: 'platformSettings',
    userPreferences: 'userPreferences'
  }
};

// 섹션 정의
const SECTIONS = [
  'business-context',
  'data-integration', 
  'persona-modeling',
  'market-intelligence',
  'strategy-simulation',
  'insights-dashboard',
  'performance-tracking'
];

// 모드 정의
const MODES = {
  TOOL: 'tool',
  GUIDE: 'guide', 
  HYBRID: 'hybrid'
};

// 페이지 정의  
const PAGES = {
  DASHBOARD: 'dashboard',
  PROJECTS: 'projects',
  SETTINGS: 'settings'
};

// 상태 정의
const STATUS = {
  ACTIVE: 'active',
  PLANNING: 'planning', 
  COMPLETED: 'completed',
  PAUSED: 'paused'
};

// 이벤트 타입
const EVENTS = {
  MODE_CHANGE: 'modeChange',
  PAGE_CHANGE: 'pageChange', 
  SECTION_CHANGE: 'sectionChange',
  PROJECT_SAVE: 'projectSave',
  SETTINGS_SAVE: 'settingsSave'
};

// 섹션별 메타데이터
const SECTION_META = {
  'business-context': {
    title: '비즈니스 컨텍스트',
    icon: '🎯',
    description: '프로젝트 목표와 비즈니스 상황을 설정',
    category: 'analysis',
    order: 1,
    estimatedTime: '10-15분'
  },
  'data-integration': {
    title: '데이터 통합',
    icon: '🔗', 
    description: '신뢰성 높은 분석을 위한 다양한 데이터 연결',
    category: 'analysis',
    order: 2,
    estimatedTime: '15-20분'
  },
  'persona-modeling': {
    title: '페르소나 모델링',
    icon: '👥',
    description: 'AI 기반 고객 세분화 및 페르소나 생성', 
    category: 'analysis',
    order: 3,
    estimatedTime: '20-25분'
  },
  'market-intelligence': {
    title: '시장 인텔리전스',
    icon: '📈',
    description: '경쟁 환경 분석 및 시장 기회 발굴',
    category: 'analysis', 
    order: 4,
    estimatedTime: '15-20분'
  },
  'strategy-simulation': {
    title: '전략 시뮬레이션', 
    icon: '🎮',
    description: '다양한 시나리오 기반 전략 테스트',
    category: 'strategy',
    order: 5,
    estimatedTime: '25-30분'
  },
  'insights-dashboard': {
    title: '인사이트 대시보드',
    icon: '💡', 
    description: '핵심 인사이트와 실행 가능한 권고사항',
    category: 'strategy',
    order: 6,
    estimatedTime: '10-15분'
  },
  'performance-tracking': {
    title: '성과 추적',
    icon: '📊',
    description: '실시간 성과 모니터링 및 최적화',
    category: 'strategy', 
    order: 7,
    estimatedTime: '지속적'
  }
};

// 가이드 콘텐츠 데이터
const GUIDE_CONTENT = {
  'business-context': {
    title: '비즈니스 컨텍스트',
    description: '프로젝트의 전체적인 방향성을 설정합니다. 명확한 목표 설정이 이후 모든 분석과 전략 수립의 기반이 됩니다.',
    checklist: [
      '비즈니스 목표 명확히 정의',
      '타겟 시장 범위 설정',
      '제품/서비스 차별점 정리',
      '성공 지표 정의'
    ],
    tips: [
      'SMART 목표 설정 원칙을 활용하세요',
      '측정 가능한 KPI를 포함하세요',
      '이해관계자와 목표를 공유하세요'
    ]
  },
  'data-integration': {
    title: '데이터 통합',
    description: '신뢰할 수 있는 데이터 소스를 연결하여 정확한 분석의 기반을 마련합니다.',
    checklist: [
      '자사 데이터 소스 확인',
      '외부 데이터 연동',
      '데이터 품질 검증',
      '개인정보 보호 확인'
    ],
    tips: [
      '자사 데이터의 신뢰도가 가장 높습니다',
      '외부 데이터는 보완적으로 활용하세요',
      '데이터 정합성을 정기적으로 검증하세요'
    ]
  },
  'persona-modeling': {
    title: '페르소나 모델링',
    description: 'AI 기반 분석을 통해 데이터 기반의 정확한 고객 페르소나를 생성합니다.',
    checklist: [
      '고객 세분화 검토',
      '페르소나 특성 분석',
      '타겟 우선순위 설정',
      '페르소나 검증'
    ],
    tips: [
      'AI 생성 페르소나의 신뢰도를 확인하세요',
      '각 페르소나별 특성을 자세히 분석하세요',
      '비즈니스 목표와 연결하여 우선순위를 정하세요'
    ]
  },
  'market-intelligence': {
    title: '시장 인텔리전스',
    description: '경쟁 환경과 시장 동향을 분석하여 전략적 포지셔닝을 위한 인사이트를 도출합니다.',
    checklist: [
      '경쟁사 분석',
      '시장 규모 파악',
      '트렌드 분석',
      '기회 영역 식별'
    ],
    tips: [
      '포지셔닝 맵에서 경쟁이 적은 영역을 찾으세요',
      '시장 트렌드를 정기적으로 모니터링하세요',
      '차별화 기회를 적극 활용하세요'
    ]
  },
  'strategy-simulation': {
    title: '전략 시뮬레이션',
    description: '다양한 전략 시나리오를 테스트하여 최적의 접근 방법을 찾습니다.',
    checklist: [
      '전략 시나리오 설정',
      '변수 조정 및 테스트',
      'ROI 예측 검토',
      '최적 전략 선택'
    ],
    tips: [
      '다양한 시나리오를 테스트해보세요',
      'ROI와 리스크를 함께 고려하세요',
      '단계적 실행 계획을 수립하세요'
    ]
  },
  'insights-dashboard': {
    title: '인사이트 대시보드',
    description: '분석 결과를 종합하여 실행 가능한 인사이트와 권고사항을 제시합니다.',
    checklist: [
      '핵심 인사이트 검토',
      '우선순위 설정',
      '액션 플랜 수립',
      '성과 지표 정의'
    ],
    tips: [
      'High Impact 항목부터 실행하세요',
      '액션 아이템을 구체적으로 정의하세요',
      '실행 일정과 담당자를 명확히 하세요'
    ]
  },
  'performance-tracking': {
    title: '성과 추적',
    description: '실행 후 성과를 지속적으로 모니터링하고 최적화합니다.',
    checklist: [
      '추적 지표 설정',
      '성과 모니터링',
      '개선 영역 식별',
      '지속적 최적화'
    ],
    tips: [
      '주요 지표를 정기적으로 모니터링하세요',
      '목표 대비 성과를 지속적으로 추적하세요',
      '개선 기회를 놓치지 마세요'
    ]
  }
};

// 프로젝트 샘플 데이터
const SAMPLE_PROJECTS = [
  {
    id: 'project-1',
    name: '뷰티 브랜드 신제품 출시 전략',
    description: '20-30대 여성 타겟 스킨케어 제품 마케팅 전략 수립',
    status: STATUS.ACTIVE,
    progress: 85,
    createdAt: '2024-12-15',
    updatedAt: '2024-12-20',
    currentSection: 'persona-modeling'
  },
  {
    id: 'project-2', 
    name: '핀테크 서비스 타겟 확장',
    description: '기존 서비스의 새로운 고객 세그먼트 발굴 및 확장 전략',
    status: STATUS.PLANNING,
    progress: 20,
    createdAt: '2024-12-10',
    updatedAt: '2024-12-18',
    currentSection: 'business-context'
  },
  {
    id: 'project-3',
    name: '이커머스 플랫폼 최적화', 
    description: '사용자 경험 개선을 위한 페르소나 기반 UI/UX 최적화',
    status: STATUS.COMPLETED,
    progress: 100,
    createdAt: '2024-11-28',
    updatedAt: '2024-12-05',
    currentSection: 'performance-tracking'
  }
];

// 기본 설정값
const DEFAULT_SETTINGS = {
  notifications: {
    email: true,
    deadline: true,
    weeklyReport: false
  },
  preferences: {
    language: 'ko',
    timezone: 'Asia/Seoul',
    autoSave: true,
    autoSaveInterval: 30
  },
  display: {
    theme: 'dark',
    sidebarCollapsed: false,
    showTips: true
  }
};

// 유효성 검사 규칙
const VALIDATION_RULES = {
  projectName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  productName: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000
  }
};

// 오류 메시지
const ERROR_MESSAGES = {
  required: '필수 입력 항목입니다.',
  minLength: '최소 {min}자 이상 입력해주세요.',
  maxLength: '최대 {max}자까지 입력 가능합니다.',
  invalid: '올바른 형식으로 입력해주세요.',
  networkError: '네트워크 오류가 발생했습니다.',
  saveError: '저장 중 오류가 발생했습니다.',
  loadError: '데이터를 불러오는 중 오류가 발생했습니다.'
};

// 성공 메시지
const SUCCESS_MESSAGES = {
  saved: '저장되었습니다.',
  updated: '업데이트되었습니다.',
  deleted: '삭제되었습니다.',
  created: '생성되었습니다.',
  completed: '완료되었습니다.'
};