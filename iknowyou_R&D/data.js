// 전역 변수 선언
let currentStep = 2;
let selectedPersona = null;
let customPersonaData = null; // 사용자 정의 페르소나 데이터

// 사용자 정의 페르소나 템플릿
const customPersonaTemplate = {
    name: "나만의 타겟 고객",
    icon: "👤",
    targetAge: "",
    targetGender: "",
    priceRange: "",
    purchaseChannel: "",
    decisionFactor: "",
    lifestyle: "",
    marketSize: "",
    growthRate: "",
    customerInfo: "",
    market: {
        title: "맞춤형 시장 분석",
        marketSize: "",
        growth: "",
        competition: "보통"
    },
    consumer: {
        title: "맞춤형 소비자 분석",
        motivation: "",
        premium: "",
        channel: ""
    }
};

// 사용자 정의 페르소나 생성 함수
function generateCustomPersona(formData) {
    const persona = { ...customPersonaTemplate };
    
    // 기본 정보 설정
    persona.targetAge = formData.targetAge || "20대";
    persona.targetGender = formData.targetGender || "여성";
    persona.priceRange = formData.priceRange || "1-3만원";
    persona.purchaseChannel = formData.purchaseChannel || "온라인 쇼핑몰";
    persona.decisionFactor = formData.decisionFactor || "디자인/외관";
    persona.lifestyle = formData.lifestyle || "트렌디/패션";
    persona.marketSize = formData.marketSize || "500억원";
    persona.growthRate = formData.growthRate || "15%";
    persona.customerInfo = formData.customerInfo || "";
    
    // 페르소나 이름 생성
    persona.name = generatePersonaName(formData);
    
    // 시장 분석 데이터 생성
    persona.market.marketSize = formData.marketSize || "500억원";
    persona.market.growth = formData.growthRate || "15%";
    persona.market.competition = getCompetitionLevel(formData);
    
    // 소비자 분석 데이터 생성
    persona.consumer.motivation = formData.decisionFactor || "디자인/외관";
    persona.consumer.premium = getPremiumPercentage(formData);
    persona.consumer.channel = formData.purchaseChannel || "온라인 쇼핑몰";
    
    return persona;
}

// 페르소나 이름 생성 함수
function generatePersonaName(formData) {
    const age = formData.targetAge || "20대";
    const gender = formData.targetGender || "여성";
    const lifestyle = formData.lifestyle || "트렌디/패션";
    
    const lifestyleMap = {
        "트렌디/패션": "트렌디",
        "실용적/절약": "실용적",
        "프리미엄/고급": "프리미엄",
        "친환경/윤리적": "친환경",
        "독창적/개성": "독창적"
    };
    
    const lifestyleText = lifestyleMap[lifestyle] || "트렌디";
    return `${age} ${gender} ${lifestyleText} 소비층`;
}

// 경쟁 강도 계산
function getCompetitionLevel(formData) {
    const priceRange = formData.priceRange;
    const channel = formData.purchaseChannel;
    
    if (priceRange === "10만원 이상" || channel === "온라인 쇼핑몰") {
        return "높음";
    } else if (priceRange === "5-10만원") {
        return "보통";
    } else {
        return "낮음";
    }
}

// 프리미엄 지불 의향 계산
function getPremiumPercentage(formData) {
    const priceRange = formData.priceRange;
    const lifestyle = formData.lifestyle;
    
    if (lifestyle === "프리미엄/고급" || priceRange === "10만원 이상") {
        return "85%";
    } else if (lifestyle === "친환경/윤리적") {
        return "75%";
    } else if (lifestyle === "독창적/개성") {
        return "70%";
    } else {
        return "60%";
    }
}

// 사업 적합도 평가 데이터
const evaluationData = {
    regions: {
        "서울": { marketSize: 95, competition: 85, customerDensity: 90 },
        "부산": { marketSize: 80, competition: 70, customerDensity: 75 },
        "대구": { marketSize: 70, competition: 65, customerDensity: 70 },
        "인천": { marketSize: 75, competition: 60, customerDensity: 80 },
        "광주": { marketSize: 65, competition: 55, customerDensity: 65 },
        "대전": { marketSize: 60, competition: 50, customerDensity: 60 },
        "울산": { marketSize: 55, competition: 45, customerDensity: 55 },
        "세종": { marketSize: 50, competition: 40, customerDensity: 50 },
        "경기도": { marketSize: 85, competition: 75, customerDensity: 85 },
        "강원도": { marketSize: 45, competition: 35, customerDensity: 45 },
        "충청북도": { marketSize: 50, competition: 40, customerDensity: 50 },
        "충청남도": { marketSize: 55, competition: 45, customerDensity: 55 },
        "전라북도": { marketSize: 60, competition: 50, customerDensity: 60 },
        "전라남도": { marketSize: 55, competition: 45, customerDensity: 55 },
        "경상북도": { marketSize: 65, competition: 55, customerDensity: 65 },
        "경상남도": { marketSize: 70, competition: 60, customerDensity: 70 },
        "제주도": { marketSize: 60, competition: 50, customerDensity: 65 }
    },
    items: {
        "화장품/뷰티": { growth: 85, barrier: 60, profitability: 80 },
        "패션/의류": { growth: 75, barrier: 50, profitability: 70 },
        "식품/음료": { growth: 80, barrier: 70, profitability: 75 },
        "가전/전자제품": { growth: 70, barrier: 80, profitability: 85 },
        "가구/인테리어": { growth: 65, barrier: 55, profitability: 70 },
        "도서/문구": { growth: 60, barrier: 40, profitability: 55 },
        "스포츠/레저": { growth: 75, barrier: 45, profitability: 70 },
        "유아용품": { growth: 70, barrier: 65, profitability: 75 },
        "반려동물용품": { growth: 90, barrier: 50, profitability: 80 },
        "헬스케어": { growth: 85, barrier: 75, profitability: 85 },
        "자동차용품": { growth: 65, barrier: 70, profitability: 75 },
        "취미/공예": { growth: 70, barrier: 40, profitability: 65 },
        "기타": { growth: 60, barrier: 45, profitability: 60 }
    },
    capabilities: {
        "디자인 전공/경력 있음": 90,
        "디자인 관련 경험 있음": 75,
        "완전히 새로운 분야": 40,
        "기타 창작 분야 경험": 65
    },
    stages: {
        "아이디어 단계": 30,
        "사업계획 수립 중": 60,
        "프로토타입 개발 중": 80,
        "시제품 완성": 95
    }
};

// 페르소나 데이터
const personaData = {
    persona1: {
        name: "친환경 라이프스타일 추구층",
        icon: "🌱",
        market: {
            title: "친환경 뷰티 시장 분석",
            marketSize: "1,800억원",
            growth: "18.5%",
            competition: "높음"
        },
        consumer: {
            title: "친환경 소비자 행동 분석",
            motivation: "환경 가치",
            premium: "70%",
            channel: "SNS, 블로그"
        }
    },
    persona2: {
        name: "프리미엄 뷰티 관심층",
        icon: "💎",
        market: {
            title: "프리미엄 뷰티 시장 분석",
            marketSize: "3,200억원",
            growth: "12.3%",
            competition: "매우 높음"
        },
        consumer: {
            title: "프리미엄 소비자 행동 분석",
            motivation: "브랜드 스토리",
            premium: "85%",
            channel: "온라인 쇼핑몰"
        }
    },
    persona3: {
        name: "디자인 민감층",
        icon: "🎨",
        market: {
            title: "디자인 중심 시장 분석",
            marketSize: "800억원",
            growth: "25.1%",
            competition: "보통"
        },
        consumer: {
            title: "디자인 민감 소비자 분석",
            motivation: "독창성",
            premium: "낮음",
            channel: "디자인 커뮤니티"
        }
    }
};

// 전략 데이터
const strategyData = {
    persona1: {
        premium: {
            successPattern: "프리미엄 친환경 전략으로 성공한 23개 기업의 공통 패턴을 기반으로 합니다.",
            market: {
                size: "2,400억원",
                growth: "22.3%",
                barrier: "중간",
                label: "프리미엄 친환경 시장"
            },
            consumer: {
                motivation: "품질 + 환경가치",
                premium: "85%",
                focus: "브랜드 스토리"
            },
            opportunity: "제품디자인 배경 + 친환경 시장<br>87%의 친환경 브랜드가 놓치고 있는 점: 사용자 경험 디자인. 당신의 제품디자인 전공 배경을 활용해 '사용하기 즐거운 친환경 제품'으로 차별화하세요."
        },
        accessible: {
            successPattern: "합리적 친환경 제품으로 성공한 31개 기업의 검증된 전략입니다.",
            market: {
                size: "1,800억원",
                growth: "18.5%",
                barrier: "낮음",
                label: "대중형 친환경 시장"
            },
            consumer: {
                motivation: "가성비 + 환경가치",
                premium: "45%",
                focus: "실용성"
            },
            opportunity: "29세 젊은 감각 + 접근성<br>기존 친환경 제품들이 놓치고 있는 점: 젊은 세대의 라이프스타일. 당신의 나이대 감각으로 '일상에서 자연스러운 친환경'을 제안하세요."
        },
        innovation: {
            successPattern: "혁신적 친환경 기술로 시장을 선도한 15개 스타트업의 성공 공식입니다.",
            market: {
                size: "800억원",
                growth: "35.7%",
                barrier: "높음",
                label: "혁신 친환경 시장"
            },
            consumer: {
                motivation: "혁신성 + 환경가치",
                premium: "90%",
                focus: "기술적 차별화"
            },
            opportunity: "디자인 전공 + 혁신 기술<br>기존 기술 중심 친환경 기업들이 놓치고 있는 점: 디자인 씽킹. 당신의 디자인 사고로 '기술을 감각적으로 풀어내는' 혁신을 시도하세요."
        }
    }
}; 