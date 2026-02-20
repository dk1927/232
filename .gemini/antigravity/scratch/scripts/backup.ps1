# Portfolio DB Backup Script
# Schedule via Windows Task Scheduler to run daily at midnight

$projectDir = Split-Path -Parent $PSScriptRoot
Set-Location $projectDir

Write-Host "Starting DB backup..." -ForegroundColor Cyan
npx ts-node scripts/backup.ts

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup completed successfully." -ForegroundColor Green
} else {
    Write-Host "Backup failed with exit code $LASTEXITCODE" -ForegroundColor Red
}
