# 🔐 SSH 연결 정보

## 📋 현재 PC 정보

### IP 주소
- **주요 IP**: 192.168.219.49 (이더넷)
- **보조 IP**: 172.23.128.1 (이더넷 3)

### 사용자 정보
- **사용자명**: pibuc
- **프로젝트 경로**: C:\Users\pibuc\AppData\Roaming\Cursor\User\globalStorage\humy2833.ftp-simple\remote-workspace-temp\cb9122d28283bfc60fa3fef05a8732c0\www\iknowyou-cloud

## 🏠 집에서 연결 방법

### 1. VS Code Remote-SSH 사용 (권장)

#### SSH 설정 파일 (~/.ssh/config):
```
Host iknowyou-pc
    HostName 192.168.219.49
    User pibuc
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

#### 연결 명령어:
```bash
# VS Code에서
# F1 → Remote-SSH: Connect to Host → iknowyou-pc

# 또는 터미널에서
ssh pibuc@192.168.219.49
```

### 2. 터미널에서 직접 연결

#### Windows (PowerShell):
```powershell
ssh pibuc@192.168.219.49
```

#### macOS/Linux:
```bash
ssh pibuc@192.168.219.49
```

### 3. 모바일 앱 연결

#### Termius (iOS/Android):
- **호스트**: 192.168.219.49
- **사용자**: pibuc
- **포트**: 22
- **인증**: 비밀번호 또는 SSH 키

#### JuiceSSH (Android):
- **연결 이름**: iknowyou-pc
- **주소**: 192.168.219.49
- **사용자명**: pibuc
- **포트**: 22

## 🔧 프로젝트 작업

### 연결 후 프로젝트 폴더로 이동:
```bash
cd "C:\Users\pibuc\AppData\Roaming\Cursor\User\globalStorage\humy2833.ftp-simple\remote-workspace-temp\cb9122d28283bfc60fa3fef05a8732c0\www\iknowyou-cloud"
```

### 서버 실행:
```bash
# 메인 서버
node server.js

# 또는 테스트 서버
node test.js
```

### 도메인 테스트:
- **로컬**: http://localhost:8080
- **DuckDNS**: http://pibuchi.duckdns.org:8080

## 🚨 주의사항

### 1. 네트워크 연결
- **같은 네트워크**: 192.168.219.49 사용
- **외부 네트워크**: 라우터 포트 포워딩 필요

### 2. 보안
- **강력한 비밀번호** 사용
- **SSH 키 인증** 권장
- **방화벽 설정** 확인

### 3. 서비스 상태
- **SSH 서비스** 실행 중 확인
- **포트 22** 열려있는지 확인

## 📱 빠른 연결 스크립트

### 집에서 사용할 스크립트 (connect.sh):
```bash
#!/bin/bash
echo "iknowyou.cloud 원격 연결 중..."
ssh pibuc@192.168.219.49
```

### 실행 권한 부여:
```bash
chmod +x connect.sh
./connect.sh
```

## 🔒 보안 설정

### SSH 키 생성 (집에서):
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/iknowyou_key
```

### 공개키 복사:
```bash
ssh-copy-id -i ~/.ssh/iknowyou_key.pub pibuc@192.168.219.49
```

### SSH 설정 파일 (~/.ssh/config):
```
Host iknowyou-pc
    HostName 192.168.219.49
    User pibuc
    Port 22
    IdentityFile ~/.ssh/iknowyou_key
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

## 📞 문제 해결

### 연결이 안 될 때:
1. **IP 주소 확인**: `ipconfig` (현재 PC에서)
2. **SSH 서비스 확인**: `Get-Service sshd` (현재 PC에서)
3. **방화벽 확인**: Windows 방화벽 설정
4. **네트워크 확인**: 같은 네트워크인지 확인

### 포트 변경이 필요한 경우:
1. **SSH 설정 파일**: `C:\ProgramData\ssh\sshd_config`
2. **포트 변경**: `Port 2222`
3. **방화벽 규칙**: 포트 2222 추가
4. **연결 시**: `ssh pibuc@192.168.219.49 -p 2222`

---
**마지막 업데이트**: 2025-07-26
**IP 주소**: 192.168.219.49
**사용자**: pibuc 
