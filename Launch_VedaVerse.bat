@echo off
title VedaVerse Galactic Launcher

echo 🚀 Starting VedaVerse Engine (Backend)...
start cmd /k "cd G:\VedaVerse\vedaverse-backend && node server.js"

echo 🌌 Launching VedaVerse Portal (Frontend)...
start cmd /k "cd G:\VedaVerse\vedaverse-frontend && npm run dev"

echo ✅ Both systems are launching! 
echo 🌐 Open http://localhost:3000 in your browser.
pause