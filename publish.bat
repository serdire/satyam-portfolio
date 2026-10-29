@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "D:\Project\publish-to-github.ps1" -RepoName "satyam-portfolio" -Description "Satyam Kulshreshtha Developer Portfolio // ponytail.dev aesthetic" %*
echo.
pause
