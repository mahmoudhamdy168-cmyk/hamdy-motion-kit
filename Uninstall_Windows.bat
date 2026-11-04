@echo off
title Hamdy Motion Kit - Uninstall
rmdir /s /q "%APPDATA%\Adobe\CEP\extensions\com.hamdy.motionkit" 2>nul
rmdir /s /q "%APPDATA%\Adobe\CEP\extensions\com.nabd.motionkit" 2>nul
echo  Hamdy Motion Kit removed.
pause
