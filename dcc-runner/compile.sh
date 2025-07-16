#!/bin/bash

SOURCE_FILE="$1"
STDIN_FILE="$2"
OUT_FILE="/root/program"

# Try to compile
if ! dcc "$SOURCE_FILE" -o "$OUT_FILE" 2>/root/compile_errors.txt; then
  echo "[!] Compilation failed"
  dcc-help > /root/dcc_help_output.txt || echo "[x] Failed to get dcc-help explanation"
  cat /root/dcc_help_output.txt
  exit 0
fi

# Try to run
if ! timeout 5s "$OUT_FILE" < "$STDIN_FILE" > /root/program_output.txt; then
  echo "[!] Runtime error or timeout"
  dcc-help > /root/dcc_help_output.txt || echo "[x] Failed to get dcc-help explanation"
  cat /root/dcc_help_output.txt
  exit 0
fi

# Print program output
cat /root/program_output.txt
