@echo off
title Saksham AI - Skill Intelligence & Learning Platform (SIH26101)
echo ============================================================================
echo   SAKSHAM AI - Skill Intelligence Platform for Official Statistical System
echo   Smart India Hackathon 2026 • SIH26101 • Team 404 not founders
echo ============================================================================
echo.

echo [1/3] Starting Python AI & RAG Engine (FastAPI on Port 8000)...
start "Saksham AI - Python Engine" cmd /k "cd /d %~dp0backend\ai_service && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Node.js API Gateway & RBAC Service (Port 5000)...
start "Saksham AI - API Gateway" cmd /k "cd /d %~dp0backend\gateway_service && npm start"

timeout /t 3 /nobreak >nul

echo [3/3] Starting Vite React.js Frontend (Port 3000)...
start "Saksham AI - Vite React Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ============================================================================
echo   All Saksham AI services have been launched!
echo   • Frontend Web App (Vite): http://localhost:3000
echo   • API Gateway & Auth:     http://localhost:5000
echo   • Python AI / RAG Engine: http://localhost:8000/docs
echo ============================================================================
pause
