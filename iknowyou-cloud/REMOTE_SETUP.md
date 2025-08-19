# 🌐 iknowyou.cloud 원격 작업 설정 가이드

## 📋 현재 작업 환경 정보

### 프로젝트 위치
```
C:\Users\pibuc\AppData\Roaming\Cursor\User\globalStorage\humy2833.ftp-simple\remote-workspace-temp\cb9122d28283bfc60fa3fef05a8732c0\www\iknowyou-cloud
```

### 도메인 설정
- **메인 도메인**: iknowyou.cloud
- **DuckDNS 도메인**: pibuchi.duckdns.org
- **포트**: 8080 (DuckDNS 포워딩)

### 현재 파일 상태
- ✅ `test.js` (2044 bytes) - 정상
- ✅ `server.js` (2829 bytes) - 정상
- ❌ 기타 JS 파일들 (0 bytes) - 비어있음

## 🚀 원격 작업 방법

### 방법 1: GitHub + Cursor (권장)

#### 1.1 GitHub 저장소 생성
```bash
# 현재 프로젝트를 GitHub에 업로드
git init
git add .
git commit -m "Initial commit: iknowyou.cloud project"
git branch -M main
git remote add origin https://github.com/[your-username]/iknowyou-cloud.git
git push -u origin main
```

#### 1.2 집에서 클론
```bash
# 집에서 실행
git clone https://github.com/[your-username]/iknowyou-cloud.git
cd iknowyou-cloud
```

### 방법 2: OneDrive/Google Drive 동기화

#### 2.1 OneDrive 설정
1. 프로젝트 폴더를 OneDrive에 복사
2. 집에서 OneDrive 동기화
3. Cursor에서 OneDrive 폴더 열기

#### 2.2 Google Drive 설정
1. 프로젝트 폴더를 Google Drive에 업로드
2. 집에서 Google Drive for Desktop 설치
3. 동기화된 폴더에서 작업

### 방법 3: SSH + VS Code Remote (고급)

#### 3.1 현재 PC에서 SSH 서버 설정
```powershell
# Windows 기능에서 OpenSSH 서버 활성화
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

# SSH 서비스 시작
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'

# 방화벽 규칙 추가
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

#### 3.2 집에서 연결
```bash
# 집에서 실행
ssh pibuc@[현재PC_IP주소]
```

## 🔧 집에서 작업 환경 설정

### 1. 필수 소프트웨어 설치
```bash
# Node.js 설치 (v22.17.0)
# https://nodejs.org/

# Cursor 설치
# https://cursor.sh/

# Git 설치
# https://git-scm.com/
```

### 2. 프로젝트 실행
```bash
# 프로젝트 폴더로 이동
cd iknowyou-cloud

# 서버 실행
node server.js

# 또는 test.js 실행
node test.js
```

### 3. 도메인 테스트
- **로컬**: http://localhost:8080
- **DuckDNS**: http://pibuchi.duckdns.org:8080

## 📱 모바일 원격 접속 (선택사항)

### 1. TeamViewer 설정
1. TeamViewer 설치
2. 계정 생성 및 로그인
3. 집에서 모바일 앱으로 접속

### 2. AnyDesk 설정
1. AnyDesk 설치
2. 고유 ID 확인
3. 집에서 모바일 앱으로 접속

## 🔒 보안 고려사항

### 1. 방화벽 설정
```powershell
# 필요한 포트만 열기
New-NetFirewallRule -DisplayName "iknowyou.cloud" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
```

### 2. VPN 설정 (권장)
- **OpenVPN** 또는 **WireGuard** 사용
- 집과 사무실 간 안전한 연결

### 3. 백업 전략
```bash
# 자동 백업 스크립트
@echo off
xcopy "C:\Users\pibuc\AppData\Roaming\Cursor\User\globalStorage\humy2833.ftp-simple\remote-workspace-temp\cb9122d28283bfc60fa3fef05a8732c0\www\iknowyou-cloud" "D:\Backup\iknowyou-cloud" /E /Y /D
```

## 🚨 문제 해결

### 1. 파일 동기화 문제
```bash
# Git 상태 확인
git status
git add .
git commit -m "Update files"
git push
```

### 2. 포트 충돌
```bash
# 포트 사용 확인
netstat -ano | findstr :8080

# 다른 포트 사용
node server.js --port 8081
```

### 3. 도메인 연결 문제
- DuckDNS 설정 확인
- 방화벽 설정 확인
- ISP 포트 차단 확인

## 📞 연락처

- **GitHub**: [your-username]
- **이메일**: [your-email]
- **DuckDNS**: pibuchi.duckdns.org

## 📝 작업 체크리스트

- [ ] GitHub 저장소 생성
- [ ] 프로젝트 업로드
- [ ] 집에서 Node.js 설치
- [ ] 집에서 Cursor 설치
- [ ] 프로젝트 클론
- [ ] 서버 실행 테스트
- [ ] 도메인 연결 테스트
- [ ] 백업 설정
- [ ] 보안 설정

---
**마지막 업데이트**: 2025-07-26
**버전**: 1.0 
