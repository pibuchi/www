# 🚀 iknowyou.cloud 빠른 시작 가이드

## 📋 필수 소프트웨어 확인

다음 소프트웨어가 설치되어 있는지 확인하세요:

- ✅ Node.js (v18+)
- ✅ Java (v17+)
- ✅ Python (3.9+)
- ✅ MySQL (8.0+)
- ✅ Nginx (선택사항)

## 🛠️ 1단계: 환경 설정

```bash
# 1. 환경 변수 파일 생성
copy env.example .env

# 2. .env 파일을 편집하여 실제 값 설정
notepad .env
```

## 🗄️ 2단계: 데이터베이스 설정

### MySQL 설치 및 설정
```sql
-- MySQL에 접속하여 실행
CREATE DATABASE iknowyou_db;
CREATE USER 'iknowyou_user'@'localhost' IDENTIFIED BY 'iknowyou_password';
GRANT ALL PRIVILEGES ON iknowyou_db.* TO 'iknowyou_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📦 3단계: 의존성 설치

```bash
# Front Office
cd front-office
npm install
cd ..

# Back Office
cd back-office
npm install
cd ..

# AI Server
cd ai-server
pip install -r requirements.txt
cd ..

# API Server (Maven이 자동으로 처리)
```

## ▶️ 4단계: 서비스 시작

### 방법 1: 자동 시작 (권장)
```bash
# 모든 서비스를 한번에 시작
start-services.bat
```

### 방법 2: 수동 시작
```bash
# 터미널 1: Front Office
cd front-office
npm run dev

# 터미널 2: Back Office
cd back-office
npm run dev

# 터미널 3: API Server
cd api-server
mvn spring-boot:run

# 터미널 4: AI Server
cd ai-server
python main.py
```

## 🌐 5단계: 접속 테스트

서비스가 모두 시작되면 다음 URL로 접속해보세요:

- **Front Office**: http://localhost:3000
- **Back Office**: http://localhost:3001
- **API Server**: http://localhost:8080/health
- **AI Server**: http://localhost:8081/health

## 🔧 6단계: Nginx 설정 (선택사항)

```bash
# Nginx 설정 파일 경로 수정
# nginx/nginx.conf 파일에서 경로를 실제 경로로 변경

# 관리자 권한으로 Nginx 시작
nginx -c "C:\path\to\iknowyou-cloud\nginx\nginx.conf"
```

## 🚨 문제 해결

### 포트 충돌
```bash
# 포트 사용 확인
netstat -ano | findstr :8080
netstat -ano | findstr :8081
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

### 데이터베이스 연결 실패
```bash
# MySQL 서비스 상태 확인
sc query mysql

# MySQL 연결 테스트
mysql -u iknowyou_user -p iknowyou_db
```

### 의존성 설치 실패
```bash
# Node.js 버전 확인
node --version

# Python 버전 확인
python --version

# Java 버전 확인
java -version
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. 로그 파일 확인
2. 서비스 상태 확인
3. 네트워크 연결 확인
4. 방화벽 설정 확인

## 🎯 다음 단계

시스템이 정상적으로 작동하면:
1. 도메인 설정 (iknowyou.cloud)
2. SSL 인증서 발급
3. 프로덕션 배포
4. 모니터링 설정 
