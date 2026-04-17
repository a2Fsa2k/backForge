#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
backend_pid_file="$ROOT_DIR/.demo_backend.pid"
frontend_pid_file="$ROOT_DIR/.demo_frontend.pid"

stop_pidfile() {
  local f="$1"
  local name="$2"
  if [[ -f "$f" ]]; then
    pid="$(cat "$f" || true)"
    if [[ -n "${pid:-}" ]] && kill -0 "$pid" 2>/dev/null; then
      echo "Stopping $name (pid $pid)"
      kill "$pid" 2>/dev/null || true
      sleep 0.3
    fi
    rm -f "$f"
  fi
}

stop_pidfile "$backend_pid_file" "backend"
stop_pidfile "$frontend_pid_file" "frontend"

echo "Stopped." 
