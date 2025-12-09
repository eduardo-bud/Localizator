@echo off
REM Script para fazer push do Localizator para GitHub
REM Autor: Eduardo Bud
REM Data: Dezembro 2025

echo.
echo ========================================
echo   LOCALIZATOR - Push para GitHub
echo ========================================
echo.

cd "c:\Users\eduar\Documents\prog2\projeto rissi - vs1"

echo [1] Verificando status do repositório...
git status

echo.
echo [2] Mostrando commits prontos para push...
git log --oneline -5

echo.
echo [3] Fazendo push para GitHub...
echo.
echo Digite seu USERNAME (edward-bud) quando solicitado
echo Digite seu PERSONAL ACCESS TOKEN quando solicitado
echo.
pause

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ PUSH CONCLUÍDO COM SUCESSO!
    echo ========================================
    echo.
    echo Seu projeto está agora em:
    echo https://github.com/eduardo-bud/Localizator
    echo.
    pause
) else (
    echo.
    echo ========================================
    echo   ❌ ERRO NO PUSH
    echo ========================================
    echo.
    echo Verifique:
    echo 1. Token é válido?
    echo 2. Username está correto?
    echo 3. Repositório está público?
    echo.
    pause
)
