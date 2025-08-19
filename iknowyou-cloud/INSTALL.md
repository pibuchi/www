# iknowyou.cloud 시스템 설치 가이드

## 🚀 빠른 시작

### 1. 필수 소프트웨어 설치

#### Node.js (v18+)
```bash
# https://nodejs.org에서 LTS 버전 다운로드
```

#### Java (v17+)
```bash
# https://adoptium.net에서 Java 17 다운로드
```

#### Python (v3.9+)
```bash
# https://python.org에서 Python 3.9+ 다운로드
```

#### MySQL (v8.0+)
```bash
# 옵션 1: XAMPP 설치 (https://www.apachefriends.org/)
# 옵션 2: MySQL Community Server (https://dev.mysql.com/downloads/)
# 옵션 3: Docker 사용
```

#### Nginx
```bash
# 옵션 1: Nginx for Windows (http://nginx.org/en/download.html)
# 옵션 2: Docker 사용
```

### 2. 환경 설정

#### 환경 변수 파일 생성
```bash
cp env.example .env
# .env 파일을 편집하여 실제 값들을 설정
```

#### 필요한 API 키 설정
- PineCone API Key: https://www.pinecone.io/
- OpenAI API Key: https://platform.openai.com/

### 3. 데이터베이스 설정

#### MySQL 데이터베이스 생성
```sql
CREATE DATABASE iknowyou_db;
CREATE USER 'iknowyou_user'@'localhost' IDENTIFIED BY 'iknowyou_password';
GRANT ALL PRIVILEGES ON iknowyou_db.* TO 'iknowyou_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. 서비스 시작

#### 방법 1: 개별 실행 (개발용)
```bash
# 터미널 1: Front Office
cd front-office
npm install
npm run dev

# 터미널 2: Back Office
cd back-office
npm install
npm run dev

# 터미널 3: API Server
cd api-server
mvn spring-boot:run

# 터미널 4: AI Server
cd ai-server
pip install -r requirements.txt
python main.py

# 터미널 5: Nginx (관리자 권한)
nginx -c "C:\path\to\iknowyou-cloud\nginx\nginx.conf"
```

#### 방법 2: Docker 사용 (프로덕션용)
```bash
# 모든 서비스 한번에 시작
docker-compose up -d

# 특정 서비스만 시작
docker-compose up mysql nginx
```

### 5. 도메인 및 SSL 설정

#### DuckDNS 설정
1. https://www.duckdns.org에서 도메인 확인
2. DuckDNS 클라이언트 설치 및 설정
3. IP 자동 업데이트 확인

#### SSL 인증서 설정 (Let's Encrypt)
```bash
# Certbot 설치
pip install certbot

# SSL 인증서 발급
certbot certonly --standalone -d iknowyou.cloud -d www.iknowyou.cloud

# Nginx SSL 설정 업데이트
```

### 6. 방화벽 및 포트 설정

#### Windows 방화벽
- 포트 80 (HTTP)
- 포트 443 (HTTPS)
- 포트 8080 (API Server)
- 포트 8081 (AI Server)

#### 공유기 포트포워딩
- 외부 포트 80 → 내부 IP:80
- 외부 포트 443 → 내부 IP:443

### 7. 테스트

#### 서비스 상태 확인
```bash
# Front Office
curl http://localhost:3000

# Back Office
curl http://localhost:3001

# API Server
curl http://localhost:8080/health

# AI Server
curl http://localhost:8081/health

# Nginx
curl http://localhost
```

#### 도메인 접속 테스트
```bash
# 메인 사이트
curl http://iknowyou.cloud

# 관리자 패널
curl http://admin.iknowyou.cloud

# API 서버
curl http://api.iknowyou.cloud

# AI 서버
curl http://ai.iknowyou.cloud
```

## 🔧 문제 해결

### 일반적인 문제들

#### 포트 충돌
```bash
# 포트 사용 확인
netstat -ano | findstr :8080
netstat -ano | findstr :8081
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

#### 데이터베이스 연결 실패
```bash
# MySQL 서비스 상태 확인
sc query mysql

# MySQL 연결 테스트
mysql -u iknowyou_user -p iknowyou_db
```

#### Nginx 설정 오류
```bash
# Nginx 설정 테스트
nginx -t

# Nginx 로그 확인
tail -f /var/log/nginx/error.log
```

## 📁 프로젝트 구조

```
iknowyou-cloud/
├── README.md
├── INSTALL.md
├── setup.bat
├── docker-compose.yml
├── env.example
├── nginx/
│   └── nginx.conf
├── api-server/
│   ├── pom.xml
│   └── src/
├── ai-server/
│   ├── requirements.txt
│   └── main.py
├── front-office/
│   ├── package.json
│   └── next.config.js
└── back-office/
    ├── package.json
    └── next.config.js
```

## 🚀 배포

### 개발 환경
- 로컬에서 모든 서비스 실행
- 실시간 코드 변경 반영

### 스테이징 환경
- Docker Compose 사용
- 실제 도메인 연결
- SSL 인증서 적용

### 프로덕션 환경
- 클라우드 서버 배포
- 로드 밸런서 설정
- 모니터링 및 로깅
- 백업 및 복구

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. 로그 파일 확인
2. 서비스 상태 확인
3. 네트워크 연결 확인
4. 방화벽 설정 확인 
