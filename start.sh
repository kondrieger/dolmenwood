#!/usr/bin/env sh
# Кузница персонажей Dolmenwood — запуск на macOS и Linux.
# Все пути берутся относительно самого файла, так что работает из любой папки.

cd "$(dirname "$0")" || exit 1

if [ ! -f index.html ]; then
  echo "[!] Рядом с этим файлом нет index.html."
  exit 1
fi

PORT=""
for p in 8777 8778 8779 8780 8781 8899 9123; do
  if ! (command -v nc >/dev/null 2>&1 && nc -z 127.0.0.1 "$p" >/dev/null 2>&1); then
    PORT="$p"; break
  fi
done
[ -z "$PORT" ] && PORT=8777

open_browser() {
  if command -v open    >/dev/null 2>&1; then open "$1"
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$1"
  fi
}

if command -v python3 >/dev/null 2>&1; then
  echo "  Кузница персонажей Dolmenwood -> http://localhost:$PORT/"
  ( sleep 1; open_browser "http://localhost:$PORT/" ) &
  exec python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  ( sleep 1; open_browser "http://localhost:$PORT/" ) &
  exec python -m http.server "$PORT"
elif command -v npx >/dev/null 2>&1; then
  ( sleep 1; open_browser "http://localhost:$PORT/" ) &
  exec npx --yes serve -l "$PORT" .
else
  echo "[i] Ни python, ни npx не найдены — открываю index.html напрямую."
  open_browser "index.html"
fi
