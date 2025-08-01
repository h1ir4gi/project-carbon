#!/bin/bash

SOURCE_FILE="/tmp/main.c"
STDIN_FILE="/tmp/stdin"
OUT_FILE="/tmp/out"

read -r json

echo "$json" | jq -r '.source' > $SOURCE_FILE
echo "$json" | jq -r '.stdin' > $STDIN_FILE

PROGRAM_OUTPUT="/tmp/program_output.txt"
PROGRAM_ERRORS="/tmp/program_errors.txt"

DCC_HELP_OUTPUT="/tmp/dcc_help_output.txt"
COMPILE_ERRORS="/tmp/compile_errors.txt"

function run_dcc_help() {
  # do we need to catch dcc help errors?
  if ! dcc-help > "$DCC_HELP_OUTPUT"; then
    echo "[x] Failed to get dcc-help explanation"
    exit 0
  fi

  echo "[?] Don't understand? Here's what dcc-help says:"
  cat "$DCC_HELP_OUTPUT"
}

# temporarily comment out dcc stuff so we can run the program instead 
# Try to compile
if ! dcc -Werror "$SOURCE_FILE" -o "$OUT_FILE" 2>"$COMPILE_ERRORS"; then
  echo "[!] Compilation failed"
  cat "$COMPILE_ERRORS"
  run_dcc_help
  exit 0
fi

# Try to run
if ! timeout 5s "$OUT_FILE" < "$STDIN_FILE" > "$PROGRAM_OUTPUT" 2>"$PROGRAM_ERRORS"; then
  cat $PROGRAM_OUTPUT
  echo "[!] Runtime error or timeout"
  cat "$PROGRAM_ERRORS"
  run_dcc_help
  exit 0
fi

# Print program output
cat $PROGRAM_OUTPUT

