# 🔐 SSH 원격 접속 수동 설정 가이드

## 📋 현재 PC에서 설정 (관리자 권한 필요)

### 1단계: OpenSSH 서버 설치

#### Windows 10/11에서:
1. **Windows 설정** → **앱** → **선택적 기능**
2. **기능 추가** 클릭
3. **OpenSSH 서버** 검색 후 설치

#### 또는 PowerShell (관리자 권한):
```powershell
# 관리자 권한으로 PowerShell 실행
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

### 2단계: SSH 서비스 시작

#### 서비스 관리자에서:
1. **Win + R** → `services.msc` 입력
2. **OpenSSH SSH Server** 찾기
3. **시작** 및 **자동 시작** 설정

#### 또는 PowerShell:
```powershell
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'
```

### 3단계: 방화벽 설정

#### Windows 방화벽에서:
1. **Windows 보안** → **방화벽 및 네트워크 보호**
2. **고급 설정**
3. **인바운드 규칙** → **새 규칙**
4. **포트** 선택 → **TCP** → **특정 포트: 22**
5. **연결 허용** → **도메인, 개인, 공용** 모두 체크
6. 이름: **OpenSSH Server**

#### 또는 PowerShell:
```powershell
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server' -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow
```

### 4단계: IP 주소 확인

```powershell
# 현재 IP 주소 확인
ipconfig

# 또는 더 자세히
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.*'}
```

### 5단계: 사용자 계정 설정

```powershell
# 현재 사용자 확인
echo $env:USERNAME

# SSH 키 생성 (선택사항)
ssh-keygen -t rsa -b 4096
```

## 🏠 집에서 설정

### 1단계: VS Code 설치
1. **VS Code 다운로드**: https://code.visualstudio.com/
2. **설치 완료**

### 2단계: Remote-SSH 확장 설치
1. VS Code 열기
2. **확장** 탭 (Ctrl+Shift+X)
3. **Remote - SSH** 검색 후 설치
4. **Remote - SSH: Editing Configuration Files** 설치

### 3단계: SSH 연결 설정

#### VS Code에서:
1. **F1** 또는 **Ctrl+Shift+P**
2. **Remote-SSH: Connect to Host** 입력
3. **Add New SSH Host** 선택
4. 연결 문자열 입력: `ssh pibuc@[IP주소]`
5. 설정 파일 선택 (기본값 사용)

#### 또는 수동 설정:
1. **F1** → **Remote-SSH: Open SSH Configuration File**
2. 다음 내용 추가:
```
Host iknowyou-pc
    HostName [IP주소]
    User pibuc
    Port 22
```

### 4단계: 원격 연결

1. **F1** → **Remote-SSH: Connect to Host**
2. **iknowyou-pc** 선택
3. **Linux** 선택 (Windows지만 SSH는 Linux 환경으로 인식)
4. 비밀번호 입력

### 5단계: 프로젝트 폴더 열기

1. **파일** → **폴더 열기**
2. 프로젝트 경로 입력:
```
C:\Users\pibuc\AppData\Roaming\Cursor\User\globalStorage\humy2833.ftp-simple\remote-workspace-temp\cb9122d28283bfc60fa3fef05a8732c0\www\iknowyou-cloud
```

## 🔧 고급 설정

### 1. SSH 키 인증 (보안 강화)

#### 현재 PC에서:
```powershell
# SSH 키 생성
ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\id_rsa"

# 공개키를 authorized_keys에 추가
type "$env:USERPROFILE\.ssh\id_rsa.pub" >> "$env:USERPROFILE\.ssh\authorized_keys"
```

#### 집에서:
```bash
# SSH 키 생성
ssh-keygen -t rsa -b 4096

# 공개키를 원격 PC에 복사
ssh-copy-id pibuc@[IP주소]
```

### 2. 포트 포워딩 (외부 접속)

#### 라우터 설정:
1. 라우터 관리 페이지 접속
2. **포트 포워딩** 설정
3. **외부 포트**: 2222 → **내부 포트**: 22
4. **내부 IP**: 현재 PC IP 주소

#### SSH 설정:
```
Host iknowyou-pc-external
    HostName [외부IP]
    User pibuc
    Port 2222
```

### 3. 자동 연결 스크립트

#### 집에서 사용할 스크립트:
```bash
#!/bin/bash
# connect-remote.sh
ssh -X pibuc@[IP주소] "cd /mnt/c/Users/pibuc/AppData/Roaming/Cursor/User/globalStorage/humy2833.ftp-simple/remote-workspace-temp/cb9122d28283bfc60fa3fef05a8732c0/www/iknowyou-cloud && bash"
```

## 🚨 문제 해결

### 1. 연결 거부
```powershell
# SSH 서비스 상태 확인
Get-Service sshd

# 서비스 재시작
Restart-Service sshd
```

### 2. 방화벽 문제
```powershell
# 방화벽 규칙 확인
Get-NetFirewallRule -Name sshd

# 규칙 삭제 후 재생성
Remove-NetFirewallRule -Name sshd
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server' -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow
```

### 3. 권한 문제
```powershell
# SSH 디렉토리 권한 설정
icacls "$env:USERPROFILE\.ssh" /grant "$env:USERNAME:(F)"
```

### 4. 포트 사용 중
```powershell
# 포트 22 사용 확인
netstat -ano | findstr :22

# 다른 포트 사용
# sshd_config 파일에서 Port 2222로 변경
```

## 📱 모바일 접속

### 1. Termius (iOS/Android)
1. **Termius** 앱 설치
2. **새 호스트** 추가
3. **SSH** 연결 설정

### 2. JuiceSSH (Android)
1. **JuiceSSH** 앱 설치
2. **연결** → **새 연결**
3. SSH 설정 입력

## 🔒 보안 고려사항

### 1. 강력한 비밀번호 사용
### 2. SSH 키 인증 사용
### 3. 기본 포트 변경 (22 → 2222)
### 4. fail2ban 설치 (선택사항)
### 5. 정기적인 업데이트

## 📞 연결 정보

- **호스트**: [IP주소]
- **사용자**: pibuc
- **포트**: 22
- **프로젝트 경로**: [프로젝트경로]

---
**마지막 업데이트**: 2025-07-26
**버전**: 1.0 
