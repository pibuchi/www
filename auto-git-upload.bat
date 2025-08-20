@echo off
echo ========================================
echo Git 자동 업로드 시작
echo ========================================

cd /d C:\www

echo 현재 시간: %date% %time%
echo.

echo 1. Git 상태 확인...
git status

echo.
echo 2. 변경된 파일들을 스테이징...
git add .

echo.
echo 3. 커밋 생성...
git commit -m "Auto commit: %date% %time%"

echo.
echo 4. GitHub에 푸시...
git push origin main

echo.
echo ========================================
echo Git 자동 업로드 완료!
echo ========================================

pause
