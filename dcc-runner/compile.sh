#!/bin/bash

SOURCE_FILE="$1"
STDIN_FILE="$2"
OUT_FILE="/tmp/out"
PROGRAM_OUTPUT="/tmp/program_output.txt"
DCC_HELP_OUTPUT="/tmp/dcc_help_output.txt"

# temporarily comment out dcc stuff so we can run the program instead 
# Try to compile
if ! dcc -Werror "$SOURCE_FILE" -o "$OUT_FILE" 2>/tmp/compile_errors.txt; then
  echo "[!] Compilation failed"
  cat /tmp/compile_errors.txt
  # dcc-help > /root/dcc_help_output.txt || echo "[x] Failed to get dcc-help explanation"
  cat /root/dcc_help_output.txt
  exit 0
fi

# Try to run
if ! timeout 5s "$OUT_FILE" < "$STDIN_FILE" > "$PROGRAM_OUTPUT" 2>/tmp/compile_errors.txt; then
  echo "[!] Runtime error or timeout"
  # dcc-help > "$DCC_HELP_OUTPUT" || echo "[x] Failed to get dcc-help explanation"
  cat /tmp/compile_errors.txt
  exit 0
fi

# Print program output
cat $PROGRAM_OUTPUT
