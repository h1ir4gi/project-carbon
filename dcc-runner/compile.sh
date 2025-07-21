#!/bin/bash

SOURCE_FILE="main.c"
STDIN_FILE="stdin"
OUT_FILE="/tmp/out"

read -r json

echo "$json" | jq -r '.source' > $SOURCE_FILE
echo "$json" | jq -r '.stdin' > $STDIN_FILE

run_dcc_help() {
  echo "[?] Don't understand? Here's what dcc-help says:"
  if ! dcc-help 2>&1; then
    echo "[x] Failed to get dcc-help explanation"
    exit 1
  fi
}

# temporarily comment out dcc stuff so we can run the program instead 
# Try to compile
if ! dcc -Werror "$SOURCE_FILE" -o "$OUT_FILE" 2>&1; then
#   echo "[!] Compilation failed"
  run_dcc_help || exit 1
  exit 0
fi

# Try to run
if ! "$OUT_FILE" < "$STDIN_FILE" 2>&1; then
#   echo "[!] Runtime error or timeout"
  run_dcc_help || exit 1
  exit 0
fi


