@echo off
echo ========================================
echo iknowyou.cloud 집에서 설치 스크립트
echo ========================================
echo.

echo 1. Node.js 설치 확인...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js가 설치되지 않았습니다.
    echo.
    echo 📥 Node.js 다운로드:
    echo https://nodejs.org/
    echo.
    echo 설치 후 이 스크립트를 다시 실행하세요.
    pause
    exit /b 1
) else (
    echo ✅ Node.js가 설치되어 있습니다.
    node --version
)

echo.
echo 2. Git 설치 확인...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git이 설치되지 않았습니다.
    echo.
    echo 📥 Git 다운로드:
    echo https://git-scm.com/
    echo.
    echo 설치 후 이 스크립트를 다시 실행하세요.
    pause
    exit /b 1
) else (
    echo ✅ Git이 설치되어 있습니다.
    git --version
)

echo.
echo 3. 프로젝트 폴더 확인...
if not exist "iknowyou-cloud" (
    echo ❌ iknowyou-cloud 폴더를 찾을 수 없습니다.
    echo.
    echo 📁 프로젝트 폴더를 이 스크립트와 같은 위치에 복사하세요.
    echo 또는 GitHub에서 클론하세요:
    echo.
    echo git clone [your-repository-url]
    pause
    exit /b 1
) else (
    echo ✅ iknowyou-cloud 폴더를 찾았습니다.
)

echo.
echo 4. 프로젝트 폴더로 이동...
cd iknowyou-cloud
echo 현재 위치: %CD%

echo.
echo 5. 파일 상태 확인...
echo.
dir *.js | findstr /v "Directory"
echo.

echo 6. 서버 실행 테스트...
echo.
echo 🚀 서버를 시작합니다...
echo 포트 8080에서 실행됩니다.
echo.
echo 브라우저에서 다음 URL을 확인하세요:
echo - http://localhost:8080
echo - http://pibuchi.duckdns.org:8080
echo.
echo 서버를 종료하려면 Ctrl+C를 누르세요.
echo.

node server.js

echo.
echo ========================================
echo 서버가 종료되었습니다.
echo ========================================
pause 
