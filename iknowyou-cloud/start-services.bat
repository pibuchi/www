@echo off
echo ========================================
echo iknowyou.cloud 서비스 시작 스크립트
echo ========================================

echo.
echo 각 서비스를 별도 터미널에서 시작합니다...
echo.

echo 1. Front Office 시작 (터미널 1)
start "Front Office" cmd /k "cd front-office && npm run dev"

echo 2. Back Office 시작 (터미널 2)
start "Back Office" cmd /k "cd back-office && npm run dev"

echo 3. API Server 시작 (터미널 3)
start "API Server" cmd /k "cd api-server && mvn spring-boot:run"

echo 4. AI Server 시작 (터미널 4)
start "AI Server" cmd /k "cd ai-server && python main.py"

echo.
echo 모든 서비스가 시작되었습니다.
echo.
echo 접속 URL:
echo - Front Office: http://localhost:3000
echo - Back Office: http://localhost:3001
echo - API Server: http://localhost:8080
echo - AI Server: http://localhost:8081
echo.
echo Nginx를 별도로 시작하려면 관리자 권한으로 실행하세요:
echo nginx -c "C:\path\to\iknowyou-cloud\nginx\nginx.conf"
echo.
pause 
