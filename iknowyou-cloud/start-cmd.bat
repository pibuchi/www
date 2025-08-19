@echo off
echo ========================================
echo iknowyou.cloud 서버 시작
echo ========================================

echo 현재 디렉토리: %CD%
echo.

echo Node.js 버전 확인:
node --version
echo.

echo 포트 3000 사용 확인:
netstat -ano | findstr :3000
echo.

echo 서버 시작...
node simple-test.js

pause 
