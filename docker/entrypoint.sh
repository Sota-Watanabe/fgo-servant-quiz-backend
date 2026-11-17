#!/bin/sh
set -eu

: "${APP_ENTRY:=dist/src/main.js}"

if [ -x /usr/bin/dumb-init ]; then
  exec /usr/bin/dumb-init -- node "$APP_ENTRY"
fi

exec node "$APP_ENTRY"
