#!/bin/sh
set -eu

: "${APP_ENTRY:=dist/src/main.js}"

exec /usr/bin/dumb-init node "$APP_ENTRY"
