# ============================================================================
# SAKSHAM AI - PowerShell Multi-Service Runner
# ============================================================================

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  SAKSHAM AI - Skill Intelligence Platform (SIH26101)" -ForegroundColor Yellow
Write-Host "  IIT Madras BS Degree Programme • Team 404 not founders" -ForegroundColor White
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/3] Starting Python AI & RAG Engine (FastAPI - Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\ai_service'; python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 3

Write-Host "[2/3] Starting Node.js API Gateway & RBAC Service (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\gateway_service'; npm start"

Start-Sleep -Seconds 3

Write-Host "[3/3] Starting Next.js Web Frontend (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\frontend'; npm run dev"

Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  All Services are online!" -ForegroundColor Yellow
Write-Host "  • Frontend:       http://localhost:3000" -ForegroundColor White
Write-Host "  • API Gateway:    http://localhost:5000" -ForegroundColor White
Write-Host "  • AI Swagger Doc: http://localhost:8000/docs" -ForegroundColor White
Write-Host "============================================================================" -ForegroundColor Cyan
