@echo off
chcp 65001 >nul
title Hamdy Motion Kit - Install
echo.
echo  ==========================================
echo     Hamdy Motion Kit  -  After Effects
echo  ==========================================
echo.
if not exist "%~dp0extension\index.html" (
  echo  [!] Extract the ZIP first: right-click the ZIP ^> Extract All, then run this file from the extracted folder.
  echo.
  pause
  exit /b 1
)
tasklist /FI "IMAGENAME eq AfterFX.exe" 2>nul | find /I "AfterFX.exe" >nul && echo  [i] After Effects is open - close it and open it again after the install.
for %%v in (9 10 11 12 13 14 15 16) do reg add "HKCU\Software\Adobe\CSXS.%%v" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul
set "EXTS=%APPDATA%\Adobe\CEP\extensions"
if not exist "%EXTS%" mkdir "%EXTS%"
if exist "%EXTS%\com.nabd.motionkit" rmdir /s /q "%EXTS%\com.nabd.motionkit"
set "DEST=%EXTS%\com.hamdy.motionkit"
if exist "%DEST%" rmdir /s /q "%DEST%"
xcopy "%~dp0extension" "%DEST%\" /e /i /y /q >nul
if exist "%DEST%\index.html" (
  echo  [OK] Installed!
  echo.
  echo  1^) Open After Effects
  echo  2^) Window  ^>  Extensions  ^>  Hamdy Motion Kit
  echo.
  echo  From now on it updates itself from GitHub every time you open it.
) else (
  echo  [!] Something went wrong while copying. Send a screenshot of this window.
)
echo.
pause
