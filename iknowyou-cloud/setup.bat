@echo off
echo ========================================
echo iknowyou.cloud 시스템 설치 스크립트
echo ========================================

echo.
echo 1. 필요한 소프트웨어 확인 중...

REM Node.js 확인
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js가 설치되어 있지 않습니다.
    echo https://nodejs.org에서 Node.js를 설치해주세요.
    pause
    exit /b 1
)

REM Java 확인
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java가 설치되어 있지 않습니다.
    echo https://adoptium.net에서 Java 17을 설치해주세요.
    pause
    exit /b 1
)

REM Python 확인
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python이 설치되어 있지 않습니다.
    echo https://python.org에서 Python 3.9+를 설치해주세요.
    pause
    exit /b 1
)

echo [OK] 기본 소프트웨어 확인 완료

echo.
echo 2. 환경 변수 파일 설정...
if not exist .env (
    copy env.example .env
    echo [INFO] .env 파일이 생성되었습니다. 필요한 값들을 설정해주세요.
    notepad .env
)

echo.
echo 3. MySQL 설치 확인...
echo [INFO] MySQL을 설치하지 않았다면 다음 중 하나를 선택하세요:
echo 1. XAMPP 설치 (https://www.apachefriends.org/)
echo 2. MySQL Community Server 설치 (https://dev.mysql.com/downloads/)
echo 3. Docker 사용 (docker-compose up mysql)

echo.
echo 4. Nginx 설치 확인...
echo [INFO] Nginx를 설치하지 않았다면 다음 중 하나를 선택하세요:
echo 1. Nginx for Windows 설치 (http://nginx.org/en/download.html)
echo 2. Docker 사용 (docker-compose up nginx)

echo.
echo 5. 의존성 설치...

REM Front Office
echo [INFO] Front Office 의존성 설치 중...
cd front-office
call npm install
cd ..

REM Back Office
echo [INFO] Back Office 의존성 설치 중...
cd back-office
call npm install
cd ..

REM AI Server
echo [INFO] AI Server 의존성 설치 중...
cd ai-server
pip install -r requirements.txt
cd ..

echo.
echo 6. 서비스 시작...
echo [INFO] 각 서비스를 별도 터미널에서 시작하세요:

echo.
echo Front Office (터미널 1):
echo cd front-office
echo npm run dev

echo.
echo Back Office (터미널 2):
echo cd back-office
echo npm run dev

echo.
echo API Server (터미널 3):
echo cd api-server
echo mvn spring-boot:run

echo.
echo AI Server (터미널 4):
echo cd ai-server
echo python main.py

echo.
echo Nginx (관리자 권한):
echo nginx -c "C:\path\to\iknowyou-cloud\nginx\nginx.conf"

echo.
echo ========================================
echo 설치 완료!
echo ========================================
pause 
