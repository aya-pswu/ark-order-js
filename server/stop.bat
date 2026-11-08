@echo off
title FZZL private server - stop
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop.ps1"
