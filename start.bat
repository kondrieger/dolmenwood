@echo off
rem Запуск локального сервера для «Кузницы персонажей Dolmenwood».
rem Сайт работает и просто по двойному клику на index.html, но через сервер
rem состояние в localStorage сохраняется надёжнее.

cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8777/
  python -m http.server 8777
  goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8777/
  py -m http.server 8777
  goto :eof
)

where npx >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8777/
  npx --yes serve -l 8777 .
  goto :eof
)

echo Не нашёл ни python, ни npx. Просто открой index.html двойным кликом.
start "" index.html
pause
