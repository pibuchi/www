# ProductAI - GPT API 기반 제품 디자인 챗봇

ProductAI는 GPT API를 활용한 제품 디자인 전문 챗봇입니다. 사용자의 역할과 경험 수준에 맞춰 제품 디자인 프로세스를 단계별로 안내합니다.

## 🚀 기능

- **역할 기반 맞춤형 가이드**: 주니어/시니어 디자이너, 제품 기획자별 맞춤 안내
- **단계별 프로젝트 진행**: 리서치부터 검증까지 체계적인 프로세스
- **실시간 AI 대화**: GPT API를 통한 자연스러운 대화형 인터페이스
- **진행 상황 추적**: 프로젝트 단계별 진행률 시각화
- **반응형 디자인**: 모바일/데스크톱 최적화

## 📋 요구사항

- Node.js 16.0 이상
- OpenAI API 키
- npm 또는 yarn

## 🛠️ 설치 및 실행

### 1. 백엔드 설정

```bash
# 백엔드 디렉토리로 이동
cd interacton_ai/backend

# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env
```

### 2. OpenAI API 키 설정

`.env` 파일을 열고 OpenAI API 키를 설정하세요:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

### 3. 서버 실행

```bash
# 개발 모드 (자동 재시작)
npm run dev

# 프로덕션 모드
npm start
```

서버가 `http://localhost:3000`에서 실행됩니다.

### 4. 프론트엔드 접속

브라우저에서 `http://localhost:3000`에 접속하여 ProductAI를 사용하세요.

## 🏗️ 프로젝트 구조

```
interacton_ai/
├── backend/
│   ├── server.js          # Express 서버
│   ├── package.json       # 백엔드 의존성
│   ├── env.example        # 환경 변수 예시
│   └── public/
│       └── index.html     # 프론트엔드
└── README.md
```

## 🔧 API 엔드포인트

### POST /api/initialize
프로젝트 초기화 및 세션 생성

**요청:**
```json
{
  "userPersona": "senior",
  "productTitle": "스마트워치 헬스케어 앱",
  "projectGoal": "사용자 경험 개선"
}
```

**응답:**
```json
{
  "sessionId": "1234567890",
  "message": "안녕하세요! 제품 디자인 프로젝트를 함께 진행할 ProductAI입니다..."
}
```

### POST /api/chat
AI와의 대화

**요청:**
```json
{
  "sessionId": "1234567890",
  "message": "사용자 메시지"
}
```

**응답:**
```json
{
  "message": "AI 응답 메시지",
  "currentStep": 1
}
```

### POST /api/update-step
프로젝트 단계 업데이트

### GET /api/session/:sessionId
세션 정보 조회

## 🎨 사용자 역할

### 🌱 주니어 디자이너
- 기초부터 차근차근 학습
- 단계별 상세한 설명
- 실습 중심의 가이드

### 🎯 시니어 디자이너
- 전략적 관점의 접근
- 체계적인 프로세스
- 고급 디자인 방법론

### 📊 제품 기획자
- 비즈니스 관점의 접근
- 효율적인 프로젝트 관리
- ROI 중심의 의사결정

## 🔄 프로젝트 단계

1. **🔍 리서치**: 사용자 니즈 및 시장 분석
2. **💡 아이디어**: 솔루션 아이디어 생성
3. **📋 기획**: 제품 기획 및 요구사항 정의
4. **🎨 디자인**: UI/UX 디자인
5. **🔧 프로토타입**: 프로토타입 제작
6. **✅ 검증**: 사용자 테스트 및 개선

## 🛡️ 보안 고려사항

- OpenAI API 키는 환경 변수로 관리
- 세션 정보는 메모리에 임시 저장
- CORS 설정으로 프론트엔드 접근 제한
- 입력 검증 및 에러 핸들링

## 🚀 배포

### Heroku 배포
```bash
# Heroku CLI 설치 후
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your_api_key
git push heroku main
```

### Vercel 배포
```bash
# Vercel CLI 설치 후
vercel
# 환경 변수 설정
vercel env add OPENAI_API_KEY
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🆘 문제 해결

### 서버 연결 오류
- 백엔드 서버가 실행 중인지 확인
- 포트 3000이 사용 가능한지 확인
- 환경 변수가 올바르게 설정되었는지 확인

### API 키 오류
- OpenAI API 키가 유효한지 확인
- API 사용량 한도를 확인
- 네트워크 연결 상태 확인

### 메모리 부족
- 세션 데이터가 메모리에 저장되므로 장시간 사용 시 서버 재시작 필요
- 프로덕션 환경에서는 Redis 등의 외부 저장소 사용 권장 
