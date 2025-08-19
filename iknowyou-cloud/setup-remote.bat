@echo off
echo ========================================
echo iknowyou.cloud 원격 작업 설정
echo ========================================
echo.

echo 1. 현재 작업 환경 정보 확인...
echo.
echo 프로젝트 위치:
echo %CD%
echo.
echo Node.js 버전:
node --version
echo.
echo Git 버전:
git --version
echo.

echo 2. 파일 상태 확인...
echo.
dir *.js | findstr /v "Directory"
echo.

echo 3. GitHub 저장소 초기화 (선택사항)...
echo.
set /p choice="GitHub 저장소를 생성하시겠습니까? (y/n): "
if /i "%choice%"=="y" (
    echo.
    echo Git 초기화 중...
    git init
    git add .
    git commit -m "Initial commit: iknowyou.cloud project"
    echo.
    echo GitHub 저장소 URL을 입력하세요:
    set /p repo_url="URL: "
    git remote add origin %repo_url%
    git branch -M main
    git push -u origin main
    echo.
    echo ✅ GitHub 저장소가 생성되었습니다!
) else (
    echo GitHub 저장소 생성을 건너뜁니다.
)

echo.
echo 4. 백업 폴더 생성...
if not exist "D:\Backup" mkdir "D:\Backup"
if not exist "D:\Backup\iknowyou-cloud" mkdir "D:\Backup\iknowyou-cloud"
echo ✅ 백업 폴더가 생성되었습니다.

echo.
echo 5. 현재 파일 백업...
xcopy "%CD%" "D:\Backup\iknowyou-cloud" /E /Y /D
echo ✅ 파일 백업이 완료되었습니다.

echo.
echo 6. 원격 접속 정보...
echo.
echo 📱 TeamViewer 또는 AnyDesk 설치:
echo    - TeamViewer: https://www.teamviewer.com/
echo    - AnyDesk: https://anydesk.com/
echo.
echo 🌐 DuckDNS 도메인:
echo    - http://pibuchi.duckdns.org:8080
echo.
echo 📁 프로젝트 폴더:
echo    %CD%
echo.

echo 7. 집에서 작업할 때 필요한 명령어...
echo.
echo cd iknowyou-cloud
echo node server.js
echo.
echo 또는
echo.
echo node test.js
echo.

echo ========================================
echo 설정이 완료되었습니다!
echo ========================================
echo.
echo 📋 다음 단계:
echo 1. 집에서 Node.js 설치
echo 2. 집에서 Cursor 설치
echo 3. 프로젝트 폴더 복사 또는 Git 클론
echo 4. 서버 실행 테스트
echo.
pause 