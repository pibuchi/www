@echo off
echo ========================================
echo SSH 원격 접속 설정
echo ========================================
echo.

echo 1. OpenSSH 서버 설치 확인...
powershell -Command "Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'"

echo.
echo 2. OpenSSH 서버 설치...
powershell -Command "Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0"

echo.
echo 3. SSH 서비스 시작...
powershell -Command "Start-Service sshd"
powershell -Command "Set-Service -Name sshd -StartupType 'Automatic'"

echo.
echo 4. 방화벽 규칙 추가...
powershell -Command "New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22"

echo.
echo 5. 현재 IP 주소 확인...
powershell -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.*'} | Select-Object IPAddress, InterfaceAlias"

echo.
echo 6. 사용자 계정 정보...
echo 현재 사용자: %USERNAME%
echo.

echo 7. SSH 연결 테스트...
echo.
echo 집에서 다음 명령어로 연결하세요:
echo.
echo ssh %USERNAME%@[IP주소]
echo.
echo 예시:
echo ssh pibuc@192.168.1.100
echo.

echo 8. VS Code Remote SSH 확장 설치 안내...
echo.
echo VS Code에서 다음 확장을 설치하세요:
echo - Remote - SSH
echo - Remote - SSH: Editing Configuration Files
echo.

echo 9. SSH 설정 파일 생성...
echo.
if not exist "%USERPROFILE%\.ssh" mkdir "%USERPROFILE%\.ssh"

echo 10. 프로젝트 폴더 정보...
echo.
echo 프로젝트 경로:
echo %CD%
echo.

echo ========================================
echo SSH 설정이 완료되었습니다!
echo ========================================
echo.
echo 📋 다음 단계:
echo 1. 집에서 VS Code 설치
echo 2. Remote-SSH 확장 설치
echo 3. SSH 연결 설정
echo 4. 원격 폴더 열기
echo.
pause 
