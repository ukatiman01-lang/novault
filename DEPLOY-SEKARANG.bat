@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ════════════════════════════════════════════════════════════
echo 🚀 DEPLOYMENT KE VPS - usenovault.fun
echo ════════════════════════════════════════════════════════════
echo.

set VPS_IP=213.199.38.187
set VPS_USER=root
set DEPLOY_DIR=D:\novault
set REMOTE_DIR=/opt/nextjs-app

echo 📂 Step 1: Copy files ke VPS...
echo.
cd /d %DEPLOY_DIR%
scp -r --exclude node_modules --exclude .next --exclude .git . %VPS_USER%@%VPS_IP%:%REMOTE_DIR%/

if errorlevel 1 (
    echo ❌ SCP gagal! Cek koneksi VPS
    pause
    exit /b 1
)

echo.
echo ✅ Files copied!
echo.
echo 🚀 Step 2: Running deployment script...
echo.

ssh %VPS_USER%@%VPS_IP% "bash %REMOTE_DIR%/deploy-vps.sh"

if errorlevel 1 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo ✨ DEPLOYMENT COMPLETE!
echo ════════════════════════════════════════════════════════════
echo.
echo 🌐 Buka: https://usenovault.fun
echo.
pause
