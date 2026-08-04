@echo off
setlocal enabledelayedexpansion
rem ============================================================
rem  Кузница персонажей Dolmenwood — запуск
rem  Работает из любой папки на любом компьютере: все пути
rem  берутся относительно самого этого файла (%~dp0).
rem ============================================================

cd /d "%~dp0"

if not exist "index.html" (
  echo [!] Рядом с этим файлом нет index.html.
  echo     Положи start.bat в ту же папку, что и index.html.
  pause
  exit /b 1
)

rem --- Ищем свободный порт, начиная с 8777 -------------------
set PORT=
for %%P in (8777 8778 8779 8780 8781 8899 9123) do (
  if not defined PORT (
    netstat -ano -p tcp | findstr /r /c:":%%P .*LISTENING" >nul 2>nul
    if errorlevel 1 set PORT=%%P
  )
)

if not defined PORT (
  echo [i] Все привычные порты заняты — открываю файл напрямую.
  start "" "index.html"
  exit /b 0
)

rem --- Ищем, чем поднять сервер ------------------------------
set LAUNCHER=
where python >nul 2>nul && set LAUNCHER=python
if not defined LAUNCHER ( where py     >nul 2>nul && set LAUNCHER=py )
if not defined LAUNCHER ( where python3 >nul 2>nul && set LAUNCHER=python3 )

if defined LAUNCHER (
  echo.
  echo   Кузница персонажей Dolmenwood
  echo   http://localhost:%PORT%/
  echo.
  echo   Не закрывай это окно, пока пользуешься сайтом.
  echo   Чтобы остановить — Ctrl+C или просто закрой окно.
  echo.
  start "" "http://localhost:%PORT%/"
  %LAUNCHER% -m http.server %PORT%
  exit /b 0
)

where npx >nul 2>nul
if not errorlevel 1 (
  echo.
  echo   Кузница персонажей Dolmenwood
  echo   http://localhost:%PORT%/
  echo.
  start "" "http://localhost:%PORT%/"
  npx --yes serve -l %PORT% .
  exit /b 0
)

rem --- Ничего не нашли: сайт прекрасно работает и так --------
echo [i] Ни python, ни npx не найдены — открываю index.html напрямую.
echo     Сайт полностью работает и так; сервер нужен только для того,
echo     чтобы браузер надёжнее хранил каталог персонажей.
start "" "index.html"
exit /b 0
