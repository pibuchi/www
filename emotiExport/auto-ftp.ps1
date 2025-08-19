# FTP Mini 자동 실행 스크립트
param(
    [string]$FtpHost = "nfcouncil.co.kr",
    [string]$Username = "YOUR_USERNAME",
    [string]$Password = "YOUR_PASSWORD"
)

Write-Host "FTP Mini 자동 연결을 시작합니다..." -ForegroundColor Green

# FTP Mini 실행 (경로는 실제 설치 경로로 수정 필요)
$ftpMiniPath = "C:\Program Files\FTP Mini\FTPMini.exe"

if (Test-Path $ftpMiniPath) {
    Start-Process $ftpMiniPath
    Write-Host "FTP Mini가 실행되었습니다. 수동으로 연결 정보를 입력해주세요." -ForegroundColor Yellow
} else {
    Write-Host "FTP Mini를 찾을 수 없습니다. 경로를 확인해주세요." -ForegroundColor Red
}

Write-Host "연결 정보:" -ForegroundColor Cyan
Write-Host "Host: $FtpHost" -ForegroundColor White
Write-Host "Username: $Username" -ForegroundColor White
Write-Host "Port: 22 (SFTP)" -ForegroundColor White 