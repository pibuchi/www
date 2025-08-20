# Git 자동 업로드 PowerShell 스크립트
param(
    [string]$CommitMessage = "Auto commit",
    [switch]$Watch
)

function AutoGitUpload {
    param([string]$Message)
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Git 자동 업로드 시작" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
    # 현재 디렉토리로 이동
    Set-Location "C:\www"
    
    # 현재 시간 표시
    $currentTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "현재 시간: $currentTime" -ForegroundColor Yellow
    
    try {
        # Git 상태 확인
        Write-Host "`n1. Git 상태 확인..." -ForegroundColor Cyan
        $status = git status --porcelain
        
        if ($status) {
            Write-Host "변경된 파일들:" -ForegroundColor Yellow
            $status | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
            
            # 변경된 파일들을 스테이징
            Write-Host "`n2. 변경된 파일들을 스테이징..." -ForegroundColor Cyan
            git add .
            
            # 커밋 생성
            Write-Host "`n3. 커밋 생성..." -ForegroundColor Cyan
            $commitMsg = "$Message - $currentTime"
            git commit -m $commitMsg
            
            # GitHub에 푸시
            Write-Host "`n4. GitHub에 푸시..." -ForegroundColor Cyan
            git push origin main
            
            Write-Host "`n========================================" -ForegroundColor Green
            Write-Host "Git 자동 업로드 완료!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
        } else {
            Write-Host "`n변경된 파일이 없습니다." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "`n오류 발생: $_" -ForegroundColor Red
    }
}

# 메인 실행
if ($Watch) {
    Write-Host "파일 감시 모드 시작... (Ctrl+C로 종료)" -ForegroundColor Green
    Write-Host "감시 중인 폴더: C:\www" -ForegroundColor Yellow
    
    # 파일 시스템 감시
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = "C:\www"
    $watcher.Filter = "*.*"
    $watcher.IncludeSubdirectories = $true
    $watcher.EnableRaisingEvents = $true
    
    # 이벤트 핸들러
    $action = {
        $path = $Event.SourceEventArgs.FullPath
        $changeType = $Event.SourceEventArgs.ChangeType
        $timeStamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        
        Write-Host "`n[$timeStamp] $changeType : $path" -ForegroundColor Magenta
        
        # 5초 대기 후 자동 업로드
        Start-Sleep -Seconds 5
        AutoGitUpload "File change detected"
    }
    
    # 이벤트 등록
    Register-ObjectEvent $watcher "Changed" -Action $action
    Register-ObjectEvent $watcher "Created" -Action $action
    Register-ObjectEvent $watcher "Deleted" -Action $action
    Register-ObjectEvent $watcher "Renamed" -Action $action
    
    try {
        while ($true) { Start-Sleep -Seconds 1 }
    }
    finally {
        $watcher.EnableRaisingEvents = $false
        $watcher.Dispose()
    }
} else {
    AutoGitUpload $CommitMessage
}
