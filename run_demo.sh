#!/usr/bin/env bash
set -euo pipefail

# MediConnect demo runner
# - Starts backend on :8000
# - Resets DB to clean seed state
# - Starts a static frontend server
# - Opens index.html in the default browser

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PORT="${PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-5500}"

backend_pid_file="$ROOT_DIR/.demo_backend.pid"
frontend_pid_file="$ROOT_DIR/.demo_frontend.pid"

cleanup_existing() {
  if [[ -f "$backend_pid_file" ]]; then
    oldpid="$(cat "$backend_pid_file" || true)"
    if [[ -n "${oldpid:-}" ]] && kill -0 "$oldpid" 2>/dev/null; then
      echo "Stopping previous backend (pid $oldpid)"
      kill "$oldpid" 2>/dev/null || true
      sleep 0.5
    fi
    rm -f "$backend_pid_file"
  fi

  if [[ -f "$frontend_pid_file" ]]; then
    oldpid="$(cat "$frontend_pid_file" || true)"
    if [[ -n "${oldpid:-}" ]] && kill -0 "$oldpid" 2>/dev/null; then
      echo "Stopping previous frontend server (pid $oldpid)"
      kill "$oldpid" 2>/dev/null || true
      sleep 0.5
    fi
    rm -f "$frontend_pid_file"
  fi

  # Also free ports in case something else is listening.
  if command -v lsof >/dev/null 2>&1; then
    for p in "$BACKEND_PORT" "$FRONTEND_PORT"; do
      pids=$(lsof -ti tcp:"$p" || true)
      if [[ -n "${pids:-}" ]]; then
        echo "Killing processes on port $p: $pids"
        kill $pids 2>/dev/null || true
      fi
    done
  fi
}

wait_for() {
  local url="$1"
  local label="$2"
  echo -n "Waiting for $label"
  for _ in {1..40}; do
    if curl -sS "$url" >/dev/null 2>&1; then
      echo " ✓"
      return 0
    fi
    echo -n "."
    sleep 0.25
  done
  echo
  echo "ERROR: $label did not start: $url" >&2
  return 1
}

open_browser() {
  local url="$1"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  elif command -v gio >/dev/null 2>&1; then
    gio open "$url" >/dev/null 2>&1 || true
  else
    echo "Open this URL in your browser: $url"
  fi
}

main() {
  cd "$ROOT_DIR"

  cleanup_existing

  echo "Starting backend (npm run dev)…"
  # Run in background and store pid
  npm run dev >/dev/null 2>&1 &
  echo $! > "$backend_pid_file"

  wait_for "http://localhost:${BACKEND_PORT}/api/health" "backend"

  echo "Resetting DB to seed state…"
  # Login to get JWT token, then reset using that token
  token=$(curl -sS -X POST "http://localhost:${BACKEND_PORT}/api/doctor/auth/login" \
    -H 'Content-Type: application/json' \
    -d '{"email":"doctor@demo.com","password":"demo123"}' \
    | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.token||'');}catch(e){process.stdout.write('');}})" )

  if [[ -z "${token:-}" ]]; then
    echo "ERROR: Could not login to obtain JWT for reset. Is backend running and seeded?" >&2
    exit 1
  fi

  curl -sS -X POST "http://localhost:${BACKEND_PORT}/api/demo/reset" \
    -H "Authorization: Bearer ${token}" \
    | cat

  echo "\nStarting frontend server on :${FRONTEND_PORT}…"
  npx --yes http-server "$ROOT_DIR" -p "$FRONTEND_PORT" -c-1 >/dev/null 2>&1 &
  echo $! > "$frontend_pid_file"

  wait_for "http://localhost:${FRONTEND_PORT}/index.html" "frontend"

  echo "Opening browser…"
  open_browser "http://localhost:${FRONTEND_PORT}/index.html"

  echo
  echo "Demo is ready: http://localhost:${FRONTEND_PORT}/index.html"
  echo "Backend:      http://localhost:${BACKEND_PORT}/api/health"
  echo
  echo "Stop demo: run ./stop_demo.sh"
}

main "$@"
